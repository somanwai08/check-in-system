import React from 'react'
import styles from './Check.module.scss'
import { Button,Space,Input,Row,Radio,Table,Modal,Form,Select,DatePicker, message } from 'antd'
import { useState ,useEffect} from 'react'
import { SearchOutlined,CloseOutlined,CheckOutlined } from '@ant-design/icons'
import _ from 'lodash'
import { useSelector } from 'react-redux'
import { RootState, useAppDispatch } from '../../store/store-index'
import type { RadioChangeEvent,TableProps,FormProps } from 'antd'
import {Info, addApplyAction, getApplyAction, updateApplyAction, updateApplyInfo} from '../../store/module/apply'
import { userInfo } from 'os'

interface DataType {
  [index:string]:unknown
}

const options = [
  {label:'全選',value:'全選'},
  {label:'已通过',value:'已通过'},
  {label:'待審批',value:'待審批'},
  {label:'未通过',value:'未通过'},
]


export default function Check() {
  const dispatch = useAppDispatch()
  const [approveType,setApproveType]=useState(options[0].value)
  const [searchWords,setSearchWords]=useState('')
  const userInfos = useSelector((state:RootState)=>state.user.infos)
  const checkInfos = useSelector((state:RootState)=>state.apply.infos)

  

  useEffect(()=>{

    // 進入的時候,沒有用戶審批信息就獲取用戶審批信息
      if(_.isEmpty(checkInfos)){
          dispatch(getApplyAction({approverid:userInfos._id as string})).then(res=>{
            
            const {errcode,rets } = (res.payload as {[index:string]:unknown}).data as {[index:string]:unknown}
            console.log(rets,'rets')
              if(errcode===0){
                dispatch(updateApplyInfo(rets as Info))
              }
                 
          })
      }
  },[checkInfos,dispatch,userInfos])


  const onSearchChange = (e:React.ChangeEvent<HTMLInputElement>)=>{
    setSearchWords(e.target.value)
          }

  const onChange = ({ target: { value } }: RadioChangeEvent)=>{
    setApproveType(value)
  }

  const handleManage=(_id:string,state:'已通过'|'未通过')=>{
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
                        dispatch(updateApplyInfo(rets as Info))
                      }
                         
                  })
                 }
             })
            }
  }


  const columns: TableProps<DataType>['columns'] = [
    {
      title: '申請人',
      dataIndex: 'applicantname',
      key: 'applicantname',
      render: (text) => <a>{text}</a>,
    },
    {
      title: '審批事由',
      dataIndex: 'reason',
      key: 'reason',
    },
    {
      title: '時間',
      dataIndex: 'time',
      key: 'time',
    },
    {
      title: '備註',
      dataIndex: 'note',
      key: 'note',
    },
    {
      title: '管理',
      dataIndex: 'manage',
      key: 'manage',
      render:( _, record) =>{
          return <>
          <Space>
            <Button type='primary'  shape='circle' size="small"  icon={<CheckOutlined/>} onClick={handleManage(record._id as string,'已通过')}></Button>
            <Button type='primary'  shape='circle' size="small" danger icon={<CloseOutlined/>} onClick={handleManage(record._id as string,'未通过')}></Button>
            </Space></>
      },
    },
    {
      title: '狀態',
      dataIndex: 'state',
      key: 'state',
    },
  
    
  ];

      // 列表要渲染的數據，filter實現了篩選功能
      const newData:DataType[] = checkInfos.filter(item=>(item.state===approveType||(approveType===options[0].value&&item))&&(item.note as string).includes(searchWords)).map((item,index)=>{
        return {
          key:index,
          _id:item._id,
          applicantname:item.applicantname,
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
      <Input placeholder="搜尋備註" value={searchWords} onChange={onSearchChange}/>
      <Button icon={<SearchOutlined></SearchOutlined>}>搜尋</Button>
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
