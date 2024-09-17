import React from 'react'
import styles from './Check.module.scss'
import { Button,Space,Input,Row,Radio,Table,Modal,Form,Select,DatePicker, message } from 'antd'
import { useState ,useEffect} from 'react'
import { SearchOutlined,CloseOutlined,CheckOutlined } from '@ant-design/icons'
import _ from 'lodash'
import { useSelector } from 'react-redux'
import { RootState, useAppDispatch } from '../../store/store-index'
import type { RadioChangeEvent,TableProps,FormProps } from 'antd'
import {Info, getApplyAction, updateApplyAction, updateApplyInfo,updateCheckInfo} from '../../store/module/apply'
import { updateMsgAction,updateMsgInfo,Info as Info1 } from '../../store/module/news'

interface DataType {
  [index:string]:unknown
}

const options = [
  {label:'Select All',value:'Select All'},
  {label:'Approved',value:'Approved'},
  {label:'Pending',value:'Pending'},
  {label:'Rejected',value:'Rejected'},
]


export default function Check() {
  const dispatch = useAppDispatch()
  const [approveType,setApproveType]=useState(options[0].value)
  const [searchWords,setSearchWords]=useState('')
  const userInfos = useSelector((state:RootState)=>state.user.infos)
  const checkInfos = useSelector((state:RootState)=>state.apply.checkList)
  const newsInfos = useSelector((state:RootState)=>state.news.infos)

  

  useEffect(()=>{

    // 如果下屬的申請列表為空，admin（又叫approver）就發請求獲取申請列表
      if(_.isEmpty(checkInfos)){
          dispatch(getApplyAction({approverid:userInfos._id as string})).then(res=>{
            
            const {errcode,rets } = (res.payload as {[index:string]:unknown}).data as {[index:string]:unknown}
            console.log(rets,'rets')
              if(errcode===0){
                dispatch(updateCheckInfo(rets as Info))
              }
                 
          })
      }
  },[checkInfos,dispatch,userInfos])

  useEffect(()=>{
    // 進入了這個頁面，代表用戶可以查詢到待審批申請，那麼右上方的bell不用再提示有新結果
    // 需要發信息更新數據庫，並沒有新信息還沒有看
    console.log(newsInfos,'newsInfos')
    if(newsInfos.applicant){
      dispatch(updateMsgAction({userid:userInfos._id as string,applicant:false})).then(action=>{
        const {errcode,info } = (action.payload as {[index:string]:unknown}).data as {[index:string]:unknown}
        if(errcode===0){
          dispatch(updateMsgInfo(info as Info1))
        }

  })
    }
  },[newsInfos,dispatch,userInfos])


  const onSearchChange = (e:React.ChangeEvent<HTMLInputElement>)=>{
    setSearchWords(e.target.value)
          }

  const onChange = ({ target: { value } }: RadioChangeEvent)=>{
    setApproveType(value)
  }

  const handleManage=(_id:string,state:'Approved'|'Rejected',applicantid:string)=>{
            return()=>{
             dispatch(updateApplyAction({_id,state})).then(action=>{
                 const {errcode}=(action.payload as {[index:string]:unknown}).data as {[index:string]:unknown}
                 if(errcode===0){
                  message.success('successful!')
                  // 再一次拉取審批數據
                  dispatch(getApplyAction({approverid:userInfos._id as string})).then(res=>{
            
                    const {errcode,rets } = (res.payload as {[index:string]:unknown}).data as {[index:string]:unknown}
                    console.log(rets,'rets')
                      if(errcode===0){
                        // 更新畫面ui
                        dispatch(updateCheckInfo(rets as Info))
                        // 通知該同事有新信息
                          dispatch(updateMsgAction({userid:applicantid,approver:true}))
                        
                        
                      }
                         
                  })
                 }
             })
            }
  }


  const columns: TableProps<DataType>['columns'] = [
    {
      title: 'Applicant',
      dataIndex: 'applicantname',
      key: 'applicantname',
      render: (text) => <a>{text}</a>,
    },
    {
      title: 'Reason',
      dataIndex: 'reason',
      key: 'reason',
    },
    {
      title: 'Duration',
      dataIndex: 'time',
      key: 'time',
    },
    {
      title: 'Note',
      dataIndex: 'note',
      key: 'note',
    },
    {
      title: 'Manage',
      dataIndex: 'manage',
      key: 'manage',
      render:( _, record) =>{
          return <>
          <Space>
            <Button type='primary'  shape='circle' size="small"  icon={<CheckOutlined/>} onClick={handleManage(record._id as string,'Approved',record.applicantid as string)}></Button>
            <Button type='primary'  shape='circle' size="small" danger icon={<CloseOutlined/>} onClick={handleManage(record._id as string,'Rejected',record.applicantid as string)}></Button>
            </Space></>
      },
    },
    {
      title: 'Status',
      dataIndex: 'state',
      key: 'state',
    },
  
    
  ];

      // 列表要渲染的數據，filter實現了篩選功能
      const newData:DataType[] = checkInfos.filter(item=>(item.state===approveType||(approveType===options[0].value&&item))&&(item.applicantname as string).includes(searchWords)).map((item,index)=>{
        
        return {
          key:index,
          _id:item._id,
          applicantname:item.applicantname,
          applicantid:item.applicantid,
          reason:item.reason,
          time:item.time,
          note:item.note,
          state:item.state
        }
      }) 

  return (
    <div>
       <Row justify={'end'} className={styles['check-title']}>
      <Space>
      <Input placeholder="Search for Applicant" value={searchWords} onChange={onSearchChange}/>
      <Button icon={<SearchOutlined></SearchOutlined>}>Search</Button>
      <Radio.Group
          options={options}
          onChange={onChange}
          value={approveType}
          optionType="button"
          buttonStyle="solid"
      />
      </Space>
      </Row>
      <Table columns={columns} dataSource={newData} className={styles['check-table']} pagination={{pageSize:10}}/>
    </div>
  )
}
