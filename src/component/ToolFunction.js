import React from 'react'

export const GetRandomColor = () => {
    let color;
    do {
        // Generate a random number between 0 and 14,745,600 (16,777,215 - 2,031,615)
        let randomNumber = Math.floor(Math.random() * 14745600);
        
        // Add 2,031,615 to ensure the color is not too light
        randomNumber += 2031615;
        
        // Convert to hexadecimal and pad with zeros if necessary
        color = "#" + randomNumber.toString(16).padStart(6, '0');
    } while (isColorTooLight(color));

    return color;
}

function isColorTooLight(color) {
    // Convert hex to RGB
    let r = parseInt(color.slice(1, 3), 16);
    let g = parseInt(color.slice(3, 5), 16);
    let b = parseInt(color.slice(5, 7), 16);
    
    // Calculate perceived brightness
    let brightness = (r * 299 + g * 587 + b * 114) / 1000;
    
    // Return true if the color is too light
    return brightness > 200;
}

// Usage

  //////////////////////////////////////////
// let randomColor;
//     for (let i = 0; i < 10; i++) {
//        randomColor = "#" + Math.floor(Math.random() * 16777215).toString(16);
//     }
//     return randomColor;
///////////////////////////
// Generate random values for RGB, ensuring they are on the lighter side
// const r = Math.floor((Math.random() * 128) + 128); // 128 to 255
// const g = Math.floor((Math.random() * 128) + 128); // 128 to 255
// const b = Math.floor((Math.random() * 128) + 128); // 128 to 255

// // Convert RGB to hex
// const toHex = (value) => {
//     const hex = value.toString(16);
//     return hex.length === 1 ? '0' + hex : hex;
// };

// const hexColor = `#${toHex(r)}${toHex(g)}${toHex(b)}`;
// return hexColor;


export function convertISOToDate(isoDate) {
  if(isoDate){
    const date = new Date(isoDate);
    return `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;
  }
  else{
    return''
  }
    
  }

  export const findUniqueValues = (arr, key, convertToInt = false) => {
    const uniqueValuesObj = arr.reduce((acc, obj) => {
      const value = obj[key];
      acc[value] = true;
      return acc;
    }, {});
  
    const uniqueValues = Object.keys(uniqueValuesObj);
    return convertToInt ? uniqueValues.map(Number) : uniqueValues;
  };

 export  function capitalizeName(name) {
  if(name){
    return name
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
  }
  return ''
   
}