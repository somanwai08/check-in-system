import React from 'react'
import { Navigate, RouteObject, createBrowserRouter } from "react-router-dom";
import {lazy} from 'react'
import {
    CopyOutlined,
    CalculatorOutlined,
    WarningOutlined,
    FileAddOutlined,
    ScheduleOutlined
} from '@ant-design/icons'
import BeforeEach from '../components/beforeEach/BeforeEach';

const Home = lazy (()=>import('../views/Home/Home'))
const Sign = lazy (()=>import('../views/Sign/Sign'))
const Exception = lazy (()=>import('../views/Exception/Exception'))
const Apply = lazy (()=>import('../views/Apply/Apply'))
const Check = lazy (()=>import('../views/Check/Check'))
const Login = lazy (()=>import('../views/Login/Login'))

declare module 'react-router'{
   export interface NonIndexRouteObject{
        meta?:{
            menu:boolean,
            title:string,
            icon:React.ReactElement,
            auth:boolean
        },
        name?:string
    }
  export  interface IndexRouteObject{
        meta?:{
            menu:boolean,
            title:string,
            icon:React.ReactElement,
            auth:boolean
        },
        name?:string
    }
}



export const routes:RouteObject[]=[
    {
        path:'/',
        element:React.createElement(Navigate,{to:'/sign'})
    },
    {
        path:'/',
        name:'home',
        element:React.createElement(BeforeEach,null,React.createElement(Home)),
        meta:{
            menu:true,
            title:"考勤管理",
            icon:React.createElement(CopyOutlined),
            auth:true
        },
        children:[
            {
                path:'sign',
                name:'sign',
                element:React.createElement(Sign),
                meta:{
                    menu:true,
                    title:"在線打卡簽到",
                    icon:React.createElement(CalculatorOutlined),
                    auth:true
                },
            },
            {
                path:'exception',
                name:'exception',
                element:React.createElement(Exception),
                meta:{
                    menu:true,
                    title:"異常考勤查詢",
                    icon:React.createElement(WarningOutlined),
                    auth:true
                },
            },
            {
                path:'apply',
                name:'apply',
                element:React.createElement(Apply),
                meta:{
                    menu:true,
                    title:"添加考勤審批",
                    icon:React.createElement(FileAddOutlined),
                    auth:true
                },
            },
            {
                path:'check',
                name:'check',
                element:React.createElement(Check),
                meta:{
                    menu:true,
                    title:"我的考勤審批",
                    icon:React.createElement(ScheduleOutlined),
                    auth:true
                },
            },
          
        ]
    },
    {
        path:'/login',
        element:React.createElement(BeforeEach,null,React.createElement(Login))
    }
]

const router = createBrowserRouter(routes)

export default router