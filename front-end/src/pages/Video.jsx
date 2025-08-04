import React, { useEffect, useState } from 'react'
import styled from "styled-components"
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownOffAltIcon from '@mui/icons-material/ThumbDownOffAlt';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import ShareIcon from '@mui/icons-material/Share';
import Comments from '../components/Comments';
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from 'react-router-dom';
import { dislike, fetchSuccess, like } from '../redux/videoSlice';
import axios from 'axios';
import { format } from 'timeago.js';
import { subscription } from '../redux/userSlice';

const Container = styled.div`
  display: flex;
  gap: 24px;
  z-index: 8;
  @media (max-width: 1000px) {
    flex-direction: column;
    padding: 0 1rem;
  }
`

const Content = styled.div`
  flex: 5;
  width: 100%;
`

const VideoWrapper = styled.div`
  position: relative;
  width: 100%;
  margin-bottom: 1rem;
`

const Title = styled.h1`
  font-size: 18px;
  font-weight: 400;
  margin-top: 20px;
  margin-bottom: 10px;
  color: ${({ theme }) => theme.text};
`

const Details = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 10px;
`

const Info = styled.span`
  color: ${({ theme }) => theme.textSoft};
`

const Buttons = styled.div`
  display: flex;
  gap: 20px;
  color: ${({ theme }) => theme.text};
  flex-wrap: wrap;
`

const Button = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  cursor: pointer;
`

const Hr = styled.hr`
  margin: 15px 0px;
  border: 0.5px solid ${({ theme }) => theme.textSoft};
`

const Channel = styled.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 20px;
`

const ChannelInfo = styled.div`
  display: flex;
  gap: 20px;
`

const Image = styled.img`
  height: 50px;
  width: 50px;
  border-radius: 50%;
`

const ChannelDetail = styled.div`
  display: flex;
  flex-direction: column;
  color: ${({ theme }) => theme.text};
`

const ChannelName = styled.div`
  font-weight: 500;
`

const ChannelCounter = styled.div`
  margin-top: 5px;
  margin-bottom: 20px;
  color: ${({ theme }) => theme.textSoft};
  font-size: 12px;
`

const Description = styled.p`
  font-size: 14px;
  text-align: justify;
`

const Subscribe = styled.button`
  background-color: #cc1a00;
  font-weight: 500;
  color: white;
  border: none;
  border-radius: 2px;
  height: max-content;
  padding: 10px 20px;
  cursor: pointer;
`

const VideoFrame = styled.video`
  max-height: 720px;
  width: 100%;
  object-fit: contain;
`

const Video = () => {
  const { currentUser } = useSelector((state) => state.user);
  const { currentVideo } = useSelector((state) => state.video);
  const dispatch = useDispatch();
  const path = useLocation().pathname.split("/")[2];

  const [channel, setChannel] = useState({});

  useEffect(() => {
    if (!path) return;

    const fetchData = async () => {
      try {
       
        await axios.put(`${import.meta.env.VITE_BACKEND_API}/videos/view/${path}`);

        const videoRes = await axios.get(`${import.meta.env.VITE_BACKEND_API}/videos/find/${path}`);
        const channelRes = await axios.get(`${import.meta.env.VITE_BACKEND_API}/users/find/${videoRes.data.userId}`);

        dispatch(fetchSuccess(videoRes.data));
        setChannel(channelRes.data.user || channelRes.data);
      } catch (error) {
        console.error("❌ Fetch error:", error.message);
      }
    };

    fetchData();
  }, [path, dispatch]);

  const handleLike = async () => {
    if (!currentUser) return;
    try {
      await axios.put(`${import.meta.env.VITE_BACKEND_API}/users/like/${currentVideo._id}`, {}, { withCredentials: true });
      dispatch(like(currentUser._id));
    } catch (err) {
      console.error("Like error:", err.message);
    }
  }

  const handleDisLike = async () => {
    if (!currentUser) return;
    try {
      await axios.put(`${import.meta.env.VITE_BACKEND_API}/users/dislike/${currentVideo._id}`, {}, { withCredentials: true });
      dispatch(dislike(currentUser._id));
    } catch (err) {
      console.error("Dislike error:", err.message);
    }
  }

  const handleSubscribe = async () => {
    if (!currentUser) return;
    try {
      const isSubscribed = currentUser.subscribedUsers?.includes(channel._id);
      const url =`${import.meta.env.VITE_BACKEND_API}/users/${isSubscribed ? "unsub" : "sub"}/${channel._id}`;
      await axios.put(url, {}, { withCredentials: true });
      dispatch(subscription(channel._id));
    } catch (err) {
      console.error("Subscribe error:", err.message);
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(currentVideo.videoUrl)
      .then(() => {
        alert("Video URL copied to clipboard!");
      })
      .catch((err) => {
        console.error("Copy failed:", err);
      });
  }

  if (!currentVideo) return <div>Loading video...</div>;

  return (
    <Container>
      <Content>
        <VideoWrapper>
          <VideoFrame controls src={currentVideo?.videoUrl} />
        </VideoWrapper>
        <Title>{currentVideo?.title}</Title>
        <Details>
          <Info>{currentVideo?.views} views • {format(currentVideo?.createdAt)}</Info>
          <Buttons>
            <Button onClick={handleLike}>
              {currentUser && currentVideo.likes?.includes(currentUser._id) ? <ThumbUpIcon /> : <ThumbUpOffAltIcon />}
              {currentVideo.likes?.length}
            </Button>
            <Button onClick={handleDisLike}>
              {currentUser && currentVideo.dislikes?.includes(currentUser._id) ? <ThumbDownIcon /> : <ThumbDownOffAltIcon />}
              Dislike
            </Button>
            <Button onClick={handleCopy}><ShareIcon /> Share</Button>
          </Buttons>
        </Details>
        <Hr />
        <Channel>
          <ChannelInfo>
            <Image src={channel.img} />
            <ChannelDetail>
              <ChannelName>{channel.name}</ChannelName>
              <ChannelCounter>{channel.subscribers} subscribers</ChannelCounter>
              <Description>{currentVideo.desc}</Description>
            </ChannelDetail>
          </ChannelInfo>
          {currentUser && currentUser._id !== channel._id && (
            <Subscribe onClick={handleSubscribe}>
              {currentUser.subscribedUsers?.includes(channel._id) ? "SUBSCRIBED" : "SUBSCRIBE"}
            </Subscribe>
          )}
        </Channel>
        <Hr />
        <Comments videoId={currentVideo._id} />
      </Content>
    </Container>
  )
}

export default Video;