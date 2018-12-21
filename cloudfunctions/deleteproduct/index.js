// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database();

// 云函数入口函数 删除商品
exports.main = async (event, context) => {
  let { _id, pro_fileid } = event

  const result = await cloud.deleteFile({
    fileList: pro_fileid,
  })

  return await db.collection('dev_products').doc(_id).remove()

}