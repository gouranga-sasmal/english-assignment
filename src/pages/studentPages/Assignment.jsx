import React, { memo, useContext, useEffect, useState } from 'react'
import { FaChevronRight  } from "react-icons/fa";
import { Link } from 'react-router-dom';
import context from '../../context/createContext';
import LoadingPage from '../LoadingPage';
import { Query } from 'appwrite';
import { capitalizeName, convertISOToDate, findUniqueValues, GetRandomColor } from '../../component/ToolFunction';
import ErrorPage from '../EroorPage'


const Assignment = ({handlers}) => {
const [assignments , setAssignments] = useState([])
const [loading , setLoading] = useState(true)
const {getingAssignments ,isLogin,getDeatails,getBookChapters}= useContext(context);


const getAssignments = async () => {
  setLoading(true);
  const response = await getingAssignments([
    Query.equal("studentId", isLogin.id),
    Query.isNull("completedDate"),
  ]);
  if (response && response.total > 0) {
    const commonTeacherId = findUniqueValues(
      response.documents,
      "teacherId",
      false
    );
    const commonChapter = findUniqueValues(
      response.documents,
      "chapterId",
      true
    );
    let mainArr;

    const getdocDeatils = async () => {
      try {
        let res = await getDeatails([Query.equal("$id", commonTeacherId)]);
      let res2 = await getBookChapters([
        Query.equal("chapterId", commonChapter),
        Query.equal("classId", JSON.parse(isLogin.class)),
      ]);
      if (res && res2 && res.total > 0 && res2.total > 0) {
        console.log(res)
        let teacherDetails = res.documents;
        let chapterDetails = res2.documents;
        mainArr = response.documents.map((item) => {
          const { name } = teacherDetails.find((teacher) => {
            return teacher.$id == item.teacherId;
          });
          const { chapterName } = chapterDetails.find((chapter) => {
            return chapter.chapterId == item.chapterId;
          });
          return { ...item, teacherName: name, chapterName };
        });
      } else {
        //TODO: No Assignments
        //TODO: Add a refresh button. Title : 'Refresh'
        // toast.error("error while getting deatail please retry")
        setLoading(false);
      }
      } catch (error) {
        console.log(error)
        setLoading(false);
      }
      
    };
    try {
      await getdocDeatils();
      setAssignments(mainArr.reverse());
      setLoading(false);
    } catch (error) {
      console.log(error)
      setLoading(false);
    }
    
  } else {
    //TODO: No Assignments
    // toast.error("there is no asignment")
    setLoading(false);
  }
};


useEffect(()=>{
  getAssignments()
},[])
// console.log(assignments);



  

  return (
    <div className="assignments " {...handlers}>
        <div className="tittle py-2">
            <div className="container border-0">
            <h2>Assignments</h2>
            <p>List of assignments</p>
            </div>
        </div>
        <div className="assignment-list">
          {loading?<LoadingPage/>:assignments.length>0?<div className="container">
            <ul className='list-unstyled py-2'>
              {assignments.map((assi,index)=>{
                let color = GetRandomColor();
                return (<li key={assi.$id} className='my-3 assignment'><Link to={`/student/home/assignments/${assi.$id}/${assi.chapterName}/${assi.score}/${assi.qsId}`} className='text-decoration-none'>
                <div className="card shadow d-flex py-2" style={{borderBottom:`4px solid ${color}`}}>
                  <section className='d-flex '>
                   <div className='ms-3   w-100'>
                    <h2 className='m-0'>Assignment-{index+1} </h2>
                    <div className=' w-100 d-flex justify-content-between mt-2 '><p className='m-0'>Chapter Name: {assi.chapterName}</p> </div>
                    <div className=' w-100 d-flex justify-content-between mt-2 '><p className='m-0'> Shared By: {capitalizeName(assi.teacherName)}</p> </div>

                   </div>
                   
                   <div className='d-flex align-items-center fake  ms-auto'>
                   <span>{convertISOToDate(assi.sharedDate)}</span>
                   <FaChevronRight className='icon'/>
                   </div>

                  </section>
                </div></Link>
                 </li>)
              })}
                    
            </ul>
            </div>:<ErrorPage massage={'No assignments found'} refreshFun={()=>getAssignments()}/>}
           
            

        </div>

    </div>
  )
}

export default  memo(Assignment)