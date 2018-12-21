// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数 获取商品列表
exports.main = async (event, context) => {
  let { type } = event;
  const db = cloud.database();
  const productList = db.collection('dev_products');

  const result = await productList.where({
    pro_type: type
  }).get()

  return result
}