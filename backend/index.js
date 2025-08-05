
import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import tourRoute from './routes/tours.js';
import serviceRoute from './routes/services.js';
import userRoute from './routes/users.js';
import authRoute from './routes/auth.js';
import reviewRoute from './routes/reviews.js';
import reviewServicesRoute from './routes/servicereviews.js';
import bookingRoute from './routes/bookings.js';
import serviceBookingRoute from './routes/servicesBooking.js';
import serviceReviewRoutes from './routes/servicereviews.js';

import sparePartRoutes from './routes/sparePartRoutes.js';
import sparePartOrderRoutes from './routes/sparePartOrderRoutes.js';
import reviewSparePartRoutes from './routes/reviewSparePartRoutes.js';

import ecuFileRoutes from './routes/ecuFileRoutes.js';
import ecuFileOrderRoutes from './routes/ecuFileOrderRoutes.js';
import reviewEcuFileRoutes from './routes/reviewEcuFileRoutes.js';

dotenv.config()
const app = express()
const port = process.env.PORT || 8000;
const corsOptions = {
  origin:true,
  credentials:true
}


// database connection
mongoose.set("strictQuery", false)
const connect = async()=>{
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser:true,
      useUnifiedTopology:true
    })

    console.log('MongoDB Connected');
    
  } catch (err) {
    console.log('Error connecting to MongoDB');
    
  }
}




// middleware
app.use(express.json());
app.use(cors(corsOptions));
app.use(cookieParser());
app.use('/api/v1/auth', authRoute);
app.use('/api/v1/tours', tourRoute);
app.use('/api/v1/services', serviceRoute);
app.use('/api/v1/users', userRoute);
app.use('/api/v1/review', reviewRoute);
app.use('/api/v1/reviewservices', reviewServicesRoute);
app.use('/api/v1/booking', bookingRoute);
app.use('/api/v1/servicebooking', serviceBookingRoute);
app.use('/api/v1/servicereviews', serviceReviewRoutes);
app.use('/api/v1/spareparts', sparePartRoutes);
app.use('/api/v1/sparepartorders', sparePartOrderRoutes);
app.use('/api/v1/reviewspareparts', reviewSparePartRoutes);
app.use('/api/v1/ecufiles', ecuFileRoutes);
app.use('/api/v1/ecufileorders', ecuFileOrderRoutes);
app.use('/api/v1/reviewecufile', reviewEcuFileRoutes);


app.listen(port, ()=>{
  connect();
  console.log("server listening on port", port);
}); 