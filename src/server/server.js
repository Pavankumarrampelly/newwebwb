const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const path = require('path');
const foodRoutes = require('./routes/food');


// Load env variables
dotenv.config();

// Initialize express
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/college-event-verse', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB Connected'))
.catch(err => console.error('MongoDB Connection Error:', err));

// Import Routes
const authRoutes = require('./routes/auth');
const eventRoutes = require('./routes/events');
const parkingRoutes = require('./routes/parking');
const foodRoutes = require('./routes/food');

// Use Routes
app.use('http://localhost:8000/api/auth', authRoutes);
app.use('http://localhost:8000/api/events', eventRoutes);
app.use('http://localhost:8000/api/parking', parkingRoutes);
app.use('http://localhost:8000/api/food', foodRoutes);

// Serve static assets if in production
if (process.env.NODE_ENV === 'production') {
  // Set static folder
  app.use(express.static('build'));
  
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../../build', 'index.html'));
  });
}

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
app.get('/ping', (req, res) => {
  res.send('Server is alive');
});
app.get('/ping', (req, res) => {
  res.send('Server is alive');
});
