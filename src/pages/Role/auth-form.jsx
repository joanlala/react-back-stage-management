import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Tree } from 'antd'
import menuList from '../../config/menuConfig'

const Item = Form.Item

const _menuList = [{
    title: '平台权限',
    key: 'all',
    children: [...menuList]
}]

export default class AuthForm extends PureComponent {
    static propTypes = { role: PropTypes.object }

    constructor(props) {
        super(props)
        // 根据传入角色的 menus 生成初始状态 
        const { menus } = this.props.role
        this.state = {
            checkedKeys: menus
        }
        this.treeData = this.getTreeData(_menuList)

    }

    /*为父组件提交获取最新 menus 数据的方法 */
    getMenus = () => this.state.checkedKeys

    getTreeData = (menuList) => {
        return menuList.reduce((pre, item) => {
            if (!item.isPublic) {
                pre.push({
                    title: item.title,
                    key: item.key,
                    children: (item.children ? this.getTreeData(item.children) : null)
                })
            }
            return pre
        }, [])
    }
    // 选中某个 node 时的回调 
    onCheck = checkedKeys => {
        //console.log('onCheck', checkedKeys);
        this.setState({ checkedKeys });
    };

    // 根据新传入的 role 来更新 checkedKeys 状态 
    /*当组件接收到新的属性时自动调用 初始渲染不会调用 只有在更新时且在render之前调用 */
    // componentWillReceiveProps(nextProps) {
    //     console.log('componentWillReceiveProps()', nextProps)
    //     const menus = nextProps.role.menus
    //     this.setState({ checkedKeys: menus })
    // }

    render() {

        const { role } = this.props
        const { checkedKeys } = this.state
        // 指定 Item 布局的配置对象 
        const formItemLayout = {
            labelCol: { span: 4 }, // 左侧 label 的宽度 
            wrapperCol: { span: 15 }, // 右侧包裹的宽度 
        }
        return (
            <div>
                <Item
                    label='角色名称'
                    {...formItemLayout}>
                    <Input value={role.name} disabled />
                </Item>
                <Tree
                    checkable
                    defaultExpandAll={true} //默认展开所有节点
                    checkedKeys={checkedKeys}//checkedKeys所有选中的key
                    onCheck={this.onCheck}//用于更新state值（checkedKeys）
                    treeData={this.treeData}
                >
                </Tree>
            </div>
        )
    }
}