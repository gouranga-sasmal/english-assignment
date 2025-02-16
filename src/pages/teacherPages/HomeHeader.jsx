import React, { useContext, useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { MdClose } from 'react-icons/md'
import { PiStudent } from "react-icons/pi";
import { CiLogout } from "react-icons/ci";
import { IoIosSettings } from "react-icons/io";
import { MdHome } from "react-icons/md";
import { IoMdShareAlt } from "react-icons/io";
import { GrTest } from "react-icons/gr";
import context from '../../context/createContext';
import BackButton from '../../component/BackButton';
import { capitalizeName } from '../../component/ToolFunction';
import { useSwipeable } from 'react-swipeable';
import { ImProfile } from 'react-icons/im';





const HomeHeader = ({menuStyle,setMenustyle,setHasNavigated , setShowShareList}) => {
    const {logOutUser ,isLogin}=useContext(context)
  const [user , setUser] = useState(isLogin)
  const location = useLocation();        
  const [pageName, setPageName] = useState("")
  const isHome = location.pathname == '/teacher/home';

  

  const handlers = useSwipeable({
    onSwipedRight: () => setMenustyle("menu-close"),
  });
  
  const pageSetup = ()=>{
    if(location.pathname.includes("chapters")){
        setPageName("Chapters")
      }
        else if(location.pathname.includes('assignmentset')){
            setPageName("Set of questions")

  }   
  else if(location.pathname.includes('questionset')){
    setPageName("Questions")

}
else if(location.pathname.includes('assignments')){
  setPageName("Assignment history")

}
  }
  
  useEffect(()=>{
    pageSetup()
  },[location])



  const openMenu = () =>{
   setMenustyle("menu-open")
  }
  const closeMenu = () =>{
   setMenustyle('menu-close')
  }

  const updateProfileImg =() =>{}
  return (
    <>
        {isHome? <div className="home-header  ">
    <div className="container d-flex  align-items-center">
    <h1>Educate</h1>
    <div onClick={openMenu} className="user-logo ms-auto">
    {user.name[0].toUpperCase()}
    </div>
    <div {...handlers}  className={`menu ${menuStyle} `}>
      <div className="menu-header ">
        <button onClick={closeMenu}><MdClose/></button>
        <div className='d-flex align-items-center pt-4 pb-5 '>
        <div onClick={()=>updateProfileImg()} className="imgsection mx-2">
        {user.name[0].toUpperCase()}
        </div>
        <div className="details ">
        <h2 className='m-0'>{capitalizeName(user.name)}</h2>
        <p className='m-0 mt-2'>{capitalizeName(user.userType)}</p>
        </div>
      </div>
      </div>
      <div className="menu-item py-3 ">
        <ul className='list-unstyled '>
        <li ><Link to={'/teacher/home'} className ={'text-decoration-none'}> <section className='d-flex align-items-center'><MdHome className='fs-4 me-2'/>Home</section> </Link></li>
          <li ><Link to={'/teacher/home/studentlist'} className ={'text-decoration-none'}> <section className='d-flex align-items-center'><PiStudent className='fs-4 me-2'/>All students</section> </Link></li>
          <li ><Link to={'/teacher/home/assignments'} className ={'text-decoration-none'}> <section className='d-flex align-items-center'><GrTest className='fs-4 me-2'/>Assignment history</section> </Link></li>
          <li><section onClick={()=>{}} className='d-flex align-items-center'><ImProfile className='fs-4 me-2'/>Profile details</section> </li>
          <li ><Link to={'/setting'} className ={'text-decoration-none'}> <section className='d-flex align-items-center'><IoIosSettings className='fs-4 me-2'/>Setting</section> </Link></li>
          <li><section onClick={()=>{logOutUser(isLogin.userType),setHasNavigated(false)}} className='d-flex align-items-center'><CiLogout className='fs-4 me-2'/>Log Out</section> </li>
        </ul> 
      </div>
    </div>
    </div>


  </div>:(pageName=='Questions')?<div className="home-header   ">
    <div className="container d-flex  align-items-center justify-content-between">
    <BackButton/> <h2 className='m-0'>{pageName}</h2>
    <button onClick={()=>setShowShareList(true)}><IoMdShareAlt/></button>
    </div>
    </div>:<div className="home-header  ">
    <div className="container d-flex  align-items-center">
    <BackButton className={'backBtn'}/> <h2 className='m-0 mx-auto'>{pageName}</h2>
    </div>
    </div>}

    </>
     )
}

export default HomeHeader