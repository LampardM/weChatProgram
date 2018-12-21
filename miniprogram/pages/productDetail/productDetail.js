//product.js
const app = getApp()
const moment = app.globalData.moment

const barTitle = {
  1: '蛋糕商品列表'
}

Page({
  data: {
    pro_id: '',
    pro_detail: {},
    indicatorDots: false,
    autoplay: true,
    interval: 3000,
    duration: 500,
    isShow: false,
    circular: true
  },

  onLoad: function(options) {
    wx.setNavigationBarTitle({ title: '商品详情' })

    try {
      let proid = options.id
      this.setData({
        pro_id: proid
      })
    } catch(e) {
      console.error(options);
      console.error("id: " + e);
      throw "id: " + e;
    }

    this.getProductDetail(this.data.pro_id)
  },

  // 商品详情
  getProductDetail(id) {
    wx.showLoading({
      title: '加载中',
    })
    
    wx.cloud.callFunction({
      name: 'productdetail',
      data: {
        _id: id
      }
    }).then((res) => {
      let result = res.result.data[0]

      if(result.pro_fileid.length > 1) {
        this.setData({
          indicatorDots: true
        })
      }

      wx.hideLoading()
      this.setData({
        pro_detail: result
      })

      console.log(this.data.pro_detail, 'detail')
    }).catch((e) => {
      console.log(e, 'error')
    })
  },

  // 复制淘口令
  getProcommand() {
    this.setData({
      isShow: true
    })
  },

  stopPageScroll: function() {
    return true
  },

  closeCurrentModal: function() {
    this.setData({
      isShow: false
    })
  },

  // 页面分享
  onShareAppMessage: function() {
    return {
      title: "快来看看我的小店吧~",
      path: '/productDetail/productDetail?id=' + this.data.pro_id,
      imageUrl: '',
      success: res => {
        console.log("分享成功");
      }
    }
  }

})
