import React from 'react'

const HalfCircleProgress = ({percent}) => {
    let colorStyle = ()=>{
      if(percent<=100 && percent>=70){
        return 'green'
      }
     else if(percent<70 && percent>=50){
        return 'blue'
      }
      else if(percent<50 && percent>=30){
        return '#ffc61a'
      }
      else if(percent<30){
        return 'red'
      }
    }
    const style = {
        '--percentage': `${percent}`,
        '--fill': colorStyle(),
      };

    return(
        <div className="semi-donut margin m-auto" 
     style={style}>
  {percent}%
</div>
    )
}

export default HalfCircleProgress