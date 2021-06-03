import React, { Component } from 'react'
import { Card, Table, Input, Select, Button, message } from 'antd'
import { PlusOutlined } from '@ant-design/icons'

import LinkButton from '../../components/LinkButton'
import { reqProducts, reqSearchProducts, reqUpdateProductStatus } from '../../api'
import { PAGE_SIZE } from '../../utils/constants'

const Option = Select.Option

export default class ProductHome extends Component {
    state = {
        total: 0, // 商品的总数量 
        products: [], // 当前页列表数据 
        searchType: 'productName', // 搜索类型 productName / productDesc 
        searchName: '', // 搜索关键字 
    }
    /*更新指定产品的状态 */
    updateProductStatus = async (productId, status) => {
        const result = await reqUpdateProductStatus(productId, status)
        if (result.status === 0) {
            message.success('更新状态成功!')
            this.getProducts(this.pageNum || 1)
        }
    }
    /*初始化生成 Tabe 所有列的数组 */
    initColumns = () => {
        this.columns = [
            {
                title: '商品名称',
                dataIndex: 'name'
            },
            {
                title: '商品描述',
                dataIndex: 'desc'
            },
            {
                title: '价格',
                dataIndex: 'price',
                render: (price) => <span>¥{price}</span>
            },
            {
                title: '状态',
                width: 100,
                dataIndex: 'status',
                render: (status, product) => {
                    // 1: 在售, 2: 已下架 
                    let btnText = '下架'
                    let statusText = '在售'
                    if (status === 2) {
                        btnText = '上架'
                        statusText = '已下架'
                    }
                    status = status === 1 ? 2 : 1
                    return (
                        <span>
                            <Button
                                type='primary'
                                onClick={() => this.updateProductStatus(product._id, status)}
                            >
                                {btnText}
                            </Button>
                            <span>{statusText}</span>
                        </span>
                    )
                }
            },
            {
                title: '操作',
                width: 100,
                render: (product) => (
                    <span>
                        <LinkButton onClick={() => this.props.history.push('/product/detail', product)}>详情</LinkButton> &nbsp;&nbsp;&nbsp;
                        <LinkButton onClick={() => this.props.history.push('/product/addupdate', product)}>修改</LinkButton>
                    </span>
                )
            }
        ]
    }

    /*异步获取指定页的数据 */
    getProducts = async (pageNum) => {
        this.pageNum = pageNum//保存当前显示页的页数
        const { searchType, searchName } = this.state
        let result
        if (searchName) {
            // 搜索分页 
            result = await reqSearchProducts({ pageNum, pageSize: PAGE_SIZE, searchType, searchName })
        } else {
            // 一般分页 
            result = await reqProducts(pageNum, PAGE_SIZE)
        }
        //console.log('getProducts()', result)
        if (result.status === 0) {
            const { total, list } = result.data
            this.setState({ total, products: list })

        }
    }

    componentDidMount() {
        this.initColumns()
        this.getProducts(1)
    }

    render() {
        const { products, total, searchType } = this.state
        const title = (
            <span>
                <Select value={searchType} onChange={value => this.setState({ searchType: value })}>
                    <Option key='productName' value='productName'>按名称搜索</Option>
                    <Option key='productDesc' value='productDesc'>按描述搜索</Option>
                </Select>
                <Input
                    style={{ width: 150, marginLeft: 10, marginRight: 10 }}
                    placeholder=' 关键字'
                    onChange={(e) => this.setState({ searchName: e.target.value })}
                />
                <Button type='primary' onClick={() => this.getProducts(1)}>搜索</Button>
            </span>
        )
        const extra = (
            <Button
                type='primary'
                style={{ float: 'right' }}
                icon={<PlusOutlined />}
                onClick={() => this.props.history.push('/product/addupdate')}
            > 添加商品 </Button>
        )
        return (
            <Card title={title} extra={extra}>
                <Table
                    bordered
                    rowKey='_id'
                    columns={this.columns}
                    dataSource={products}
                    pagination={{//分页器
                        current:this.pageNum,
                        defaultPageSize: PAGE_SIZE,
                        total,
                        showQuickJumper: true,
                        onChange: this.getProducts
                    }}
                />
            </Card>
        )
    }
}
