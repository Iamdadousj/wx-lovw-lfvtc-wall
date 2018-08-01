//app.js
const AV = require('./libs/av-weapp-min.js');
App({
  onLaunch: function () { //小程序启动后 触发的函数
    //调用API从本地缓存中获取数据
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs);
    // wx.clearStorageSync()
  },
  onShow:function () {
    AV.init({
      appId: 'GFObn0F7ok9y2ldtGbekdYbX-gzGzoHsz',
      appKey: 'MqPzpFkxFFlMM1t4pfYkCClP',
    });
  },
  scroll:function(e){
    console.log(e);
  },
  getUserInfo:function(cb){
    var that = this
    if(this.globalData.userInfo){
      typeof cb == "function" && cb(this.globalData.userInfo)
    }else{
      //调用登录接口
      wx.login({
        success: res => {
          wx.getUserInfo({
            success: res => {
              that.globalData.userInfo = res.userInfo
              typeof cb == "function" && cb(that.globalData.userInfo)
            }, fail: err => {
              wx.showModal({
                title: '授权提示',
                content: '您尚未对小电哥进行授权，点击我去页面授权登录使用吧！。',
                success: function (res) {
                  if (res.confirm) {
                    console.log('用户点击确定')
                    wx.navigateTo({
                      url: '/pages/scan/scan?user_id=111',
                    })
                  }
                }
              })
            }
          })
        }
      })
    }
  },  
  globalData:{
    userInfo:null
  }
});