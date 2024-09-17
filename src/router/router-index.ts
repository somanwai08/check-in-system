import React from 'react'
import { Navigate, RouteObject, createBrowserRouter } from "react-router-dom";
import {lazy} from 'react'
import {
    CopyOutlined,
    CalculatorOutlined,
    WarningOutlined,
    FileAddOutlined,
    ScheduleOutlined,
    CalendarOutlined
} from '@ant-design/icons'
import BeforeEach from '../components/beforeEach/BeforeEach';

const Home = lazy (()=>import('../views/Home/Home'))
const Sign = lazy (()=>import('../views/Sign/Sign'))
const Exception = lazy (()=>import('../views/Exception/Exception'))
const Apply = lazy (()=>import('../views/Apply/Apply'))
const Check = lazy (()=>import('../views/Check/Check'))
const Login = lazy (()=>import('../views/Login/Login'))
const Attendance = lazy(()=>import('../views/AttenList/AttenList'))
const Modify = lazy(()=>import('../views/Modify/Modify'))
const Register = lazy(()=>import('../views/Register/Register'))
const ModifyPW = lazy(()=>import('../views/ModifyPW/ModifyPW'))

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
        path:'/check-in-system',
        element:React.createElement(Navigate,{to:'/check-in-system/login'})
    },
    {
        path:'/check-in-system',
        name:'home',
        element:React.createElement(BeforeEach,null,React.createElement(Home)),
        meta:{
            menu:true,
            title:"Menu",
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
                    title:"Check-in",
                    icon:React.createElement(CalculatorOutlined),
                    auth:true
                },
            },
            {
                path:'changepw',
                name:'changepw',
                element:React.createElement(ModifyPW),
                meta:{
                    menu:false,
                    title:"Change Password",
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
                    title:'Leave Application',
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
                    title:"Leave Approve",
                    icon:React.createElement(ScheduleOutlined),
                    auth:true
                },
            },
            {
                path:'attendance',
                name:'attendance',
                element:React.createElement(Attendance),
                meta:{
                    menu:true,
                    title:"Timesheet",
                    icon:React.createElement(CalendarOutlined),
                    auth:true
                },
            },
            {
                path:'modify',
                name:'modify',
                element:React.createElement(Modify),
                meta:{
                    menu:true,
                    title:"Check-in Modification",
                    icon:React.createElement(CalendarOutlined),
                    auth:true
                },
            },
          
        ]
    },
    {
        path:'/check-in-system/login',
        element:React.createElement(BeforeEach,null,React.createElement(Login))
    },
    // {
    //     path:'check-in-system/register',
    //     element:React.createElement(BeforeEach,null,React.createElement(Register))
    // }
]

const router = createBrowserRouter(routes)

export default router