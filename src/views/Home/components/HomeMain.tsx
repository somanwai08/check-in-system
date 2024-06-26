import React from 'react'
import styles from '../Home.module.scss'
import { Outlet } from 'react-router-dom'

export default function HomeMain() {
  return (
    <div className={styles['home-main']}>
      <Outlet></Outlet>
    </div>
  )
}
