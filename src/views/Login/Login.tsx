import React from 'react'
import styles from './Login.module.scss'
import type { FormProps } from 'antd';
import { Button, Form, Input,Row,Col, message } from 'antd';
import {loginAction, updateInfo, updateToken} from '../../store/module/users'
import { useAppDispatch } from '../../store/store-index';
import { useNavigate } from 'react-router-dom';
import {  useSelector } from 'react-redux';
import { RootState } from '../../store/store-index';


type FieldType = {
  email: string;
  pass: string;
};


export default function Login() {
         const token = useSelector((state:RootState)=>state.user.token)
         const dispatch = useAppDispatch()      
         const navigate = useNavigate()

  const handleLogin = () =>{
        dispatch(loginAction({email:'huangrong@imooc.com',pass:'huangrong'}))
  }

  const onFinish: FormProps<FieldType>['onFinish'] = (values) => {
    console.log('Success:', values);
     dispatch(loginAction(values)).then(action=>{

            const {errcode,token,errmsg} = (action.payload as {[index:string]:unknown}).data as {[index:string]:unknown}
            
            if (errcode === 0 && typeof token === 'string'){
              dispatch(updateToken(token))
              message.success('登錄成功')
              navigate('/')
             }
             else{
              console.log(errcode,'errcode')
              message.error('登錄失敗')
             }
             
     })

  };
  
  const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  
     
  return (
    <div className={styles.login}>
      <div className={styles.header}>
      {/* <span className={styles['header-logo']}>
        <i className="iconfont icon-vue"></i>
        <i className="iconfont icon-icon-test"></i>
        <i className="iconfont icon-typescript"></i>
      </span> */}
      <span className={styles['header-title']}  >Sauvereign Check-in System</span>
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
      rules={[{ required: true, message: 'Please input your email!' }]}
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

    <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
      <Button type="primary" htmlType="submit">
        Submit
      </Button>
    </Form.Item>
  </Form>
   </Col>
    </Row>
    
    </div>
  )
}

