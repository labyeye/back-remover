const express = require('express');
const multer = require('multer');
const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');
const path = require('path');

const app = express();
const upload = multer({ dest: 'uploads/' });

app.post('/remove-bg', upload.single('image_file'), async (req, res) => {
  const filePath = req.file.path;
  const formData = new FormData();
  formData.append('image_file', fs.createReadStream(filePath));
  formData.append('size', 'auto');

  try {
    const response = await axios.post('https://api.remove.bg/v1.0/removebg', formData, {
      headers: {
        ...formData.getHeaders(),
        'X-Api-Key': 'K4NDvHm8K9x9s3jRL1UvwDnf',
      },
      responseType: 'arraybuffer',
    });

    const outputFilename = `no-bg-${req.file.filename}.png`;
    const outputPath = path.join(__dirname, 'uploads', outputFilename);
    fs.writeFileSync(outputPath, Buffer.from(response.data));

    res.send({ image_url: `http://localhost:5001/uploads/${outputFilename}` });
  } catch (error) {
    console.error(error.response ? error.response.data : error.message);
    res.status(500).send('Failed to remove background');
  } finally {
    fs.unlinkSync(filePath); // Clean up the uploaded file
  }
});

app.use('/uploads', express.static('uploads'));

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

