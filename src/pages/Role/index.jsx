import React, { PureComponent } from 'react'
import { Card, Button, Table, Modal, message } from 'antd'
import {connect} from 'react-redux'

import { PAGE_SIZE } from "../../utils/constants"
import { reqRoles, reqAddRole, reqUpdateRole } from '../../api'
import AddForm from './add-form'
import AuthForm from './auth-form'
import { formateDate } from '../../utils/dataUtils'
import {logout} from '../../redux/actions'
/**
 * 角色路由
 */
class Role extends PureComponent {
    state = {
        roles: [], // 所有角色的列表 
        role: {}, // 选中的 role 
        isShowAdd: false, // 是否显示添加界面 
        isShowAuth: false, // 是否显示设置权限界面 
    }

    constructor(props) {
        super(props)
        this.auth = React.createRef()
        this.initColumn()
    }

    initColumn = () => {
        this.columns = [
            {
                title: '角色名称',
                dataIndex: 'name'
            },
            {
                title: '创建时间',
                dataIndex: 'create_time',
                render: (create_time) => formateDate(create_time)
            },
            {
                title: '授权时间',
                dataIndex: 'auth_time',
                render: formateDate
            },
            {
                title: '授权人',
                dataIndex: 'auth_name'
            },
        ]
    }

    //获得所有角色列表
    getRoles = async () => {
        const result = await reqRoles()
        if (result.status === 0) {
            const roles = result.data
            this.setState({ roles })
        }
    }

    onRow = (role) => {
        return {
            onClick: event => { // 点击行 
                //console.log('row onClick()', role)
                this.setState({ role })
            },
        }
    }

    /*添加角色 */
    addRole = () => {
        // 进行表单验证, 只能通过了才向下处理
        this.form && this.form.validateFields()
            .then(async values => {
                // 隐藏确认框 
                this.setState({
                    isShowAdd: false
                })
                // 收集输入数据 
                const { roleName } = values
                this.form && this.form.resetFields()
                // 请求添加 
                if (roleName) {
                    const result = await reqAddRole(roleName)
                    // 根据结果提示/更新列表显示 
                    if (result.status === 0) {
                        message.success('添加角色成功')
                        // 新产生的角色 
                        const role = result.data
                        // 更新 roles 状态: 基于原本状态数据更新 
                        this.setState(state => ({
                            roles: [...state.roles, role]
                        }))
                    } else {
                        message.warn('添加角色失败,请重新添加')

                    }
                } else {
                    message.warn('请输入要添加的角色名')
                    return false
                }
            })
            .catch(info => {
                message.warn('添加角色失败,请重新添加')
            })
        if (!this.form) {
            return false
        }
    }

    /*更新角色 */
    updateRole = async () => {
        // 隐藏确认框 
        this.setState({
            isShowAuth: false
        })
        const role = this.state.role
        // 得到最新的 menus 
        const menus = this.auth.current.getMenus()
        role.menus = menus
        role.auth_time = Date.now()
        role.auth_name = this.props.user.username
        // 请求更新
        const result = await reqUpdateRole(role)
        if (result.status === 0) {
            // 如果更新的角色_id与当前用户角色_id相同 需要强制退出 重新登录来更新left-nav
            //console.log('role._id',role._id) 
            //console.log('memoryUtils.user.role._id',memoryUtils.user.role._id) 
            if (role._id === this.props.user.role._id) {
                // storageUtils.removeUser()
                // memoryUtils.user = {}
                // this.props.history.replace('/login')
                message.success('当前用户修改了权限 需要重新登录')
                this.props.logout()
            } else {
                message.success('设置角色权限成功')
                this.setState({
                    roles: [...this.state.roles]
                })
            }
        }
    }

    componentDidMount() {
        this.getRoles()
    }

    render() {
        //console.log('Role render()')
        const { roles, role, isShowAdd, isShowAuth } = this.state
        const title = (
            <span>
                <Button
                    type='primary'
                    onClick={() => this.setState({ isShowAdd: true })}
                >创建角色</Button>
                &nbsp;&nbsp;
                <Button
                    type='primary'
                    disabled={!role._id}
                    onClick={() => this.setState({ isShowAuth: true })}
                >设置角色权限</Button>
            </span>
        )
        return (
            <Card title={title}>
                <Table
                    bordered
                    rowKey='_id'
                    dataSource={roles}
                    columns={this.columns}
                    pagination={{
                        defaultPageSize: PAGE_SIZE
                    }}
                    rowSelection={{
                        type: 'radio',
                        selectedRowKeys: [role._id],
                        onSelect:(role)=>{
                            this.serState({
                                role
                            })
                        }
                    }}
                    onRow={this.onRow}
                />
                <Modal
                    title="添加角色"
                    visible={isShowAdd}
                    onOk={this.addRole}
                    onCancel={() => {
                        this.setState({ isShowAdd: false })
                        this.form && this.form.resetFields()
                    }}
                >
                    <AddForm setForm={(form) => this.form = form} />
                </Modal>
                {
                    isShowAuth ? <Modal
                        title="设置角色权限"
                        visible={isShowAuth}
                        onOk={this.updateRole}
                        onCancel={() => {
                            this.setState({
                                isShowAuth: false
                            })
                        }}
                    >
                        <AuthForm ref={this.auth} role={role} />
                    </Modal> : null
                }
            </Card>
        )
    }
}

export default connect(
    state=>({
        user:state.user
    }),
    {logout}
)(Role)