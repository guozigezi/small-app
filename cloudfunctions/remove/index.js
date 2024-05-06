// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: 'cloud1-3gi51qcb61981a27' }) // 使用当前云环境

// 云函数入口函数
exports.main = async (event, context) => {
  const db = cloud.database().collection('questions')
  //先查询
  return db.doc(event.id)
  //再删除
  .remove()
  
}