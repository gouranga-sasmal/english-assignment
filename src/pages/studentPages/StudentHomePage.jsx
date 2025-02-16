import React, { useCallback, useState }  from 'react'
import Assignment from './Assignment';
import { Route, Routes } from 'react-router-dom';
import AssignmentPage from './AssignmentPage';
import StudentHomeHeader from './StudentHomeHeader';
import { useSwipeable } from 'react-swipeable';


const StudentHomePage = ({setHasNavigated}) => {
  const [menuStyle , setMenustyle] = useState("menu-close")


  const handlers = useCallback(
     useSwipeable({
    onSwipedLeft: ()=>{
      setMenustyle("menu-open")
        } 
    },
    ),[]
  )
  
  return (
    <div className="student-home ">
      
      <Routes>
        <Route path='/' element={<><StudentHomeHeader menuStyle={menuStyle} setMenustyle={setMenustyle} setHasNavigated={setHasNavigated}/> <Assignment handlers={handlers}/></> }/>
        <Route path="/assignments/:assignmentDocid/:chapterName/:score/:qsid" element={<AssignmentPage /> }/>
      </Routes>
      

    </div>

    
  )
}

export default StudentHomePage