// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const db = cloud.database();
  const productList = db.collection('dev_products');

  const result = await productList.where({
    ishot: true
  }).get()

  return result
}