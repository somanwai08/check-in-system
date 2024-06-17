import React from 'react'
import { useLocation,matchRoutes,Navigate } from 'react-router-dom'
import { routes } from '../../router/router-index'

interface BeforeEachProps{
    children?:React.ReactNode
}

export default function BeforeEach(props:BeforeEachProps) {

    const location = useLocation()
    const match = matchRoutes(routes,location)
    if(Array.isArray(match)){
        const auth = match[match.length-1].route.meta?.auth

        if(auth){

           
              return <Navigate to='/login'/>
        }else{
    
            return (
                <div>
                  {props.children}
                </div>
              )
        }

    }else{
        return <Navigate to='/login'/>
    }
    

    

  
}
