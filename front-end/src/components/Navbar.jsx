import React, { useState } from "react";
import styled from "styled-components";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import SearchIcon from "@mui/icons-material/Search";
import MenuIcon from "@mui/icons-material/Menu";
import VideoCallOutlinedIcon from "@mui/icons-material/VideoCallOutlined"
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Upload from "./Upload";

const Container = styled.div`
  position: sticky;
  top: 0;
  background-color: ${({ theme }) => theme.bgLighter};
  height: 56px;
  z-index: 10;
`;

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  height: 100%;
  padding: 0px 20px;
  position: relative;
`;
const Search = styled.div`
  width: 40%;
  position: absolute;
  left: 0px;
  right: 0px;
  margin: auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 5px;
  border: 1px solid #ccc;
  border-radius: 3px;

  @media (max-width: 768px) {
    position: relative;
  }
`;

const Input = styled.input`
  border: none;
  background-color: transparent;
  width: 100%;
  outline: none;
  color: ${({ theme }) => theme.text};
  &:focus {
    border: none;
  }
`;

const SearchI = styled.div`
  color: ${({theme}) => theme.text};
`

const Button = styled.button`
  padding: 5px 15px;
  background-color: transparent;
  border: 1px solid #3ea6ff;
  color: #3ea6ff;
  border-radius: 3px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
`;

const Menu = styled.div`
  display: none;
  @media (max-width: 768px) {
    display: block;
  }
`;

const User = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 500;
  color: ${({theme}) => theme.text};
`

const Avatar = styled.img`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: #999;
`

const Navbar = ({ showMenu, setShowMenu }) => {

  const {currentUser} = useSelector(state=>state.user)
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState("")
  const navigate = useNavigate()

  return (
    <>
    <Container>
      <Wrapper>
        <Menu
          onClick={() => {
            setShowMenu(!showMenu);
          }}
        >
          <MenuIcon />
        </Menu>
        <Search>
          <Input placeholder="Search" onChange={(e)=>setSearch(e.target.value)} />
          <SearchI>
          <SearchIcon onClick={()=>{navigate(`/search?q=${search}`)}}/>
          </SearchI>
        </Search>
        {currentUser ? <User>
          <VideoCallOutlinedIcon onClick={()=>setOpen(true)}/>
          <Avatar src={currentUser.img}/>
          <Button onClick={()=>{navigate("/admin")}}>{currentUser.name}</Button>
        </User> : <Link to={"/signin"} style={{ textDecoration: "none" }}>
          <Button>
            <AccountCircleIcon />
            SIGN IN
          </Button>
        </Link>}
      </Wrapper>
    </Container>
    {open && <Upload setOpen={setOpen}/>}
    </>
  );
};

export default Navbar;
