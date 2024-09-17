import './Modify.module.scss'
import React, { useEffect, useState } from 'react'
import { DatePicker, Select, Button, Form ,message,Space} from 'antd';
import type { DatePickerProps} from 'antd';
import type { FormProps } from 'antd';
import { useAppDispatch } from '../../store/store-index';
import { modifyTime } from '../../store/module/sign';
import { employedListAction } from '../../store/module/users';
import _ from 'lodash';

type FieldType = {
  date: string;
  activity: string;
};
const { Option } = Select;

export default function Modify() {
    const [date,setDate]=useState<string>('')
    const  [activity,setSelectedActivity]=useState('00')
    const [userId,setUserId] = useState<string>('')
    const dispatch = useAppDispatch()
    const [employed,setEmployed] = useState<{[index:string]:unknown}[]>()

useEffect(()=>{
      if(_.isEmpty(employed)){
        dispatch(employedListAction()).then(res=>{
          // console.log(res,'employed')
          const {infos}=(res.payload as {[index:string]:unknown}).data as {[index:string]:unknown}
          setEmployed(infos as {[index:string]:unknown}[])
 })
      }
       
},[employed])

const onOk = (value: DatePickerProps['value'] ) => {
    // console.log('onOk: ', value);
  };
const handleActivityChange = (value:string)=>{
      setSelectedActivity(value)
}
const handleUserChange = (value:string) =>{
  console.log(value,'handleUserChange')
       setUserId(value)
}
const onFinish: FormProps<FieldType>['onFinish'] = (values) => {
  console.log('Success:', date, activity,userId);
  const year = date.split('-')[0]
  const month = date.split('-')[1]
  const day = date.split('-')[2].split(' ')[0]
  const time = date.split(' ')[1]
  
  console.log(`year:${year},month:${month},day:${day},time:${time}`)
  if(date.length===0){
       message.error('Please input time')
  }else{
    // 發送請求修改用戶打卡時間
         dispatch(modifyTime({userid:userId,year,month,day,activity,time})).then(res=>{
           message.success('success！')
         }).catch(err=>{
          message.error('Failed. Please try again!')
         })
    
  }
};

const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
  console.log('Failed:', errorInfo);
};
// console.log(employed,'employed')
  return (
    <div>
       <Form 
      //  layout="vertical"
       labelCol={{ span: 8 }}
       wrapperCol={{ span: 16 }}
       style={{ maxWidth: 600,margin:'0 auto',marginTop:'50px'}}
       onFinish={onFinish}
       onFinishFailed={onFinishFailed}
       autoComplete="off"
       >
        <Form.Item 
        label="選擇用戶" 
        >
        <Select
          // value={employed![0].name as string}
          onChange={handleUserChange}
          placeholder="請選擇"
        >
          {employed?.map(item=><Option value={item._id} >{item.name as string}</Option>)}
        </Select>
        </Form.Item>
      <Form.Item label="選擇日期和時間">
        <DatePicker
          showTime
          onChange={(value, dateString) => {
            console.log('Selected Time: ', value);
            console.log('Formatted Selected Time: ', dateString);
          const date = dateString.toString()
          setDate(date)
          
        }}
          onOk={onOk}
        />
      </Form.Item>
      <Form.Item label="修改時段">
        <Select
          value={activity}
          onChange={handleActivityChange}
          placeholder="請選擇"
        >
          <Option value="00">開始工作</Option>
          <Option value="01">外出午膳</Option>
          <Option value="02">返到鋪頭</Option>
          <Option value="03">收工</Option>
        </Select>
      </Form.Item>
      <Form.Item wrapperCol={{offset:8,span:20}}>
      
        <Button type="primary" htmlType="submit">
          提交
        </Button>
       
        
      </Form.Item>
    </Form>
    </div>
  )
}
