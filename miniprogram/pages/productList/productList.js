//product.js
const app = getApp()
const moment = app.globalData.moment
const _ = app.globalData._

const barTitle = {
  1: '蛋糕商品列表'
}

Page({
  data: {
    productlist: [],
    pro_type: null,
    showAdd: false,
    isAdmin: false,
    headerTabs: ['综合', '价格'],
    activeIndex: 0,
    iconIndex: 0,
    count: 0,
    toTop: false
  },

  onLoad: function(options) {
    // wx.setNavigationBarTitle({ title: barTitle[options.pro_type] })
    wx.setNavigationBarTitle({ title: '商品列表' })

    console.log(app.globalData, 'global')

    this.setData({
      pro_type: options.pro_type,
      isAdmin: app.globalData.isAdmin,
      count: JSON.parse(options.count)
    })

    this.getProductList(JSON.parse(options.pro_type))
  },

  onShow: function () {
    this.getProductList(JSON.parse(this.data.pro_type))
  },

  // 获取产品列表
  getProductList(type) {
    wx.showLoading({
      title: '加载中',
    })
    
    wx.cloud.callFunction({
      name: 'product',
      data: {
        type: type
      }
    }).then((res) => {
      let result = res.result.data

      console.log(result, 'result')

      wx.hideLoading()
      this.setData({
        productlist: result,
        showAdd: true
      })
    }).catch((e) => {
      console.log(e, 'error')
    })
  },

  // 增加商品
  addProduct() {
    let type = this.data.pro_type // pro type
    wx.navigateTo({ url: '../addEditProduct/addEditProduct?type=' + 1 + '&pro_type=' + type })
  },

  // 编辑商品
  editProduct(e) {
    let id = e.currentTarget.dataset.id
    let pro_detail = JSON.stringify(e.currentTarget.dataset.detail)
    let type = this.data.pro_type // pro type

    wx.navigateTo({ url: '../addEditProduct/addEditProduct?type=' + 2 + '&pro_type=' + type + '&pro_detail=' + pro_detail })

  },

  // 删除商品
  deleteProduct(e) {
    let id = e.currentTarget.dataset.id
    let pro_fileid = e.currentTarget.dataset.profileid

    wx.showModal({
      title: '提示',
      content: '确定删除该商品么？',
      success: function (res) {
        if (res.confirm) {
          wx.cloud.callFunction({
            name: 'deleteproduct',
            data: {
              _id: id,
              pro_fileid: pro_fileid,
            }
          }).then((res) => {
            console.log(res, '删除')
            wx.showToast({
              title: '删除成功',
              icon: 'success',
              duration: 2000
            })
            this.getProductList(JSON.parse(this.data.pro_type))
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }.bind(this)
    })
  },

  // 查看商品详情
  goProductDetail(e) {
    let diff = e.currentTarget.dataset.diff
    let id = e.currentTarget.dataset.id
    if(diff > 0) {
      // 没过期 跳详情页
      wx.navigateTo({ url: '../productDetail/productDetail?id=' + id })
    } else {
      // 过期了
    }
  },

  // 切换tab
  changrActivetab(e) {
    let index = e.currentTarget.dataset.index
    let result = this.data.productlist

    this.setData({
      activeIndex: index
    })

    if(index === 1) {

      this.setData({
        count: this.data.count + 1
      })

      if(this.data.count % 2 === 0) {
        // 升序
        this.setData({
          iconIndex: 0
        })

        result = _.sortBy(result, (n) => { return n.pro_price })
  
        this.setData({
          productlist: result
        })
      }else {
        // 降序序
        this.setData({
          iconIndex: 1
        })

        result = _.sortBy(result, (n) => { return -n.pro_price })
  
        this.setData({
          productlist: result
        })
      }

    } else {
      this.setData({
        count: this.data.count + 2
      })

      result = _.sortBy(result, (n) => { return n.create_date })

      this.setData({
        productlist: result
      })

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

  // 下拉刷新
  onPullDownRefresh() {
    this.getProductList(JSON.parse(this.data.pro_type))
    wx.stopPullDownRefresh()
  }

})
