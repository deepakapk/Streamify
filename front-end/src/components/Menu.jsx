import React from "react";
import styled from "styled-components";
import logo from "../assets/logo.png";
import HomeIcon from "@mui/icons-material/Home";
import ExploreIcon from "@mui/icons-material/Explore";
import SettingsBrightnessIcon from "@mui/icons-material/SettingsBrightness";
import SubscriptionsIcon from "@mui/icons-material/Subscriptions";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { logout } from "../redux/userSlice";
import { toast } from 'react-toastify'

const Container = styled.div`
  flex: 1;
  background-color: ${({ theme }) => theme.bgLighter};
  height: 100vh;
  color: ${({ theme }) => theme.text};
  font-size: 14px;
  position: sticky;
  top: 0;
  z-index: 9;
  @media (max-width: 768px) {
    /* display: none; */
    position: fixed;
  }
`;
const Wrapper = styled.div`
  padding: 18px 26px;
`;
const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  font-weight: bold;
  margin-bottom: 25px;
`;
const Img = styled.img`
  height: 25px;
`;

const Item = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  cursor: pointer;
  padding: 7.5px 0px;
  &:hover {
    background-color: ${({ theme }) => theme.soft};
  }
`;

const Hr = styled.hr`
  margin: 15px 0px;
  border: 0.5px solid ${({ theme }) => theme.soft};
`;

const Login = styled.div``;

const Button = styled.button`
  padding: 5px 15px;
  background-color: transparent;
  border: 1px solid #3ea6ff;
  color: #3ea6ff;
  border-radius: 3px;
  font-weight: 500;
  margin-top: 10px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
`;

const StyledLink = styled(Link)`
  text-decoration: none;
  color: ${({ theme }) => theme.text};
`;

const Menu = ({ darkMode, setDarkMode }) => {
  const {currentUser} = useSelector(state=>state.user)
  const dispatch = useDispatch()

  const handleLogout = async ()=>{
    await axios.get(import.meta.env.VITE_BACKEND_API + "/auth/logout", {withCredentials : true})
    toast("Logged Out")
    dispatch(logout())
  }

  return (
    <Container>
      <Wrapper>
        <StyledLink to="/">
          <Logo>
            <Img src={logo}></Img>
          </Logo>
        </StyledLink>
        <StyledLink to={"/"}>
        <Item>
          <HomeIcon />
          Home
        </Item>
        </StyledLink>
        <StyledLink to={"/trends"}>
        <Item>
          <ExploreIcon />
          Explore
        </Item>
        </StyledLink>
        <StyledLink to={"/subscriptions"}>
        <Item>
          <SubscriptionsIcon />
          Subscriptions
        </Item>
        </StyledLink>
        <Hr />
        {
          !currentUser ?
          <>
          <Login>
          Sign in to like videos, comment, and subscribe.
          <Link to={"/signin"} style={{textDecoration : "none"}}>
            <Button>
              <AccountCircleIcon />
              SIGN IN
            </Button>
          </Link>
        </Login>
        <Hr /></>
        :
        <><Button onClick={handleLogout}>Log Out</Button> <Hr/></>
        
      }
        <Item onClick={() => setDarkMode(!darkMode)}>
          <SettingsBrightnessIcon />
          {darkMode ? "Light Mode" : "Dark Mode"}
        </Item>
      </Wrapper>
    </Container>
  );
};

export default Menu;
