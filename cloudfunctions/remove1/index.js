// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: 'cloud1-0gopr9bga04d4ea8' }) // 使用当前云环境

// 云函数入口函数
exports.main = async (event, context) => {
  const db = cloud.database().collection('public')
  //先查询
  return db.doc(event.id)
  //再删除
  .remove()
  
}