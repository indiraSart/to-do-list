require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const auth = require('./routes/auth');
const app = express();

// Middleware
app.set("view engine", "ejs");


app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept']
}));
app.use(express.static('public'))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/', auth);

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/to-do-list', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => {
    console.log('MongoDB Connected Successfully');
})
.catch(err => {
    console.error('MongoDB Connection Error:', err);
    process.exit(1);
});

// Routes





// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something broke!' });
});

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../frontend')));
}

app.get('/', (req, res) => {
    res.render('index');
});

// Basic route for testing
app.get('/api/test', (req, res) => {
    res.json({ message: 'Backend server is running' });
});


const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`API URL: http://localhost:${PORT}/api`);
}); 
