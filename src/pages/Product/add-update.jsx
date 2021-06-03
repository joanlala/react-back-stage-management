import React, { Component } from 'react'
import { Card, Form, Input, Button, Cascader,message } from 'antd'
import { ArrowLeftOutlined } from '@ant-design/icons'

import LinkButton from '../../components/LinkButton'
import { reqCategorys ,reqAddOrUpdateProduct} from '../../api'
import PicturesWall from './pictures-wall'
import RichTextEditor from './rich-text-editor'
const { Item } = Form
const { TextArea } = Input
/*商品添加/更新的路由组件 */
class ProductAddUpdate extends Component {
    state = {
        options: [], // 用来显示级联列表的数组 
    }
    constructor(props) {
        super(props);
        this.picturewall = React.createRef();
        this.editor = React.createRef();
        // 取出跳转传入的数据 
        const product = this.props.location.state
        this.product = product || {}
        this.isUpdate = !!product // !!xxx 将一个数据强制转换成布尔类型
    }
    /*选择某个分类项时的回调 加载对应的二级分类显示 */
    loadData = async (selectedOptions) => {

        const targetOption = selectedOptions[selectedOptions.length - 1]

        targetOption.loading = true // 显示 loading
        // 异步请求获取对应的二级分类列表 
        const subCategorys = await this.getCategorys(targetOption.value) // await 的作用: 保证完成执行完保存的分类数组才进入后面的语句
        targetOption.loading = false // 隐藏 loading 
        if (subCategorys && subCategorys.length > 0) {
            // 有子分类 
            // 生成一个二级的 options 
            const cOptions = subCategorys.map(c => ({
                value: c._id,
                label: c.name,
                isLeaf: true,
            }))
            // 添加为对应的 option 的 children(子 options)
            targetOption.children = cOptions
        } else {
            // 没有子分类 
            targetOption.isLeaf = true
        }
        // 更新 options 状态 
        this.setState({
            options: [...this.state.options],
        });
    }

    onFinish = async(values) => {
        // 收集产品相关信息 
        const { name, desc, price, categoryIds } = values
        // 在父组件中得到子组件对象, 调用子组件对象的方法 
        const imgs = this.picturewall.current.getImgs()
        const detail = this.editor.current.getDetail()
        let pCategoryId = ''
        let categoryId = ''
        if (categoryIds.length === 1) {
            // 选择的是一级分类 
            pCategoryId = '0'
            categoryId = categoryIds[0]
        } else {
            // 选择的是二级分类 
            pCategoryId = categoryIds[0]
            categoryId = categoryIds[1]
        }
        // 封装成对象 
        const product = { name, desc, price, pCategoryId, categoryId, detail, imgs }
        // 如果是更新, 指定 product 的_id 属性值 
        if (this.isUpdate) {
            product._id = this.product._id
        }
        // 请求保存 
        const result = await reqAddOrUpdateProduct(product)
        if (result.status === 0) {
            message.success('保存商品成功')
            this.props.history.goBack()
        } else {
            message.success('保存商品失败')
        }
    }

    validatePrice = (rule, value, callback) => {
        value = value * 1
        if (value > 0) {
            return Promise.resolve();
        } else {
            return Promise.reject("价格必须是大于 0 的数值");
        }
    }
    /*获取指定分类 id 的子分类列表 如果 parentId 为 0 时获取一级列表 */
    getCategorys = async (parentId) => {
        const result = await reqCategorys(parentId)
        if (result.status === 0) {
            const categorys = result.data
            if (parentId === '0') {
                // 根据一级分类数组初始化生成 options 数组
                this.initOptions(categorys)
            } else {
                // 当前得到是二级分类列表 
                // 返回二级分类列表(作为 async 函数的 promise 对象的成功的 value 值) 
                return categorys
            }
        }
    }
    /*生成级联的一级列表 */
    initOptions = async (categorys) => {
        // 根据一级分类数组生成 option 的数组 
        const options = categorys.map(c => ({
            value: c._id,
            label: c.name,
            isLeaf: false,
        }))
        // 如果当前是更新, 且商品是一个二级分类的商品 
        const { product, isUpdate } = this
        if (isUpdate && product.pCategoryId !== '0') {
            // 异步获取 product.pCategoryId 的二级分类列表 
            const subCategorys = await this.getCategorys(product.pCategoryId)
            if (subCategorys && subCategorys.length > 0) {
                // 生成二级的 下拉列表的option 数组 
                const cOptions = subCategorys.map(c => ({
                    value: c._id,
                    label: c.name,
                    isLeaf: true,
                }))
                // 找到当前商品对应的 一级option 
                const targetOption = options.find(option => option.value === product.pCategoryId)
                // 将 cOptions 添加为对应的一级 option 的 children 
                targetOption.children = cOptions
            }
        }
        // 更新状态 
        this.setState({ options })
    }

    componentDidMount() {
        // 异步获取一级分类列表 
        this.getCategorys('0')
    }

    render() {

        const { product, isUpdate } = this
        const { options } = this.state
        const { pCategoryId, categoryId } = product
        // 用于接收级联分类ID的数组 
        const categoryIds = []
        if (isUpdate) {
            if (pCategoryId === '0') {
                categoryIds.push(categoryId)
            } else {
                categoryIds.push(pCategoryId)
                categoryIds.push(categoryId)
            }
        }

        const title = (
            <span>
                <LinkButton onClick={() => this.props.history.goBack()}>
                    <ArrowLeftOutlined style={{ fontSize: 20 }} />
                </LinkButton>
                {isUpdate ? '修改商品' : '添加商品'}
            </span>
        )
        // 指定 form 的 item 布局的对象 
        const formItemLayout = {
            labelCol: { span: 2 },
            wrapperCol: { span: 8 }
        }

        return (
            <Card title={title}>
                <Form  {...formItemLayout} onFinish={this.onFinish}>
                    <Item
                        label="商品名称"
                        rules={[{ required: true, message: '商品名称必须输入' }]}
                        name='name'
                        initialValue={product.name}
                    >
                        <Input placeholder='请输入商品名称' />
                    </Item>
                    <Item
                        label="商品描述"
                        name='desc'
                        rules={[{ required: true, message: '商品描述必须输入' }]}
                        initialValue={product.desc}
                    >
                        <TextArea placeholder="请输入商品描述" autosize={{ maxRows: 6, minRows: 2 }} />
                    </Item>
                    <Item
                        label="商品价格"
                        name='price'
                        rules={[{ required: true, message: '商品价格必须输入' }, { validator: this.validatePrice }]}
                        initialValue={product.price}
                    >
                        <Input type='number' placeholder='请输入商品价格' addonAfter='元' />
                    </Item>
                    <Item
                        label="商品分类"
                        name='categoryIds'
                        rules={[{ required: true, message: '商品分类必须输入' }]}
                        initialValue={categoryIds}
                    >
                        <Cascader options={options} loadData={this.loadData} placeholder='请选择商品分类' />
                    </Item>
                    <Item
                        label="商品图片"
                    >
                        <PicturesWall ref={this.picturewall} imgs={product.imgs} />
                    </Item>
                    <Item
                        label="商品详情"
                        labelCol={{ span: 2 }}
                        wrapperCol={{ span: 20 }}
                    >
                        <RichTextEditor ref={this.editor} detail={product.detail} />
                    </Item>
                    <Button type='primary' htmlType='submit'>提交</Button>
                </Form>
            </Card>
        )
    }
}

export default ProductAddUpdate