import React from 'react'
import styles from './Home.module.scss'
import { Outlet } from 'react-router-dom'
import { Layout} from 'antd'
import HomeHeader from './components/HomeHeader'
import HomeAside from './components/HomeAside'
import HomeBreadcrum from './components/HomeBreadcrum'
import HomeMain from './components/HomeMain'

const {Header,Content,Sider}=Layout

export default function Home() {

  
  
                
  return (
    <Layout className={styles['container']}>
      <Header className={styles['header']}>
        <HomeHeader />
      </Header>
      <Layout>
        <Sider width={'30%%'} theme='light'>
          <HomeAside/>
        </Sider>
        <Layout style={{padding:'20px'}}>
          <HomeBreadcrum/>
           <Content className={styles['home-main']}>
            <HomeMain/>
           </Content>
        </Layout>
      </Layout>
    </Layout>
  )
}
