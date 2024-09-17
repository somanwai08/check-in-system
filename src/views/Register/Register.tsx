import React from 'react'
import styles from './Register.module.scss'
import type { FormProps } from 'antd';
import { Button, Form, Input,Row,Col, message } from 'antd';
import {registerAction} from '../../store/module/users'
import { useAppDispatch } from '../../store/store-index';
import { useNavigate } from 'react-router-dom';
import {  useSelector } from 'react-redux';
import { RootState } from '../../store/store-index';


type FieldType = {
  email: string;
  pass: string;
  name:string
};


export default function Register() {
        //  const token = useSelector((state:RootState)=>state.user.token)
         const dispatch = useAppDispatch()      
         const navigate = useNavigate()

  // const handleLogin = () =>{
  //       dispatch(loginAction({email:'huangrong@imooc.com',pass:'huangrong'}))
  // }

  const onFinish: FormProps<FieldType>['onFinish'] = (values) => {
    console.log('Success:', values);
     dispatch(registerAction(values)).then(action=>{
            const {errcode,token,errmsg} = (action.payload as {[index:string]:unknown}).data as {[index:string]:unknown}
            
            if (errcode === 0 ){
              message.success('註冊成功')
              navigate('/login')
             }
             else{
              console.log(errcode,'errcode')
              message.error('註冊失敗')
             }
             
     })

  };
  
  const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
    console.log('Failed:', errorInfo);
    message.error('Register failed! Please check the register information')
  };

  const handleSignIn = ()=>{
       navigate('/check-in-system/login')
  }

  
     
  return (
    <div className={styles.login}>
      <div className={styles.header}>
      <span className={styles['header-title']}  >Sign up for Sauvereign Check-in System</span>
    </div>
    <Row >
   <Col xs={{span:16,offset:4}} sm={{span:8,offset:8}} md={{span:8,offset:8}} lg={{span:8,offset:8}} xl={{span:8,offset:8}} xxl={{span:8,offset:8}}>
   <Form
    name="basic"
    labelCol={{ span: 8 }}
    wrapperCol={{ span: 16 }}
    style={{ maxWidth: 600 }}
    initialValues={{ remember: true }}
    onFinish={onFinish}
    onFinishFailed={onFinishFailed}
    autoComplete="off"
    className={styles.main}
  >
    <Form.Item<FieldType>
      label="Email"
      name="email"
      rules={[
        { required: true, message: 'Please input your email!' },
        { type: 'email', message:"The input is not a valid Email"}
      ]}
      
    >
      <Input />
    </Form.Item>

    <Form.Item<FieldType>
      label="Password"
      name="pass"
      rules={[{ required: true, message: 'Please input your password!' }]}
    >
      <Input.Password />
    </Form.Item>
    <Form.Item<FieldType>
      label="username"
      name="name"
      rules={[{ required: true, message: 'Please input your username!' }]}
    >
      <Input />
    </Form.Item>

    <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
      <Button type="primary" htmlType="submit">
        Submit
      </Button>
    </Form.Item>
    <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
      <Button type="primary" onClick={handleSignIn}>
        Sign in
      </Button>
    </Form.Item>
  </Form>
   </Col>
    </Row>
    
    </div>
  )
}

