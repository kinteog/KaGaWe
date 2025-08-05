import SparePart from '../models/SparePart.js';

// Create a new spare part
export const createSparePart = async (req, res) => {
  const newPart = new SparePart(req.body);

  try {
    const savedPart = await newPart.save();
    res.status(200).json({
      success: true,
      message: 'Spare part created successfully',
      data: savedPart,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Failed to create spare part. Try again.',
    });
  }
};

// Update spare part
export const updateSparePart = async (req, res) => {
  const id = req.params.id;

  try {
    const updatedPart = await SparePart.findByIdAndUpdate(id, { $set: req.body }, { new: true });
    res.status(200).json({
      success: true,
      message: 'Spare part updated successfully',
      data: updatedPart,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Failed to update spare part.',
    });
  }
};

// Delete spare part
export const deleteSparePart = async (req, res) => {
  const id = req.params.id;

  try {
    await SparePart.findByIdAndDelete(id);
    res.status(200).json({
      success: true,
      message: 'Spare part deleted successfully',
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete spare part.',
    });
  }
};

// Get a single spare part
export const getSingleSparePart = async (req, res) => {
  const id = req.params.id;

  try {
    const part = await SparePart.findById(id).populate('reviews');
    res.status(200).json({
      success: true,
      message: 'Spare part retrieved',
      data: part,
    });
  } catch (err) {
    res.status(404).json({
      success: false,
      message: 'Spare part not found',
    });
  }
};

// Get all spare parts (admin)
export const getAllSparePartsAdmin = async (req, res) => {
  try {
    const parts = await SparePart.find({}).populate('reviews');
    res.status(200).json({
      success: true,
      message: 'All spare parts retrieved',
      data: parts,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch spare parts',
    });
  }
};

// Get spare parts with pagination
export const getAllSpareParts = async (req, res) => {
  let page = parseInt(req.query.page);
  if (isNaN(page) || page < 1) page = 0;

  try {
    const parts = await SparePart.find({})
      .populate('reviews')
      .skip(page * 8)
      .limit(8);

    const total = await SparePart.countDocuments();

    res.status(200).json({
      success: true,
      count: total,
      message: 'Spare parts retrieved',
      data: parts,
    });
  } catch (err) {
    res.status(404).json({
      success: false,
      message: 'Failed to fetch spare parts',
    });
  }
};

// Search spare parts
export const getSparePartBySearch = async (req, res) => {
  const { name, category, manufacturer } = req.query;
  const conditions = [];

  if (name) conditions.push({ name: new RegExp(name, 'i') });
  if (category) conditions.push({ category: new RegExp(category, 'i') });
  if (manufacturer) conditions.push({ manufacturer: new RegExp(manufacturer, 'i') });

  const query = conditions.length > 0 ? { $or: conditions } : {};

  try {
    const results = await SparePart.find(query).populate('reviews');
    res.status(200).json({
      success: true,
      message: 'Search results',
      data: results,
    });
  } catch (err) {
    res.status(404).json({
      success: false,
      message: 'No matching spare parts found',
    });
  }
};

// Get featured spare parts
export const getFeaturedSpareParts = async (req, res) => {
  try {
    const parts = await SparePart.find({ isFeatured: true }).populate('reviews').limit(8);
    res.status(200).json({
      success: true,
      message: 'Featured spare parts found',
      data: parts,
    });
  } catch (err) {
    res.status(404).json({
      success: false,
      message: 'No featured spare parts found',
    });
  }
};

// Get total spare parts count
export const getSparePartCount = async (req, res) => {
  try {
    const count = await SparePart.estimatedDocumentCount();
    res.status(200).json({
      success: true,
      data: count,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Failed to get count',
    });
  }
};
