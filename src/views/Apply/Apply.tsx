import React,{ useEffect, useState }  from 'react'
import styles from './Apply.module.scss'
import { Button,Space,Input,Row,Radio,Table,Modal,Form,Select,DatePicker, message } from 'antd'
import type { RadioChangeEvent,TableProps,FormProps } from 'antd'
import { SearchOutlined } from '@ant-design/icons'
import {Info, addApplyAction, getApplyAction, updateApplyInfo} from '../../store/module/apply'
import _ from 'lodash'
import { useSelector } from 'react-redux'
import { RootState, useAppDispatch } from '../../store/store-index'
import dayjs from 'dayjs'



type FieldType = {
  approvername:string
  note:string
  reason:string
  time:[string,string]
};
interface DataType {
  [index:string]:unknown
}



const columns: TableProps<DataType>['columns'] = [
  {
    title: '申請人',
    dataIndex: 'applicantname',
    key: 'applicantname',
    render: (text) => <a>{text}</a>,
  },
  {
    title: '審批事由',
    dataIndex: 'reason',
    key: 'reason',
  },
  {
    title: '時間',
    dataIndex: 'time',
    key: 'time',
  },
  {
    title: '備註',
    dataIndex: 'note',
    key: 'note',
  },
  {
    title: '審批人',
    dataIndex: 'approvername',
    key: 'approvername',
  },
  {
    title: '狀態',
    dataIndex: 'state',
    key: 'state',
  },

  
];

export default function Apply() {
          const dispatch = useAppDispatch()
          const applyInfos = useSelector((state:RootState)=>state.apply.infos)
          const userInfos = useSelector((state:RootState)=>state.user.infos)
          const options = [
            {label:'全選',value:'全選'},
            {label:'已通過',value:'已通過'},
            {label:'待審批',value:'待審批'},
            {label:'未通過',value:'未通過'},
          ]
          const defaultApproveType = options[0]
          const [approveType,setApproveType]=useState(options[0].value)
          const [searchWords,setSearchWords]=useState('')
          const [isModalOpen, setIsModalOpen] = useState(false);

              useEffect(()=>{

                // 進入的時候,沒有用戶審批信息就獲取用戶審批信息
                  if(_.isEmpty(applyInfos)){
                      dispatch(getApplyAction({applicantid:userInfos._id as string})).then(res=>{
                        
                        const {errcode,rets } = (res.payload as {[index:string]:unknown}).data as {[index:string]:unknown}
                          if(errcode===0){
                            dispatch(updateApplyInfo(rets as Info))
                          }
                             
                      })
                  }
              },[applyInfos,dispatch,userInfos])
              
          // 列表要渲染的數據，filter實現了篩選功能
          const newData:DataType[] = applyInfos.filter(item=>(item.state===approveType||(approveType===options[0].value&&item))&&(item.note as string).includes(searchWords)).map((item,index)=>{
            return {
              key:index,
              applicantname:item.applicantname,
              reason:item.reason,
              time:item.time,
              note:item.note,
              approvername:item.approvername,
              state:item.state
            }
          }) 

          

          const onChange = ({ target: { value } }: RadioChangeEvent)=>{
            setApproveType(value)
          }

          const onSearchChange = (e:React.ChangeEvent<HTMLInputElement>)=>{
                setSearchWords(e.target.value)
          }

          const showModal = () => {
            setIsModalOpen(true);
          };
          const handleOk = () => {
            setIsModalOpen(false);
          };
        
          const handleCancel = () => {
            setIsModalOpen(false);
          };

          const onFinish:FormProps<FieldType>['onFinish']  = (values) => {

            console.log('Success:', values);
            const time1=dayjs(values.time[0]).format('hh:mm:ss DD-MM-YYYY')
            const time2 = dayjs(values.time[1]).format('hh:mm:ss DD-MM-YYYY')

            const data = {
              ...values,
              time:[time1,time2],
              applicantid:userInfos._id,
              approverid:(userInfos.approver as {[index:string]:unknown}[])[0]._id,
              applicantname:userInfos.name


            }
            console.log(data,'data')
            dispatch(addApplyAction(data)).then(action=>{
              const {errcode} = (action.payload as {[index:string]:unknown}).data as {[index:string]:unknown}
              if(errcode===0){
                dispatch(getApplyAction({applicantid:userInfos._id as string})).then(res=>{
                  const {errcode,rets } = (res.payload as {[index:string]:unknown}).data as {[index:string]:unknown}
                  console.log(rets,'erts')
                          if(errcode===0){
                            message.success('success')
                            onReset()
                            handleCancel()
                            dispatch(updateApplyInfo(rets as Info))
                          }
                             
                })
              }
            })
          };
          
          const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
            console.log('Failed:', errorInfo);
            message.error('Submit Failed')
          };

          const [form] = Form.useForm()
          const { Option } = Select

          const onReset = () => {
            form.resetFields();
          };

         

         

  return (
    <div className='apply'>
      <Row justify={'space-between'} className={styles['apply-title']}>
      <Button onClick={showModal}>添加審批</Button>
      <Space>
      <Input placeholder="搜尋備註" value={searchWords} onChange={onSearchChange}/>
      <Button icon={<SearchOutlined></SearchOutlined>}>搜尋</Button>
      <Radio.Group
          options={options}
          onChange={onChange}
          value={approveType}
          optionType="button"
          buttonStyle="solid"
      />
      </Space>
      </Row>
      
      <Table columns={columns} dataSource={newData} className={styles['apply-table']} pagination={{pageSize:10}}/>
      <Modal title="添加審批" open={isModalOpen} onOk={handleOk} onCancel={handleCancel} footer={null}>
      <Form
      form={form}
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      name="control-hooks"
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      style={{ maxWidth: 600,paddingTop:20 }}
    >
      <Form.Item name="approvername" label="approvername/審批人" rules={[{ required: true }]}>
        <Select
          placeholder="approvername"
          allowClear
        >
          <Option value="洪8公">洪8公</Option>
          
        </Select>
      </Form.Item>
      <Form.Item name="reason" label="reason/審批事由" rules={[{ required: true }]}>
        <Select
          placeholder="請選擇"
          allowClear
        >
          <Option value="Annual Leave">年假/Annual Leave</Option>
          <Option value="Sick Leave">病假/Sick Leave</Option>
          <Option value="Compassionate Leave">恩恤假/Compassionate Leave</Option>
          <Option value="Outing">外出/Outing</Option>
          <Option value="Make Up Check In">補簽卡/Make Up Check In</Option>
        </Select>
      </Form.Item>
      <Form.Item name='time' label="Time/時間" rules={[{ required: true }]}>
      <DatePicker.RangePicker
        showTime
        // onChange={onDateChange}
      />
        </Form.Item>
      <Form.Item name='note' label="note/備註" rules={[{ required: true }]}>
          <Input.TextArea rows={4} />
        </Form.Item>

      <Form.Item 
      wrapperCol={{ offset:8,span: 16 }}
      >
        <Space>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
          <Button htmlType="button" onClick={onReset}>
            Reset
          </Button>
          
        </Space>
      </Form.Item>
    </Form>
      </Modal>
      
    </div>
  )
}
