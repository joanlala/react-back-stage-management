import React, { Component } from 'react'
import {Redirect} from 'react-router-dom'
import {
    Form,
    Input,
    Button,
    message
} from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons'

import './login.less'
import logo from '../../assets/images/logo.png'
import { reqLogin } from '../../api'
import memoryUtils from '../../utils/memoryUtils'
import storageUtils from '../../utils/storageUtils'

export default class Login extends Component {

    onFinish = async (values) => {
        // 请求登录
        const { username, password } = values
        const result = await reqLogin(username, password)
        // console.log("login()",result);
        if (result.status === 0) {
            message.success('登录成功', 2)
            memoryUtils.user = result.data  //保存于内存中
            storageUtils.saveUser(result.data)//保存于local中

            this.props.history.replace('/')//跳转到管理界面
        } else {//result.status===1 
            message.error(result.msg)//用户账号或密码错误
        }
    }

    render() {
        // 判断用户是否登录
        const user=memoryUtils.user
        if(user&&user._id){
            return <Redirect to='/'/>
        }

        return (
            <div className="login">
                <header className="login-header">
                    <img src={logo} alt="logo" />
                    <h1>react:后台管理项目</h1>
                </header>
                <section className="login-content">
                    <h2>用户登录</h2>
                    <Form onFinish={this.onFinish} className="login-form">
                        <Form.Item
                            name="username"
                            rules={[
                                { required: true, message: '用户名必须输入' },
                                { min: 4, message: '用户名最少4位' },
                                { max: 12, message: '用户名最多12位' },
                                { pattern: /^[a-zA-Z0-9_]+$/, message: '用户名必须是由英文字母、数字或下划线组成' }
                            ]}
                        >
                            <Input
                                prefix={<UserOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
                                placeholder="用户名" />
                        </Form.Item>
                        <Form.Item
                            // 标识名
                            name="password"
                            rules={[
                                { required: true, message: '密码必须输入' },
                                { min: 4, message: '密码最少4位' },
                                { max: 12, message: '密码最多12位' },
                                { pattern: /^[a-zA-Z0-9_]+$/, message: '密码必须是由英文字母、数字或下划线组成' }
                            ]}
                        >
                            <Input
                                prefix={<LockOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
                                type="password"
                                placeholder="密码 "
                            />
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit" className="login-form-button">登录</Button>
                        </Form.Item>
                    </Form>
                </section>
            </div >
        )
    }
}


