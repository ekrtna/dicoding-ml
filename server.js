const express = require('express');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const cors = require('cors');

// Initialize the app
const app = express();
app.use(cors());  // Allow all origins (can be configured to specific origins)

// Root route for testing
app.get('/', (req, res) => {
    console.log('GET / request received');
    res.send('Hello, World!');
});

const upload = multer({ limits: { fileSize: 1000000 } }); // Limit 1MB

// POST route for prediction
app.post('/predict', upload.single('image'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                status: 'fail',
                message: 'Terjadi kesalahan dalam melakukan prediksi',
            });
        }

        // Dummy ML Model Simulation
        const isCancer = Math.random() > 0.5; // Replace with real prediction logic

        const response = {
            status: 'success',
            message: 'Model is predicted successfully',
            data: {
                id: uuidv4(),
                result: isCancer ? 'Cancer' : 'Non-cancer',
                suggestion: isCancer
                    ? 'Segera periksa ke dokter!'
                    : 'Penyakit kanker tidak terdeteksi.',
                createdAt: new Date().toISOString(),
            },
        };
        return res.json(response);
    } catch (error) {
        return res.status(400).json({
            status: 'fail',
            message: 'Terjadi kesalahan dalam melakukan prediksi',
        });
    }
});

// Error handling for file size limit
app.use((err, req, res, next) => {
    if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(413).json({
            status: 'fail',
            message: 'Payload content length greater than maximum allowed: 1000000',
        });
    }
    next(err);
});

// Start server on port 8080, binding to all IP addresses
const PORT = process.env.PORT || 8080;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
});
