import ECUFileOrder from '../models/ECUFileOrder.js';

// ✅ Create a new ECU file order
export const createEcuFileOrder = async (req, res) => {
  try {
    const newOrder = new ECUFileOrder({
      ...req.body,
      userId: req.user.id, // Assign the authenticated user ID securely
    });

    const savedOrder = await newOrder.save();

    res.status(200).json({
      success: true,
      message: 'Your ECU file order has been placed successfully',
      data: savedOrder,
    });
  } catch (err) {
    console.error('ECU Order error:', err);
    res.status(500).json({
      success: false,
      message: 'Internal server error: Failed to place ECU file order',
    });
  }
};

// ✅ Get a single ECU file order by ID
export const getEcuFileOrder = async (req, res) => {
  const id = req.params.id;

  try {
    const order = await ECUFileOrder.findById(id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'ECU file order found',
      data: order,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving ECU file order',
    });
  }
};

// ✅ Get all ECU file orders (admin only)
export const getAllEcuFileOrders = async (req, res) => {
  try {
    const orders = await ECUFileOrder.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: 'All ECU file orders retrieved',
      data: orders,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve ECU file orders',
    });
  }
};

// ✅ Update an ECU file order by ID (admin)
export const updateEcuFileOrder = async (req, res) => {
  const id = req.params.id;

  try {
    const updatedOrder = await ECUFileOrder.findByIdAndUpdate(id, req.body, {
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
      message: 'ECU file order updated successfully',
      data: updatedOrder,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Error updating ECU file order',
    });
  }
};

// ✅ Delete an ECU file order by ID (admin)
export const deleteEcuFileOrder = async (req, res) => {
  const id = req.params.id;

  try {
    const deletedOrder = await ECUFileOrder.findByIdAndDelete(id);

    if (!deletedOrder) {
      return res.status(404).json({
        success: false,
        message: 'Order not found for deletion',
      });
    }

    res.status(200).json({
      success: true,
      message: 'ECU file order deleted successfully',
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Error deleting ECU file order',
    });
  }
};

// ✅ Get all orders for a specific user
export const getUserEcuFileOrders = async (req, res) => {
  const userId = req.params.userId;

  try {
    const orders = await ECUFileOrder.find({ userId }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: 'User ECU file orders retrieved successfully',
      data: orders,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve user ECU file orders',
    });
  }
};
