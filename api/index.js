const express = require('express');
const nodemailer = require('nodemailer');
const multer = require('multer');
const cors = require('cors');

const app = express();
const upload = multer({ storage: multer.memoryStorage() });

// Middleware
app.use(cors());
app.use(express.json());

// Root route
app.get('/', (req, res) => {
  res.send('Welcome to ServerLeanScape API!');
});

// Optional: Route for /send-mail (GET)
app.get('/send-mail', (req, res) => {
  res.send('Please use POST request to /send-email');
});

// Nodemailer configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

// Email endpoint
app.post('/send-email', upload.single('bill'), async (req, res) => {
  try {
    const { username } = req.body;
    const file = req.file;

    if (!username || !file) {
      return res.status(400).json({ success: false, message: 'Username and file are required' });
    }

    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: process.env.GMAIL_USER,
      subject: 'New Bill Upload',
      text: `Username: ${username}`,
      attachments: [
        {
          filename: file.originalname,
          content: file.buffer,
        },
      ],
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending email:', error);
        return res.status(500).json({ success: false, message: error.toString() });
      }
      res.status(200).json({ success: true, message: 'Email sent: ' + info.response });
    });
  } catch (error) {
    console.error('Unexpected error:', error);
    res.status(500).json({ success: false, message: 'An unexpected error occurred' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});