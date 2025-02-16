import React from 'react'
import { FaArrowLeft } from "react-icons/fa6";
import { useNavigate } from 'react-router-dom';



const BackButton = ({className}) => {
    const navigate = useNavigate();

    
    const goBack=()=>{
        navigate(-1)
    }

  return (
    <>
    <button onClick={goBack} className={`${className} back-btn`}><FaArrowLeft/></button>
    </>
  )
}

export default BackButton