const sharp = require('sharp');

sharp('public/logo.jpg')
  .metadata()
  .then(metadata => {
    // 75% crop to remove the white borders (derived from previous CSS scale)
    const width = Math.floor(metadata.width * 0.74);
    const height = Math.floor(metadata.height * 0.74);
    const left = Math.floor((metadata.width - width) / 2);
    const top = Math.floor((metadata.height - height) / 2);

    return sharp('public/logo.jpg')
      .extract({ left, top, width, height })
      .toFile('public/logo_cropped.jpg');
  })
  .then(() => {
    console.log('Crop success');
    const fs = require('fs');
    fs.copyFileSync('public/logo_cropped.jpg', 'public/logo.jpg');
    fs.unlinkSync('public/logo_cropped.jpg');
    console.log('Replaced logo.jpg');
  })
  .catch(err => console.error('Crop error', err));
