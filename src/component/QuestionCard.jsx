// src/components/QuizCard.js
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from 'swiper/modules';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';





const QuestionCard = ({allQuestions,getScore,showcorrectAns}) => {
  const [cardPosition , setCardPosition]=useState('')
  let totalLenth=allQuestions.length*100-100;
  const [selectAns , setSelectAns]=useState([]);
  const [Answer , setAnswer] = useState([]);
  const [showSubmit , setShowSubmit] = useState(true)

  useEffect(() => {
    if (allQuestions && allQuestions.length > 0) {
      setSelectAns(new Array(allQuestions.length).fill(undefined));
    }
  }, [allQuestions]);

  const pagination = {
    clickable: true,
    renderBullet: function (index, className) {
      return '<span class="' + className + '">' + (index + 1) + '</span>';
    },
  };
  // const handleNext = () => {
  //   if(cardPosition==-totalLenth){
  //     setCardPosition(cardPosition)
  //   }
  //   else{
  //     setCardPosition((prev)=>prev-100)
  //   }
    
  // };


  // const handlePrevious = () => {
  //   // console.log(cardPosition);
  //   if(!cardPosition || cardPosition == 0){
  //     setCardPosition(cardPosition)
  //   }
  //   else{
  //     setCardPosition((prev)=>prev+100)
  //   }
  // };

  const clickedOpt=(quesIndex , selectedAns ,ansIndex)=>{
    // console.log(quesIndex,selectedAns ,ansIndex);
    // let fakeArr = selectAns;
    let fakeArr = [...selectAns];
    fakeArr[quesIndex]=ansIndex;
    setSelectAns(fakeArr)
    let fakeArr2 = [...Answer];
    fakeArr2[quesIndex] = selectedAns;
    setAnswer(fakeArr2)
  }

  const handelSubmit = ()=>{
    let score = 0;
        allQuestions.map((que,i)=>{
          if(que.correctAnswer.answer_text ==Answer[i]){
            score = score+1
          }
          // else{
          //   score = score+0
          // }


    })
    let scoreofHundred =Math.round(score * (100/allQuestions.length))  //score/allQuestions.length*100
    getScore(scoreofHundred)
    setShowSubmit(false)
  }

  return (
    <div className="question-card  ">
      <div className={`cards py-2`}>
      <Swiper
        // navigation={true}
        pagination={pagination}
        modules={[Pagination 
          // ,Navigation
        ]}
        className="mySwiper"
      >
      {allQuestions.map((ques,i)=>{
         let selected = selectAns[i];
        return <SwiperSlide key={i} className=''><div  className="card text-start shadow p-3 ">
          <div className="ques ">
          {/* <span className='qn'></span> */}
            {/* <h5>{i+1}. {ques.question}</h5> */}
            <div dangerouslySetInnerHTML={{ __html: i+1 + '. ' + ques.question }} />
          </div>
          <div className="opt ">
            <ul className='p-0 '>
            {ques.options.map((op,ix)=>{
              const optLeter = ['A','B','C','D']
              if(showcorrectAns){
                let isCorrectAns = op.answer_text== ques.correctAnswer.answer_text;
                return <li key={ix} className={`${(ix==selected)?"select":isCorrectAns?"correct":"notcorrect"} d-flex  rounded align-items-center my-3 p-2`}><span className='me-3'>{optLeter[ix]}.</span>
              <p className='m-0 '>{op.answer_text}</p></li>
              }
              else{
                return <li onClick={()=>clickedOpt(i,op.answer_text,ix)} key={ix} className={`${(ix==selected)?"select":''} d-flex border rounded align-items-center my-3 p-2`}><span className='me-3'>{optLeter[ix]}.</span>
              <p className='m-0 text-start '>{op.answer_text}</p></li>
              }
             
            })}
            </ul>
           

          </div>
          

        </div>
        </SwiperSlide> 

      })}
            </Swiper>
      </div>
      <div className="controll d-flex justify-content-around py-2 ">
        {/* <button onClick={handlePrevious}  className=''>prev</button> */}
        {!showSubmit||selectAns.includes(undefined)?'':<button onClick={handelSubmit}  className=' text-white'>Submit</button>}
        {/* <button onClick={handleNext} className=''>next</button> */}
      </div>
    </div>
    
  );
};

export default QuestionCard;



{/* <div className="question-card">
      <div className={`cards`} style={{left:cardPosition+'%'}}>
      {allQuestions.map((ques,i)=>{
         let selected = selectAns[i];
        return  <div key={i} className="card shadow p-3">
          <div className="ques ">
          <span className='qn'>{i+1}.</span>
            <h5>{ques.question
            }</h5>
          </div>
          <div className="opt ">
            <ul className='p-0 pt-3'>
            {ques.options.map((op,ix)=>{
              const optLeter = ['A','B','C','D']
              if(showcorrectAns){
                let isCorrectAns = op.answer_text== ques.correctAnswer.answer_text;
                return <li key={ix} className={`${(ix==selected)?"select":isCorrectAns?"correct":"notcorrect"} d-flex border rounded align-items-center my-3 p-2`}><span className='me-3'>{optLeter[ix]}.</span>
              <p className='m-0'>{op.answer_text}</p></li>
              }
              else{
                return <li onClick={()=>clickedOpt(i,op.answer_text,ix)} key={ix} className={`${(ix==selected)?"select":''} d-flex border rounded align-items-center my-3 p-2`}><span className='me-3'>{optLeter[ix]}.</span>
              <p className='m-0'>{op.answer_text}</p></li>
              }
             
            })}
            </ul>
           

          </div>
          

        </div>

      })}
      </div>
      <div className="controll d-flex justify-content-around mt-3">
        <button onClick={handlePrevious}  className=''>prev</button>
        {!showSubmit||selectAns.includes(undefined)?'':<button onClick={handelSubmit}  className='bg-success text-white'>submit</button>}
        <button onClick={handleNext} className=''>next</button>
      </div>
    </div> */}
    

