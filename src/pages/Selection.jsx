import React, { useEffect } from 'react'
import { FcBusinessman } from "react-icons/fc";
import { FcManager } from "react-icons/fc";
import { useNavigate, useParams } from 'react-router-dom';



const Selection = () => {
   const navigate = useNavigate();
    const handelClick = (e)=>{
      const {name} = e.currentTarget;
      navigate(`/login/${name}`)
    }
    useEffect(()=>{
      const userType = localStorage.getItem("userType");
      const currentUser = localStorage.getItem("currentUser");
      console.log(currentUser);
      if(!currentUser){
        if(userType){
          if(userType =="student"){
            navigate(`/login/student`)
          }
          else{
            navigate(`/login/teacher`)
          }
        }
      }
      
      
    })
  return (
    <div className="selection h-100 ">
        <div className="header  text-center py-5">
            <p className='my-5'>Choose who are you?</p>
        </div>
        <div className="selectbox  d-flex align-items-center justify-content-around ">
           <button onClick={(e)=>handelClick(e)} name='teacher' className='shadow'>
            <FcBusinessman className='icon'/>
            <h5>Teacher</h5>
            </button> 
            <button name='student' onClick={(e)=>handelClick(e)} className='shadow'>
            <FcManager className='icon'/>   
            <h5 className=''>Student</h5>
             </button>

        </div>

    </div>
       
  )
}

export default Selection