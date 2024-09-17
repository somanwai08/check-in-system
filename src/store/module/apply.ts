import http from "../../utils/http";
import { createSlice,PayloadAction ,createAsyncThunk} from "@reduxjs/toolkit";


// 後端返回的數據類型
export type Info = Array<{
    [index:string]:unknown
}>

// 用戶狀態的數據類型
export type ApplysState = {
    // infos:Info
    applyList:Info;
    checkList:Info
}

type Userid = {
    applicantid?:string,
    approverid?:string
}

// 添加用戶審批信息的數據類型
type applyInfo = {
    [index:string]:unknown
}
// 更新用戶信息的數據類型
type putApply =     {
   _id:string,
   state:'Approved'|'Rejected'
}

// 獲取用戶審批信息
export const getApplyAction = createAsyncThunk('checks/getApplyAction',async(payload:Userid)=>{
                    const ret = await http.get('checks/apply',payload)  
                    return ret
})
// 添加用戶審批信息
export const addApplyAction = createAsyncThunk('checks/addApplyAction',async(payload:applyInfo)=>{
                    const ret = await http.post('checks/apply',payload)
                    return ret
})

// 更新用户审批信息
export const updateApplyAction = createAsyncThunk('checks/updateApplyAction',async(payload:putApply)=>{
                    const ret = await http.put('checks/apply',payload)
                    return ret
})




const applySlice = createSlice({
                        name:'apply',
                        initialState:{
                            // infos:[]
                            applyList:[] as Info,
                            checkList:[] as Info
                        },
                        reducers:{
                            // 更新用戶申請假期信息
                            updateApplyInfo(state,action:PayloadAction<Info>){
                                // console.log(action.payload,'action.payload')
                                        state.applyList = action.payload
                            },
                            // 更新主管需要批核的信息
                            updateCheckInfo(state,action:PayloadAction<Info>){
                                 state.checkList=action.payload
                            }
                        }
})

export const {updateApplyInfo,updateCheckInfo} = applySlice.actions
export default applySlice.reducer