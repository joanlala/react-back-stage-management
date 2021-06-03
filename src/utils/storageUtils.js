//进行local数据存储管理的工具模块
import store from 'store'

const USER_KEY='user_key'
const storageUtils={
    // save user
    saveUser(user){
        store.set(USER_KEY,user)
    },

    //get user
    getUser(){
        return store.get(USER_KEY)
    },

    //remove user
    removeUser(){
        store.remove(USER_KEY)
    }
}

export default storageUtils