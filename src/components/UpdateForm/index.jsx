import React from 'react'
import { Form, Input } from 'antd'
import PropTypes from 'prop-types'

const Item = Form.Item

const UpdateForm = (props) => {
    const [form] = Form.useForm()
    const getName = () => {
        props.setForm(form)
    }
    return (
        <Form form={form}>
            <Item
                label="分类名称"
                name='categoryName'
                initialValue={props.categoryName}
                rules={[{required:true,message:'必须输入分类名称'}]}
            >
                <Input
                    placeholder='请输入分类名称'
                    onChange={getName}
                />
            </Item>
        </Form>
    )
}

UpdateForm.propTypes = {
    categoryName: PropTypes.string,
    setForm: PropTypes.func.isRequired
}

export default UpdateForm;