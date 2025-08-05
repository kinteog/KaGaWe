import ServiceBooking from '../models/ServiceBooking.js';

// Create a new service booking
export const createServiceBooking = async (req, res) => {
  try {
    const newServiceBooking = new ServiceBooking({
      ...req.body,
      userId: req.user.id, // <-- Securely assign the authenticated user
    });

    const savedBooking = await newServiceBooking.save();

    res.status(200).json({
      success: true,
      message: 'Your service has been booked successfully',
      data: savedBooking,
    });
  } catch (err) {
    console.error('Booking error:', err);
    res.status(500).json({
      success: false,
      message: 'Internal server error: Failed to book service',
    });
  }
};


// Get a single service booking by ID
export const getServiceBooking = async (req, res) => {
  const id = req.params.id;

  try {
    const booking = await ServiceBooking.findById(id);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Service booking found',
      data: booking,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving booking',
    });
  }
};

// Get all service bookings (admin)
export const getAllServiceBookings = async (req, res) => {
  try {
    const bookings = await ServiceBooking.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      message: 'All service bookings retrieved',
      data: bookings,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve bookings',
    });
  }
};

// Update a service booking by ID (admin)
export const updateServiceBooking = async (req, res) => {
  const id = req.params.id;

  try {
    const updatedBooking = await ServiceBooking.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedBooking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found for update',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Booking updated successfully',
      data: updatedBooking,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Error updating booking',
    });
  }
};

// Delete a service booking by ID (admin)
export const deleteServiceBooking = async (req, res) => {
  const id = req.params.id;

  try {
    const deletedBooking = await ServiceBooking.findByIdAndDelete(id);

    if (!deletedBooking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found for deletion',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Booking deleted successfully',
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Error deleting booking',
    });
  }
};

// Get bookings for a specific user
export const getUserServiceBookings = async (req, res) => {
  const userId = req.params.userId;

  try {
    const bookings = await ServiceBooking.find({ userId }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: 'User bookings retrieved successfully',
      data: bookings,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve user bookings',
    });
  }
};

