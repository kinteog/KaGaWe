import ECUFile from '../models/ECUFile.js';

// ✅ Create a new ECU file
export const createECUFile = async (req, res) => {
  const newFile = new ECUFile(req.body);

  try {
    const savedFile = await newFile.save();
    res.status(200).json({
      success: true,
      message: 'ECU file created successfully',
      data: savedFile,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Failed to create ECU file. Try again.',
    });
  }
};

// ✅ Update ECU file
export const updateECUFile = async (req, res) => {
  const id = req.params.id;

  try {
    const updatedFile = await ECUFile.findByIdAndUpdate(id, { $set: req.body }, { new: true });
    res.status(200).json({
      success: true,
      message: 'ECU file updated successfully',
      data: updatedFile,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Failed to update ECU file.',
    });
  }
};

// ✅ Delete ECU file
export const deleteECUFile = async (req, res) => {
  const id = req.params.id;

  try {
    await ECUFile.findByIdAndDelete(id);
    res.status(200).json({
      success: true,
      message: 'ECU file deleted successfully',
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete ECU file.',
    });
  }
};

// ✅ Get a single ECU file
export const getSingleECUFile = async (req, res) => {
  const id = req.params.id;

  try {
    const ecuFile = await ECUFile.findById(id).populate('reviews');
    res.status(200).json({
      success: true,
      message: 'ECU file found',
      data: ecuFile,
    });
  } catch (err) {
    res.status(404).json({
      success: false,
      message: 'ECU file not found',
    });
  }
};

// ✅ Admin: Get all ECU files (no pagination)
export const getAllECUFilesAdmin = async (req, res) => {
  try {
    const files = await ECUFile.find({}).populate('reviews');
    res.status(200).json({
      success: true,
      message: 'All ECU files fetched',
      data: files,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch all ECU files',
    });
  }
};

// ✅ Paginated fetch
export const getAllECUFiles = async (req, res) => {
  let page = parseInt(req.query.page);
  if (isNaN(page) || page < 1) page = 0;

  try {
    const files = await ECUFile.find({})
      .populate('reviews')
      .skip(page * 8)
      .limit(8);

    const total = await ECUFile.countDocuments();

    res.status(200).json({
      success: true,
      count: total,
      message: 'ECU files found',
      data: files,
    });
  } catch (err) {
    res.status(404).json({
      success: false,
      message: 'No ECU files found',
    });
  }
};

// ✅ Search ECU files by title, make, model, etc.
export const getECUFileBySearch = async (req, res) => {
  const { title, vehicleMake, vehicleModel, tuningStage, engineCode } = req.query;
  const conditions = [];

  if (title) conditions.push({ title: new RegExp(title, 'i') });
  if (vehicleMake) conditions.push({ vehicleMake: new RegExp(vehicleMake, 'i') });
  if (vehicleModel) conditions.push({ vehicleModel: new RegExp(vehicleModel, 'i') });
  if (tuningStage) conditions.push({ tuningStage: new RegExp(tuningStage, 'i') });
  if (engineCode) conditions.push({ engineCode: new RegExp(engineCode, 'i') });

  const query = conditions.length ? { $or: conditions } : {};

  try {
    const files = await ECUFile.find(query).populate('reviews');
    res.status(200).json({
      success: true,
      message: 'Search results',
      data: files,
    });
  } catch (err) {
    res.status(404).json({
      success: false,
      message: 'No matching ECU files found',
    });
  }
};

// ✅ Get featured ECU files
export const getFeaturedECUFiles = async (req, res) => {
  try {
    const files = await ECUFile.find({ isFeatured: true })
      .populate('reviews')
      .limit(8);
    res.status(200).json({
      success: true,
      message: 'Featured ECU files',
      data: files,
    });
  } catch (err) {
    res.status(404).json({
      success: false,
      message: 'No featured ECU files found',
    });
  }
};

// ✅ Count total ECU files
export const getECUFileCount = async (req, res) => {
  try {
    const count = await ECUFile.estimatedDocumentCount();
    res.status(200).json({
      success: true,
      data: count,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Failed to count ECU files',
    });
  }
};
