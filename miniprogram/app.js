//app.js
import global from './libs/index'

let _ = global._
let moment = global.moment

App({
  onLaunch: function () {
    
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        traceUser: true,
      })
    }

    this.globalData = {
      _: _,
      moment: moment
    }
  }
})
