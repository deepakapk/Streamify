import React, { useEffect, useState } from "react";
import styled from "styled-components";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Container = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  background-color: #0000009c;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Wrapper = styled.div`
  width: 600px;
  height: 600px;
  background-color: ${({ theme }) => theme.bgLighter};
  color: ${({ theme }) => theme.text};
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  position: relative;

  @media (max-width: 768px) {
    width: 80%;
    height: 80%;
  }
`;

const Close = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  cursor: pointer;
`;

const Title = styled.h1`
  text-align: center;
`;

const Input = styled.input`
  border: 1px solid ${({ theme }) => theme.soft};
  color: ${({ theme }) => theme.text};
  border-radius: 3px;
  padding: 10px;
  background-color: transparent;
`;

const Desc = styled.textarea`
  border: 1px solid ${({ theme }) => theme.soft};
  color: ${({ theme }) => theme.text};
  border-radius: 3px;
  padding: 10px;
  background-color: transparent;
`;

const Button = styled.button`
  border-radius: 3px;
  border: none;
  padding: 10px 20px;
  font-weight: 500;
  cursor: pointer;
  background-color: ${({ theme }) => theme.soft};
  color: ${({ theme }) => theme.textSoft};
`;

const Label = styled.label`
  font-size: 14px;
`;

const Upload = ({ setOpen }) => {
  const [img, setImg] = useState(undefined);
  const [video, setVideo] = useState(undefined);
  const [imgPerc, setImgPerc] = useState(0);
  const [vidPerc, setVidPerc] = useState(0);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [tags, setTags] = useState([]);
  const [imgUrl, setImgUrl] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [data, setData] = useState({})

    const navigate = useNavigate();

  const handleTags = (e) => {
    setTags(e.target.value.split(","));
  };

  const uploadFile = async (file, type) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "video_preset"); 
    formData.append("resource_type", type); 

    try {
      const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUD_NAME}/${type}/upload`;
      const res = await axios.post(cloudinaryUrl, formData, {
        onUploadProgress: (progressEvent) => {
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          type === "video" ? setVidPerc(percent) : setImgPerc(percent);
        },
      });

      if (type === "video") setVideoUrl(res.data.secure_url);
      else setImgUrl(res.data.secure_url);
    } catch (err) {
      console.error("Upload failed:", err);
    }
  };

  useEffect(() => {
    video && uploadFile(video, "video");
  }, [video]);

  useEffect(() => {
    img && uploadFile(img, "image");
  }, [img]);

  const handleSubmit = async(e) => {
    e.preventDefault();
    const res = await axios.post(import.meta.env.VITE_BACKEND_API + "/videos",{title, desc, tags, videoUrl, imgUrl} , {withCredentials : true})
    setOpen(false)
    if(res.status === 200)
    {
        navigate("/")
    }
  };

  return (
    <Container>
      <Wrapper>
        <Close onClick={() => setOpen(false)}>X</Close>
        <Title>Upload a New Video</Title>

        <Label>Video:</Label>
        <Input type="file" accept="video/*" onChange={(e) => setVideo(e.target.files[0])} />
        {vidPerc > 0 && <p>Video upload: {vidPerc}%</p>}

        <Input type="text" placeholder="Title" onChange={(e) => setTitle(e.target.value)} />
        <Desc placeholder="Description" rows={8} onChange={(e) => setDesc(e.target.value)} />
        <Input
          type="text"
          placeholder="Separate the tags with commas."
          onChange={handleTags}
        />

        <Label>Thumbnail Image:</Label>
        <Input type="file" accept="image/*" onChange={(e) => setImg(e.target.files[0])} />
        {imgPerc > 0 && <p>Image upload: {imgPerc}%</p>}

        <Button  onClick={handleSubmit}>Upload</Button>
      </Wrapper>
    </Container>
  );
};

export default Upload;
