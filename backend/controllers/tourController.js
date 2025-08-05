
import Tour from '../models/Tour.js'


// create new tour
export const createTour =  async (req,res)=> {

    const newTour =  new Tour(req.body)

    try{
        const savedTour =  await newTour.save()

        res.status(200).json({
            success:true, 
            message:'Successfully created', 
            data:savedTour
        });

    } catch(err) {

        res.status(500).json({
            success:false, 
            message:'Failed to create. try again'
        });
        
    }
};

//Update tour
export const updateTour =  async(req, res) => {

    const id = req.params.id

    try {

        const updatedTour =  await Tour.findByIdAndUpdate(id, {
            $set: req.body
        }, {new:true})

        res.status(200).json({
            success:true, 
            message:'Successfully updated', 
            data:updatedTour
        });

    } catch (err) {
        res.status(500).json({
            success:false, 
            message:'Failed to update. try again'
        });
        
    }
};

//delete tour
export const deleteTour =  async(req, res) => {
    const id = req.params.id

    try {

        await Tour.findByIdAndDelete(id);

        res.status(200).json({
            success:true, 
            message:'Successfully Deleted'
        });

    } catch (err) {
        res.status(500).json({
            success:false, 
            message:'Failed to delete. try again'
        });
        
    }
};

//getSingle Tour
export const getSingleTour =  async(req, res) => {
    const id = req.params.id

    try {

        const tour = await Tour.findById(id).populate('reviews');

        res.status(200).json({
            success:true, 
            message:'Record found',  
            data: tour, 
        });
       

    } catch (err) {
        res.status(404).json({
            success:false, 
            message:'Record not found'
        });
        
    }
};

//getAll tour
export const getAllTour =  async(req, res) => {
    // for pagination
    let page = parseInt(req.query.page);
    if (isNaN(page) || page < 1) {
      page = 0; // Default to 0 if the page is NaN or less than 1
    }

    try {
        const tours = await Tour.find({})
        .populate('reviews')
        .skip(page * 8)
        .limit(8);

        res.status(200).json({
            success:true, 
            count:tours.length, 
            message:'Records found',  
            data: tours,
        });

    } catch (err) {
        res.status(404).json({
            success:false, 
            message:'Records not found'
        });
    }
};

// get tour by search

export const getTourBySearch = async(req, res)=>{

    // here 'i' means case sensitive
    const city = new RegExp(req.query.city, 'i') 
    const distance = parseInt(req.query.distance)
    const maxGroupSize = parseInt(req.query.maxGroupSize)

    try {
        // gte means greater than or equal
        const tours = await Tour.find({ city, distance:{$gte:distance},
        maxGroupSize:{$gte:maxGroupSize}}).populate('reviews');

        res.status(200).json({
            success:true, 
            message:'Records found',   
            data: tours,
        });

    } catch (err) {
        console.error(err); // Log the error for debuggi
        res.status(404).json({
            success:false, 
            message:'Records not found'
        });   
    }

}

//get featured tour
export const getFeaturedTour =  async(req, res) => {
   
    try {
        const tours = await Tour.find({featured:true})
        .populate('reviews')
        .limit(8);

        res.status(200).json({
            success:true, 
            message:'Records found',  
            data: tours,
        });

    } catch (err) {
        res.status(404).json({
            success:false, 
            message:'Records not found'
        });
    }
};

// Get tour counts
export const getTourCount = async(req, res)=>{
    try {
        const tourCount =  await Tour.estimatedDocumentCount()

        res.status(200).json({
            success:true,
            data:tourCount
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'failed to fetch'
        })
    }
}