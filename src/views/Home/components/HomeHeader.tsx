import React, { useEffect } from 'react'
import { Badge,Dropdown,Avatar, Space } from 'antd';
import type { MenuProps } from 'antd';
import styles from '../Home.module.scss'
import {BellOutlined,UserOutlined} from '@ant-design/icons'
import { useSelector } from 'react-redux';
import { RootState,useAppDispatch } from '../../../store/store-index';
import { clearToken } from '../../../store/module/users';
import { Info, getMsgAction,  updateMsgInfo } from '../../../store/module/news';
import { Link,useNavigate } from 'react-router-dom';

export default function HomeHeader() {

  const avatar = useSelector((state:RootState)=>state.user.infos.head) as string
  const name = useSelector((state:RootState)=>state.user.infos.name) as string
  const id = useSelector((state:RootState)=>state.user.infos._id) as string
  // 申请消息提醒
  const applicant = useSelector((state:RootState)=>state.news.infos.applicant) 
  // 审批消息提醒
  const approver = useSelector((state:RootState)=>state.news.infos.approver) 
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  // 获取用户消息状态
  useEffect(()=>{
        dispatch(getMsgAction({userid:id})).then(action=>{
          const {errcode,info} = (action.payload as {[index:string]:unknown}).data as {[index:string]:unknown}
          if(errcode===0){
            dispatch(updateMsgInfo(info as Info))
          }
        })
  },[id,dispatch])

  const handleLogOut = ()=>{
          // 清空用戶信息
          dispatch(clearToken())

          // 跳轉到登錄頁
          setTimeout(()=>{
            window.location.replace('/check-in-system')
          },100)
          
  }


  const items1: MenuProps['items'] =[]

   if(applicant){
          items1.push({
            key: '1',
            label: <Link to='/check'>NEW Leave pending for approval</Link>
          })
   }
   if(approver){
    items1.push({
      key: '2',
      label: <Link to='/apply'>Application result available</Link>
    })
   }
   if(!applicant&&!approver){
     items1.push({
      key: '3',
      label: 'no message'
     })
   }

  const items2: MenuProps['items'] =[
    {
      key: '1',
      label:<Link to='/check-in-system/changepw'>Change Password</Link>
    },
    {
      key: '2',
      label: (
        <a target="_blank" rel="noopener noreferrer"  onClick={handleLogOut}>
          Log Out
        </a>
      ),
    }
  ]

  return (
    
      <div className={styles['home-header']}>
      
      <span className={styles['header-title']}  >Sauvereign Check-in System</span>

      <div className={styles['header-right']}>
      <Dropdown menu={{ items:items1 }}  arrow>
        <Badge dot={(applicant||approver) as boolean}>
        <BellOutlined />
        </Badge>
      </Dropdown>
      <Dropdown menu={{ items:items2 }}  arrow>
        <Space className={styles['home-header-space']}>
        <Avatar size={30} icon={<UserOutlined />} src={avatar}/>  {name}
        </Space>
        
      </Dropdown>
      </div>

      
    </div>
  
  )
}
