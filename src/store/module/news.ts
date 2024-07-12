import http from "../../utils/http";
import { createSlice,PayloadAction ,createAsyncThunk} from "@reduxjs/toolkit";


// 後端返回的數據類型
export type Info = {
    [index:string]:unknown
}

// 用戶狀態的數據類型
export type newsState = {
    infos:Info
}

type Userid = {
    userid:string
}

// 添加用戶審批信息的數據類型
type applyInfo = {
    [index:string]:unknown
}
// 更新用戶信息的數據類型
type putMsg =     {
   userid:string,
   applicant?:boolean,
   approver?:boolean
}

// 獲取用戶消息提醒
export const getMsgAction = createAsyncThunk('news/getMsgAction',async(payload:Userid)=>{
                    const ret = await http.get('news/remind',payload)  
                    return ret
})


// 更新用户消息提醒
export const updateMsgAction = createAsyncThunk('news/updateMsgAction',async(payload:putMsg)=>{
                    const ret = await http.put('news/remind',payload)
                    return ret
})




const newsSlice = createSlice({
                        name:'news',
                        initialState:{
                            infos:{}
                        }as newsState,
                        reducers:{
                            // 更新用戶審批信息
                            updateMsgInfo(state,action:PayloadAction<Info>){
                                        state.infos = action.payload
                            }
                        }
})

export const {updateMsgInfo} = newsSlice.actions
export default newsSlice.reducer