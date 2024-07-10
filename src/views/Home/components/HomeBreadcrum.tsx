import React from 'react'
import styles from '../Home.module.scss'
import { Breadcrumb } from "antd";
import { useLocation,matchRoutes } from 'react-router-dom';
import { routes } from '../../../router/router-index';

export default function HomeBreadcrum() {

      const location = useLocation()
      const match = matchRoutes(routes,location)

     const title1 = match![0].route.meta?.title
     const title2 = match![1].route.meta?.title

  return (
    <Breadcrumb
      className={styles['home-breadcum']}
    items={[
      {
        title: title1,
      },
      {
        title: title2,
      },
    ]}
  />
  )
}
