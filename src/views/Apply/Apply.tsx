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
import { updateMsgAction,updateMsgInfo,Info as Info1 } from '../../store/module/news'
import type { GetProps } from 'antd';
type RangePickerProps = GetProps<typeof DatePicker.RangePicker>



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
    title: 'Applicant Name',
    dataIndex: 'applicantname',
    key: 'applicantname',
    render: (text) => <a>{text}</a>,
  },
  {
    title: 'Reason',
    dataIndex: 'reason',
    key: 'reason',
  },
  {
    title: 'Duration',
    dataIndex: 'time',
    key: 'time',
  },
  {
    title: 'Remark',
    dataIndex: 'note',
    key: 'note',
  },
  {
    title: 'Approver Name',
    dataIndex: 'approvername',
    key: 'approvername',
  },
  {
    title: 'Status',
    dataIndex: 'state',
    key: 'state',
  },

  
];

export default function Apply() {
          const dispatch = useAppDispatch()
          const applyInfos = useSelector((state:RootState)=>state.apply.applyList)
          const userInfos = useSelector((state:RootState)=>state.user.infos)
          const newsInfos = useSelector((state:RootState)=>state.news.infos)
       
          const options = [
            {label:'Select All',value:'Select All'},
            {label:'Approved',value:'Approved'},
            {label:'Pending',value:'Pending'},
            {label:'Rejected',value:'Rejected'},
          ]
          const defaultApproveType = options[0]
          const [approveType,setApproveType]=useState(options[0].value)
          const [searchWords,setSearchWords]=useState('')
          const [isModalOpen, setIsModalOpen] = useState(false);

              useEffect(()=>{

                // 進入的時候,沒有用戶審批信息就獲取用戶審批信息
                  if(_.isEmpty(applyInfos)){
                      dispatch(getApplyAction({applicantid:userInfos._id as string})).then(res=>{
                        // console.log(res,'res')
                        const {errcode,rets } = (res.payload as {[index:string]:unknown}).data as {[index:string]:unknown}
                        
                          if(errcode===0){
                            dispatch(updateApplyInfo(rets as Info))
                          }
                             
                      })
                  }
              },[dispatch,userInfos])

              useEffect(()=>{
                // 進入了這個頁面，代表用戶可以查詢到申請結果，那麼右上方的bell不用再提示有新結果
                // 需要發信息更新數據庫，並沒有新信息還沒有看
                if(newsInfos.approver){
                  dispatch(updateMsgAction({userid:userInfos._id as string,approver:false})).then(action=>{
                    const {errcode,info } = (action.payload as {[index:string]:unknown}).data as {[index:string]:unknown}
                    if(errcode===0){
                      dispatch(updateMsgInfo(info as Info1))
                    }

              })
                }
              },[newsInfos,dispatch,userInfos])
              
          // 列表要渲染的數據，filter實現了篩選功能
          const newData:DataType[] = applyInfos.filter(item=>
            {
              return (item.state===approveType||(approveType===options[0].value&&item))&&(item.note as string).includes(searchWords)}).map((item,index)=>{
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

          const disabledDate: RangePickerProps['disabledDate'] = (current) => {
            // Can not select days before today and today
            return current && current < dayjs().endOf('day');
          };

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
            // console.log(data,'data')
            dispatch(addApplyAction(data)).then(action=>{
              const {errcode} = (action.payload as {[index:string]:unknown}).data as {[index:string]:unknown}
              if(errcode===0){
                // 發請求獲取最新申請信息
                dispatch(getApplyAction({applicantid:userInfos._id as string})).then(res=>{
                  const {errcode,rets } = (res.payload as {[index:string]:unknown}).data as {[index:string]:unknown}
                  console.log(rets,'erts')
                          if(errcode===0){
                            message.success('success')
                            onReset()
                            handleCancel()
                            // 成功獲得申請信息後更新UI
                            dispatch(updateApplyInfo(rets as Info))
                          }
                             
                })
                // 提醒approver有新信息需要審批
                dispatch(updateMsgAction({userid:(userInfos.approver as {[index:string]:unknown}[])[0]._id as string,applicant:true}))
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
      <Button onClick={showModal}>Leave Application</Button>
      <Space>
      <Input placeholder="Search for Note" value={searchWords} onChange={onSearchChange}/>
      <Button icon={<SearchOutlined></SearchOutlined>}>Search</Button>
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
      <Modal title="Add approval" open={isModalOpen} onOk={handleOk} onCancel={handleCancel} footer={null}>
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
          <Option value="Joy Lam">Joyce</Option>
          
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
          <Option value="Outing">補休/Compensation Leave</Option>
        </Select>
      </Form.Item>
      <Form.Item name='time' label="Time/時間" rules={[{ required: true }]}>
      <DatePicker.RangePicker
        showTime
        disabledDate={disabledDate}
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
