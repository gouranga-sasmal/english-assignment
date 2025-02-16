import React from 'react'

const EroorPage = ({massage , refreshFun}) => {
  return (
    <div className='errorPage'>
        <div className='text-center'>
        <p>{massage}</p>
        <button onClick={()=>refreshFun()}>refresh</button>
        </div>
       
    </div>
  )
}

export default EroorPage