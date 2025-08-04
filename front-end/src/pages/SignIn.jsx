import axios from 'axios'
import React, { useState } from 'react'
import styled from 'styled-components'
import { useDispatch } from "react-redux"
import { loginFailure, loginStart, loginSuccess } from '../redux/userSlice'
import { auth, provider } from "../firebase"
import { signInWithPopup } from "firebase/auth"
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

const Container = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    height: calc(89vh - 56px);
    color: ${({theme}) => theme.text};
    flex-direction: column;
    @media (max-width: 768px) {
        height: calc(100vh - 56px);
  }
`

const Wrapper = styled.div`
    display: flex;
    align-items: center;
    flex-direction: column;
    background-color:${({theme}) => theme.bgLighter} ;
    border: 1px solid ${({theme}) => theme.soft} ;
    color: ${({theme}) => theme.text};    
    padding: 20px 50px;
    gap: 10px;
`

const Title = styled.h1`
    font-size: 24px;
`
const SubTitle = styled.h2`
    font-size: 20px;
    font-weight: 300;
`
const Input = styled.input`
    border: 1px solid ${({theme}) => theme.soft};
    border-radius: 3px;
    padding: 10px;
    background-color: transparent;
    width: 100%;
    color: ${({theme}) => theme.text};
`
const Button = styled.button`
    border-radius: 3px;
    border: none;
    padding: 10px 20px;
    cursor: pointer;
    font-weight: 500;
    background-color: ${({theme}) => theme.soft};
    color: ${({theme}) => theme.textSoft};
    `
const More = styled.div`
    display: flex;
    margin-top: 12px;
    font-size: 10px;
    color: ${({theme}) => theme.soft};
    
`
const Links = styled.div`
    margin-left: 30px;
`
const Link = styled.span`
    margin-left: 30px;
`

const SignIn = () => {

    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const handleLogin = async (e)=>{
        e.preventDefault()
        dispatch(loginStart())
        try {
            const res = await axios.post(import.meta.env.VITE_BACKEND_API + "/auth/signin", {name, password}, {withCredentials: true})
            dispatch(loginSuccess(res.data.userObj))
            toast("Logged In Successfully")
            navigate("/")
        } catch (error) {
            dispatch(loginFailure())
        }
    }

    const handleSignUp = async (e)=>{
        e.preventDefault();
        try {
            const res = await axios.post(import.meta.env.VITE_BACKEND_API + "/auth/signup", {name, email, password}, {withCredentials: true})
            toast("User Created Successfully")
            setName("")
            setEmail("")
            setPassword("")
        } catch (error) {
            toast("Internal Error Occured")
        }
    }

    // const signInwithGoogle = async()=> {
    //     signInWithPopup( auth, provider )
    //     .then((result) => {
            
    //         const res = axios.post(import.meta.env.VITE_BACKEND_API + "/auth/google", {
    //             name: result.user.displayName,
    //             email: result.user.email,
    //             img: result.user.photoURL
    //             }, {withCredentials: true}).then((result) => {
    //                 dispatch(loginSuccess(result.data))
    //                 toast("Logged In Successfully")
    //                 navigate("/")
    //             })
    //     })
    //     .catch(err=>{
    //         dispatch(loginFailure())
    //     })
    // }


    const signInwithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    
    const user = result.user;
    const token = await user.getIdToken();

    const response = await axios.post(
      `${import.meta.env.VITE_BACKEND_API}/auth/google`,
      {
        name: user.displayName,
        email: user.email,
        img: user.photoURL,
      },
      {
        withCredentials: true,
      }
    );

    dispatch(loginSuccess(response.data));
    toast("Logged In Successfully");
    navigate("/");
    
  } catch (err) {
    dispatch(loginFailure());
    toast.error("Google Sign-In failed");
    console.error(err);
  }
};


  return (
    <Container>
        <Wrapper>
            <Title>Sign in</Title>
            <SubTitle>to continue to streamify</SubTitle>
            <Input placeholder='username' onChange={(e)=>{setName(e.target.value)}}/>
            <Input type='password' placeholder='password' onChange={(e)=>{setPassword(e.target.value)}}/>
            <Button onClick={handleLogin}>Sign in</Button>
            <Title>or</Title>
            <Button onClick={signInwithGoogle}>SignIn with Google</Button>
            <Input placeholder='username' onChange={(e)=>{setName(e.target.value)}}/>
            <Input placeholder='email' onChange={(e)=>{setEmail(e.target.value)}} />
            <Input type='password' placeholder='password' onChange={(e)=>{setPassword(e.target.value)}}/>
            <Button onClick={handleSignUp}>Sign up</Button>
        </Wrapper>
        <More>
            English(USA)
            <Links>
                <Link>Help</Link>
                <Link>Privacy</Link>
                <Link>Terms</Link>
            </Links>
        </More>
    </Container>
  )
}

export default SignIn