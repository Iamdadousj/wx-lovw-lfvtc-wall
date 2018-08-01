// page/dstal/pages/login/login.js
Page({
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  onLoad: function() {
    wx.getSetting({
      success: function(res) {
        if (res.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            success: function(res) {
              console.log(res.userInfo)
              //用户已经授权过
            }
          })
        }
      }
    })
  },
  onReady: function() {
    //获得dialog组件
    this.dialog = this.selectComponent("#dialog");
  },

  showDialog: function() {
    this.dialog.showDialog();
  },

  confirmEvent: function() {
    this.dialog.hideDialog();
  },

  bindGetUserInfo: function(e) {
    if (e.detail.userInfo) {
      wx.showModal({
        title: '授权成功',
        content: '感谢您的使用',
      })  
    } else {
      wx.showModal({
        title: '请授权使用',
        content: '点击按钮重新授权',
        success: res=> {
        }
      })  
    }
  }
})