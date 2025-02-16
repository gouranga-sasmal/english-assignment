import React, { useContext, useEffect, useState } from 'react'
import { GoPerson } from 'react-icons/go'
import { Link, useParams } from 'react-router-dom'
import { GoLock } from "react-icons/go";
import { MdOutlineEmail } from 'react-icons/md';
import { MdPhone } from "react-icons/md";
import context from '../context/createContext';
import {  toast } from 'react-toastify';


const iniUser={Phone:'',
userType:'',
  password:''
}

const LoginPage = () => {
  const {name} = useParams();
  const {loginUser} = useContext(context);
const [userDetails,setuserDetails] = useState(iniUser)
const [loading , setLoading] = useState(false)
useEffect(()=>{
  setuserDetails({...userDetails,userType:name})
  localStorage.setItem("userType",name)
},[])

const handelChange = (e)=>{
  let {name , value} = e.target;
  setuserDetails({...userDetails,[name]:value})
}
const handelLogin = async () =>{
  if(userDetails.Phone.length !== 10){
    console.log("enter a valid phone ");
    toast.warn('enter a valid phone ', {
      position: "top-left",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: true,
      progress: undefined,
      theme: "light",
      });
  }
  else{
    if(userDetails.password.length<6){
      console.log("invalid password");
      toast.warn('invalid password', {
        position: "top-left",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "light",
        });
    }
    else{
      setLoading(true)
       await loginUser(userDetails)
      setLoading(false)
    }
  }
}



  return (
    <div className="login">
      <div className="header  p-5 text-center">
        <p className='m-3'>Welcomeback</p>
        </div>
        <div className="content   d-block text-center py-5">
          <h5 className='pb-4'>Enter your details</h5>
          <section className='my-4 shadow'><MdPhone className='icon'/> <input onChange={handelChange} name='Phone' placeholder='Enter your phone no' type="text" /></section>
          <section className='my-4 shadow'><GoLock className='icon'/><input onChange={handelChange} name='password'   placeholder='Enter your password' type="password" /></section>
          <p>Don't have an account? <Link to={`/register/${name}`} className='text-decoration-none font-weight-bold'>Create account</Link></p>
          <div className='py-3'><button onClick={handelLogin} className='px-5 py-1'>{loading?<><span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
  <span className="sr-only">Loading...</span></>:'Login'}</button></div>
        </div>

      </div>
      
      
    
  )
}

export default LoginPage