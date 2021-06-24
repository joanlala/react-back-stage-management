import React, { Component } from 'react'
import { Redirect,Switch,Route } from 'react-router-dom'
import { Layout } from 'antd'
import {connect} from 'react-redux'

import LeftNav from '../../components/LeftNav'
import Header from '../../components/Header'
import Home from '../Home'
import Category from '../Category'
import Product from '../Product'
import User from '../User'
import Role from '../Role'
import Bar from '../Charts/Bar'
import Line from '../Charts/Line'
import Pie from '../Charts/Pie'
import NotFound from '../NotFound'

const { Footer, Sider, Content } = Layout

class Admin extends Component {
    render() {
        const user = this.props.user
        if (!user || !user._id) {
            return <Redirect to='/login' />
        }
        return (
            <Layout style={{minHeight:'100%'}}>
                <Sider>
                    <LeftNav />
                </Sider>
                <Layout>
                    <Header/>
                    <Content style={{margin:20,backgroundColor:'white'}}>
                        <Switch>
                            <Redirect exact from='/' to='/home'/>
                            <Route path='/home' component={Home}/>
                            <Route path='/category' component={Category}/>
                            <Route path='/product' component={Product}/>
                            <Route path='/user' component={User}/>
                            <Route path='/role' component={Role}/>
                            <Route path='/charts/bar' component={Bar}/>
                            <Route path='/charts/line' component={Line}/>
                            <Route path='/charts/pie' component={Pie}/>
                            <Route component={NotFound}/>
                        </Switch>
                    </Content>
                    <Footer style={{textAlign:'center',color:'#bcb'}}>推荐使用谷歌浏览器，可以获得更佳页面操作体验</Footer>
                </Layout>
            </Layout>
        )
    }
}

export default connect(
    state=>({user:state.user})
)(Admin)