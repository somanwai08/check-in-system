import type { MenuProps } from 'antd';
import { Menu } from 'antd';
import styles from '../Home.module.scss'
import { useSelector } from 'react-redux';
import { useAppDispatch } from '../../../store/store-index';
import type { RootState } from '../../../store/store-index';
import { routes } from '../../../router/router-index';
import _ from 'lodash';
import { useLocation, matchRoutes,Link, RouteObject } from 'react-router-dom';
import { infosAction } from '../../../store/module/users';
type MenuItem = Required<MenuProps>['items'][number];

export default function HomeAside() {
          const location = useLocation()
          const matchResult = matchRoutes(routes,location)
          const defaultSelectedKeys=matchResult![1].pathnameBase
          const defaultOpenKeys=matchResult![0].pathnameBase

          const dispatch = useAppDispatch()
          let permission = useSelector((state:RootState)=>state.user.infos.permission) as unknown[]
          // console.log(permission,'permission0')
          let menus:RouteObject[]
          let items:MenuItem[]=[]

          if(permission){
            menus = _.cloneDeep(routes).filter(v=>{

              // 對於menu裡面的每一項v，它的children屬性需要按照permission來過濾
              // 加入沒有該權限，要從路由表中刪除對應的children子項目
              
              v.children =_.cloneDeep(v.children)?.filter(v1=>{ 
               
                  return v1.meta?.menu && permission.includes(v1.name)
                 
                })
                      // 決定是否保留v的條件：1.menu屬性是否為真，v的name屬性是否在權限範圍裡面
                   return (v.meta?.menu && permission.includes(v.name)) 
            })
          
          
            items = menus.map(item=>{
          
                  const kid = item.children?.map(v=>{
                    return{
                      key:item.path!+v.path!,
                      label:<Link to={`${item.path!}/${v.path!}`}>{v.meta?.title}</Link>,
                      title:v.meta?.title,
                      icon:v.meta?.icon
                    }
                  })
          
                     return {
                      key:item.path!,
                      label:item.meta?.title,
                      icon:item.meta?.icon,
                      children:kid
                     }
            })
          }

          


          if(permission===undefined){
      dispatch(infosAction()).then(res=>{
       permission = ((((res as {[index:string]:unknown}).payload as {[index:string]:unknown}).data as {[index:string]:unknown}).infos as {[index:string]:unknown}).permission as unknown[]

       menus = _.cloneDeep(routes).filter(v=>{

        // 對於menu裡面的每一項v，它的children屬性需要按照permission來過濾
        // 加入沒有該權限，要從路由表中刪除對應的children子項目
        
        v.children =_.cloneDeep(v.children)?.filter(v1=>{ 
         
            return v1.meta?.menu && permission.includes(v1.name)
           
          })
                // 決定是否保留v的條件：1.menu屬性是否為真，v的name屬性是否在權限範圍裡面
             return (v.meta?.menu && permission.includes(v.name)) 
      })

      items = menus.map(item=>{
        
        const kid = item.children?.map(v=>{
          return{
            key:item.path!+v.path!,
            label:<Link to={`${item.path!}/${v.path!}`}>{v.meta?.title}</Link>,
            title:v.meta?.title,
            icon:v.meta?.icon
          }
        })

           return {
            key:item.path!,
            label:item.meta?.title,
            icon:item.meta?.icon,
            children:kid
           }
  })


      })
}



 

 

  return (
    <div>
      <Menu
      selectedKeys={[defaultSelectedKeys]}
      openKeys={[defaultOpenKeys]}
      mode="inline"
      items={items}
      className={styles['home-aside']}
    />
      
    </div>
  )
}



