Component({

  behaviors: [],

  properties: {
    isShow: { // 属性名
      type: Boolean, // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
      value: false, // 属性初始值（可选），如果未指定则会根据类型选择一个
      observer: function(newVal, oldVal, changedPath) {
         // 属性被改变时执行的函数（可选），也可以写成在methods段中定义的方法名字符串, 如：'_propertyChange'
         // 通常 newVal 就是新设置的数据， oldVal 是旧数据
      }
    },
    taoCommand: {
      type: String,
      value: ''
    }
  },
  data: {}, // 私有数据，可用于模板渲染

  lifetimes: {
    // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
    attached: function () { },
    moved: function () { },
    detached: function () { },
  },

  // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
  attached: function () { 
    console.log(this.properties.isShow, 'show')
  }, // 此处attached的声明会被lifetimes字段中的声明覆盖
  ready: function() { },

  pageLifetimes: {
    // 组件所在页面的生命周期函数
    show: function () { },
    hide: function () { },
    resize: function () { },
  },

  methods: {
    // 关闭弹框
    closeCurModal: function() {
      this.triggerEvent('closeModal')
    },

    // 复制
    copyCommand: function(e) {
      wx.setClipboardData({
        data: e.currentTarget.dataset.text,
        success:function(res) {
          wx.getClipboardData({
            success:function() {
              wx.showToast({
  　　　　　　　  title: '复制成功'
  　　  　　　 })
              this.triggerEvent('closeModal');
            }.bind(this)
          })
        }.bind(this)
      })
    }
  }

})