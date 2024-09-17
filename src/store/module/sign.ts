import http from "../../utils/http";
import { createSlice,PayloadAction ,createAsyncThunk} from "@reduxjs/toolkit";


type Token = string
// 後端返回的數據類型
export type Info = {
    [index:string]:unknown
}

// 用戶狀態的數據類型
export type SignsState = {
    infos:Info,
    allAttendance:Info
}

type User = {
    userid:string
}
type Time = {
    userid:string;
    year:string;
    month:string
}
type ModifyTime = {
    userid:string;
    year:string;
    month:string;
    day:string;
    activity:string;
    time:string
}

// 獲取用戶打卡信息的函數
export const getTimeAction = createAsyncThunk('signs/getTimeAction',async(payload:User)=>{
        
    const ret = await http.get('/signs/time',payload)
         return ret
})

// 更新用戶打卡信息的函數
export const putTimeAction = createAsyncThunk('signs/putTimeAction',async(payload:User)=>{
    const ret = await http.put('/signs/time',payload)
    return ret
})

// admin獲取所有在職用戶在某年某月的打卡資料
export const getAllAttAction = createAsyncThunk('signs/getAllTimeAction',async(payload:Time)=>{
    const ret = await http.get('/signs/getalltime',payload)
    return ret
})

// admin修改同事打卡資料
export const modifyTime = createAsyncThunk('signs/modifyTimeAction',async(payload:ModifyTime)=>{
    const ret = await http.put('/signs/modifytime',payload)
    return ret
})



const signsSlice = createSlice({
    name:'signs',
    initialState:{
        infos:{},
        allAttendance:{}
    } as SignsState,
    reducers:{
        updateInfo(state,action:PayloadAction<Info>){
                    state.infos = action.payload
        },
        updateAttendance(state,action:PayloadAction<Info>){
                     
                    state.allAttendance = action.payload
        }
    }
})

export const {updateInfo,updateAttendance}=signsSlice.actions

export default signsSlice.reducer

