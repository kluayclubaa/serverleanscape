// server.js
const express = require('express');
const nodemailer = require('nodemailer');
const multer = require('multer');
const cors = require('cors');
const path = require('path');

const app = express();
const upload = multer({ dest: 'uploads/' }); // Temporary storage for uploaded files

// Middleware
app.use(cors()); // Enable CORS for frontend-backend communication
app.use(express.json()); // Parse JSON request bodies

// Nodemailer configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'kluay.edu@gmail.com', // Replace with your Gmail address
    pass: 'hpgc duhd tkkh imtk', // Replace with your app-specific password
  },
});

// Email endpoint
app.post('/send-email', upload.single('bill'), async (req, res) => {
  try {
    const { username } = req.body; // Get username from request body
    const file = req.file; // Get uploaded file

    // Validate input
    if (!username || !file) {
      return res.status(400).json({ success: false, message: 'Username and file are required' });
    }

    // Prepare email options
    const mailOptions = {
      from: 'kluay.edu@gmail.com', // Sender email
      to: 'kluay.edu@gmail.com', // Receiver email
      subject: 'New Bill Upload', // Email subject
      text: `Username: ${username}`, // Email body
      attachments: [
        {
          filename: file.originalname, // Use the original file name
          path: file.path, // Path to the uploaded file
        },
      ],
    };

    // Send email
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending email:', error);
        return res.status(500).json({ success: false, message: error.toString() });
      }
      console.log('Email sent:', info.response);
      res.status(200).json({ success: true, message: 'Email sent: ' + info.response });
    });
  } catch (error) {
    console.error('Unexpected error:', error);
    res.status(500).json({ success: false, message: 'An unexpected error occurred' });
  }
});

// Start the server
const PORT = process.env.PORT || 5000; // Use port 5000 or a custom port from environment variables
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});