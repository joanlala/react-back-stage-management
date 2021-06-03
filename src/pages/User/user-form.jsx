import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Select, } from 'antd'
const FormItem = Form.Item
const Option = Select.Option
/*用来添加或更新的 form 组件 */
const UserForm = (props) => {
    const [form] = Form.useForm();
    const formItemLayout = {
        labelCol: { span: 4 },
        wrapperCol: { span: 16 }
    }
    const { user, roles } = props
    return (
        <Form form={form}  {...formItemLayout} onChange={()=>props.setForm(form)}>
            <FormItem
                label="用户名"
                name='username'
                initialValue={user.username}
            >
                <Input type="text" placeholder="请输入用户名" />
            </FormItem>
            {
                !user._id ? (
                    <FormItem
                        label="密码"
                        name='password'
                        initialValue=''
                    >
                        <Input type="password" placeholder="请输入密码" />
                    </FormItem>
                ) : null
            }
            <FormItem
                label="手机号"
                name='phone'
                initialValue={user.phone}
            >
                <Input type="phone" placeholder="请输入手机号" />
            </FormItem>
            <FormItem
                label="邮箱"
                name='email'
                initialValue={user.email}
            >
                <Input type="email" placeholder="请输入邮箱" />
            </FormItem>
            <FormItem
                label="角色"
                name='role_id'
                initialValue={user.role_id}
            >
                <Select
                    style={{ width: 200 }}
                    placeholder='请选择角色'
                >
                    {roles.map(role => <Option key={role._id} value={role._id}>{role.name}</Option>)}
                </Select>
            </FormItem>
        </Form>
    )
}
UserForm.propTypes = {
    setForm: PropTypes.func.isRequired,
    user: PropTypes.object,
    roles: PropTypes.array
}
export default UserForm