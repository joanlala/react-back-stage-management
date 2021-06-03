/* 包含应用中所有接口请求函数的模块
    每个函数的返回值都是promise对象
*/
import ajax from './ajax'
// 登录
export const reqLogin = (username, password) => ajax('/login', { username, password }, 'POST')
// 添加用户
export const reqAddUser = (user) => ajax('/manage/user/add', user, 'POST')

// 获取天气
export const reqWeather = () => {
    // return new Promise((resolve, reject) => {//
    //     const url = `https://restapi.amap.com/v3/weather/weatherInfo?key=bdcf3f49d7c8654a9123aa2804119fcd&city=510000`
    //     jsonp(url, {}, (err, data) => {
            
    //         if(!err&&data.status==='1'){
    //             const {weather}=data.lives[0]
    //             resolve({weather})
    //         }else{
    //             message.error('获取天气信息失败')
    //         }
    //     })
    // })
    return ajax('https://restapi.amap.com/v3/weather/weatherInfo?key=bdcf3f49d7c8654a9123aa2804119fcd&city=510000')
}

// 获取一级或某个二级分类列表 
export const reqCategorys = (parentId) => ajax('/manage/category/list', {parentId}) 
// 添加分类 
export const reqAddCategory = (parentId, categoryName) => ajax('/manage/category/add', { parentId, categoryName }, 'POST') 
// 更新分类名称 
export const reqUpdateCategory = ({categoryId, categoryName}) => ajax('/manage/category/update', { categoryId, categoryName }, 'POST')
// 根据分类 ID 获取分类
export const reqCategory = (categoryId) => ajax('/manage/category/info', {categoryId}) 
// 获取商品分页列表 
export const reqProducts = (pageNum, pageSize) => ajax('/manage/product/list', {pageNum, pageSize}) 
// 根据 ID/Name 搜索产品分页列表
export const reqSearchProducts = ({pageNum, pageSize, searchType, searchName}) => ajax('/manage/product/search', { pageNum, pageSize, [searchType]: searchName, })
// 添加/更新商品 
export const reqAddOrUpdateProduct = (product) => ajax('/manage/product/' + (product._id ? 'update' : 'add'), product, 'post') 
// 对商品进行上架/下架处理 
export const reqUpdateProductStatus = (productId, status) => ajax('/manage/product/updateStatus', { productId, status }, 'POST') 
// 删除图片 
export const reqDeleteImg = (name) => ajax('/manage/img/delete', {name}, 'post')

// 添加角色 
export const reqAddRole = (roleName) => ajax('/manage/role/add', {roleName}, 'POST') 
// 获取角色列表 
export const reqRoles = () => ajax('/manage/role/list') 
// 更新角色(给角色设置权限) 
export const reqUpdateRole = (role) => ajax('/manage/role/update', role, 'POST')
// 添加/更新用户 
export const reqAddOrUpdateUser = (user) => ajax('/manage/user/'+(user._id ? 'update' : 'add'), user, 'POST')
// 获取用户列表 
export const reqUsers = () => ajax('/manage/user/list') 
// 删除用户 
export const reqDeleteUser = (userId) => ajax('/manage/user/delete', {userId}, 'POST')