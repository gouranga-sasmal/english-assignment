import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import context from '../../context/createContext';
import LoadingPage from '../LoadingPage'
import StudentSharelist from '../../component/StudentSharelist';
 import ErrorPage from '../EroorPage';

const QuestionSet = ({showShareList,setShowShareList}) => {
    const param = useParams();
    const {classes,chapter,id} = param;
    const {getQuestion} = useContext(context)
    const [question , setQuestion] = useState([])
    const [loading , setLoading] = useState(true)


    const getAllQuestion = async()=>{
      setLoading(true)
         let res = await getQuestion(id)
         setLoading(false)
         if(res){
          setQuestion(res)
         }
    }
    useEffect(()=>{
        getAllQuestion()
    },[])

console.log();

  return (
      <div className="question w-100 text-center position-relative ">
        {loading?<LoadingPage/>:(question.length>0)?<div className="container  ">
          <ul className='list-unstyled'>
          {question.map((ques ,index)=>{
            return <li key={index} className='my-4 '>
              <div className="card shadow  text-start p-3">
                {/* <p>{index+1}: {ques.question}</p> */}
                <div dangerouslySetInnerHTML={{ __html: index+1 + ': ' + ques.question }} />
                <ol>
                  {ques.options.map((opt ,index)=>{
                    let correctans = opt.answer_text == ques.correctAnswer.answer_text;
                    return <li key={index}><p className={correctans?"text-success":"text-danger"}>  {opt.answer_text}</p></li>
                  })}
                </ol>

              </div>

            </li>

          })}
          </ul>
          <StudentSharelist setShowShareList={setShowShareList} className={`sharemenu  ${showShareList?"showshare":""}` }/>

        </div>:<ErrorPage massage={'No questions found. Please try again'} refreshFun={()=>getAllQuestion()} />}

        
    </div>
  )
}

export default QuestionSet