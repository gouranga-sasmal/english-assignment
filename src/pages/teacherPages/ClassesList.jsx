import React, {  memo, useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import context from '../../context/createContext'
import LoadingPage from '../LoadingPage'
import EroorPage from '../EroorPage'
import { GetRandomColor } from '../../component/ToolFunction'


const ClassesList = ({handlers}) => {
const [classesList , setClassesList] = useState([])
const {getAllClass} = useContext(context)
const [loading , setLoading] = useState(true)



const getClasses = async()=>{
  setLoading(true)
  let res =await getAllClass()
  setLoading(false)
  if(res && res.total >0){
    setClassesList(res.documents)
  }
  else{
    setClassesList([])
  }

}


useEffect(()=>{
  getClasses()
},[])


  return (
    <div className="classes-list w-100   " {...handlers}>
        {loading?<LoadingPage/>:(classesList.length>0)?<div className="container ">
          <h2 className='mt-2'>All classes</h2>
        <div className="row">
          {classesList.map((singleclass)=>{
            let color = GetRandomColor();
            return(<div key={singleclass.classId} className="col-6 my-2" >
            <Link to={`/teacher/home/chapters/${singleclass.classId}`} className='text-decoration-none'>
            <div  className="card shadow px-2 " style={{borderBottom:`4px solid ${color}`}} >
                 <div className="class-logo" style={{color:color}}>
                    {singleclass.name}
                 </div>
                 <h2 className='my-2' style={{color:color}}>{singleclass.name}</h2>
             </div>
             </Link> 
         </div>)  
          })}    
        </div>

        </div>:<EroorPage massage={" class not found"} refreshFun={getClasses}/>}
        
        
    </div>
  )
}

export default memo(ClassesList) ;