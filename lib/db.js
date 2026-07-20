import { db } from "./firebase";
import { collection, addDoc, getDocs, query, where, orderBy, Timestamp, doc, getDoc } from "firebase/firestore";

// Add a new service
export async function addServiceRecord(vehicleData, serviceData) {
  try {
    let vehicleId = null;

    // 1. Check if vehicle exists by phone or plate
    const qPhone = query(collection(db, "vehicles"), where("phoneNumber", "==", vehicleData.phoneNumber));
    const querySnapshotPhone = await getDocs(qPhone);

    if (!querySnapshotPhone.empty) {
      vehicleId = querySnapshotPhone.docs[0].id;
    } else {
      // Create new vehicle
      const newVehicleRef = await addDoc(collection(db, "vehicles"), {
        phoneNumber: vehicleData.phoneNumber,
        customerName: vehicleData.customerName || "",
        licensePlate: vehicleData.licensePlate,
        createdAt: Timestamp.now()
      });
      vehicleId = newVehicleRef.id;
    }

    // 2. Add service record
    const nextMileage = serviceData.oilLifespan ? (Number(serviceData.currentMileage) + Number(serviceData.oilLifespan)) : null;

    await addDoc(collection(db, "services"), {
      vehicleId,
      serviceDescription: serviceData.serviceDescription,
      currentMileage: Number(serviceData.currentMileage),
      oilLifespan: serviceData.oilLifespan ? Number(serviceData.oilLifespan) : null,
      nextServiceMileage: nextMileage,
      invoiceNumber: serviceData.invoiceNumber || null,
      serviceDate: Timestamp.now()
    });

    return { success: true, vehicleId };
  } catch (error) {
    console.error("Error adding service: ", error);
    return { success: false, error };
  }
}

// Fetch customer name by phone number (for auto-fetch)
export async function getCustomerNameByPhone(phoneNumber) {
  try {
    const q = query(collection(db, "vehicles"), where("phoneNumber", "==", phoneNumber));
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      return snapshot.docs[0].data().customerName;
    }
    return null;
  } catch (error) {
    console.error("Error fetching customer: ", error);
    return null;
  }
}

// Search vehicles and their services
export async function searchVehicles(searchTerm) {
  try {
    // We'll search by phone first
    let q = query(collection(db, "vehicles"), where("phoneNumber", "==", searchTerm));
    let snapshot = await getDocs(q);

    // If not found by phone, search by license plate
    if (snapshot.empty) {
      q = query(collection(db, "vehicles"), where("licensePlate", "==", searchTerm));
      snapshot = await getDocs(q);
    }

    if (snapshot.empty) return null;

    const vehicleDoc = snapshot.docs[0];
    const vehicleData = { id: vehicleDoc.id, ...vehicleDoc.data() };

    // Fetch services for this vehicle
    const servicesQ = query(collection(db, "services"), where("vehicleId", "==", vehicleDoc.id));
    const servicesSnapshot = await getDocs(servicesQ);

    const services = servicesSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      serviceDate: doc.data().serviceDate.toDate().toISOString() // Convert to string for serialization
    }));
    
    // Sort locally by date descending to avoid Firebase composite index requirement
    services.sort((a, b) => new Date(b.serviceDate) - new Date(a.serviceDate));

    return { vehicle: vehicleData, services };
  } catch (error) {
    console.error("Error searching vehicles: ", error);
    return null;
  }
}

// Get Reminders Data
export async function getRemindersData() {
  try {
    const vehiclesSnapshot = await getDocs(collection(db, "vehicles"));
    const vehicles = {};
    vehiclesSnapshot.forEach(doc => {
      vehicles[doc.id] = { id: doc.id, ...doc.data() };
    });

    const servicesSnapshot = await getDocs(collection(db, "services"));
    
    // Group latest service per vehicle
    const latestServices = {};
    servicesSnapshot.forEach(doc => {
      const data = doc.data();
      const vId = data.vehicleId;
      const sDate = data.serviceDate.toDate();
      
      if (!latestServices[vId] || sDate > latestServices[vId].serviceDate) {
        latestServices[vId] = {
          id: doc.id,
          ...data,
          serviceDate: sDate
        };
      }
    });

    const now = new Date();
    const reminders = {
      oneMonth: [],
      twoMonths: [],
      threeMonths: []
    };

    for (const vId in latestServices) {
      if (!vehicles[vId]) continue; // orphaned service?
      
      const srv = latestServices[vId];
      const diffTime = Math.abs(now - srv.serviceDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      const item = {
        vehicle: vehicles[vId],
        latestService: {
          ...srv,
          serviceDate: srv.serviceDate.toISOString() // serialize
        },
        daysPassed: diffDays
      };

      if (diffDays >= 1 && diffDays <= 30) {
        reminders.oneMonth.push(item);
      } else if (diffDays >= 31 && diffDays <= 60) {
        reminders.twoMonths.push(item);
      } else if (diffDays >= 61) {
        reminders.threeMonths.push(item);
      }
    }
    
    // Sort each array by daysPassed descending
    reminders.oneMonth.sort((a,b) => b.daysPassed - a.daysPassed);
    reminders.twoMonths.sort((a,b) => b.daysPassed - a.daysPassed);
    reminders.threeMonths.sort((a,b) => b.daysPassed - a.daysPassed);

    return reminders;

  } catch (error) {
    console.error("Error getting reminders: ", error);
    return null;
  }
}
