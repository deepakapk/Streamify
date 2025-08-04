
import React, { useState } from 'react'
import styled from 'styled-components'
import Card from '../components/Card'
import { useEffect } from 'react'
import axios from "axios"


const Text = styled.span`
    font-size: 13px;
    font-weight: 500;
    color : ${({theme}) => theme.textSoft};
`

const Container = styled.div`
    max-width: 1500px;
    margin: auto;
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
    justify-content: center;
    padding: 20px;

    @media (max-width: 768px) {
        gap: 16px;
        padding: 10px;
    }

    @media (max-width: 480px) {
        flex-direction: column;
        gap: 12px;
    }
`

const Home = ({type}) => {

  const [videos, setVideos] = useState([])

  useEffect(()=>{
    const fetchVideos = async()=>{
      setVideos([])
      const response = await axios.get(import.meta.env.VITE_BACKEND_API + `/videos/${type}`, {withCredentials:true})
      setVideos(response.data.videos)
    }
    fetchVideos();
  },[type])

  return (
    <Container>
      {videos.length>1 ? videos.map((video,index)=>(
        <Card key={index} video={video}/>
      )) : <Text>No Videos to Watch here</Text>}
        
    </Container>
  )
}

export default Home