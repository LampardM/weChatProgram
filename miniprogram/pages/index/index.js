//index.js
const app = getApp()
const moment = app.globalData.moment

let flag = false

Page({
  data: {
    avatarUrl: './user-unlogin.png',
    userInfo: {},
    logged: false,
    takeSession: false,
    requestResult: '',
    isShow: false,
    taoCommand: '￥dqEIb96NrDo￥',
    imgUrls: [
      '../../images/cakeone.jpg',
      '../../images/caketwo.jpg',
      '../../images/cakethree.jpg',
      '../../images/cakefour.jpg',
      '../../images/cakefive.jpg'
    ],
    indicatorDots: true,
    autoplay: true,
    interval: 3000,
    duration: 500,
    circular: true,
    isAdmin: false,
    fireUrl: "../../images/fire.png",
    hotlist: [],
    toTop: false
  },

  onLoad: function() {
    this.flag = true

    wx.setNavigationBarTitle({ title: '美熙蛋糕装饰' })
    if (!wx.cloud) {
      wx.redirectTo({
        url: '../chooseLib/chooseLib',
      })
      return
    }

    this.onGetOpenid();
  },

  onShow: function () {
    this.getProductList()
  },

  onGetOpenid: function() {
    // 调用云函数
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        
        app.globalData.openid = res.result.OPENID

        if(res.result.OPENID === 'o4k_80GUzTd_vv8KDi2rDbZUefKM' || res.result.OPENID === 'o4k_80GIPtzyc28H1M_wTIr0Ytio' || res.result.OPENID === 'o4k_80LJNyzXxYBuDuZL9tMpiXBE' || res.result.OPENID === 'o4k_80P9Hh8uvkOaRAGThNfIDhSw') {
          app.globalData.isAdmin = true
        } else {
          app.globalData.isAdmin = false
        }

        this.setData({
          isAdmin: app.globalData.isAdmin
        })
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
      }
    })
  },

  // 查看商品列表
  goProductlist: function(e) {
    let type = e.currentTarget.dataset.type // pro type
    wx.navigateTo({ url: '../productList/productList?pro_type=' + type + '&count=' + 0 })
  },

  makePhonecall() {
    wx.makePhoneCall({
      phoneNumber: '15167991716'
    })
  },

  // 计算
  getProductCommand(prolist) {

    prolist.forEach((pro) => {
      let createdate = pro.command_date
      let lastdate = moment(createdate).add(30, 'days')

      const diff = lastdate.diff(moment(), 'days')

      pro.diff = diff
    })

    return app.globalData._.sortBy(prolist, (n) => { return n.pro_price})

  },

  // 获取产品列表
  getProductList() {
    this.flag = false
    wx.showLoading({
      title: '加载中',
    })
        
    wx.cloud.callFunction({
      name: 'hotproduct',
      data: {}
    }).then((res) => {
      let result = res.result.data
      
      result = this.getProductCommand(result)

      console.log(result, 'hot')

      wx.hideLoading()

      this.setData({
        hotlist: result
      })
    }).catch((e) => {
      console.log(e, 'error')
    })
  },

  // 查看商品详情
  goProductDetail(e) {
    let diff = e.currentTarget.dataset.diff
    let id = e.currentTarget.dataset.id

    // if(diff > 0) {
    //   // 没过期 跳详情页
    //   wx.navigateTo({ url: '../productDetail/productDetail?id=' + id })
    // } else {
    //   // 过期了
    // }

    wx.navigateTo({ url: '../productDetail/productDetail?id=' + id })
  },

  // 页面分享
  onShareAppMessage: function() {
    return {
      title: "快来看看我的小店吧~",
      path: '/index/index',
      imageUrl: '',
      success: res => {
        console.log("分享成功");
      }
    }
  },

  // 页面滚动
  onPageScroll: function (e) {
    let scrolltop = e.scrollTop
    if(scrolltop > 800) {
      this.setData({
        toTop: true
      })
    } else {
      this.setData({
        toTop: false
      })
    }
  },

  // 回到顶部
  backtop() {
    this.setData({
      toTop: false
    })

    wx.pageScrollTo({
      scrollTop: 0,
      duration: 500
    })
  },

  onPullDownRefresh() {
    this.getProductList();
    wx.stopPullDownRefresh()
  }

})
