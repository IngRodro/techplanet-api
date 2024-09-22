import Sale from './sale.model'; // Asegúrate de que la ruta sea correcta

export const createSale = async (req, res) => {
  try {
    const products  = req.body;
    const { userId } = req;
    console.log(products)

    // Calcular el total de la venta
    const totalAmount = products.reduce((total, product) => {
      return total + product.productId.sellingPrice * product.quantity;
    }, 0);


    const saveProducts = products.map((product) => {
      return {
        productId: product.productId.id,
        quantity: product.quantity,
        price: product.productId.sellingPrice,
      }
    })


    // Crear la venta
    const newSale = new Sale({
      userId,
      products: saveProducts,
      totalAmount,
    });

    // Guardar en la base de datos
    const savedSale = await newSale.save();

    return res.status(201).json({
      success: true,
      message: 'Compra realizada correctamente',
      sale: savedSale,
      error: false
    });
  } catch (error) {
    console.error('Error al crear la venta:', error);
    return res.status(500).json({
      message: 'Error al realizar la compra',
      error: error.message,
    });
  }
};

export const getMonthlySalesTotal = async (req, res) => {
  try {
    const { year, month } = req.query;

    // Validar parámetros
    if (!year || !month) {
      return res.status(400).json({
        message: 'Se requiere el mes y el año para filtrar las ventas',
      });
    }

    // Convertir a números
    const parsedYear = parseInt(year, 10);
    const parsedMonth = parseInt(month, 10);

    if (isNaN(parsedYear) || isNaN(parsedMonth) || parsedMonth < 1 || parsedMonth > 12) {
      return res.status(400).json({
        message: 'El mes y el año deben ser números válidos',
      });
    }

    // Filtrar ventas por mes y año, y ordenar por fecha
    const sales = await Sale.find({
      purchaseDate: {
        $gte: new Date(parsedYear, parsedMonth - 1, 1),
        $lt: new Date(parsedYear, parsedMonth, 1),
      },
    })
    .populate('userId')
    .populate('products.productId')
    .sort({ purchaseDate: 1 }); // Ordenar por fecha ascendente

    // Calcular el total mensual sumando el campo `totalAmount`
    const totalMonthlySales = sales.reduce((acc, sale) => acc + sale.totalAmount, 0);

    return res.status(200).json({
      message: 'Ventas obtenidas exitosamente',
      totalMonthlySales,
      sales,
    });
  } catch (error) {
    console.error('Error al obtener ventas por mes y año:', error);
    return res.status(500).json({
      message: 'Error al obtener las ventas',
      error: error.message,
    });
  }
};

