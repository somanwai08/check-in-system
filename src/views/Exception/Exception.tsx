import React, { useState,useEffect } from 'react'
import styles from './Exception.module.scss'
import{Row,Button,Select,Space,Col,Timeline,Card} from 'antd'
import { useSelector } from 'react-redux'
import { RootState, useAppDispatch } from '../../store/store-index'
import { Link,useSearchParams } from 'react-router-dom'
import { Info, getTimeAction, updateInfo } from '../../store/module/sign'
import _ from 'lodash'
import { toZero } from '../../utils/common'



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
          
          })

          let monthDetail
          if(signInfo.detail){
                const monthlySignInfo = (((signInfo.detail as {[index:string]:unknown})[String(year)])as {[index:string]:unknown})[String(toZero(month+1))] as {[index:string]:unknown}
              
               monthDetail = Object.entries(monthlySignInfo)

          }
         
          

  return (
    <div>
      <Row className={styles.exception} justify="space-between" align="middle">
        {/* 左面按鈕 */}
        <Link to='/apply'>
        <Button type="primary">異常處理</Button>
        </Link>
        {/* 右面選擇菜單 */}
        <Space>
          {/* <Button>2024</Button> */}
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
        <Timeline>

          {monthDetail?.filter(item=>item[1]!=='').map(item=>{
            const timeInfo = (((signInfo.time as{[index:string]:unknown})[String(year)] as {[index:string]:unknown})[String(toZero(month+1))] as {[index:string]:unknown})[item[0]] as string[]
            
            return <Timeline.Item key={item[0]} className={styles['exception-lineItem']}>
            <h3>{item[0]}-{(month+1)}-{year}</h3>
            <Card >
            <Space>
            <h4>{item[1] as string}</h4>
            <p>考勤詳情：{timeInfo[0]!=null?`${timeInfo[0]}-${timeInfo[1]!=null?timeInfo[1]:''}`:'no record'}</p>
            </Space>
            </Card>       
          </Timeline.Item>
          })}
         
        </Timeline>
        </Col>
        <Col span={12}>
        <Timeline>
        <Timeline.Item className={styles['exception-lineItem']}>
            <h3>事假</h3>
            <Card >
            <h4>待審批</h4>
            <p>申請日期： 09:08:09 04-07-2024 - 09:08:09 05-07-2024</p>
            <p>申請詳情：aaa</p>
            </Card>       
          </Timeline.Item>
          <Timeline.Item className={styles['exception-lineItem']}>
            <h3>事假</h3>
            <Card >
            <h4>待審批</h4>
            <p>申請日期： 09:08:09 04-07-2024 - 09:08:09 05-07-2024</p>
            <p>申請詳情：aaa</p>
            </Card>       
          </Timeline.Item>
        </Timeline>
        </Col>
      </Row>
    </div>
  )
}
