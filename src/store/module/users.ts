import http from "../../utils/http";
import { createSlice,PayloadAction ,createAsyncThunk} from "@reduxjs/toolkit";


type Token = string
export type Info = {
    [index:string]:unknown
}

export type userInfo = {
    token:Token
    infos:Info
}

type logIn = {
    email:string,
    pass:string
}

// 進行用戶登錄的函數
export const loginAction = createAsyncThunk('users/loginAction',async(payload:logIn)=>{
         const ret = await http.post('/users/login',payload)
         return ret
})

// 獲取用戶信息的函數？
export const infosAction = createAsyncThunk('users/infosAction',async()=>{
    const ret = await http.get('/users/infos')
    return ret
})


const userSlice = createSlice({
    name:'user',
    initialState:{
        token:'',
        infos:{},
    } as userInfo,
    reducers:{
        updateToken(state,action:PayloadAction<Token>){
                    state.token=action.payload
        },
        updateInfo(state,action:PayloadAction<Info>){
                    state.infos = action.payload
        },
        clearToken(state){
               state.token=''
        }
    }
})

export const {updateToken,updateInfo,clearToken}=userSlice.actions

export default userSlice.reducer

