const express = require('express');
const app = express();
const NODE_ENV = process.env.NODE_ENV || "production";
require('dotenv').config({ path: '.env.' + NODE_ENV });
const PORT = process.env.PORT;
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const multer = require('multer');

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
const AppRouter = require('./routes/AppRouter');


// Database connect...
const mongoURI = process.env.MONGO_URL;
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB');
});


app.use('/api', AppRouter);


app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-type,Accept,X-Access-Token,X-Key');
    if (req.method == 'OPTIONS') {
        res.status(200).end();
    } else {
        next();
    }
});

app.use((err, req, res, next) => {
    if (err instanceof multer.MulterError) {
      // Multer error
      return res.status(400).json({ message: err.message });
    } else if (err) {
      // Custom error from fileFilter
      return res.status(400).json({ message: err.message });
    }
    next();
  });

//calling server
app.listen(PORT, () => {
    console.log("server is running on", PORT)
});