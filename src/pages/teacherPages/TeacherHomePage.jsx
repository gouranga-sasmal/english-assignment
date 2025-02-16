import React, { useContext, useState } from 'react'
import { Route, Routes } from "react-router-dom";
import StudentList from './StudentList';
import AssignmentsHistory from './AssignmentsHistory'
import HomeHeader from './HomeHeader';
import ClassesList from './ClassesList';
import Chapters from './Chapters';
import AssignmentSet from './AssignmentSet';
import QuestionSet from './QuestionSet'
import { useSwipeable } from 'react-swipeable';







const TeacherHomePage = ({setHasNavigated}) => {
  const [menuStyle , setMenustyle] = useState("menu-close")
  const [showShareList , setShowShareList] =useState(false);



  const handlers = useSwipeable({
    onSwipedLeft: ()=>{
      setMenustyle("menu-open")
        } 
    },
    );

  
  
  return (
    <div className="teacher-home " >
      <Routes>
        <Route path='/' element={  <><HomeHeader menuStyle={menuStyle} setMenustyle={setMenustyle} setHasNavigated={setHasNavigated} setShowShareList={setShowShareList}/><ClassesList handlers={handlers}/></>}/>
        <Route path='/chapters/:classes' element={<><HomeHeader menuStyle={menuStyle} setMenustyle={setMenustyle} setHasNavigated={setHasNavigated} setShowShareList={setShowShareList}/><Chapters/></>}/>
        <Route path='/assignmentset/:classes/:chapter' element={<><HomeHeader menuStyle={menuStyle} setMenustyle={setMenustyle} setHasNavigated={setHasNavigated} setShowShareList={setShowShareList}/><AssignmentSet/></>}/>
        <Route path='/questionset/:classes/:chapter/:id' element={<><HomeHeader menuStyle={menuStyle} setMenustyle={setMenustyle} setHasNavigated={setHasNavigated} setShowShareList={setShowShareList}/><QuestionSet setShowShareList={setShowShareList} showShareList={showShareList}/></>}/>
        <Route path="/studentlist" element={<StudentList />}/>
        <Route path="/assignments" element={<><HomeHeader menuStyle={menuStyle} setMenustyle={setMenustyle} setHasNavigated={setHasNavigated} setShowShareList={setShowShareList}/><AssignmentsHistory /></>}/>
      </Routes>
      </div>



  )
}

export default TeacherHomePage