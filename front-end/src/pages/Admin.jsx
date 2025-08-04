import axios from 'axios';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import {toast} from "react-toastify"

const Container = styled.div`
  padding: 20px;
`;

const UserSection = styled.div`
  margin-bottom: 30px;
  padding: 20px;
  background-color: ${({ theme }) => theme.bgLighter};
  border-radius: 10px;
`;

const SectionTitle = styled.h2`
  color: ${({ theme }) => theme.text};
`;

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
`;

const VideoCard = styled.div`
  background-color: ${({ theme }) => theme.bgLighter};
  padding: 15px;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0,0,0,0.05);
`;

const VideoTitle = styled.h3`
  color: ${({ theme }) => theme.text};
`;

const VideoDesc = styled.p`
  color: ${({ theme }) => theme.textSoft};
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
`;

const Button = styled.button`
  background-color: ${({ update, theme }) => update ? '#4CAF50' : '#f44336'};
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
`;

const Input = styled.input`
  width: 100%;
  margin-top: 5px;
  padding: 5px;
  border: 1px solid ${({ theme }) => theme.soft};
  border-radius: 4px;
  background-color: ${({ theme }) => theme.bgLighter};
  color: ${({ theme }) => theme.text};
`;

const Admin = () => {
  const [videos, setVideos] = useState([]);
  const [editId, setEditId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDesc, setEditDesc] = useState("");

  const [userName, setUserName] = useState("");
  const [userImg, setUserImg] = useState("");
  const [userId, setUserId] = useState("");
  const [user, setUser] = useState("");
  const [userImgFile, setUserImgFile] = useState(null);


  const fetchVideos = async () => {
    try {
      const res = await axios.get(import.meta.env.VITE_BACKEND_API + "/videos/findall", {
        withCredentials: true
      });
      setVideos(res.data);
    } catch (err) {
      console.error("Failed to fetch videos:", err.message);
    }
  };

  const fetchUser = async () => {
    try {
      const res = await axios.get(import.meta.env.VITE_BACKEND_API + "/users/fetchUser", {
        withCredentials: true
      });
      setUserName(res.data.user.name || "");
      setUserImg(res.data.user.img || "");
      setUserId(res.data.user._id || "")
      setUser(res.data.user)
    } catch (err) {
      console.log("Failed to fetch user:", err.message);
    }
  };

  useEffect(() => {
    fetchVideos();
    fetchUser();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(import.meta.env.VITE_BACKEND_API + `/videos/${id}`, { withCredentials: true });
      setVideos(prev => prev.filter(video => video._id !== id));
    } catch (err) {
      console.error("Failed to delete video:", err.message);
    }
  };

  const handleUpdate = async (id) => {
    try {
      await axios.put(import.meta.env.VITE_BACKEND_API + `/videos/${id}`, {
        title: editTitle,
        desc: editDesc
      }, { withCredentials: true });

      setEditId(null);
      fetchVideos();
    } catch (err) {
      console.error("Failed to update video:", err.message);
    }
  };

  const handleUserUpdate = async () => {
    try {
      let imageUrl = userImg;

      if (userImgFile) {
        const data = new FormData();
        data.append("file", userImgFile);
        data.append("upload_preset", "video_preset");
        data.append("cloud_name", `${import.meta.env.VITE_CLOUD_NAME}`);

        const cloudRes = await axios.post(`https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUD_NAME}/image/upload`, data);
        imageUrl = cloudRes.data.secure_url;
      }
      await axios.put(import.meta.env.VITE_BACKEND_API + `/users/${userId}`, {
        name: userName,
        img: imageUrl,
      }, { withCredentials: true });

      toast("User updated successfully!");
      setUserImgFile(null);
      setUserImg(imageUrl);

    } catch (err) {
      console.error("Failed to update user:", err.message);
    }
  };

  return (
    <Container>

      {/* User Section */}
      <UserSection>
        <SectionTitle>Update Your Info</SectionTitle>
        <Input
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          placeholder="Your Name"
        />
        <Input
          type="file"
          onChange={(e) => setUserImgFile(e.target.files[0])}
          accept="image/*"
        />
        {userImg && !userImgFile && (
          <img src={userImg} alt="Profile" style={{ width: "60px", height: "60px", marginTop: "10px", borderRadius: "50%" }} />
        )}
        {userImgFile && (
          <img src={URL.createObjectURL(userImgFile)} alt="Preview" style={{ width: "60px", height: "60px", marginTop: "10px", borderRadius: "50%" }} />
        )}
        <Button update onClick={handleUserUpdate}>Save</Button>
      </UserSection>

      {/* Videos Section */}
      <GridContainer>
        {videos.map(video => (
          <VideoCard key={video._id}>
            {editId === video._id ? (
              <>
                <Input
                  value={editTitle}
                  onChange={e => setEditTitle(e.target.value)}
                  placeholder="New Title"
                />
                <Input
                  value={editDesc}
                  onChange={e => setEditDesc(e.target.value)}
                  placeholder="New Description"
                />
                <ButtonGroup>
                  <Button update onClick={() => handleUpdate(video._id)}>Save</Button>
                  <Button onClick={() => setEditId(null)}>Cancel</Button>
                </ButtonGroup>
              </>
            ) : (
              <>
                <VideoTitle>{video.title}</VideoTitle>
                <VideoDesc>{video.desc}</VideoDesc>
                <ButtonGroup>
                  <Button
                    update
                    onClick={() => {
                      setEditId(video._id);
                      setEditTitle(video.title);
                      setEditDesc(video.desc);
                    }}
                  >
                    Update
                  </Button>
                  <Button onClick={() => handleDelete(video._id)}>Delete</Button>
                </ButtonGroup>
              </>
            )}
          </VideoCard>
        ))}
      </GridContainer>
    </Container>
  );
};

export default Admin;
