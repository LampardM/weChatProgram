// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database();

// 云函数入口函数
exports.main = async (event, context) => {
  let { _id } = event;
  const productList = db.collection('dev_products');

  const result = await productList.where({
    _id: _id
  }).get()

  return result
}