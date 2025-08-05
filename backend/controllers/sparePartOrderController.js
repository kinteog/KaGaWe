import SparePartOrder from '../models/SparePartOrder.js';

// Create a new spare part order
export const createSparePartOrder = async (req, res) => {
  try {
    const newOrder = new SparePartOrder({
      ...req.body,
      userId: req.user.id, // assign authenticated user ID
    });

    const savedOrder = await newOrder.save();

    res.status(200).json({
      success: true,
      message: 'Spare part order placed successfully',
      data: savedOrder,
    });
  } catch (err) {
    console.error('Order error:', err);
    res.status(500).json({
      success: false,
      message: 'Internal server error: Failed to place order',
    });
  }
};

// Get a single order by ID
export const getSparePartOrder = async (req, res) => {
  const id = req.params.id;

  try {
    const order = await SparePartOrder.findById(id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Order retrieved',
      data: order,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving order',
    });
  }
};

// Get all orders (admin)
export const getAllSparePartOrders = async (req, res) => {
  try {
    const orders = await SparePartOrder.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      message: 'All spare part orders retrieved',
      data: orders,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve orders',
    });
  }
};

// Update an order by ID (admin)
export const updateSparePartOrder = async (req, res) => {
  const id = req.params.id;

  try {
    const updatedOrder = await SparePartOrder.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedOrder) {
      return res.status(404).json({
        success: false,
        message: 'Order not found for update',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Order updated successfully',
      data: updatedOrder,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Error updating order',
    });
  }
};

// Delete an order by ID (admin)
export const deleteSparePartOrder = async (req, res) => {
  const id = req.params.id;

  try {
    const deletedOrder = await SparePartOrder.findByIdAndDelete(id);

    if (!deletedOrder) {
      return res.status(404).json({
        success: false,
        message: 'Order not found for deletion',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Order deleted successfully',
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Error deleting order',
    });
  }
};

// Get orders for a specific user
export const getUserSparePartOrders = async (req, res) => {
  const userId = req.params.userId;

  try {
    const orders = await SparePartOrder.find({ userId }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: 'User orders retrieved successfully',
      data: orders,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve user orders',
    });
  }
};
