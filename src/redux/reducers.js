import {combineReducers} from 'redux'

import storageUtils from '../utils/storageUtils'
import {SET_HEAD_TITLE,SAVE_USER,SHOW_ERROR_MSG, RESET_USER} from './constants'
const initTitle='首页'
function headTitle(preState=initTitle,action){
    const {type,data}=action
    switch (type) {
        case SET_HEAD_TITLE:
            return data
        default:
            return preState
    }
}

const initUser=storageUtils.getUser()||{}
function user(preState=initUser,action){
    const {type,data}=action
    switch (type) {
        case SAVE_USER:
            return data
        case RESET_USER:
            return data
        case SHOW_ERROR_MSG:
            return {...preState,errorMsg:data}
        default:
            return preState
    }
}

export default combineReducers({
    headTitle,
    user
})