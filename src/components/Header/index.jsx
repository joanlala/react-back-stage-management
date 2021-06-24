import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { Modal,message } from 'antd'
import {connect} from 'react-redux'

import { formateDate } from '../../utils/dataUtils'
import { reqWeather } from '../../api'
import LinkButton from '../LinkButton'
import './index.less'
import {logout} from '../../redux/actions'

const { confirm } = Modal
class Header extends Component {
    state = {
        currentTime: formateDate(Date.now()),
        weather: ''
    }

    getTime = () => {
        this.intervalId = setInterval(() => {
            const currentTime = formateDate(Date.now())
            this.setState({ currentTime })
        }, 1000);
    }

    getWeather = async () => {
        try {
            const data = await reqWeather()
            this.setState({ weather: data.lives[0].weather })
        } catch (error) {
            message.error('获取天气信息失败')
        }
    }

    componentDidMount() {
        this.getTime()
        this.getWeather()
    }
    // getTitle = () => {
    //     const path = this.props.location.pathname
    //     let title
    //     menuList.forEach(item => {
    //         if (item.key === path) {
    //             title = item.title
    //         } else if (item.children) {
    //             const cItem = item.children.find(cItem => path.indexOf(cItem.key === 0))
    //             if (cItem) {
    //                 title = cItem.title
    //             }
    //         }
    //     })
    //     return title
    // }
    logOut = () => {
        confirm({
            content: '确定退出登录吗?',
            onOk: () => {
                this.props.logout()
                //this.props.history.replace('/login')
            },
        })
    }
    componentWillUnmount() {
        clearInterval(this.intervalId)
    }
    render() {
        const { currentTime, weather } = this.state
        // const title = this.getTitle()
        const title=this.props.headTitle
        return (
            <div className='header'>
                <div className="header-top">
                    <span>欢迎，{this.props.user.username}</span>
                    <LinkButton onClick={this.logOut}>退出</LinkButton>
                </div>
                <div className="header-bottom">
                    <div className="header-bottom-left">
                        {title}
                    </div>
                    <div className="header-bottom-right">
                        <span>{currentTime}</span>
                        {/* <img src="{dayPictureUrl}" alt="weather"/> */}
                        <span className="header-bottom-weather">{weather}</span>
                    </div>
                </div>
            </div>
        )
    }
}

export default connect(
    state=>({
        headTitle:state.headTitle,
        user:state.user
    }),
    {logout}
)(withRouter(Header))
