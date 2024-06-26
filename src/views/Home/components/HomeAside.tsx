import React from 'react'
import { AppstoreOutlined, MailOutlined, SettingOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Menu } from 'antd';
import styles from '../Home.module.scss'
import { useSelector } from 'react-redux';
import type { RootState } from '../../../store/store-index';
import { routes } from '../../../router/router-index';
import _ from 'lodash';
import { useLocation, matchRoutes,Link } from 'react-router-dom';
type MenuItem = Required<MenuProps>['items'][number];

export default function HomeAside() {
          const location = useLocation()
          const matchResult = matchRoutes(routes,location)
          const defaultSelectedKeys=matchResult![1].pathnameBase
          const defaultOpenKeys=matchResult![0].pathnameBase



  const permission = useSelector((state:RootState)=>state.user.infos.permission) as unknown[]

  const menus = _.cloneDeep(routes).filter(v=>{

    // 對於menu裡面的每一項v，它的children屬性需要按照permission來過濾
    // 加入沒有該權限，要從路由表中刪除對應的children子項目
    v.children = v.children?.filter(v=>v.meta?.menu && permission.includes(v.name))
    
            // 決定是否保留v的條件：1.menu屬性是否為真，v的name屬性是否在權限範圍裡面
         return (v.meta?.menu && permission.includes(v.name)) 
  })


  const items:MenuItem[] = menus.map(item=>{

        const kid = item.children?.map(v=>{
          return{
            key:item.path!+v.path!,
            label:<Link to={item.path!+v.path!}>{v.meta?.title}</Link>,
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

  const onClick: MenuProps['onClick'] = (e) => {
    console.log('click ', e);
  };

  return (
    <div>
      <Menu
      defaultSelectedKeys={[defaultSelectedKeys]}
      defaultOpenKeys={[defaultOpenKeys]}
      mode="inline"
      items={items}
      className={styles['home-aside']}
    />
      
    </div>
  )
}
