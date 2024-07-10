import http from "../../utils/http";
import { createSlice,PayloadAction ,createAsyncThunk} from "@reduxjs/toolkit";


type Token = string
// 後端返回的數據類型
export type Info = {
    [index:string]:unknown
}

// 用戶狀態的數據類型
export type SignsState = {
    infos:Info
}

type Time = {
    userid:string
}

// 獲取用戶打卡信息的函數
export const getTimeAction = createAsyncThunk('signs/getTimeAction',async(payload:Time)=>{
         const ret = await http.get('/signs/time',payload)
         return ret
})

// 更新用戶打卡信息的函數
export const putTimeAction = createAsyncThunk('signs/putTimeAction',async(payload:Time)=>{
    const ret = await http.put('/signs/time',payload)
    return ret
})


const signsSlice = createSlice({
    name:'signs',
    initialState:{
        infos:{},
    } as SignsState,
    reducers:{
        updateInfo(state,action:PayloadAction<Info>){
                    state.infos = action.payload
        }
    }
})

export const {updateInfo}=signsSlice.actions

export default signsSlice.reducer

