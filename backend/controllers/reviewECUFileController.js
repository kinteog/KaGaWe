import ECUFile from "../models/ECUFile.js";
import ECUFileReview from "../models/ECUFIleReview.js";

// ✅ Create a review for an ECU file
export const createECUFileReview = async (req, res) => {
  try {
    const ecuFileId = req.params.ecuFileId;
    if (!ecuFileId) {
      throw new Error("ECU File ID is missing in the request parameters.");
    }

    const newReview = new ECUFileReview({ ...req.body, ecuFileId });

    const savedReview = await newReview.save();

    // Push review ID to ECUFile document
    const updatedECUFile = await ECUFile.findByIdAndUpdate(
      ecuFileId,
      { $push: { reviews: savedReview._id } },
      { new: true }
    );

    if (!updatedECUFile) {
      throw new Error("Failed to update ECU file with the new review.");
    }

    res.status(200).json({
      success: true,
      message: "Review submitted successfully",
      data: savedReview,
    });
  } catch (err) {
    console.error("Error submitting review:", err.message);
    res.status(500).json({
      success: false,
      message: err.message || "Failed to submit review. Try again.",
    });
  }
};

// ✅ Get all ECU file reviews (admin)
export const getAllECUFileReviews = async (req, res) => {
  try {
    const reviews = await ECUFileReview.find()
      .populate("ecuFileId", "title") // populate only the title
      .sort({ createdAt: -1 });

    const formattedReviews = reviews.map((r) => ({
      _id: r._id,
      username: r.username,
      reviewText: r.reviewText,
      rating: r.rating,
      ecuFileId: r.ecuFileId?._id,
      ecuFileTitle: r.ecuFileId?.title || "N/A",
      createdAt: r.createdAt,
      updatedAt: r.updatedAt,
    }));

    res.status(200).json({
      success: true,
      data: formattedReviews,
    });
  } catch (err) {
    console.error("Failed to fetch ECU file reviews:", err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};

// ✅ Update a review
export const updateECUFileReview = async (req, res) => {
  try {
    const updatedReview = await ECUFileReview.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json({ success: true, data: updatedReview });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ✅ Delete a review
export const deleteECUFileReview = async (req, res) => {
  try {
    await ECUFileReview.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: "Review deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
