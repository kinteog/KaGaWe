import User from "../models/User.js";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// ==========================
// User Registration
// ==========================
export const register = async (req, res) => {
  try {
    const { username, email, password, phone, photo } = req.body;

    // Check for duplicates
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

    // Hash password
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);

    // Create new user
    const newUser = new User({
      username,
      email,
      password: hash,
      phone,
      photo
    });

    await newUser.save();

    res.status(200).json({ success: true, message: 'Successfully created' });

  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ success: false, message: 'Failed to create. Try again.' });
  }
};


// ==========================
// User Login
// ==========================
export const login = async (req, res) => {
  const email = req.body.email;

  try {
    const user = await User.findOne({ email });

    // If user doesn't exist
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Compare passwords
    const checkCorrectPassword = await bcrypt.compare(req.body.password, user.password);
    if (!checkCorrectPassword) {
      return res.status(401).json({ success: false, message: 'Incorrect email or password. Try again' });
    }

    const { password, ...rest } = user._doc;

    // Create JWT
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "15d" }
    );

    // Set cookie and return token and user data (including role)
    res.cookie('accessToken', token, {
      httpOnly: true,
      secure: true,        // cookie only over HTTPS
      sameSite: "None",
      expires: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000) // 15 days
    }).status(200).json({
      token,
      data: {
        ...rest,
        role: user.role,
        photo: user.photo || null
      },
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Failed to login. Try again' });
  }
};
