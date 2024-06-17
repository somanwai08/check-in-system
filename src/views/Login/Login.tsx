import React from 'react'
import styles from './Login.module.scss'
import { UseDispatch,useSelector } from 'react-redux'
import { useAppDispatch,RootState} from '../../store/store-index'
import {loginAction} from '../../store/module/users'


export default function Login() {
     const dispatch = useAppDispatch()
     const token = useSelector((state:RootState)=>state.user.token)

     const handleClick = ()=>{
              dispatch(loginAction({email:"huangrong@imooc.com",pass:'huangrong'})).then(res=>{
                      console.log(res,'res')
              })
     }
     

  return (
    <div>
      Login
     <br/>
      <button onClick={handleClick}>Login in button</button>
    </div>
  )
}
