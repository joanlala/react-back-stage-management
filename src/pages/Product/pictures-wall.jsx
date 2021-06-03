import React, { Component } from 'react'
import { Upload, Modal,message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import PropTypes from 'prop-types'

import { BASE_IMG_PATH, UPLOAD_IMG_NAME } from '../../utils/constants'
import { reqDeleteImg } from '../../api'

function getBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}

export default class PicturesWall extends Component {
    static propTypes = {
        imgs: PropTypes.array
    }
    constructor(props) {
        super(props)
        let fileList = []
        // 如果传入了 imgs, 生成一个对应的 fileList 
        const imgs = this.props.imgs
        if (imgs && imgs.length > 0) {
            fileList = imgs.map((img, index) => ({
                uid: -index, //每个file都有自己唯一id
                name: img,//图片文件名
                status: 'done', //图片状态 loading: 上传中, done: 上传完成, remove: 删除 
                url: BASE_IMG_PATH + img,//图片地址
            }))
        }
        //初始化状态 
        this.state = {
            previewVisible: false, // 是否显示大图预览 
            previewImage: '', // 大图的 url 
            fileList: fileList // 所有需要显示的图片信息对象的数组 
        }
    }
    /*得到当前已上传的图片文件名的数组 */
    getImgs = () => this.state.fileList.map(file => file.name)
    /*关闭大图预览 */
    handleCancel = () => this.setState({
        previewVisible: false
    })
    /*预览大图 */
    handlePreview = async file => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }

        //显示指定file对应的大图
        this.setState({
            previewImage: file.url || file.preview,
            previewVisible: true,
            previewTitle: file.name || file.url.substring(file.url.lastIndexOf('/') + 1),
        });
    };

    /*
    file: 当前操作文件信息对象 
    fileList: 所有文件信息对象的数组 
    */
    handleChange = async ({ file, fileList }) => {
        //console.log('handleChange()', file, fileList)
        // 如果上传图片完成 
        if (file.status === 'done') {
            const result = file.response//返回的结果数据
            if (result.status === 0) {
                message.success('上传成功了')
                const { name, url } = result.data
                file = fileList[fileList.length - 1]
                file.name = name
                file.url = url
            } else {
                message.error('上传失败了')
            }
        } else if (file.status === 'removed') {
            // 删除图片 
            const result = await reqDeleteImg(file.name)

            if (result.status === 0) {
                message.success('删除图片成功')
            } else {
                message.error('删除图片失败')
            }
        }
        // 更新 fileList 状态 
        this.setState({ fileList })
    }

    render() {
        const { previewVisible, previewImage, fileList, previewTitle } = this.state;
        const uploadButton = (
            <div>
                <PlusOutlined />
                <div style={{ marginTop: 8 }}>Upload</div>
            </div>
        );
        return (
            <>
                <Upload
                    action="/manage/img/upload" //上传图片的接口地址
                    accept="image/*"  //只接收图片格式
                    name={UPLOAD_IMG_NAME} //请求参数名
                    listType="picture-card" //卡片样式
                    fileList={fileList} //所有已上传图片文件对象的数组
                    onPreview={this.handlePreview}
                    onChange={this.handleChange}
                >
                    {fileList.length >= 8 ? null : uploadButton}
                </Upload>
                <Modal
                    visible={previewVisible}
                    title={previewTitle}
                    footer={null}
                    onCancel={this.handleCancel}
                >
                    <img alt="example" style={{ width: '100%' }} src={previewImage} />
                </Modal>
            </>
        );
    }
}