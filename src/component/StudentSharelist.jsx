import React, { useContext, useEffect, useState } from "react";
import { IoIosClose } from "react-icons/io";
import { GiCheckMark } from "react-icons/gi";
import { FaCaretRight } from "react-icons/fa";
import context from "../context/createContext";
import { Query ,ID } from "appwrite";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { capitalizeName } from "./ToolFunction";





const StudentSharelist = ({ className, setShowShareList }) => {
  const param = useParams()
const [students , setStudents] = useState([])
const [selectStu , setSelectStu]= useState([])
const {listAllStudents ,addingAssigntsments,isLogin} = useContext(context);
const {chapter,classes,id} = param;
const [chekBokCheked , setChekBokCheked] = useState(false)

const getStudents = async ()=>{
  let res = await listAllStudents([Query.equal('class', classes)])
  if(res && res.total>0){
    setStudents(res.documents)
  }
}
useEffect(()=>{
  getStudents()
},[])

const selectIt=(id)=>{
  setChekBokCheked(false)
  if(selectStu.includes(id)){
   let filterdArry =  selectStu.filter((ele)=>{
      return ele !== id;
    })
    setSelectStu(filterdArry)

  }
  else{
    setSelectStu([...selectStu,id])
  }
}


const handelChnage = () =>{
  setChekBokCheked(!chekBokCheked)
  if(!chekBokCheked){
    setSelectStu(students.map((ele)=>{
      return ele.$id
    })) 
  }
  else{
    setSelectStu([])
  }  
}
const sendquestions = async ()=>{
  const assignmentid=ID.unique();
 let sendingArry =  selectStu.map((stu)=>{
    return {assignmentId:assignmentid,teacherId:isLogin.id,studentId:stu,qsId:id,classId:JSON.parse(classes),chapterId:JSON.parse(chapter),sharedDate:new Date().toISOString()} })
    let res = await addingAssigntsments(sendingArry)
   if(res && res.length >0 ){
    toast.success('Assignment shared successfully')
   }
   else{
    toast.error("Assignment sharing failed. Try again.")
   }
}

const handelClick = ()=>{
  sendquestions();
  setShowShareList(false);
  setSelectStu([])
  setChekBokCheked(false)
}


  
  return (
    <div className={`${className} sharelist  text-start`}>
      <div className="container">
        <section className="d-flex justify-content-between align-items-center fs-5">
          {" "}
          Share to
          <button
            className="bg-none -none outline-none me-3"
            onClick={() =>{setShowShareList(false);setSelectStu([]);setChekBokCheked(false)} }
          >
            <IoIosClose />
          </button>
        </section>
        {students.length>0?<section className="d-flex align-items-center">
          <input onChange={handelChnage} checked={chekBokCheked} className="ms-auto me-2" name="allcheck" type='checkbox' />
          <label  htmlFor="allcheck">Select all</label>

        </section>:""}
        
        <div className="list">
          {students.length>0?<ul className=" share-ul">
            {students.map((singleStu)=>{
              return <li onClick={()=>selectIt(singleStu.$id)} key={singleStu.$id} className="  text-center">
              <div className="content ">
              {" "}
              <div className="logo mb-1">{singleStu.name[0].toUpperCase()}</div>
              <h5>{capitalizeName(singleStu.name)}</h5>
              </div>
              {selectStu.includes(singleStu.$id)?<div className="marks">
              <GiCheckMark/>  
              </div>:''}
              

            </li>

            })}
            
          </ul>:<div className="w-100 h-100  d-flex align-items-center justify-content-center">you have no students of this class</div>}
          
        </div>
        <div className="footer">
          <button disabled={selectStu.length>0?false:true} style={{opacity:selectStu.length>0?1:0.5}} onClick={handelClick}>Send <FaCaretRight/></button>
        </div>:
        
      </div>
    </div>
  );
};

export default StudentSharelist;
