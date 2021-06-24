import { reqLogin } from '../api'
import storageUtils from '../utils/storageUtils'
import {SET_HEAD_TITLE,SAVE_USER,SHOW_ERROR_MSG,RESET_USER} from './constants'

export const setHeadTitle=(headTitle)=>({type:SET_HEAD_TITLE,data:headTitle})

/* 登录的异步 action */
export const login=(username,password)=>{
    return async dispatch=>{
        const result=await reqLogin(username,password)
        if(result.status===0){
            const user=result.data
            storageUtils.saveUser(user) 
            dispatch(saveUser(user))
        }else { 
            const msg = result.msg 
            dispatch(showErrorMsg(msg))
        }
    }
}

/*保存用户信息的同步 action */ 
export const saveUser = (user) => ({type: SAVE_USER, data:user}) 
/*显示错误信息的同步 action */ 
export const showErrorMsg = (errorMsg) => ({type: SHOW_ERROR_MSG, data:errorMsg})

/*退出登陆的同步 action */
export const logout=()=>{
    storageUtils.removeUser()
    return {type:RESET_USER,data:{}}
}
