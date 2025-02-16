import React, { useEffect, useState } from 'react'
import context from './createContext'
import { listStudents, addStudents, getStudents, login, register, searchStudent, removeStudentfromTeacherList, searchTeacher, getAllClasses, getChapters, takeQuestionSet,fetchGrammerQuestionSet, getQuestionRelation, getQuestions, getQuestionsOption, fetchQuestionSetByQsIds, addAssingments, getAssignments, updateDoc } from '../database/databaseService';
import {  useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Query } from 'appwrite';


const ContextProvider = ({children}) => {
  const [isLogin , setIsLogin] = useState('')
  const navigate = useNavigate()


  const setUser = ()=>{
    let user = localStorage.getItem("currentUser")
        if(user){
          setIsLogin(JSON.parse(user)) 
    }
    else{
      setIsLogin(user)
    }
  }
  useEffect(()=>{
    setUser()
  },[])

  const registerUser = async (userDetails)=>{
   let res = await register(userDetails);
   console.log(res);
   localStorage.setItem('currentUser',JSON.stringify({id:res.$id,degree:res.degree,name:res.name,phone:res.phone,userType:userDetails.userType,class:res.class}))
   setUser()

  }

  

  const loginUser = async(userDetails)=>{
    try {
      let res = await login(userDetails);
    if(res.total == 0){
      toast.error('user not found!', {position: "top-left",autoClose: 3000,hideProgressBar: false,closeOnClick: true,pauseOnHover: false,draggable: true,progress: undefined,theme: "light",
      });
    }
    else{
      let resobj =(res.documents[0]);
    localStorage.setItem('currentUser',JSON.stringify({id:resobj.$id,degree:resobj.degree,name:resobj.name,phone:resobj.phone,userType:userDetails.userType,class:resobj.class}))
    setUser()
    return 'sucessFull'
    }
    } catch (error) {
    return error      
    }
    
    
  }
  const logOutUser = (usrType) =>{
    localStorage.setItem('currentUser','')
    setUser()
    if(usrType == "student"){
      navigate("/login/student")
    }
    else if(usrType == "teacher"){
      navigate("/login/teacher")
    }
  }

  const studentSearch = async(number) =>{
   return await searchStudent([Query.equal("phone", [number]),]);
  }

  const addTheStudent = async(studentId) =>{
    return await addStudents({teacherId:isLogin.id ,studentId})
  }

  const listAllStudents = async (exQuery) =>{
    const teacherId = isLogin.id;
      let stuRes = await listStudents(teacherId)
      if(stuRes.total > 0){
        const studentIds = stuRes.documents.map(ele=> ele.studentId)
           return await getStudents(studentIds , exQuery); 

        } 
    }
    
    const isAlreadyAvailable = async (number) =>{
      let res1 =  await searchStudent([Query.equal("phone", [number]),])
    let res2 = await searchTeacher([Query.equal("phone", [number]),])
    console.log(res1);
    console.log(res2);

    if(res1.total >0 ||res2.total >0){
      return true
    }
    else{
      return false
    }
  }
    
    const removeStudent = async(studentId)=>{
      const teacherId = isLogin.id;
        return await removeStudentfromTeacherList({teacherId,studentId});
    } 

    const getAllClass = async ()=>{
       return  await getAllClasses()
    }
    [
     
  ]

    const getBookChapters = async (querys)=>{
      console.log(querys);
      return await getChapters(querys)
    }


    const getQuestionSet = async (classId,chapterId)=>{
      return await takeQuestionSet(classId,chapterId)
    }

    const getGrammerQuestionSet = async (classId,chapterId)=>{
      return await fetchGrammerQuestionSet(classId,chapterId)
    }
    const fetchQuestionSetByQuestionSetIds = async (qsIds) => {
      return await fetchQuestionSetByQsIds(qsIds);
    };

    const getQuestion = async (questionSeId) =>{
      let res= await getQuestionRelation(questionSeId)
      if(res && res.total>0){
        let ques = res.documents.map((question)=>{ return question.qId})
        let res2 =  await getQuestions(ques)
        if(res2 && res2.total > 0){
          return await Promise.all(  res2.documents.map(async (ques)=>{
           let res3 = await getQuestionsOption(ques.$id)
           if(res3 && res3.total >0){
            return {question:ques.question_text,options:res3.documents,correctAnswer:res3.documents.find((ans)=>ques.correct_answer_id ==ans.$id)}   
           }
          }))
        }

      }
    }

    const addingAssigntsments = async (document)=>{
      const createDocumentPromises = document.map((documentData) => {
        return addAssingments(documentData);
      });
      return await Promise.all(createDocumentPromises);

    }

    const getingAssignments = async(query)=>{
      console.log(query);

      return await getAssignments(query)
    }
    const updateAssignments = async(docId,data)=>{
      return await updateDoc(docId,data)
    }
  const getDeatails = async (query)=>{
    console.log(query);

    return await searchTeacher(query)

  }
  
  return (
    <context.Provider value={{registerUser,loginUser,isLogin,logOutUser,setIsLogin,studentSearch ,addTheStudent,listAllStudents,removeStudent,isAlreadyAvailable,getAllClass,getBookChapters,getQuestionSet,getGrammerQuestionSet,getQuestion,addingAssigntsments,getingAssignments, fetchQuestionSetByQuestionSetIds, updateAssignments,getDeatails}}>
        {children}
    </context.Provider> 
    
  )
}

export default ContextProvider