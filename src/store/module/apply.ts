import http from "../../utils/http";
import { createSlice,PayloadAction ,createAsyncThunk} from "@reduxjs/toolkit";


// 後端返回的數據類型
export type Info = Array<{
    [index:string]:unknown
}>

// 用戶狀態的數據類型
export type ApplysState = {
    infos:Info
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
   state:'已通過'|'未通過'
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
                        name:'checks',
                        initialState:{
                            infos:[]
                        }as ApplysState,
                        reducers:{
                            // 更新用戶審批信息
                            updateApplyInfo(state,action:PayloadAction<Info>){
                                        state.infos = action.payload
                            }
                        }
})

export const {updateApplyInfo} = applySlice.actions
export default applySlice.reducer