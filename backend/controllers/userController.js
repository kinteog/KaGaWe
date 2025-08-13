import User from '../models/User.js'
import bcrypt from 'bcryptjs';
import fs from 'fs';
import path from 'path';

// create new User
export const createUser = async (req, res) => {
  try {
    const { email, username, password, phone, ...rest } = req.body;

    // Check if email or username already exists
    const existingEmail = await User.findOne({ email });
    const existingUsername = await User.findOne({ username });
    const existingPhone = await User.findOne({ phone });

    if (existingEmail) {
      return res.status(400).json({ success: false, message: 'Email already in use' });
    }

    if (existingUsername) {
      return res.status(400).json({ success: false, message: 'Username already taken' });
    }


    if (existingPhone) {
      return res.status(400).json({ success: false, message: 'Phone number already in use' });
    }


    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      phone,
      ...rest,
    });

    const savedUser = await newUser.save();

    res.status(200).json({
      success: true,
      message: 'Successfully created',
      data: savedUser,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Failed to create. Try again',
    });
  }
};



//Update User
export const updateUser = async (req, res) => {
  const id = req.params.id;

  try {
    const existingUser = await User.findById(id);
    if (!existingUser) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const { email, username, password, phone, ...rest } = req.body;

    // Check for duplicate email (used by someone else)
    if (email && email !== existingUser.email) {
      const emailExists = await User.findOne({ email });
      if (emailExists) {
        return res.status(400).json({ success: false, message: 'Email already in use' });
      }
    }

    // Check for duplicate username (used by someone else)
    if (username && username !== existingUser.username) {
      const usernameExists = await User.findOne({ username });
      if (usernameExists) {
        return res.status(400).json({ success: false, message: 'Username already taken' });
      }
    }

    if (phone && phone !== existingUser.phone) {
      const phoneExists = await User.findOne({ phone });
      if (phoneExists && phoneExists._id.toString() !== id) {
        return res.status(400).json({ success: false, message: 'Phone number already in use' });
      }
    }

    const updatedData = {
      username: username || existingUser.username,
      email: email || existingUser.email,
      phone: phone || existingUser.phone,
      ...rest,
    };

    if (password && password.trim() !== '') {
      const salt = await bcrypt.genSalt(10);
      updatedData.password = await bcrypt.hash(password, salt);
    }

    const updatedUser = await User.findByIdAndUpdate(id, { $set: updatedData }, { new: true });

    res.status(200).json({
      success: true,
      message: 'Successfully updated',
      data: updatedUser,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Failed to update. Try again' });
  }
};



// Delete User
// Delete User
export const deleteUser = async (req, res) => {
  const id = req.params.id;

  try {
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // ✅ Delete profile image if exists and is not default avatar
    if (user.photo && !user.photo.includes('avatars/avatar.jpg')) {
      // Ensure we point to "uploads" folder
      const imagePath = path.join(process.cwd(), 'uploads', user.photo);

      fs.unlink(imagePath, (err) => {
        if (err) {
          console.warn('Failed to delete user image:', imagePath, err.message);
        } else {
          console.log('Deleted user image:', imagePath);
        }
      });
    }

    await User.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'User and profile image deleted successfully',
    });
  } catch (err) {
    console.error('Delete error:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to delete user.',
    });
  }
};


//getSingle User
export const getSingleUser =  async(req, res) => {
    const id = req.params.id

    try {

        const user = await User.findById(id);

        res.status(200).json({
            success:true, 
            message:'Record found',  
            data: user, 
        });
       

    } catch (err) {
        res.status(404).json({
            success:false, 
            message:'Record not found'
        });
        
    }
};

//getAll User
export const getAllUser =  async(req, res) => {

    
    try {
        const user = await User.find({})

        res.status(200).json({
            success:true,  
            message:'Records found',  
            data: user,
        });

    } catch (err) {
        res.status(404).json({
            success:false, 
            message:'Records not found'
        });
    }
};