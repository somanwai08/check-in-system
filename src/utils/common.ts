
const toZero: (n: number)=>string = (n) => {
    if(n < 10){
      return '0' + n;
    }
    else{
      return '' + n;
    }
  }
  
 

  interface WorkTime {
    [key: string]: (string|null)[];
  }
    

 const sortWorkTime = (Obj:WorkTime)=>{
       const keys:[number, string, (string | null)[]][] =  Object.entries(Obj).map(([key,value])=>[parseInt(key),key,value] as [number,string,(string|null)[]]) .sort((a,b)=>a[0]-b[0])
         const    newKeys=Object.fromEntries(keys.map(item=>[item[1],item[2]]))
         return newKeys
 }


  const calculateWorkTime=(workTime: WorkTime):{ [key: string]: string} =>{
    
    return Object.entries(workTime).reduce((result, [key, times]) => {
        
        if (times.length === 0||times.length===1) {
          result[key] = '0h0m';
        } else{
          const start = new Date(`1970-01-01 ${times[0]}`);
          const end = new Date(`1970-01-01 ${times[times.length - 1]}`);
          const duration = end.getTime() - start.getTime();
          const hours = Math.floor(duration / (1000 * 60 * 60));
          const minutes = Math.floor((duration % (1000 * 60 * 60)) / (1000 * 60) );
          result[key] = `${hours}h${minutes}m`;
        }     
        return result ;
      }, {} as { [key: string]: string });
  }

  const calculateTotalWorkTime=(workTime: WorkTime):{ [key: string]: number} =>{
    const finalResult =  Object.entries(workTime).reduce((result, [key, times]) => {
        let start 
        let end 
        let duration
        if (times.length === 0||times.length===1) {
          // 該天沒有打卡，或者只打了一次卡，不用計算工時
        } 
        else{
           start = new Date(`1970-01-01 ${times[0]}`);
           end = new Date(`1970-01-01 ${times[times.length - 1]}`);
           duration = end.getTime() - start.getTime();
          result.totalHr+=duration
          result.totalMin+=duration
        }    
         
        return result ;
      }, {totalHr:0,totalMin:0} as { [key: string]: number });

      finalResult.totalHr=Math.floor(finalResult.totalHr/(1000 * 60 * 60))
      finalResult.totalMin=Math.floor((finalResult.totalMin% (1000 * 60 * 60)) / (1000 * 60))
         
      return finalResult
  }


  export {
    calculateWorkTime,
    calculateTotalWorkTime,
    toZero,
    sortWorkTime
  }