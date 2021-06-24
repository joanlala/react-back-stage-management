import React, { Component } from 'react'
import {Redirect} from 'react-router-dom'
import {
    Form,
    Input,
    Button
} from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import {connect} from 'react-redux'

import './login.less'
import logo from '../../assets/images/logo.png'
import {login,showErrorMsg} from '../../redux/actions'

class Login extends Component {

    onFinish = (values) => {
        // 请求登录
        const { username, password } = values
        this.props.login(username,password)
    }

    render() {
        // 判断用户是否登录
        const user=this.props.user
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
                <div className={user.errorMsg ? 'error-msg show' : 'error-msg'}>{user.errorMsg}</div>
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

export default connect(
    state=>({
        user:state.user
    }),
    {
        login,
        showErrorMsg
    }
)(Login)

