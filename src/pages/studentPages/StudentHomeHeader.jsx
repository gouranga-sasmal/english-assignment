import React, { useContext, useState } from 'react'
import { MdClose, MdHome } from 'react-icons/md'
import { CiLogout } from 'react-icons/ci'
import context from '../../context/createContext'
import { capitalizeName } from '../../component/ToolFunction'
import { useSwipeable } from 'react-swipeable'
import { ImProfile } from "react-icons/im";


const StudentHomeHeader = ({menuStyle , setMenustyle,setHasNavigated}) => {

    const {logOutUser , isLogin}=useContext(context)
    const [user , setUser] = useState(isLogin)



    const handlers = useSwipeable({
      onSwipedRight: () => setMenustyle("menu-close"),
    });

 const openMenu = () =>{
  setMenustyle("menu-open")
 }
 const closeMenu = () =>{
  setMenustyle('menu-close')
 }
  return (
    <div className="home-header ">
        <div className="container  d-flex  align-items-center">
          <h1>Educate</h1>
        <div onClick={openMenu} className="user-logo ms-auto">
        {user.name[0].toUpperCase()}
        </div>
        <div  className={`menu ${menuStyle} `} {...handlers}>
          <div className="menu-header ">
            <button onClick={closeMenu}><MdClose/></button>
            <div className='d-flex align-items-center justify-content-center pt-4 pb-5 '>
            <div className="imgsection me-3">
            { user.name[0].toUpperCase()}
            </div>
            <div className="details ">
            <h2 className='m-0'>{capitalizeName(user.name)}</h2>
            <p className='m-0 mt-2'>{capitalizeName(user.userType)}</p>
            </div>
          </div>
          </div>
          <div className="menu-item ">
          <ul className='list-unstyled '>
          <li><section onClick={()=>{}} className='d-flex align-items-center'><ImProfile className='fs-4 me-2'/>Profile details</section> </li>
          <li><section onClick={()=>{}} className='d-flex align-items-center'><CiLogout className='fs-4 me-2'/>Log Out</section> </li>
          <li><section onClick={()=>{}} className='d-flex align-items-center'><CiLogout className='fs-4 me-2'/>Log Out</section> </li>
          <li><section onClick={()=>{logOutUser(isLogin.userType),setHasNavigated(false)}} className='d-flex align-items-center'><CiLogout className='fs-4 me-2'/>Log Out</section> </li>
        </ul>             
          </div>
        </div>
        </div>

      </div>
  )
}

export default StudentHomeHeader