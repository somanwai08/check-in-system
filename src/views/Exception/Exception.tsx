import React, { useState,useEffect } from 'react'
import styles from './Exception.module.scss'
import{Row,Button,Select,Space,Col,Timeline,Card} from 'antd'
import { useSelector } from 'react-redux'
import { RootState, useAppDispatch } from '../../store/store-index'
import { Link,useSearchParams } from 'react-router-dom'
import { Info, getTimeAction, updateInfo } from '../../store/module/sign'
import _ from 'lodash'
import { toZero } from '../../utils/common'
import { getApplyAction, updateApplyInfo, Info as Info1 } from '../../store/module/apply'



let date = new Date()
const mthArr = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
const yearOption = [2024,2025,2026,2027,2028,2029,2030,2031,2032,2033]

export default function Exception() {
          //  url的查詢參數
          const [searchParams,setSearchParams]=useSearchParams()
          // 月份選擇器的月份
          // 關於初始值：如果url中有查詢參數，月份就按查詢參數中的月份渲染
          // 如果url沒有查詢參數，月份就按當前月份渲染：date.getMonth()
          const [month,setMonth]=useState(searchParams.get('month')?Number(searchParams.get('month')):date.getMonth())
          // 關於初始值：如果url中有查詢參數，年份就按查詢參數中的年份渲染
           // 如果url沒有查詢參數，年份就按當前年份渲染：date.getFullYear()
           const [year,setYear]=useState(searchParams.get('year')?Number(searchParams.get('year')):date.getFullYear())
          
          // 點擊月份dropdown menu時候所做的操作
          const handleMonthChange = (e:number)=>{
                  // 轉換所選的月份
                    setMonth(e)
                  // 變更查詢參數
                  setSearchParams(String(`year=${year}&month=${e}`))

          }
          const handleYearChange = (e:number)=>{
             // 轉換所選的年份
             setYear(e)
             // 變更查詢參數
             setSearchParams(String(`year=${yearOption[e]}&month=${month}`))
          }
         
          const dispatch=useAppDispatch()
          const userInfo = useSelector((state:RootState)=>state.user.infos)
          const signInfo = useSelector((state:RootState)=>state.sign.infos)
          const applyInfo = useSelector((state:RootState)=>state.apply.applyList)
          
         
          useEffect(()=>{
            // 進入的時候,沒有用戶打卡信息就獲取用戶打卡信息
            if(_.isEmpty(signInfo)){
              dispatch(getTimeAction({userid:userInfo._id as string})).then(res=>{
          
                const {errcode,infos}=(res.payload as {[index:string]:unknown}).data as {[index:string]:unknown}
               
                  if(errcode===0){
                    dispatch(updateInfo(infos as Info))
                  }
          })
        }
          
          },[signInfo, userInfo, dispatch])

          useEffect(()=>{
            // 進入的時候,被管理者的假期申請記錄為空，就發請求獲取申請記錄
            if(_.isEmpty(applyInfo)){
              console.log('zhixingma1')
              dispatch(getApplyAction({applicantid:userInfo._id as string})).then(action=>{
                       console.log(applyInfo,'applyInfo')
                const {errcode,rets}=(action.payload as {[index:string]:unknown}).data as {[index:string]:unknown}
                       if(errcode===0){
                        if((rets as {[index:string]:unknown}[]).length!==0){
                          dispatch(updateApplyInfo(rets as Info1))
                        }
                       }
              })
            }
          },[applyInfo, userInfo, dispatch])




          let monthDetail
          if(signInfo.detail){
                const monthlySignInfo = (((signInfo.detail as {[index:string]:unknown})[String(year)])as {[index:string]:unknown})[String(toZero(month+1))] as {[index:string]:unknown}
              
               monthDetail = Object.entries(monthlySignInfo)

          }
         
          

  return (
    <div>
      <Row className={styles.exception} justify="space-between" align="middle">
        {/* 左面按鈕 */}
        <Link to='/modify'>
        <Button type="primary">異常處理</Button>
        </Link>
        {/* 右面選擇菜單 */}
        <Space>
          <Select value={year} onChange={handleYearChange} className={styles.yearSelect}>
          {yearOption.map((item,i)=><Select.Option key={i} value={i} className="year-item">
                {item}
              </Select.Option>)}
          </Select>
          <Select value={month} onChange={handleMonthChange}>
            {mthArr.map((item,i)=><Select.Option key={i} value={i} className="month-item">
                {item}
              </Select.Option>)}
          </Select>
        </Space>
      </Row>
      <Row gutter={20} className={styles['exception-line']}>
        <Col span={12}>
        <Timeline
          items={monthDetail?.filter(item=>item[1]!=='').map(item=>{
            const timeInfo = (((signInfo.time as{[index:string]:unknown})[String(year)] as {[index:string]:unknown})[String(toZero(month+1))] as {[index:string]:unknown})[item[0]] as string[]
            return {
              children:<>
              <h3>{item[0]}-{(month+1)}-{year}</h3>
             <Card >
             <Space>
             <h4>{item[1] as string}</h4>
             <p>考勤詳情：{timeInfo[0]!=null?`${timeInfo[0]}-${timeInfo[1]!=null?timeInfo[1]:''}`:'no record'}</p>
             </Space>
             </Card> </>
            } 
          })}
        >
         
        </Timeline>
        </Col>
        <Col span={12}>
        <Timeline
           items={applyInfo.filter(item=>{
            // 申請時段的開始月份
            const startMonth = (item.time as string)[0].split('-')[1]
            // 申請時段的結束月份
            const endMonth = (item.time as string)[1].split('-')[1]
            // 篩選條件：只有當申請開始月份小於等於當前月份，申請結束月份大於等於當前月份的item會被選出來
            return startMonth<=toZero(month+1)&&endMonth>=toZero(month+1)
           }).map(item=>{
            const {reason,state,note}=item as {[index:string]:string}
            
            return {
              children: <>
               <h3>{reason}</h3>
               <Card >
            <h4>{state}</h4>
            <p className={styles['exception-applCard']}>申請日期： {(item.time as string)[0]} - {(item.time as string)[1]}</p>
            <p>申請詳情：{note}</p>
            </Card> 
              </>
            }
           })}
        >
        </Timeline>
        </Col>
      </Row>
    </div>
  )
}
