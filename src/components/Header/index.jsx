import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { Modal,message } from 'antd'

import { formateDate } from '../../utils/dataUtils'
import memoryUtils from '../../utils/memoryUtils'
import { reqWeather } from '../../api'
import menuList from '../../config/menuConfig'
import storageUtils from '../../utils/storageUtils'
import LinkButton from '../LinkButton'
import './index.less'

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
    getTitle = () => {
        const path = this.props.location.pathname
        let title
        menuList.forEach(item => {
            if (item.key === path) {
                title = item.title
            } else if (item.children) {
                const cItem = item.children.find(cItem => path.indexOf(cItem.key === 0))
                if (cItem) {
                    title = cItem.title
                }
            }
        })
        return title
    }
    logOut = () => {
        confirm({
            content: '确定退出登录吗?',
            onOk: () => {
                storageUtils.removeUser()
                memoryUtils.user = {}
                this.props.history.replace('/login')
            },
        })
    }
    componentWillUnmount() {
        clearInterval(this.intervalId)
    }
    render() {
        const { currentTime, weather } = this.state
        const title = this.getTitle()
        return (
            <div className='header'>
                <div className="header-top">
                    <span>欢迎，{memoryUtils.user.username}</span>
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

export default withRouter(Header)
