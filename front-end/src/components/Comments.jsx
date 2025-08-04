import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import Comment from './Comment'
import { useSelector } from 'react-redux'
import AddCommentIcon from '@mui/icons-material/AddComment';
import axios from 'axios'

const Container = styled.div``;
const NewComments = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;
const Avatar = styled.img`
  height: 50px;
  width: 50px;
  border-radius: 50%;
`;
const Input = styled.input`
  border: none;
  border-bottom: 1px solid ${({ theme }) => theme.soft};
  color: ${({ theme }) => theme.text};
  background-color: transparent;
  outline: none;
  padding: 5px;
  width: 100%;
`;
const Button = styled.button`
  color: ${({ theme }) => theme.textSoft};
`;

const Comments = ({ videoId }) => {
  const [comments, setComments] = useState([]);
  const { currentUser } = useSelector((state) => state.user);
  const [desc, setDesc] = useState("");

  const fetchComments = async () => {
    try {
      const res = await axios.get(import.meta.env.VITE_BACKEND_API + `/comments/${videoId}`);
      setComments(res.data.comments);
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [videoId]);

  const handleCom = async () => {
    try {
      await axios.post(
        import.meta.env.VITE_BACKEND_API + `/comments/`,
        { desc, videoId },
        { withCredentials: true }
      );
      setDesc("");
      fetchComments();
    } catch (error) {
      console.log("Failed to post comment:", error.message);
    }
  };

  return (
    <Container>
      <NewComments>
        <Avatar src={currentUser?.img} />
        <Input
          placeholder="Add a comment..."
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
        />
        <Button onClick={handleCom}>
          <AddCommentIcon />
        </Button>
      </NewComments>

      {comments.map((comment) => (
        <Comment key={comment._id} comment={comment} />
      ))}
    </Container>
  );
};

export default Comments;
