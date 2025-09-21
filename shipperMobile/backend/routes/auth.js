const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Shipper = require('../models/Shipper');

const router = express.Router();

// Register route
router.post('/register', async (req, res) => {
  try {
    const { username, password, email, phone } = req.body;

    // Check if username exists
    const existingShipper = await Shipper.findOne({ username });
    if (existingShipper) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create shipper
    const shipper = new Shipper({
      username,
      password: hashedPassword,
      email,
      phone,
    });

    await shipper.save();

    // Create JWT token with random secret
    const token = jwt.sign(
      { shipperId: shipper._id, username: shipper.username },
      process.env.JWT_SECRET || 'fallback-random-key',
      { expiresIn: '24h' }
    );

    res.status(201).json({
      token,
      shipper: { id: shipper._id, username: shipper.username },
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Login route
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    const shipper = await Shipper.findOne({ username });
    if (!shipper) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isValidPassword = await bcrypt.compare(password, shipper.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { shipperId: shipper._id, username: shipper.username },
      process.env.JWT_SECRET || 'fallback-random-key',
      { expiresIn: '24h' }
    );

    res.json({
      token,
      shipper: { id: shipper._id, username: shipper.username },
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
