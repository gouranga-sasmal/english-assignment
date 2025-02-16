import React, { useContext, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import context from '../../context/createContext';
import { FaChevronRight } from 'react-icons/fa';
import LoadingPage from '../LoadingPage'
import ErrorPage from '../EroorPage'


const AssignmentSet = () => {
  const param = useParams()
  const {classes , chapter} = param;
  const {getQuestionSet}= useContext(context)
  const {getGrammerQuestionSet}= useContext(context)
  const [questionSet ,setQuestionset] = useState([])
  const [loading , setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('questions'); // Track the active tab


  const setofQueston = async ()=>{
    console.log("ok");
    setLoading(true)
    let res= await getQuestionSet(classes,chapter)
    setLoading(false)
    if(res && res.total>0){
      setQuestionset(res.documents)
    }
  }

  const setofGrammer = async () => {
    setLoading(true);
    // Fetch other data logic here
    let res = await getGrammerQuestionSet(classes, chapter); // Replace with a different API call if needed
    setLoading(false);
    if (res && res.total > 0) {
      // setOtherSet(res.documents); // Assuming similar structure
      setQuestionset(res.documents)
    }
  }

  useEffect(() => {
    if (activeTab === 'questions') {
      setofQueston();
    } else if (activeTab === 'grammer') {
      setofGrammer();
    }
  }, [activeTab]); // Reload data when tab changes


  return (
    
      <div className="question-set w-100 text-center">
        <div className="ios-segment-control d-flex justify-content-center my-3">
        <button
          className={`ios-segment ${activeTab === 'questions' ? 'active' : ''}`}
          onClick={() => setActiveTab('questions')}
        >
          Questions
        </button>
        <button
          className={`ios-segment ${activeTab === 'grammer' ? 'active' : ''}`}
          onClick={() => setActiveTab('grammer')}
        >
          Grammer
        </button>
      </div>

        {loading?<LoadingPage/>:(questionSet.length>0)?<div className="container ">
          <ul className='list-unstyled'>
          {questionSet.map((set,index)=>{
           return( <li key={index} className='my-3 assignment'><Link to={`/teacher/home/questionset/${classes}/${chapter}/${set.$id}`} className='text-decoration-none'>
                <div className="card shadow d-flex p-2">
                  <section className='d-flex '>
                   <div className='   w-100 text-start'>
                    <h2 className='m-0'>{set.title}
                      {/* <span className='ms-4 massage'>new</span> */}
                      </h2>
                    <div className=' w-100 d-flex justify-content-between mt-2 '><p className='m-0'>{set.pattern}</p> </div>
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
            </div>:<ErrorPage massage={"no set is founded"} refreshFun={()=>setofQueston()}/>}
        
        </div>

  )
}

export default AssignmentSet