import React, { useState,useEffect } from 'react'
import styles from './Sign.module.scss'
import { Descriptions,Button,Calendar,Row, Select,Space, message,Card} from 'antd';
import type { DescriptionsProps } from 'antd';
// import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store/store-index';
import { useAppDispatch } from '../../store/store-index';
import _ from 'lodash'
import { getTimeAction,updateInfo , putTimeAction } from '../../store/module/sign';
import type { Info } from '../../store/module/sign';
import type { Dayjs } from 'dayjs';
import { toZero } from '../../utils/common';

// import MobileDetect from 'mobile-detect';

// const md=new MobileDetect(window.navigator.userAgent)

// console.log(md.mobile(),'isMobile')


const date = new Date()

enum DetailKey {
  normal = '正常出勤',
  absent = '旷工',
  miss = '漏打卡',
  late = '迟到',
  early = '早退',
  lateAndEarly = '迟到并早退'
}



const originDetailValue:Record<keyof typeof DetailKey,number> = {
  normal:0,
  absent:0,
  miss :0,
  late:0,
  early:0,
  lateAndEarly:0
}


export default function Sign() {
       const [month,setMonth] = useState(date.getMonth()+1)
       const [year,setYear] = useState(date.getFullYear())
       const monthOptions = ['January','February','March','April','May','June','July','August','September','October','November','December']
      //  console.log(month,'month')
       const signsInfos = useSelector((state:RootState)=>state.sign.infos)
       const [dailyCheckIn,setDailyCheckIn]= useState<string|null[]>()
      //  (((signsInfos.time as {[index:string]:unknown})[year] as {[index:string]:unknown})[toZero(month)] as {[index:string]:unknown})[toZero(date.getDate())] as string|null[]

       const usersInfos = useSelector((state:RootState)=>state.user.infos)
       const dispatch = useAppDispatch()
       const [detailValue,setDetailValue] = useState({...originDetailValue})
       
      //  console.log(dailyCheckIn,'dailychein')


            // 用來獲得用戶簽名數據的副作用
       useEffect(()=>{

        if(_.isEmpty(signsInfos)){
                // 如果沒有簽名數據，就獲取用戶簽名數據
                dispatch(getTimeAction({userid:usersInfos._id as string})).then((action1)=>{
                 
                   const {errcode,infos}=(action1.payload as {[index:string]:unknown}).data as {[index:string]:unknown}
                    if(errcode===0){
                         dispatch(updateInfo(infos as Info))
                         const monthlyCheckIn = ((((((infos as {[index:string]:unknown}).time)as {[index:string]:unknown})[year])as {[index:string]:unknown})[toZero(month)] as{[index:string]:string|null[]})[toZero(date.getDate())]
                         setDailyCheckIn(monthlyCheckIn)
                         
                    }
                })
        }
      

       },[signsInfos,dispatch,usersInfos,month,year])

       useEffect(()=>{
                          const year = new Date().getFullYear()
                        // 如果有描述列表的數據
                if(signsInfos.detail){
                        // 找到日曆右上方選擇的月份（也是描述列表第一項顯示的月份）對應的打卡數據
                        const monthlyData = ((signsInfos.detail as {[index:string]:unknown})[year] as {[index:string]:unknown})[toZero(month+1)] 
                       
                        // 對該月的每一個已考勤情況進行統計
                        for(let att=1;att<=new Date().getDate();att++){
                          switch((monthlyData as {[index:string]:unknown})[toZero(att)]  ){
                            case '正常出勤': 
                            originDetailValue.normal++
                            break;
                            case '旷工':
                              originDetailValue.absent++
                              break;
                            case '漏打卡':
                              originDetailValue.miss++
                              break;
                            case '迟到':
                              originDetailValue.late++
                              break;
                            case '早退':
                              originDetailValue.early++
                              break;
                            case '迟到并早退':
                              originDetailValue.lateAndEarly++
                              break;
                          }
                        }
                        setDetailValue({...originDetailValue}) 
                }

                return ()=>{
                    //  更新或者销毁的时候触发
                    for(let attr in originDetailValue){
                      originDetailValue[attr as keyof typeof originDetailValue]= 0
                    }
                }

       },[month,signsInfos.detail,year])

      useEffect(()=>{
        // console.log(dailyCheckIn,'console dailyCheckin')
        if(dailyCheckIn===undefined&&signsInfos.time){
            // console.log(signsInfos,'def')
          // console.log((((signsInfos.time as {[index:string]:unknown})[year] as {[index:string]:unknown})[toZero(month)] as {[index:string]:unknown})[toZero(date.getDate())] as string|null[],'abc')
          setDailyCheckIn((((signsInfos.time as {[index:string]:unknown})[year] as {[index:string]:unknown})[toZero(month)] as {[index:string]:unknown})[toZero(date.getDate())] as string|null[])
        }
        
      },[dailyCheckIn])
      
       const handleCellRender=(value:Dayjs)=>{
                  
                  const year = value.year()
                  
            //獲取每一格所屬的月份
             const month = signsInfos.time && ((signsInfos.time as {[index:string]:unknown})[year] as {[index:string]:unknown})[toZero(value.month()+1)]

            //  獲取每一格所在的日期的值（打卡時間）
             const date = month && (month as {[index:string]:unknown})[toZero(value.date())]


             let ret:React.ReactElement = <div></div>
             if(Array.isArray(date)){
                  if(date.length===1){
                    ret=<div>start:{date[0]}</div>
                  }else if(date.length===2){
                    ret=<div>
                      <div>start:{date[0]}</div>
                      <div>break:</div>
                      <div>{date[1]}-{date[2]}</div>
                         </div> 
                  }else if(date.length===3){
                    ret=<div>
                      <div>start:{date[0]}</div>
                         <div>break:</div>
                         <div>{date[1]}-{date[2]}</div>
                         </div> 
                  }else if(date.length===4){
                    ret=<div>
                         <div>start:{date[0]}</div>
                         <div>break:</div>
                         <div>`{date[1]}-{date[2]}`</div>
                         <div>off:{date[3]}</div>
                         </div> 
                  }
                      
             }
             return <div>{ret}</div>
       }
       
       const handlePutTime=()=>{
      
        navigator.geolocation.getCurrentPosition((position)=>{

          const latitude = position.coords.latitude
          const longitude = position.coords.longitude

          if(latitude>=22.2810102&&latitude<=22.2822682&&longitude>=114.1571273&&longitude<=114.1584973){
            // if條件：假如在中環店
            dispatch(putTimeAction({userid:usersInfos._id as string})).then(action=>{
              const {errcode,infos}=(action.payload as {[index:string]:unknown}).data as {[index:string]:unknown}
              if(errcode===0){
                dispatch(updateInfo(infos as Info))
                message.success(`successful latitude:${latitude} longitude:${longitude}`)
                const monthlyCheckIn = ((((((infos as {[index:string]:unknown}).time)as {[index:string]:unknown})[year])as {[index:string]:unknown})[toZero(month)] as{[index:string]:string|null[]})[toZero(date.getDate())] 
                setDailyCheckIn(monthlyCheckIn)
              }
              
            })
          }else if(latitude>=22.3035091&&latitude<=22.3047671&&longitude>=114.1602596&&longitude<=114.1616296){
               // if條件：假如在element店
               dispatch(putTimeAction({userid:usersInfos._id as string})).then(action=>{
                const {errcode,infos}=(action.payload as {[index:string]:unknown}).data as {[index:string]:unknown}
                if(errcode===0){
                  dispatch(updateInfo(infos as Info))
                  message.success(`successful latitude:${latitude} longitude:${longitude}`)
                  const monthlyCheckIn = ((((((infos as {[index:string]:unknown}).time)as {[index:string]:unknown})[year])as {[index:string]:unknown})[toZero(month)] as{[index:string]:string|null[]})[toZero(date.getDate())]
                  setDailyCheckIn(monthlyCheckIn)
                }
                
              })
          }else{
            message.error(`unsuccessful! latitude:${latitude} longitude:${longitude}`)
          }
        },(err)=>{
          alert(err.message)
        })
          
       }

  const items: DescriptionsProps['items'] = [
    {
      key: '1',
      label: 'Month',
      children: monthOptions[month-1],
    },
    {
      key: '2',
      label: 'miss',
      children:<span style={{color:detailValue.miss>1?'red':'black'}}>{detailValue.miss}</span> ,
    },
  ];

  

  return (
    <div className={styles['sign-home']}>
      <Descriptions  items={items} bordered={true} column={{xs:1,sm:3,md:4,lg:5,xl:6,xxl:9}} layout="vertical"/>

<Calendar className={styles['sign-desktopSignInfo']} cellRender={handleCellRender}  headerRender={({value,type,onChange,onTypeChange})=>{
              const monthOptions1 = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
              
         const monthOptions2 = monthOptions1.map(item=><Select.Option key={item} value={item}>{item}</Select.Option>)
         const yearOptions = [2024,2025,2026,2027,2028,2029,2030,2031,2032,2033]
         const yearOptions2 = yearOptions.map(item=><Select.Option key={item} value={item}>{item}</Select.Option>)
        
        return (
        <Row className={styles['sign-calendarHeader']} justify='space-between' align='middle'>
             <Button type='primary' onClick={handlePutTime}>check in</Button>
             <Space>
              {/* 年份dropdown */}
              <Select className={styles['sign-yearDropDown']} value={value.year()} onChange={(e)=>{

                            // 讓選擇菜單，描述列表的月份都動態顯示
                            const index =  yearOptions.findIndex(item=>item===e)
                              setYear(yearOptions[index])
                            // 讓月份和選中的月份聯動起來
                              const now=value.clone().year(yearOptions[index])
                            onChange(now)
                            }}>{yearOptions2}</Select>

             {/* 月份dropdown */}
              <Select value={monthOptions1[month]} onChange={(newMonth)=>{

                          // 讓選擇菜單，描述列表的月份都動態顯示
                         const index =  monthOptions1.findIndex(item=>item===newMonth)
                            setMonth(index)
                          // 讓月份和選中的月份聯動起來
                            const now=value.clone().month(index)
                        onChange(now)
                            
                     
              }}>{monthOptions2}</Select>
             </Space>
        </Row>
        )
      }}></Calendar>
      <Row className={styles['sign-mobileSignInfo']} justify='space-between' align='middle'>
        <Button type='primary' onClick={handlePutTime}>Check in3</Button>
        <Card title="Check-in Data"  style={{ width: '100%',marginTop:'20px'}}>
      {/* <p>Start:${((signsInfos as {[index:string]:unknown})[year] as {[index:string]:{[index:string]:string[]}})[month][date.getDay()][0]}</p> */}
      <p>Date:{`${date.getDate()}-${month}-${year}`}</p>
      {/* <p>{year-month}</p> */}
      <p>Start:{dailyCheckIn?dailyCheckIn[0]:''}</p>
      <p>Break: {dailyCheckIn?dailyCheckIn[1]:''}-{dailyCheckIn?dailyCheckIn[2]:''}</p>
      <p>Off: {dailyCheckIn?dailyCheckIn[3]:''}</p>
    </Card>

      </Row> 

    </div>
  )
}
