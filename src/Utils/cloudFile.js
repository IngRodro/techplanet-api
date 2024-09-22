import { v2 as cloudinary } from 'cloudinary';

import getConfig from 'config';

const { imageCloud } = getConfig();

cloudinary.config({
  cloud_name: imageCloud.cloud_name,
  api_key: imageCloud.api_key,
  api_secret: imageCloud.api_secret,
});

export const uploadOneFile = async (filePath, folder) =>
  cloudinary.uploader.upload(filePath, {
    folder: process.env.NODE_ENV === 'test' ? `test/${folder}` : `images/${folder}`,
  });

export const deleteFiles = async (publicIds) => {
  try {
    // Usa Promise.all para realizar todas las eliminaciones en paralelo
    const deletePromises = publicIds.map((publicId) =>
      cloudinary.uploader.destroy(publicId)
    );

    // Espera a que todas las promesas se resuelvan
    const results = await Promise.all(deletePromises);

    // Filtra y retorna los resultados exitosos
    return results;
  } catch (error) {
    console.error("Error eliminando archivos:", error);
    throw error;
  }
};


export const uploadImages = async (productImages, folder) => {
  const uploadPromises = productImages.map(async (image) => {
    const result = await cloudinary.uploader.upload(image, {
      folder: process.env.NODE_ENV === 'test' ? `test/${folder}` : `images/${folder}`
    });
    return { public_id: result.public_id, secure_url: result.secure_url }
  });

  try {
    const uploadedImages = await Promise.all(uploadPromises);
    console.log('All images uploaded successfully:' );
    return uploadedImages;
  } catch (error) {
    console.error('Error during image upload, rolling back uploads:', error);

    // Eliminar las imágenes que se subieron con éxito antes del error
    const uploadedImages = await Promise.allSettled(uploadPromises);
    const successfulUploads = uploadedImages
      .filter(result => result.status === 'fulfilled')
      .map(result => result.value);

    for (const image of successfulUploads) {
      try {
        await cloudinary.uploader.destroy(image.public_id);
        console.log(`Image ${image.public_id} deleted successfully.`);
      } catch (deleteError) {
        console.error(`Error deleting image ${image.public_id}:`, deleteError);
      }
    }

    throw error;  // Re-throw the original error
  }
}
