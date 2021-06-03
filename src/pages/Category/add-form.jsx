import React from 'react'
import { Form, Input, Select } from 'antd'
import PropTypes from 'prop-types'

const Item = Form.Item
const Option = Select.Option

const AddForm = (props) => {
    const [form] = Form.useForm()
    const {setForm,categorys,parentId}=props
    const getForm=()=>{
        setForm(form)
    }
    return (
        <Form form={form}>
            <Item
                label="所属分类"
                name='parentId'
                initialValue={parentId}
            >
                <Select>
                    <Option key='0' value='0'>一级分类</Option>
                    { categorys.map(c => <Option key={c._id} value={c._id}>{c.name}</Option>) }
                </Select>
            </Item>

            <Item
                label="分类名称"
                name='categoryName'
                initialValue=''
                rules={[{required:true,message:'必须输入分类名称'}]}
            >
                <Input placeholder='请输入分类名称' onChange={getForm}/>
            </Item>
        </Form>
    )
}

AddForm.propTypes={ 
    categorys: PropTypes.array.isRequired, 
    parentId: PropTypes.string.isRequired, 
    setForm: PropTypes.func.isRequired,
}

export default AddForm;