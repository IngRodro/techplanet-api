import productModel from './product.model';
import { deleteFiles, uploadImages } from '../../../Utils/cloudFile';
import userModel from '../user/user.model';

export const getAllProducts = async (req, res) => {
  try {
    const allProduct = await productModel.find().sort({ createdAt: -1 });

    res.json({
      message: 'All Product',
      success: true,
      error: false,
      data: allProduct,
    });
  } catch (err) {
    res.status(400).json({
      message: err.message || err,
      error: true,
      success: false,
    });
  }
};

export const createProduct = async (req, res) => {
  const {
    productName,
    brandName,
    category,
    productImages,
    description,
    price,
    sellingPrice,
  } = req.body;
  const { userId } = req;

  const sessionUser = await userModel.findOne(userId);

  if (sessionUser?.role === 'admin') {
    if (productImages.lenght > 0) {
      return res.status(400).json({
        message: 'Not file uploaded',
      });
    }

    try {
      const result = await uploadImages(productImages, 'techplanet/products');

      const product = await productModel.create({
        productName,
        brandName,
        category,
        description,
        price,
        sellingPrice,
        productImages: result,
      });
      return res
        .status(201)
        .json({ data: product, error: false, success: true });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        message: 'Error creating product',
        error: true,
        success: false,
      });
    }
  } else {
    return res.status(401).json({
      message: 'No estas autorizado para realizar esa accion',
      error: true,
      success: false,
    });
  }
};

export const updateProduct = async (req, res) => {
  const {
    id,
    productName,
    brandName,
    category,
    description,
    price,
    sellingPrice,
    newImages, // Imágenes nuevas (en base64 o formato de archivo)
    deletedImages, // Imágenes a eliminar (con sus `public_id`)
  } = req.body;

  const { userId } = req;

  try {
    // Verificar que el usuario sea un administrador
    const sessionUser = await userModel.findOne(userId);
    if (sessionUser?.role !== 'admin') {
      return res.status(401).json({
        message: 'No estás autorizado para realizar esa acción',
        error: true,
        success: false,
      });
    }

    // Subir las imágenes nuevas
    let uploadedImages = [];
    if (newImages?.length > 0) {
      uploadedImages = await uploadImages(newImages, 'techplanet/products');
    }

    // Actualizar el producto con las nuevas imágenes
    const updatedProduct = await productModel.findByIdAndUpdate(
      id,
      {
        $set: {
          productName,
          brandName,
          category,
          description,
          price,
          sellingPrice,
        },
        $push: { productImages: { $each: uploadedImages } },
      },
      { new: true } // Para retornar el producto actualizado
    );


    if (!updatedProduct) {
      return res.status(404).json({
        message: 'Producto no encontrado',
        error: true,
        success: false,
      });
    }

    // Eliminar las imágenes antiguas que fueron marcadas para eliminación
    if (deletedImages?.length > 0) {
      const publicIdsToDelete = deletedImages.map((image) => image.public_id);
      await deleteFiles(publicIdsToDelete);

      // Remover las imágenes eliminadas del producto
      await productModel.findByIdAndUpdate(
        id,
        {
          $pull: { productImages: { public_id: { $in: publicIdsToDelete } } },
        },
        { new: true }
      );
    }

    return res.status(200).json({
      message: 'Producto actualizado exitosamente',
      data: updatedProduct,
      error: false,
      success: true,
    });
  } catch (error) {
    console.error('Error al actualizar el producto:', error);
    return res.status(500).json({
      message: 'Error al actualizar el producto',
      error: true,
      success: false,
    });
  }
};


export const getCategories = async (req, res) => {
  try {
    const productCategory = await productModel.distinct('category');

    const productByCategory = [];

    for (const category of productCategory) {
      const product = await productModel.findOne({ category });

      if (product) {
        productByCategory.push(product);
      }
    }

    res.json({
      data: productByCategory,
      success: true,
      error: false,
    });
  } catch (err) {
    res.status(400).json({
      message: err.message || err,
      error: true,
      success: false,
    });
  }
};

export const getProductByCategoryOrBrand = async (req, res) => {
  try {
    const { category, brand } = req?.body || req?.query;

    let query = {
      available: true
    };
    if (category) query.category = category;
    if (brand) query.brandName = brand;

    const product = await productModel.find(query);

    res.json({
      data: product,
      success: true,
      error: false,
    });
  } catch (err) {
    res.status(400).json({
      message: err.message || err,
      error: true,
      success: false,
    });
  }
};

export const getProductDetails = async (req, res) => {
  try {
    const { productId } = req.body;

    const product = await productModel.findById(productId);

    res.json({
      data: product,
      success: true,
      error: false,
    });
  } catch (err) {
    res.json({
      message: err?.message || err,
      error: true,
      success: false,
    });
  }
};

export const filterProducts = async (req, res) => {
  try {
    const categoryList = req?.body?.category || [];

    const product = await productModel.find({
      category: {
        $in: categoryList,
      },
      available: true
    });

    res.json({
      data: product,
      message: 'product',
      error: false,
      success: true,
    });
  } catch (err) {
    res.json({
      message: err.message || err,
      error: true,
      success: false,
    });
  }
};

export const searchProducts = async (req, res) => {
  try {
    const query = req.query.q;

    const regex = new RegExp(query, 'i', 'g');

    const product = await productModel.find({
      $or: [
        {
          productName: regex,
        },
        {
          category: regex,
        },
      ],
      available: true
    });

    res.json({
      data: product,
      message: 'Search Product list',
      error: false,
      success: true,
    });
  } catch (err) {
    res.json({
      message: err.message || err,
      error: true,
      success: false,
    });
  }
};

export const changeAvailability = async (req, res) => {
  const { productId } = req.body;

  try {
    const product = await productModel.findOne({ _id: productId });

    if (!product) {
      return res.json({
        message: 'Product not found',
        error: true,
        success: false,
      });
    }

    const newAvailability = !product.available;

    await productModel.updateOne(
      { _id: productId },
      { $set: { available: newAvailability } }
    );

    res.json({
      message: 'Availability changed successfully',
      error: false,
      success: true,
    });
  } catch (err) {
    res.json({
      message: err.message || err,
      error: true,
      success: false,
    });
  }
};
