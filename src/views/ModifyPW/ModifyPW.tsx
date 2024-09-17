import React from 'react'
import './ModifyPW.module.scss'
import type { FormProps } from 'antd';
import { Button, Checkbox, Form, Input,message,Row } from 'antd';
import {changePasswordAction} from '../../store/module/users'
import { RootState, useAppDispatch } from '../../store/store-index';
import { useSelector } from 'react-redux';

type FieldType = {
  password: string;
  password1: string;

  };
  
 

export default function ModifyPW() {
          const dispatch = useAppDispatch()
          const userInfo = useSelector((state:RootState)=>state.user.infos)
          console.log(userInfo,'userInfo')

          const onFinish: FormProps<FieldType>['onFinish'] = (values) => {
            console.log('Success:', values);
            if(values.password!==values.password1){
                       message.error('Two passwords are different!')
            }else{

                  console.log({
                    userid:userInfo._id as string,
                    pass:values.password
                   },'abc')
                   dispatch(changePasswordAction({
                    userid:userInfo._id as string,
                    pass:values.password
                   })).then(action=>{
                       message.success('Password successfully changed!')
                   }).catch(err=>{
                        message.error('Password not changed,Please try again later!')
                   })
            }
          };
          
          const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
            console.log('Failed:', errorInfo);
          };

  return (
    <div  >
      <Form
    name="basic"
    labelCol={{ span: 8 }}
    wrapperCol={{ span: 16 }}
    style={{ maxWidth: 600, margin:'0 auto',marginTop:'60px' }}
    onFinish={onFinish}
    onFinishFailed={onFinishFailed}
    autoComplete="off"
  >
    <Form.Item<FieldType>
      label="New Password"
      name="password"
      rules={[{ required: true, message: 'Please input your username!' }]}
    >
     <Input.Password />
    </Form.Item>

    <Form.Item<FieldType>
      label="New Password Again"
      name="password1"
      rules={[{ required: true, message: 'Please input your password!' }]}
    >
      <Input.Password />
    </Form.Item>

    <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
      <Button type="primary" htmlType="submit">
        Submit
      </Button>
    </Form.Item>
  </Form>

    </div>
  )
}
