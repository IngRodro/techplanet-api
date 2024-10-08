import cartModel from './cart.model';

export const addToCartController = async (req, res) => {
  try {
    const { productId } = req?.body;
    const userId = req.userId;

    const isProductAvailable = await cartModel.findOne({ productId, userId: userId?._id });

    if (isProductAvailable) {
      return res.json({
        message: 'El Producto ya esta registrado en el carrito',
        success: false,
        error: true,
      });
    }

    const payload = {
      productId: productId,
      quantity: 1,
      userId: userId,
    };

    const newAddToCart = new cartModel(payload);
    const saveProduct = await newAddToCart.save();

    return res.json({
      data: saveProduct,
      message: 'Producto agregado al carrito',
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

export const countCartProducts = async (req, res) => {
  try {
    const userId = req.userId;

    const count = await cartModel.countDocuments({
      userId: userId,
    });

    res.json({
      data: {
        count: count,
      },
      error: false,
      success: true,
    });
  } catch (error) {
    res.json({
      message: error.message || error,
      error: false,
      success: false,
    });
  }
};

export const getCartProducts = async (req, res) => {
  try {
    const userId = req.userId;

    const allProduct = await cartModel
      .find({
        userId: userId
      }).populate('productId')

    res.json({
      data: allProduct,
      success: true,
      error: false,
    });
  } catch (err) {
    res.json({
      message: err.message || err,
      error: true,
      success: false,
    });
  }
};

export const updateCartProduct = async (req, res) => {
  try {
    const cartProductId = req?.body?._id;
    const qty = req.body.quantity;

    const updateProduct = await cartModel.updateOne(
      { _id: cartProductId },
      {
        ...(qty && { quantity: qty }),
      },
    );

    res.json({
      data: updateProduct,
      error: false,
      success: true,
    });
  } catch (err) {
    res.json({
      message: err?.message || err,
      error: true,
      success: false,
    });
  }
};

export const deleteCartProduct = async (req, res) => {
  try {
    const cartProductId = req.body._id;
    const deleteProduct = await cartModel.deleteOne({
      _id: cartProductId,
    });

    res.json({
      message: 'Producto eliminado del carrito',
      error: false,
      success: true,
      data: deleteProduct,
    });
  } catch (err) {
    res.json({
      message: err?.message || err,
      error: true,
      success: false,
    });
  }
};
