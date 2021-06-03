import React, { Component } from 'react'
import { Link, withRouter } from 'react-router-dom'
import { Menu } from 'antd'

import menuList from '../../config/menuConfig'
import './index.less'
import logo from '../../assets/images/logo.png'
import memoryUtils from '../../utils/memoryUtils'

const { SubMenu } = Menu;
class LeftNav extends Component {
    // getMenuNodes_map = (menuList) => {
    //     return menuList.map(item => {
    //         if (!item.children) {
    //             return (
    //                 <Menu.Item
    //                     key={item.key}
    //                     icon={item.icon}
    //                 >
    //                     <Link to={item.key} >
    //                         {item.title}
    //                     </Link>
    //                 </Menu.Item>
    //             )
    //         } else {
    //             return (
    //                  <SubMenu
    //                      key={item.key}
    //                      icon={item.icon}
    //                      title={item.title}
    //                  >
    //                      {this.getMenuNodes(item.children)}
    //                  </SubMenu>
    //             )
    //         }
    //     })
    // }
    getMenuNodes = (menuList) => {
        const path = this.props.location.pathname
        return menuList.reduce((pre, item) => {
            // 判断当前登录用户是否拥有该left-nav项的权限
            if (this.hasAuth(item)) {
                if (!item.children) {
                    pre.push((<Menu.Item
                        key={item.key}
                        icon={item.icon}
                    >
                        <Link to={item.key} >
                            {item.title}
                        </Link>
                    </Menu.Item>
                    ))
                } else {
                    // 如果当前请求路由与当前菜单的某个子菜单的 key 匹配, 将菜单的 key 保存为 openKey 
                    if (item.children.find(cItem => path.indexOf(cItem.key) === 0)) {
                        this.openKey = item.key
                    }
                    pre.push((
                        <SubMenu
                            key={item.key}
                            icon={item.icon}
                            title={item.title}
                        >
                            {this.getMenuNodes(item.children)}
                        </SubMenu>
                    ))
                }
            }
            return pre
        }, [])
    }

    /*判断当前用户是否有看到当前 item 对应菜单项的权限 */ 
    hasAuth = (item) => { 
        const key = item.key 
        const menuSet = memoryUtils.user.role.menus 
        /*
        1. 如果菜单项标识为公开 
        2. 如果当前用户是 admin 
        3. 如果菜单项的 key 在用户的 menus 中
        */ 
       if(item.isPublic || memoryUtils.user.username==='admin' || menuSet.indexOf(key)!==-1) { 
           return true  
        } else if(item.children){ // 4. 如果有子节点, 需要判断有没有一个 child 的 key 在 menus 中
            return !!item.children.find(child => menuSet.indexOf(child.key)!==-1) 
        } 
    }
    render() {

        const menuNodes = this.getMenuNodes(menuList)
        // 获得当前请求的路由路径
        let path = this.props.location.pathname
        if (path.indexOf('/product') === 0) {
            path = '/product'
        }
        const openKey = this.openKey
        return (
            <div className='left-nav'>
                <Link to='/home' className='left-nav-header' >
                    <img src={logo} alt="logo" />
                    <h1>后台管理</h1>
                </Link>
                <Menu
                    mode="inline"
                    theme="dark"
                    selectedKeys={[path]}
                    defaultOpenKeys={[openKey]}
                >
                    {menuNodes}
                </Menu>
            </div>
        )
    }
}

export default withRouter(LeftNav)