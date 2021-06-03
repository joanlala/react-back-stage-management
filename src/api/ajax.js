import axios from 'axios'
import { message } from 'antd'

export default function ajax(url, data = {}, method = 'GET') {
    return new Promise((resolve, reject) => {
        //执行异步 ajax 请求
        let promise
        if (method === 'GET') {
            promise = axios.get(url, { params: data })
        } else {
            promise = axios.post(url, data)
        }

        promise.then(response => {
            resolve(response.data)//发送 ajax 请求成功 返回成功的数据
        }).catch(error => {
            message.error('请求错误：' + error.message)//统一处理请求对像 ： 在axios外面统一包裹一个promise对象
        })
    })
}