import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { format } from "timeago.js";

const Container = styled.div`
  width: 100%;
  max-width: ${(props) => props.type !== "sm" && "360px"};
  margin-bottom: ${(props) => (props.type === "sm" ? "10px" : "45px")};
  cursor: pointer;
  flex: 1 1 300px;
  display: ${(props) => props.type === "sm" && "flex"};
  gap: ${(props) => props.type === "sm" && "10px"};
  @media (max-width: 768px) {
    display: block;
  }
`;



const Img = styled.img`
    width: 320px;
    border-radius: 7px;
    height:  ${(props)=>props.type === "sm" ? "120px" : "202px"};
    background-color: #999;
    object-fit: cover;
    flex : 1;
      @media (max-width: 768px) {
        height: 200px;
  }
`

const Details = styled.div`
  display: flex;
  margin-top: ${(props) => (props.type === "sm" ? "0px" : "16px")};
  gap: 12px;
  flex: 1;
`;

const ChannelImage = styled.img`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: #999;
  display: ${(props) => props.type === "sm" && "none"};
`;

const Texts = styled.div``;
const Title = styled.h1`
  font-size: 16px;
  font-weight: 500;
  color: ${({ theme }) => theme.text};
`;
const ChannelName = styled.h2`
  font-size: 14px;
  color: ${({ theme }) => theme.textSoft};
  margin: 9px 0px;
`;
const Info = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme.textSoft};
`;
const Card = ({ type, video }) => {

  const [channel, setChannel] = useState({})

    useEffect(()=>{
      const fetchChannel = async()=>{
        setChannel([])
        const response = await axios.get(import.meta.env.VITE_BACKEND_API + `/users/find/${video.userId}`)
        setChannel(response.data.user)
      }
      fetchChannel();
    },[video.userId])

  return (
    <Link to={`/video/${video._id}`} style={{ textDecoration: "none" }}>
      <Container type={type}>
        <Img type={type} src={video.imgUrl}/>
        <Details type={type}>
          <ChannelImage
            type={type}
            src={channel.img}
          />
          <Texts>
            <Title>{video.title}</Title>
            <ChannelName>{channel.name}</ChannelName>
            <Info>
              {video.views} views &#9679; {format(video.createdAt)}
            </Info>
          </Texts>
        </Details>
      </Container>
    </Link>
  );
};

export default Card;
