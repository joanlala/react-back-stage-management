import React from 'react'
import { Form, Input, } from 'antd'
import PropTypes from 'prop-types'

const { Item } = Form
/*用来添加角色的 form 组件 */
const AddForm = (props) => {
    const [form] = Form.useForm();
    const formItemLayout = {
        labelCol: { span: 5 },
        wrapperCol: { span: 16 }
    }
    

    return (
        <Form form={form}>
            <Item
                {...formItemLayout}
                label='角色名称'
                name='roleName'
                initialValue=''
                rules={[{required:true,message:'必须输入角色名'}]}
            >
                <Input type='text' placeholder='请输入角色名称' onChange={() => props.setForm(form)} />
            </Item>
        </Form>
    )
}
AddForm.propTypes={ 
    setForm: PropTypes.func.isRequired,
}
export default AddForm