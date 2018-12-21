// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: 'dev-f61466'
});
const db = cloud.database();

// 云函数入口函数 增加新商品
exports.main = async (event, context) => {
  let { pro_type, pro_name, pro_price, pro_command, pro_fileid, pro_desc, create_date, command_date, ishot } = event

  return await db.collection('dev_products').add({
    data: {
      pro_type: pro_type, 
      pro_name: pro_name, 
      pro_price: pro_price, 
      pro_command: pro_command, 
      pro_fileid: pro_fileid, 
      pro_desc: pro_desc, 
      create_date: create_date, 
      command_date: command_date,
      ishot: ishot
    }
  })
  .then((res) => {
    console.log(res, '新增数据')
  })

}