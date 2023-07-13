import { Button, Space, Typography, Upload, Progress } from 'antd';
import { FileOutlined, DownloadOutlined } from '@ant-design/icons'
import './App.css';
import axios from 'axios';

import { useState } from 'react';

function App() {
  const [files, setFiles] = useState({});

  const handleFileUpload = ({ file }) => {
    const formData = new FormData();
    formData.append('files', file); 
    console.log(file);

   

    axios.post('http://localhost:5040/upload', formData, {
      onUploadProgress: (progressEvent) => {
        const progress = progressEvent.loaded / progressEvent.total;
        setFiles(prevState => ({
          ...prevState,
          [file.uid]: {
            name: file.name,
            uid: file.uid,
            progress
          }
        }));
      },
    });
  };

  const handleDownload = (fileName) => {
    console.log(fileName);
    axios({
      url: `http://localhost:5040/files/${fileName}`,
      method: 'GET',
      responseType: 'blob',
    })
      .then((response) => {
        const blob = response.data;
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', fileName);
        document.body.appendChild(link);
        link.click();
      });
  };
  

  return (
    <Space direction='vertical' style={{
      width: "100vw",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      marginTop: 24,
    }}>
      <Upload multiple customRequest={handleFileUpload} showUploadList={false}>
        <Button>Click to Upload</Button>
      </Upload>
      {Object.values(files).map((file, index) => (
        <Space direction='vertical' style={{ backgroundColor: 'rgba(0,0,0,0.05)', width: 500, padding: 8 }} key={file.uid}>
          <Space>
            <FileOutlined />
            <Typography>{file.name} <Button style={{marginLeft: 295, backgroundColor: 'rgba(0,0,0,0.03)' , height: 30}} onClick={()=> handleDownload(file.name)}><DownloadOutlined /></Button></Typography>
          </Space>
          
          <Progress percent={Math.ceil(file.progress * 100)} />
        </Space>
      ))}
    </Space>
  );
}

export default App;
