import React, { useEffect } from 'react'
import { Badge,Dropdown,Avatar, Space } from 'antd';
import type { MenuProps } from 'antd';
import styles from '../Home.module.scss'
import {BellOutlined,UserOutlined} from '@ant-design/icons'
import { useSelector } from 'react-redux';
import { RootState,useAppDispatch } from '../../../store/store-index';
import { clearToken } from '../../../store/module/users';
import { Info, getMsgAction, updateMsgAction, updateMsgInfo } from '../../../store/module/news';

export default function HomeHeader() {

  const avatar = useSelector((state:RootState)=>state.user.infos.head) as string
  const name = useSelector((state:RootState)=>state.user.infos.name) as string
  const id = useSelector((state:RootState)=>state.user.infos._id) as string
  // 申请消息提醒
  const applicant = useSelector((state:RootState)=>state.news.infos.applicant) 
  // 审批消息提醒
  const approver = useSelector((state:RootState)=>state.news.infos.approver) 
  const dispatch = useAppDispatch()

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
            window.location.replace('/login')
          })
          
  }

  const items1: MenuProps['items'] =[
    {
      key: '1',
      label: (
        <a target="_blank" rel="noopener noreferrer" href="https://www.antgroup.com">
          no messages
        </a>
      ),
    }
  ]

  const items2: MenuProps['items'] =[
    {
      key: '1',
      label: (
        <a target="_blank" rel="noopener noreferrer" href="https://www.antgroup.com">
          center
        </a>
      ),
    },
    {
      key: '2',
      label: (
        <a target="_blank" rel="noopener noreferrer"  onClick={handleLogOut}>
          log out
        </a>
      ),
    }
  ]

  return (
    
      <div className={styles['home-header']}>
      
      <span className={styles['header-title']}  >Sauvereign Check-in System</span>

      <div>
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
