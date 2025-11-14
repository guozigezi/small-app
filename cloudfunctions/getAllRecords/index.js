const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async(event, context) => {
  const db = cloud.database()
  const collection = event.collection || 'record'
  const where = event.where || {}
  
  console.log('云函数调用参数:', { collection, where })
  
  try {
    // 获取指定集合的所有数据，突破20条限制
    const result = await db.collection(collection)
      .where(where)
      .get()
    
    console.log('查询结果数量:', result.data.length)
    
    return {
      success: true,
      data: result.data,
      total: result.data.length
    }
  } catch (error) {
    console.error('云函数查询错误:', error)
    return {
      success: false,
      error: error.message
    }
  }
}