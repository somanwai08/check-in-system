import React from 'react'

export default function Algo() {
 
  const arr = [49,9,4,9,121]


  const findDisappearedNumbers = function(arr:number[]) {
           let p2 = arr.length-1
           let p1 =0
           while(p2>0){
             if(arr[p1]>arr[p2]){
                  let tem= arr[p2]
                  arr[p2]=arr[p1]
                  arr[p1]=tem
             }
             p2--
           }

           console.log(arr,'arr')
  };

  findDisappearedNumbers(arr)
  return (
    <div>
    

      
    </div>
  )
}
