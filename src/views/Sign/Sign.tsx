import React, { useState,useEffect } from 'react'
import styles from './Sign.module.scss'
import { Descriptions,Button,Tag,Calendar ,Row, Select,Space, message} from 'antd';
import type { DescriptionsProps } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store/store-index';
import { useAppDispatch } from '../../store/store-index';
import _ from 'lodash'
import { getTimeAction,updateInfo , putTimeAction } from '../../store/module/sign';
import type { Info } from '../../store/module/sign';
import type { Dayjs } from 'dayjs';
import { toZero } from '../../utils/common';

const date = new Date()

enum DetailKey {
  normal = '正常出勤',
  absent = '旷工',
  miss = '漏打卡',
  late = '迟到',
  early = '早退',
  lateAndEarly = '迟到并早退'
}

const originDetailState = {
  type:'success' as 'success'|'error',
  text:'Normal' as 'Normal'|'Abnormal'
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
       const [month,setMonth] = useState(date.getMonth())
       const [year,setYear] = useState(date.getFullYear())
       const monthOptions = ['January','February','March','April','May','June','July','August','September','October','November','December']
       
       const navigate = useNavigate()

       const signsInfos = useSelector((state:RootState)=>state.sign.infos)
       const usersInfos = useSelector((state:RootState)=>state.user.infos)
       const dispatch = useAppDispatch()
       const [detailValue,setDetailValue] = useState({...originDetailValue})
       const [detailState,setDetailState] = useState({...originDetailState})

            // 用來獲得用戶簽名數據的副作用
       useEffect(()=>{

        if(_.isEmpty(signsInfos)){
                // 如果沒有簽名數據，就獲取用戶簽名數據
                dispatch(getTimeAction({userid:usersInfos._id as string})).then((action1)=>{
                 
                   const {errcode,infos}=(action1.payload as {[index:string]:unknown}).data as {[index:string]:unknown}
                    if(errcode===0){
                         dispatch(updateInfo(infos as Info))
                    }
                })
        }
      

       },[signsInfos,dispatch,usersInfos])

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

       },[month,signsInfos.detail])
   
       const handleManage=()=>{
        navigate(`/exception?year=${year}&month=${month}`)
       }
       const handleCellRender=(value:Dayjs)=>{
                  
                  const year = value.year()
                  
            //獲取每一格所屬的月份
             const month = signsInfos.time && ((signsInfos.time as {[index:string]:unknown})[year] as {[index:string]:unknown})[toZero(value.month()+1)]

            //  獲取每一格所在的日期的值（打卡時間）
             const date = month && (month as {[index:string]:unknown})[toZero(value.date())]

             let ret = ''
             if(Array.isArray(date)){
                      ret = date.join('-')
             }
             return <div>{ret}</div>
       }

       const handlePutTime=()=>{
               navigator.geolocation.getCurrentPosition((position)=>{
                const latitude = position.coords.latitude
                const longitude = position.coords.longitude

                console.log('緯度'+latitude)
                console.log('經度'+longitude)

                if(latitude>=22.28034&&latitude<=22.28133&&longitude>=114.15637&&longitude<=114.15733){
                  dispatch(putTimeAction({userid:usersInfos._id as string})).then(action=>{
                    console.log(action.payload,'action.payload in sign.tsx putTimeAction')
                    const {errcode,infos}=(action.payload as {[index:string]:unknown}).data as {[index:string]:unknown}
                    if(errcode===0){
                      dispatch(updateInfo(infos as Info))
                      message.success('successful')
                    }
                    
                  })
                }else{
                  message.error('打卡失敗')
                }

               })

              
              
       }

  const items: DescriptionsProps['items'] = [
    {
      key: '1',
      label: 'Month',
      children: monthOptions[month],
    },
    {
      key: '2',
      label: 'normal',
      children: detailValue.normal,
    },
    {
      key: '3',
      label: 'absent',
      children: detailValue.absent,
    },
    {
      key: '4',
      label: 'miss',
      children: detailValue.miss,
    },
    {
      key: '5',
      label: 'late',
      children: detailValue.late,
    },
    {
      key: '6',
      label: 'early',
      children: detailValue.early,
    },
    {
      key: '7',
      label: 'late and early',
      children: detailValue.lateAndEarly,
    },
    {
      key: '8',
      label: 'Manage',
      children: <Button onClick={handleManage}>Details</Button>,
    },
    {
      key: '9',
      label: 'Status',
      children: <Tag color={detailState.type}>{detailState.type}</Tag>,
    },
  ];

  

  return (
    <div className={styles['sign-home']}>
      <Descriptions  items={items} bordered={true} column={{xs:1,sm:3,md:4,lg:5,xl:6,xxl:9}} layout="vertical"/>
      <Calendar  cellRender={handleCellRender}  headerRender={({value,type,onChange,onTypeChange})=>{
              const monthOptions1 = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
              
         const monthOptions2 = monthOptions1.map(item=><Select.Option key={item} value={item}>{item}</Select.Option>)
         const yearOptions = [2024,2025,2026,2027,2028,2029,2030,2031,2032,2033]
         const yearOptions2 = yearOptions.map(item=><Select.Option key={item} value={item}>{item}</Select.Option>)
        
        return (
        <Row className={styles['sign-calendarHeader']} justify='space-between' align='middle'>
             <Button type='primary' onClick={handlePutTime}>在線簽到</Button>
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
    </div>
  )
}
