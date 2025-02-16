import React, { useContext, useEffect, useState } from 'react'
import { GoPerson } from "react-icons/go";
import { MdOutlineEmail } from "react-icons/md";
import { GoLock } from "react-icons/go";
import { MdPhone } from "react-icons/md";
import { Link, useParams } from 'react-router-dom';
import context from '../context/createContext';
import { searchStudent } from '../database/databaseService';
import { toast } from 'react-toastify';
import { Query } from 'appwrite';

const iniUser={
  userName:"",
  phone:'',
readClass:"",
userType:'',
  password:'',
  degree:'',
  repassword:''
}



const RegisterPage = () => {
  const {name} = useParams();
  const {registerUser , isAlreadyAvailable} = useContext(context);
  const [userDetails,setuserDetails] = useState(iniUser)
  const [loading , setLoading] = useState(false)

  useEffect(()=>{
    setuserDetails({...userDetails,userType:name})
  },[])

  const handelChange = (e)=>{
    let {name , value} = e.target;  
    setuserDetails({...userDetails,[name]:value})
  }


const handelCreate = async ()=>{
  if(!userDetails.phone||!userDetails.password||!userDetails.phone||!userDetails.repassword||!userDetails.userName){
    console.log("Please fill all the deatails ");
    toast.warn('Please fill all the details ', {position: "top-left",autoClose: 3000,hideProgressBar: false,closeOnClick: true,pauseOnHover: false,draggable: true, progress: undefined,theme: "light",});
  }
  else{
    if(name == 'teacher'){
      if(!userDetails.degree){
        console.log("select a degree fast");
        toast.warn('Please choose your degree from list', {position: "top-left",autoClose: 3000,hideProgressBar: false,closeOnClick: true,pauseOnHover: false,draggable: true, progress: undefined,theme: "light",});

      }
      else{
        if(userDetails.phone.length !==10){
          console.log('invalid phone number');
          toast.warn('Invalid phone number', {position: "top-left",autoClose: 3000,hideProgressBar: false,closeOnClick: true,pauseOnHover: false,draggable: true, progress: undefined,theme: "light",});


        }
        else{
          if(userDetails.password.length < 6 ){
            console.log('password should be atlest 6 charcter ');
            toast.warn('Password should be atleast 6 character long', {position: "top-left",autoClose: 3000,hideProgressBar: false,closeOnClick: true,pauseOnHover: false,draggable: true, progress: undefined,theme: "light",});

          }
          else{
          if(userDetails.password !== userDetails.repassword){
            console.log('password not matched');
            toast.warn("Password didn't matched", {position: "top-left",autoClose: 3000,hideProgressBar: false,closeOnClick: true,pauseOnHover: false,draggable: true, progress: undefined,theme: "light",});

          }
          else{
            setLoading(true)
              let res = await isAlreadyAvailable( Query.equal("phone", [userDetails.phone]),)
              if(!res){
                   registerUser(userDetails)
              }
              else{
                console.log('this no. alrady used ');
                toast.error('This phone number is already registered. Please use a different number or log in to your existing account', {position: "top-left",autoClose: 3000,hideProgressBar: false,closeOnClick: true,pauseOnHover: false,draggable: true, progress: undefined,theme: "light",});
                setLoading(false)
              }
          }
      
        }
      }
      }
    
    }
    else{
      if(!userDetails.readClass){
        console.log('Please select your class');
        toast.warn('Please choose your class from list', {position: "top-left",autoClose: 3000,hideProgressBar: false,closeOnClick: true,pauseOnHover: false,draggable: true, progress: undefined,theme: "light",});

      }
      else{
        if(userDetails.phone.length !==10){
          console.log('Invalid phone number');
          toast.warn('Invalid phone number', {position: "top-left",autoClose: 3000,hideProgressBar: false,closeOnClick: true,pauseOnHover: false,draggable: true, progress: undefined,theme: "light",});

        }
        else{
          if(userDetails.password.length < 6 ){
            console.log('Password should be allest 6 charcter ');
            toast.warn('Password should be atleast 6 character long ', {position: "top-left",autoClose: 3000,hideProgressBar: false,closeOnClick: true,pauseOnHover: false,draggable: true, progress: undefined,theme: "light",});

          }
          else{
            if(userDetails.password !== userDetails.repassword){
              console.log('Password not matched');
              toast.warn("Password didn't matched", {position: "top-left",autoClose: 3000,hideProgressBar: false,closeOnClick: true,pauseOnHover: false,draggable: true, progress: undefined,theme: "light",});

            }
            else{
              setLoading(true)
              let res = await isAlreadyAvailable(userDetails.phone)
              if(!res){
                   registerUser(userDetails)
              }
              else{
                console.log('This no. alrady used ');
                toast.warn('This phone number is already registered. Please use a different number or log in to your existing account', {position: "top-left",autoClose: 5000,hideProgressBar: false,closeOnClick: true,pauseOnHover: false,draggable: true, progress: undefined,theme: "light",});

                setLoading(false)
              }
             
              }
             
            }
          }
          
      
        }
      }
    }
    
  }
  

 


  return (
    <div className="register position-relative">
      <div className="header  p-5 text-center ">
      <p className=''>Register</p>

        </div>
        
        <div className="content  text-center">
          <h5 className='pt-4'>Enter your details</h5>
          <section className='my-4 shadow'><GoPerson className='icon'/><input onChange={handelChange} name='userName' className=''  placeholder='Enter your name' type="text" /></section>
          <section className='my-4 shadow'><MdPhone className='icon'/> <input onChange={handelChange} name='phone' className=''  placeholder='Enter your phone number' type="number" /></section>
          <section className='my-4 shadow'><GoLock className='icon'/> <input onChange={handelChange} name='password' className=''  placeholder='Create a password' type="password" /></section>
          <section className='my-4 shadow'><GoLock className='icon'/> <input onChange={handelChange} name='repassword' className=''  placeholder='Re-enter your password' type="password" /></section>

      <section className="custom-select border-0 text-start ">
        {name=='teacher'?<select name='degree' onChange={handelChange}>
    <option value={''}>Select your degree:</option>
    <option value="graduate">Graduate</option>
    <option value="Postgraduate">Postgraduate</option>
    <option value="Doctorate">Doctorate</option>
  </select>:<select name='readClass' onChange={handelChange}>
    <option value={''}>Select your class:</option>
    <option value="5">class 5</option>
    <option value="6">class 6</option>
    <option value="7">class 7</option>
    <option value="8">class 8</option>
    <option value="9">class 9</option>
    <option value="10">class 10</option>
    <option value="11">class 11</option>
    <option value="12">class 12</option>
    <option value="20">ITI Machinist</option>
  </select>}
  
</section>
<p className='my-3'>Already have an account?<Link to={`/login/${name}`} className='text-decoration-none font-weight-bold'> Login</Link></p>


          
          
          <div className='p-3'><button onClick={handelCreate} className='px-3 py-1'>{loading?<><span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
  <span className="sr-only">Loading...</span></>:'Create account'}</button></div>
          </div>

        </div>

  )
}

export default RegisterPage