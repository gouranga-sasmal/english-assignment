import React, { useContext, useEffect, useState } from 'react'
import { FaChevronRight } from 'react-icons/fa'
import { Link, useParams } from 'react-router-dom'
import context from '../../context/createContext'
import LoadingPage from '../LoadingPage'
import { Query } from 'appwrite'
import ErrorPage from '../EroorPage'

const Chapters = () => {
const param = useParams()
const {getBookChapters} = useContext(context)
const [chapters , setChapters] = useState([])
const {classes}= param;
const [loading , setLoading] = useState(true)


const setChapter = async() =>{
  setLoading(true)
  let res = await getBookChapters([Query.equal("classId", [JSON.parse(classes)]), Query.limit(100)]);
  setLoading(false)
  if(res && res.total > 0){
    setChapters(res.documents)
  }
  else{
    setChapters([])
  }
}


  useEffect(()=>{
    setChapter()
  },[])
  return (
    <div className="chapter-list w-100 text-center">
        {loading?<LoadingPage/>:(chapters.length>0)?<div className="container ">
          <ul className='list-unstyled'>
          {chapters.map((chapter)=>{
           return( <li key={chapter.chapterId} className='my-3 assignment'><Link to={`/teacher/home/assignmentset/${classes}/${chapter.chapterId}`} className='text-decoration-none'>
                <div className="card shadow d-flex p-2">
                  <section className='d-flex '>
                   <div className=' w-100 text-start'>
                    <h2 className='m-0'>{chapter.chapterName}
                      {/* <span className='ms-4 massage'>new</span> */}
                      </h2>
                    <div className=' w-100 d-flex justify-content-between mt-2 '><p className='m-0'>Author: {chapter.authorName}</p> </div>
                   </div>
                   
                   <div className='d-flex align-items-center fake  ms-auto'>
                   <span></span>
                   <FaChevronRight className='icon'/>
                   </div>

                  </section>
                </div></Link>
                 </li>)
          })} 
        
                 </ul>
            </div>:<ErrorPage massage={"no chapters found"} refreshFun={()=>setChapter()}/>}
        </div>

        
  )
}

export default Chapters