const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const itemRoutes = require('./routes/item.routes');
const inquiryRoutes = require('./routes/inquiry.routes');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

connectDB();

app.use(express.json());
app.use(cors({
  origin:[
    'http://localhost:3000',
    'https://task-raktim-banerjees-projects.vercel.app/',
    'https://task-git-main-raktim-banerjees-projects.vercel.app/'
  ]
}));

app.use('/api/items', itemRoutes);
app.use('/api/inquiries', inquiryRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

process.on('unhandledRejection', (err) => {
  console.error('UNHANDLED REJECTION! 💥 Shutting down...');
  console.error(err.name, err.message);
  process.exit(1);
});