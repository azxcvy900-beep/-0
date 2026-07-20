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
    const servicesQ = query(collection(db, "services"), where("vehicleId", "==", vehicleDoc.id), orderBy("serviceDate", "desc"));
    const servicesSnapshot = await getDocs(servicesQ);

    const services = servicesSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      serviceDate: doc.data().serviceDate.toDate().toISOString() // Convert to string for serialization
    }));

    return { vehicle: vehicleData, services };
  } catch (error) {
    console.error("Error searching vehicles: ", error);
    return null;
  }
}
