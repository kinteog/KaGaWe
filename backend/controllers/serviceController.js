import Service from '../models/Service.js';
import fs from 'fs';
import path from 'path';

// Create a new service
export const createService = async (req, res) => {
    const newService = new Service(req.body);

    try {
        const savedService = await newService.save();
        res.status(200).json({
            success: true,
            message: 'Successfully created',
            data: savedService,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Failed to create. Try again',
        });
    }
};

// Update a service
export const updateService = async (req, res) => {
    const id = req.params.id;

    try {
        const updatedService = await Service.findByIdAndUpdate(
            id,
            { $set: req.body },
            { new: true }
        );

        res.status(200).json({
            success: true,
            message: 'Successfully updated',
            data: updatedService,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Failed to update. Try again',
        });
    }
};

// Delete a service
export const deleteService = async (req, res) => {
  const id = req.params.id;

  try {
    const service = await Service.findById(id);
    if (!service) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }

    // Delete image file from disk if it exists
    if (service.photo) {
      const imagePath = path.join('uploads', service.photo); // Assuming photo is like 'services/filename.jpg'
      fs.unlink(imagePath, (err) => {
        if (err) {
          console.warn('Failed to delete image or image not found:', imagePath);
        } else {
          console.log('Deleted image file:', imagePath);
        }
      });
    }

    // Delete the service from DB
    await Service.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'Service and associated image deleted successfully',
    });
  } catch (err) {
    console.error('Error deleting service:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to delete service',
    });
  }
};

// Get a single service
export const getSingleService = async (req, res) => {
    const id = req.params.id;

    try {
        const service = await Service.findById(id).populate('reviews');
        res.status(200).json({
            success: true,
            message: 'Record found',
            data: service,
        });
    } catch (err) {
        res.status(404).json({
            success: false,
            message: 'Record not found',
        });
    }
};

// Admin: Get all services (no pagination)
export const getAllServicesAdmin = async (req, res) => {
  try {
    const services = await Service.find({}).populate('reviews');
    res.status(200).json({
      success: true,
      message: 'All services fetched',
      data: services,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch all services',
    });
  }
};


// Get all services with pagination
export const getAllServices = async (req, res) => {
    let page = parseInt(req.query.page);
    if (isNaN(page) || page < 1) {
        page = 0;
    }

    try {
        const services = await Service.find({})
            .populate('reviews')
            .skip(page * 8)
            .limit(8);

        const totalServices = await Service.countDocuments();

        res.status(200).json({
            success: true,
            count: totalServices, // ✅ for frontend pagination
            message: 'Records found',
            data: services,
        });
    } catch (err) {
        res.status(404).json({
            success: false,
            message: 'Records not found',
        });
    }
};

// Search services by name or category
export const getServiceBySearch = async (req, res) => {
    const { name, category } = req.query;
  
    // Build search conditions dynamically
    const searchConditions = [];
  
    if (name) {
      searchConditions.push({ name: new RegExp(name, 'i') });
    }
  
    if (category) {
      searchConditions.push({ category: new RegExp(category, 'i') });
    }
  
    // If no search terms provided, return all
    const query = searchConditions.length > 0 ? { $or: searchConditions } : {};
  
    try {
      const services = await Service.find(query).populate('reviews');
  
      res.status(200).json({
        success: true,
        message: 'Records found',
        data: services,
      });
    } catch (err) {
      res.status(404).json({
        success: false,
        message: 'Records not found',
      });
    }
  };
  

// Get featured services
export const getFeaturedServices = async (req, res) => {
    try {
        const services = await Service.find({ featured: true })
        .populate('reviews')
        .limit(8);

        res.status(200).json({
            success: true,
            message: 'Records found',
            data: services,
        });
    } catch (err) {
        res.status(404).json({
            success: false,
            message: 'Records not found',
        });
    }
};

// Get total service count
export const getServiceCount = async (req, res) => {
    try {
        const serviceCount = await Service.estimatedDocumentCount();
        res.status(200).json({
            success: true,
            data: serviceCount,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch',
        });
    }
};
