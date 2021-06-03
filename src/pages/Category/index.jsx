import React, { Component } from 'react'
import { Card, Button, Table, message, Modal } from 'antd'
import {
    PlusOutlined,
    ArrowRightOutlined,
} from '@ant-design/icons'

import LinkButton from '../../components/LinkButton'
import { reqCategorys, reqAddCategory, reqUpdateCategory } from '../../api'
import AddForm from './add-form'
import UpdateForm from './update-form'

/**
 * 商品分类
 */
export default class Category extends Component {
    constructor(props) {
        super(props)
        this.state = {
            categorys: [], // 一级分类列表 
            subCategorys: [], // 二级分类列表 
            parentId: '0', // 父分类的 ID 
            parentName: '', // 父分类的名称 
            loading: false, // 标识是否正在加载中 
            showStatus: 0, // 是否显示对话框 0: 都不显示, 1: 显示添加, 2: 显示更新 
        }
        this.initColumns()
    }

    initColumns = () => {
        this.columns = [
            {
                title: '分类的名称',
                dataIndex: 'name',
                key: 'name'
            },
            {
                title: '操作',
                width: '300px',
                key: 'option',
                render: (category) => (
                    <span>
                        <LinkButton onClick={() => this.showUpdate(category)}>修改分类</LinkButton>
                        &nbsp;&nbsp;&nbsp;
                        {this.state.parentId === '0' ? <LinkButton onClick={() => this.showSubCategorys(category)}>查看子分类</LinkButton> : null}
                    </span>
                )
            },
        ];
    }

    /*根据 parentId 异步获取分类列表显示 */
    getCategorys = async (parentId) => {
        // 在request前，显示loading
        this.setState({ loading: true })
        // 优先使用指定的 parentId, 如果没有指定使用状态中的 parentId
        parentId = parentId || this.state.parentId
        // 发送异步请求，获取数据
        const result = await reqCategorys(parentId)

        // 在请求完成后，隐藏loading
        this.setState({ loading: false })
        if (result.status === 0) {
            const categorys = result.data
            if (parentId === '0') {
                // 更新一级分类列表
                this.setState({ categorys })
            }
            else {
                // 更新二级分类列表 
                this.setState({ subCategorys: categorys })
            }
        } else {
            message.error('获取分类列表失败')
        }
    }

    /*显示指定分类的子分类列表 */
    showSubCategorys = (category) => {
        // 更新状态: state 中的数据是异步更新(不会立即更新 state 中的数据) 
        this.setState(
            {
                parentId: category._id,
                parentName: category.name
            },
            () => {
                // 在状态更新之后执行, 在回调函数中能得到最新的状态数据 
                this.getCategorys()
            })
    }

    /*显示一级列表 */
    showCategorys = () => {
        this.setState({
            parentId: '0',
            parentName: '',
            subCategorys: [],
            showStatus: 0,
        })
    }

    /*添加分类 */
    addCategory =() => {
        if(this.form!==undefined){
            this.form.validateFields()
            .then(async (values) => {
                const { parentId, categoryName } = values
                // 关闭对话框 
                this.setState({ showStatus: 0 })
                // 重置表单 
                this.form.resetFields()
                // 异步请求添加分类 
                const result = await reqAddCategory(parentId, categoryName)
                if (result.status === 0) {
                    /*添加一级分类 在当前分类列表下添加 */
                    if (parentId === this.state.parentId) {
                        this.getCategorys()
                    } else if (parentId === '0') {
                        this.getCategorys(parentId)
                    }
                }
            })
            .catch((info) => {
                console.log('Validate Failed:', info);
            });
        }else{
            message.warn('必须输入分类名称或点击取消')
        }
    }

    /*更新分类 */
    updateCategory = () => {
        if(this.form!==undefined){
            this.form.validateFields()
            .then(async (values) => {
                const categoryId = this.category._id
                const { categoryName } = values
                // 重置表单 
                this.form.resetFields()
                // 异步请求更新分类 
                const result = await reqUpdateCategory({ categoryId, categoryName })
                if (result.status === 0) {
                    // 重新获取列表 
                    this.getCategorys()
                }
                //关闭对话框 
                this.setState({ showStatus: 0 })
            })
            .catch((info) => {
                console.log('Validate Failed:', info);
            });
        }else{
            message.warn('必须输入不同的分类名称或点击取消')
        }
    }

    /*显示添加的对话框*/
    showAdd = () => {
        this.setState({ showStatus: 1 })
    }
    /*显示修改的对话框 */
    showUpdate = (category) => {
        // 保存 category 
        this.category = category
        // 更新状态 
        this.setState({ showStatus: 2 })
    }

    componentDidMount() {
        this.getCategorys()
    }

    render() {
        // 读取状态
        const { categorys, subCategorys, parentId, parentName, loading, showStatus } = this.state

        // 从组件对象中数据 
        const category = this.category || {}

        const title = parentId === '0' ? '一级分类列表' : (
            <span>
                <LinkButton onClick={this.showCategorys}>一级分类列表</LinkButton>
                <ArrowRightOutlined style={{ marginRight: '5px' }}/>
                <span >{parentName}</span>
            </span>
        )
        const extra = (
            <Button type='primary' icon={<PlusOutlined />} onClick={this.showAdd} >
                添加
            </Button>
        )


        return (
            <Card title={title} extra={extra} >
                <Table
                    dataSource={parentId === '0' ? categorys : subCategorys}
                    bordered
                    loading={loading}
                    columns={this.columns}
                    rowKey='_id'
                    pagination={{ defaultPageSize: 5, showQuickJumper: true }}
                />
                {
                    showStatus === 1 ? <Modal
                        title="添加分类"
                        visible={true}
                        onOk={this.addCategory}
                        onCancel={
                            () => this.setState({ showStatus: 0 })
                        }
                    >
                        <AddForm
                            categorys={categorys}
                            parentId={parentId}
                            setForm={form => { this.form = form }}
                        />
                    </Modal> : null
                }
                {
                    showStatus === 2 ? <Modal
                        title="修改分类"
                        visible={true}
                        onOk={this.updateCategory}
                        onCancel={() => {
                            this.setState({ showStatus: 0 })
                            this.form&&this.form.resetFields();
                        }}
                    >
                        <UpdateForm
                            categoryName={category.name}
                            setForm={form => { this.form = form }}
                        />
                    </Modal> : null
                }
            </Card>
        )
    }
}
