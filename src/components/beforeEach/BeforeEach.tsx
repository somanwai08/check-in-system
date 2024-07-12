import React from 'react'
import { useLocation,matchRoutes,Navigate } from 'react-router-dom'
import { routes } from '../../router/router-index'
import { useAppDispatch } from '../../store/store-index'
import { useSelector } from 'react-redux'
import type { RootState } from '../../store/store-index'
import { infosAction ,updateInfo} from '../../store/module/users'
import _ from 'lodash'
import type { Info } from '../../store/module/users'


interface BeforeEachProps{
    children?:React.ReactNode
}

export default function BeforeEach(props:BeforeEachProps) {
     const dispatch = useAppDispatch()
     const token = useSelector((state:RootState)=>state.user.token)
     const infos = useSelector((state:RootState)=>state.user.infos)
    const location = useLocation()
    const match = matchRoutes(routes,location)
            // 如果頁面路徑匹配到路由
    if(Array.isArray(match)){
        const auth = match[match.length-1].route.meta?.auth

           // 頁面需要權限進入,而用戶信息又為空的時候
        if(auth && _.isEmpty(infos)){
                    
            if(token){
                
                     // 如果有token，獲取用戶信息
            dispatch(infosAction()).then(action=>{
                const {errcode,infos}=(action.payload as {[index:string]:unknown}).data as {[index:string]:unknown}
                  
                if(errcode === 0){
                    
                    dispatch(updateInfo(infos as Info ))
                }
                // 其實這裡應該再寫一些如果token驗證失敗的處理方式

            })
            }else{
                // 如果沒有token，就返回登入頁面
                return <Navigate to='/login'/>
                // dispatch(updateInfo(infos as Info ))

            }   
        }
      


    }
    if (token && location.pathname === '/login'){
        return <Navigate to='/sign'/>
    }
    
    // 當頁面不需要權限進入的時候，直接返回children的內容
    return (

        <div>
          {props.children}
        </div>
      )
}
