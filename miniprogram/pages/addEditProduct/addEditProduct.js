//product.js
import util from "../../libs/until";

const app = getApp()
const barTitle = {
  1: '新增商品',
  2: '编辑商品'
}

Page({
  data: {
    type: 1,
    pro_type: 1, // 商品类型 1：蛋糕
    pro_name: '',
    pro_price: 0,
    pro_command: '',
    pro_desc: '',
    create_date: null,
    command_date: null,
    pro_tepurl: [],
    pro_fileid: [],
    ishot: false,
    origin_command: '',
    _id: null
  },

  onLoad: function(options) {
    let type;
    let pro_type;
    wx.setNavigationBarTitle({ title: barTitle[options.type] })

    try {
      type = JSON.parse(options.type)

      if(type) {
        if(type === 2) {
          console.log('编辑商品')
          let pro_detail = JSON.parse(options.pro_detail)
          this.initEditProductDetail(pro_detail)
        } else {
          console.log('新增商品')
        }

      }
    } catch(e) {
      console.error(options);
      console.error("type: " + e);
      throw "type: " + e;
    }

    try {
      pro_type = JSON.parse(options.pro_type)
    } catch(e) {
      console.error(options);
      console.error("pro_type: " + e);
      throw "pro_type: " + e;
    }

    this.setData({
      type,
      pro_type
    })
  },

  // 初始化编辑商品
  initEditProductDetail(pro_detail) {
    let { pro_type, pro_name, pro_price, pro_command, pro_fileid, pro_desc, create_date, command_date, origin_command, ishot, _id } = this.data
    pro_type = pro_detail.pro_type
    pro_name = pro_detail.pro_name
    pro_price = pro_detail.pro_price
    pro_command = pro_detail.pro_command
    pro_fileid = pro_detail.pro_fileid
    pro_desc = pro_detail.pro_desc
    create_date = pro_detail.create_date
    command_date = pro_detail.command_date
    origin_command = pro_detail.pro_command
    ishot = pro_detail.ishot
    _id = pro_detail._id

    this.setData({
      pro_type, pro_name, pro_price, pro_command, pro_fileid, pro_desc, create_date, command_date, origin_command, ishot, _id
    })
  },

  // 热销切换
  switch1Change(e) {
    let ishot = e.detail.value
    this.setData({
      ishot: ishot
    })
  },

  // 交换临时真实图片链接
  exchangeRealUrl(imgId) {
    let pro_fileid = this.data.pro_fileid
    pro_fileid.push(imgId)

    this.setData({ pro_fileid })

    // 不需要交换临时真实路径也可以
    wx.cloud.getTempFileURL({
      fileList: [imgId],
      success: res => {
        let tempFileURL = res.fileList[0].tempFileURL
        let urlTarget = {
          tempFileURL: tempFileURL,
          fileID: imgId
        }
        let cur = this.data.pro_tepurl
        cur.push(urlTarget)

        this.setData({ pro_tepurl: cur })

        console.log(this.data.pro_tepurl, 'list')
      },
      fail: err => {
        // handle error
      }
    })
  },
  
  // 云函数上传图片
  uploadCloudImgUrl(cloudPath, filePath) {
    wx.cloud.uploadFile({
      cloudPath,
      filePath,
      success: res => {

        this.exchangeRealUrl(res.fileID)
        console.log('[上传文件] 成功：', res)
      },
      fail: e => {
        console.error('[上传文件] 失败：', e)
        wx.showToast({
          icon: 'none',
          title: '上传失败',
        })
      },
      complete: () => {
        wx.hideLoading()
      }
    })
  },

  // 上传商品图
  uploadProImgUrl() {
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {

        wx.showLoading({
          title: '上传中',
        })

        let tempFilePaths = res.tempFilePaths

        tempFilePaths.forEach((path) => {
          let filePath = path

          const cloudPath = 'pro_img/'+ util.CreateGuid() + filePath.match(/\.[^.]+?$/)[0]

          this.uploadCloudImgUrl(cloudPath, filePath)
        })
      }.bind(this),
      fail: e => {
        console.error(e)
      }
    })
  },

  // 删除图片
  removeImg(e) {
    let fileID = e.currentTarget.dataset.id

    let { pro_tepurl, pro_fileid } = this.data;

    wx.showModal({
      title: '提示',
      content: '确定删除该图片么？',
      success: function (res) {
        if (res.confirm) {
          // 删除临时链接数组
          pro_tepurl.forEach((item, index) => {
            if(item.fileID === fileID) {
              pro_tepurl.splice(index, 1)
            }
          })

          this.setData({ pro_tepurl })
          // 删除储存空间
          pro_fileid.forEach((x, index) => {
            if(x === fileID) {
              pro_fileid.splice(index, 1)
              this.setData({ pro_fileid })
              wx.cloud.deleteFile({
                fileList: [fileID],
                success: res => {
                  // handle success
                  console.log(res.fileList, '删除成功')
                },
                fail: err => {
                  // handle error
                }
              })
            }
          })

        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }.bind(this)
    })
  },

  // 商品名合法性检测
  checkProname(name) {
    if(!name) {
      wx.showToast({
        title: '请输入名称',
        icon: 'none',
        duration: 2000
      })
      return false
    } else {
      this.setData({
        pro_name: name
      })
      return true
    }
  },

  // 商品名确定回调
  confirmProname(event) {
    let name = event.detail.value
    this.checkProname(name)
  },

  // 价格合法性检测
  checkProprice(price) {
    let reg=/^\d+(\.\d{0,4})?$/;

    if(reg.test(price)) {
      let priceNow = price
      this.setData({
        pro_price: priceNow
      })
      return true
      
    } else {
      wx.showToast({
        title: '请输入正确价格',
        icon: 'none',
        duration: 2000
      })

      return false
    }
  },

  // 商品价格回调
  confirmProprice(event) {
    let price = event.detail.value
    this.checkProprice(price)
  },

  // 商品名合法性检测
  checkProndesc(desc) {
    if(!desc) {
      wx.showToast({
        title: '请输入描述',
        icon: 'none',
        duration: 2000
      })

      return false
    } else {
      this.setData({
        pro_desc: desc
      })

      return true

    }
  },

  // 商品描述回调
  confirmProdesc(event) {
    let desc = event.detail.value
    this.checkProndesc(desc)
  },

  // 商品图片合法性检测
  checkProimgUrl(pro_fileid) {
    if(pro_fileid.length === 0) {
      wx.showToast({
        title: '请上传至少一张图片',
        icon: 'none',
        duration: 2000
      })

      return false
    } else {
      console.log('通过检查')
      return true
    }
  },

  // 提交商品信息
  submitProdetail() {
    let { type, pro_type, pro_name, pro_price, pro_command, pro_fileid, pro_desc, create_date, _id, ishot } = this.data

    let curdate = +new Date()

    if(this.checkProname(pro_name) && this.checkProprice(pro_price) && this.checkProimgUrl(pro_fileid) && this.checkProndesc(pro_desc)) {
      if(type === 1) {
        // 新增商品
        this.setData({
          create_date: curdate,
          command_date: curdate
        })
  
        let { create_date, command_date } = this.data
  
        wx.cloud.callFunction({
          name: 'addproduct',
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
        }).then(res => {
          wx.showToast({
            title: '添加成功',
            icon: 'success',
            duration: 2000
          })
          let pro_type = this.data.pro_type
          wx.navigateBack()
          //{ url: '../productList/productList?pro_type=' + pro_type + '&count=' + 0}
        })
        .catch(console.error)
  
      } else {
        // 编辑商品
        let { origin_command, pro_command } = this.data

        let { command_date } = this.data

        wx.cloud.callFunction({
          name: 'editproduct',
          data: {
            _id: _id,
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
        }).then((res) => {
          console.log(res, '更新产品成功')
          wx.showToast({
            title: '更新成功',
            icon: 'success',
            duration: 2000
          })
          let pro_type = this.data.pro_type
          wx.navigateBack()
          //{ url: '../productList/productList?pro_type=' + pro_type + '&count=' + 0}
        }).catch((e) => {
          console.log(e)
        })
        
      }
    } else {
      // 检查未通过
    }

  }

})
