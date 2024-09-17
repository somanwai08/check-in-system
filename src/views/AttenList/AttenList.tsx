import React, { useEffect, useState } from 'react'
import './AttenList.module.scss'
import { Select,Button,Form,Table,Avatar,Row } from 'antd'
import type { FormProps } from 'antd'
import { getAllAttAction,updateAttendance } from '../../store/module/sign'
import { useSelector } from 'react-redux'
import {  useAppDispatch } from '../../store/store-index'
import type { RootState } from '../../store/store-index'
import type { TableProps } from 'antd';
import { toZero,calculateTotalWorkTime ,calculateWorkTime,sortWorkTime} from '../../utils/common'
import * as XLSX from 'xlsx';
import _, { values } from 'lodash'


type FieldType = {
    year:string;
    month:string
}
// 這是頁面表格的數據接口
interface DataType {
    key: string;
    name: string;
    avatar: string;
    // workTime: {[index:string]:unknown};
    totalHour:number;
    totalMin:number;
    // tags: string[];
  }

// 這是導出xlsx的數據接口
interface XlsxDataType {
  // name: string;
  // workTime: {[index:string]:unknown};
  [index:string]:unknown

}

  interface WorkTime {
    [index: string]: string[];
  }


export default function AttenList() {
           const dispatch = useAppDispatch()
           const userid = useSelector((state:RootState)=>state.user.infos._id) 
           const [tableData,setTableData] = useState<DataType[]>()
           const [xlsxData,setXlsxData] = useState<XlsxDataType[]>()
           const [month1,setMonth1] = useState<String>(toZero((new Date().getMonth()+1)))
           const month = toZero((new Date().getMonth()+1))
    // 進入頁面的時候，先發請求獲取當月的打卡信息
     useEffect(()=>{
          // const month = toZero((new Date().getMonth()+1))
          const year = (new Date().getFullYear()).toString()
          dispatch(getAllAttAction({year,month,userid:userid as string})).then(res=>{
            let {data} = (res.payload as {[index:string]:unknown}).data as {[index:string]:unknown}
            let xlsxData = _.cloneDeep(data)
            data = (data as {[index:string]:unknown}[]).map((item,index)=>{
                return{
                    key:index,
                    name:item.name,
                    avatar:item.avatar,
                    // workTime:calculateWorkTime(item.checkTime as WorkTime),
                    totalHour:calculateTotalWorkTime(item.checkTime as WorkTime).totalHr,
                    totalMin:calculateTotalWorkTime(item.checkTime as WorkTime).totalMin,
                    
                }
              }) 
            
              dispatch(updateAttendance({data}))
              setTableData(data as DataType[] | undefined)
                xlsxData = (xlsxData as {[index:string]:unknown}[]).map((item,index)=>{
              return{
                  name:item.name,
                  workTime:calculateWorkTime(item.checkTime as WorkTime),
                  totalHour:calculateTotalWorkTime(item.checkTime as WorkTime).totalHr,
                  totalMin:calculateTotalWorkTime(item.checkTime as WorkTime).totalMin,
                  
              }
            }) 
              setXlsxData(xlsxData as XlsxDataType[] | undefined)
           
              
        })

     },[])
    const handleChange = (value: string) => {
        // console.log(`selected ${value}`);
      };

      const onFinish: FormProps<FieldType>['onFinish'] = (values) => {
        console.log('Success:', values);
        setMonth1(values.month)
        dispatch(getAllAttAction({...values,userid:userid as string})).then(res=>{
            // console.log(res,'res')
            let {data} = (res.payload as {[index:string]:unknown}).data as {[index:string]:unknown}
            data = (data as {[index:string]:unknown}[]).map((item,index)=>{
                return{
                    key:index,
                    name:item.name,
                    avatar:item.avatar,
                    totalHour:calculateTotalWorkTime(item.checkTime as WorkTime).totalHr,
                    totalMin:calculateTotalWorkTime(item.checkTime as WorkTime).totalMin,
                    
                }
              }) 
            dispatch(updateAttendance({data}))
            setTableData(data as DataType[] | undefined)
        })
          
      };
      
      const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
        console.log('Failed:', errorInfo);
      };
      const columns: TableProps<DataType>['columns'] = [
        {
          title: 'Name',
          dataIndex: 'name',
          key: 'name',
        },
        {
          title: 'Avatar',
          dataIndex: 'avatar',
          key: 'avatar',
          render:(text,record)=> {
            return <Avatar size="large" src={record.avatar}/>
        }
        },
        {
          title: 'Total',
          key: 'total',
          dataIndex: 'total',
          render: (_, { totalHour,totalMin }) => (
            <>
              {`${totalHour}h${totalMin}m`}
            </>
          ),
        },
       
      ];
      

   const handleExport = ()=>{
           

         
            const workbook = XLSX.utils.book_new()

           const abcs = xlsxData!.map(item=>{
            // console.log(item,'item')
           
                // for each person's data , transform an object into a 2D array
              let abc =  Object.entries(item.workTime as {[index:string]:unknown}).map(([key,value])=>[parseInt(key),key,value] as [number,string,(string|null)[]]).sort((a,b)=>a[0]-b[0])
                          .map(([key1,key2,value])=>[item.name,`${toZero(key1)}-${month}-${(new Date().getFullYear()).toString()}`,value])
             
              abc = [...abc,['','total',`${item.totalHour}h${item.totalMin}m`]]

              // console.log(abc,'abc')
                // generate a worksheet for each 2d array
              const worksheet = XLSX.utils.json_to_sheet(abc)
               
              XLSX.utils.sheet_add_aoa(worksheet, [
                ['Monthly Timesheets','',''],
                ["","",""],
                ["Month",`${month}/${new Date().getFullYear()}`,''],
                ["","",""],
                [ "name","Date","Working Hour"]
                ], 
                { origin: "A1" });

                XLSX.utils.sheet_add_aoa(worksheet,abc, { origin: "A6" });

                // add the worksheet into the work book
              XLSX.utils.book_append_sheet(workbook,worksheet, item.name as string)

              

              worksheet["!cols"]=[{wch:20},{wch:25},{wch:15},{wch:10},{wch:10}]
            
          }) 


            XLSX.writeFile(workbook,`${month1}-${new Date().getFullYear()} Monthly Timesheet.xlsx`)

   }
   

  return (
    <div>
        
        <Form
         name="basic"
         labelCol={{ span: 8 }}
         wrapperCol={{ span: 16 }}
         style={{ maxWidth: 600,margin:'0 auto',marginTop:50 }}
         initialValues={{ year:'2024',month }}
         onFinish={onFinish}
         onFinishFailed={onFinishFailed}
         className='table'
         >
          
            <Form.Item<FieldType>
                label="year"
                name="year"
                rules={[{required:true,message:"Please input year!"}]}>
                     <Select
                        //   defaultValue="2024"
                        // initialValues="2024"
                          style={{ width: 120 }}
                          onChange={handleChange}
                          options={[
                            { value: '2024', label: '2024' },
                            { value: '2025', label: '2025' },
                            { value: '2026', label: '2026' },
                            { value: '2027', label: '2027' },
                            { value: '2028', label: '2028' },
                            { value: '2029', label: '2029' },
                            { value: '2030', label: '2030' },
                            { value: '2031', label: '2031' },
                            { value: '2032', label: '2032' },
                            { value: '2033', label: '2033' },
                            { value: '2034', label: '2034' },
                            { value: '2035', label: '2035' },
                          ]}
                        />

                </Form.Item>
                <Form.Item<FieldType>
                label="month"
                name="month"
                rules={[{required:true,message:"Please input month!"}]}>
                     <Select
                        //   defaultValue="08"
                          style={{ width: 120 }}
                          onChange={handleChange}
                          options={[
                            { value: '01', label: '01' },
                            { value: '02', label: '02' },
                            { value: '03', label: '03' },
                            { value: '04', label: '04' },
                            { value: '05', label: '05' },
                            { value: '06', label: '06' },
                            { value: '07', label: '07' },
                            { value: '08', label: '08' },
                            { value: '09', label: '09' },
                            { value: '10', label: '10' },
                            { value: '11', label: '11' },
                            { value: '12', label: '12' },

                          ]}
                        />

                </Form.Item>
            
                <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                      <Button type="primary" htmlType="submit">
                        Submit
                      </Button>
                </Form.Item>
            

        </Form>
       <Row justify={'center'} style={{marginTop:'50px',marginBottom:'20px'}}>
       <Button onClick={handleExport} >Export Excel</Button>
       </Row>
        
        
       
       
        <Table 
         
         style={{ maxWidth: 900,margin:'0 auto' }}
        columns={columns} 
        dataSource={tableData}
        />
    </div>
  )
}
