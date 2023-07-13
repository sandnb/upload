const express = require('express');
const multer = require('multer');
const cors = require('cors');
const app = express();
const fs = require('fs');
const path = require('path');
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

// app.get('/files', (req, res) => {
//   const filesDir = path.join(__dirname, 'uploads');
//   fs.readdir(filesDir, (err, files) => {
//     if (err) {
//       console.error(err);
//       res.status(500).json({ message: 'Failed to retrieve files' });
//     } else {
//       res.json({ files });
//     }
//   });"rc-upload-1689218515414-3
// });

app.get('/', (req, res) => {
  res.send('Welcome to the server!');
});


app.get('/files/:fileName', (req, res) => {
  const fileName = req.params.fileName;
  const filePath = path.join(__dirname, 'uploads', fileName);
  res.download(filePath, (err) => {
    if (err) {
      console.error(err);
      res.status(500).json({ message: 'File download failed' });
    }
  });
});





app.listen(5040, () => {
  console.log('Server is running on port 5040');
  console.log('current user:', process.env.USERNAME);
});
