const express = require('express');
const multer = require('multer');
const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');
const path = require('path');
const cors = require('cors'); // Require cors module

require('dotenv').config();

const app = express();
const upload = multer({ dest: 'uploads/' });

app.use(cors()); // Use cors middleware to enable CORS

// Serve static files from the "uploads" directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.post('/remove-bg', upload.single('image_file'), async (req, res) => {
  try {
    const formData = new FormData();
    formData.append('image_file', fs.createReadStream(req.file.path));
    formData.append('size', 'auto');

    console.log('Sending request to Remove.bg...');
    const response = await axios.post(
      'https://api.remove.bg/v1.0/removebg',
      formData,
      {
        headers: {
          ...formData.getHeaders(),
          'X-Api-Key': process.env.REMOVE_BG_KEY,
        },
        responseType: 'arraybuffer',
      }
    );

    if (response.status !== 200) {
      console.error('Remove.bg API response:', response.status, response.data);
      return res.status(500).send('Failed to remove background');
    }

    const outputFilename = `no-bg-${req.file.filename}.png`;
    const outputPath = path.join(__dirname, 'uploads', outputFilename);
    fs.writeFileSync(outputPath, Buffer.from(response.data));

    res.send({ image_url: `https://back-remover.onrender.com/uploads/${outputFilename}` });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Failed to remove background');
  }
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
