import React, { useEffect, useState } from "react";
import styled, { ThemeProvider } from "styled-components";
import Menu from "./components/Menu";
import Navbar from "./components/Navbar";
import { darkTheme, lightTheme } from "./utils/Theme";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Video from "./pages/Video";
import SignIn from "./pages/SignIn";
import { useDispatch } from "react-redux";
import { logout } from "./redux/userSlice";
import axios from "axios";
import Search from "./pages/Search";
import Admin from "./pages/Admin";
import { ToastContainer, toast } from "react-toastify";

const Container = styled.div`
  display: flex;
`;

const Main = styled.div`
  flex: 7;
  background-color: ${({ theme }) => theme.bg};

  width: 100%;

  @media (max-width: 768px) {
    flex: unset;
  }
`;
const Wrapper = styled.div`
  padding: 2.5rem 5rem;

  @media (max-width: 1024px) {
    padding: 2rem 3rem;
  }

  @media (max-width: 768px) {
    padding: 1rem 1.5rem;
  }

  @media (max-width: 480px) {
    padding: 0.75rem 1rem;
  }
`;

const App = () => {
  const [darkMode, setDarkMode] = useState(() => {
    const stored = localStorage.getItem("darkMode");
    return stored ? JSON.parse(stored) : true;
  });
  const [showMenu, setShowMenu] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const dispatch = useDispatch();

  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
  }, [darkMode]);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await axios.get(
          import.meta.env.VITE_BACKEND_API + "/users/fetchUser",
          { withCredentials: true }
        );
        if (!res.data.user) dispatch(logout());
      } catch (error) {
        dispatch(logout());
      }
    };
    getUser();
  }, [dispatch]);

  useEffect(() => {
    if (windowWidth > 768) {
      setShowMenu(false);
    }
  }, [windowWidth]);

  return (
    <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
      <Container>
        {(windowWidth > 768 || showMenu) && (
          <Menu darkMode={darkMode} setDarkMode={setDarkMode} />
        )}
        <Main>
          <Navbar setShowMenu={setShowMenu} showMenu={showMenu} />
          <Wrapper>
            <Routes>
              <Route path="/" element={<Home type="random" />} />
              <Route path="/trends" element={<Home type="trend" />} />
              <Route path="/subscriptions" element={<Home type="sub" />} />
              <Route path="/signin" element={<SignIn />} />
              <Route path="/video/:id" element={<Video />} />
              <Route path="/search" element={<Search />} />
              <Route path="/admin" element={<Admin />} />
            </Routes>
          </Wrapper>
        </Main>
      </Container>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        theme="dark"
      />
    </ThemeProvider>
  );
};

export default App;
