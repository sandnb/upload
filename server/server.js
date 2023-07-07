const express = require('express');
const multer = require('multer');
const cors = require('cors');
const app = express();
app.use(cors());

const storage = multer.diskStorage({
  destination: './uploads',
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage }).array('files', 100);

app.post('/upload', (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      
      console.error(err);
      res.status(500).json({ message: 'Upload failed' });
    } else {
     
      const uploadedFiles = req.files.map((file) => {
        return {
          name: file.originalname,
          data: file.buffer,
          size: file.size,
          mimetype: file.mimetype,
        };
      });

      console.log(uploadedFiles); 

     
      res.json({ message: 'Files uploaded successfully' });
    }
  });
});

app.listen(5040, () => {
  console.log('Server is running on port 5040');
});
