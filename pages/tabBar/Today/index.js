var app = getApp();
const AV = require('../../../libs/av-weapp-min.js');
var Lovelist = AV.Object.extend('Lovelist');
var getList = function(_that) {
  var query = new AV.Query('Lovelist');
  query.descending('createdAt').find().then(function(products) {
    _that.setData({
      contentList: products
    });
    console.log(this.data.contentList);
  }).catch(function(error) {
    alert(JSON.stringify(error));
  });
}
Page({
  data: {
    showModel:false,
    //判断小程序的API，回调，参数，组件等是否在当前版本可用。
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    das: [],
    pageStartY: 0,
    pageEndY: 0,
    isFixed: false,
    contentList: [],
    objects: [],
    indicatorDots: true,
    autoplay: true,
    interval: 5000,
    duration: 800,
    scrollTop: 0,
    isRefresh: false,
    xuserInfo: {},
    nickName:'',
    windowHeight: 0,//获取屏幕高度  
    refreshHeight: 0,//获取高度  
    refreshing: false,//是否在刷新中  
    refreshAnimation: {}, //加载更多旋转动画数据  
    clientY: 0,//触摸时Y轴坐标  
  },
  onLoad: function() {
    getList(this);

    var that = this;

    wx.getSetting({
      success: function (res) {
        if (res.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            success: function (res) {
              console.log(res.userInfo)
              //用户已经授权过
            }
          })
        }
      }
    })

    wx.getSystemInfo({
      success: function (res) {
        console.info(res.windowHeight);
        that.setData({
          scrollHeight: res.windowHeight
        });
      }
    });
    wx.showShareMenu({
      withShareTicket: true
    });
  },
  onShow: function() {
    getList(this);
  },
  onReady: function() {
    var context = wx.createContext();//创建并返回绘图上下文context对象。
    context.beginPath();//开始一个新的路径
    context.moveTo(30, 40);//路径的起点
    context.lineTo(260, 40);//路径的终点
    context.stroke();//对当前路径进行描边
    context.closePath();//关闭当前路径
    wx.drawCanvas({//
      canvasId: 'canvasLine',//画布标识，对应的cavas-id
      actions: context.getActions()//导出context绘制的直线并显示到页面
    });

    new AV.Query('tomg')
      .find()
      .then(das => this.setData({ das }))
      .catch(console.error);
  },
  bindChange: function(e) {
    var that = this;
    that.setData({
      currentTab: e.detail.current
    });
  },
  goDetails: function(e) {
    var objId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: "../../Today/pages/details/details?objId=" + objId
    })
  },
  imgYu (e) {

  },
  swichNav: function(e) {
    var that = this;
    // console.log(e.target)
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current
      })
    }
  },
  toUpperLoading(e) {
    console.log("下拉刷新了....")
    var that = this
    if (that.data.refreshing) return
    that.setData({ refreshing: true })
    updateRefreshIcon.call(that)
    //刷新请求
    utils_news.GetNews(function (result) {
      that.setData({
        reportList: result
      })
      setTimeout(function () {
        that.setData({
          refreshing: false
        })
      }, 3000)
    })
  }
,
//下拉刷新图标旋转动画
  refresh() {
    var deg = 0;
    var that = this;
    console.log('旋转开始了.....')
    //创建动画
    var animation = wx.createAnimation({
      duration: 1500
    })
    var timer = setInterval(function () {
      if (!that.data.refreshing)
        clearInterval(timer)
      animation.rotateZ(deg).step();//在Z轴旋转一个deg角度
      deg += 360
      that.setData({
        refreshAnimation: animation.export()
      })
    }, 500)
  }, bindGetUserInfo: function (e) {
    console.log(e.detail.userInfo)
    if (e.detail.userInfo) {
      //用户按了允许授权按钮
      wx.reLaunch({
        url: './index',
      })
    } else {
      //用户按了拒绝按钮
      wx.reLaunch({
        url: '../me/index',
      })
    }
  },
  onShareAppMessage: function(res) {
console.log(res)
    return {
      title: '临职表白墙,单身俱乐部',
      desc: '临职小电哥-热点：这么多话题，等着你来说',
      imageUrl: '/image/gh_equery.jpg',
      path: '/pages/tabBar/Today/index?id=123',
      success: function(res) {
        // 转发成功  
        var shareTickets = res.shareTickets;
        var shareTicket = shareTickets;
        wx.getShareInfo({
          shareTicket: shareTicket,
          success: function(res) {
            console.log('success');
            console.log(res);
            //console.log(res);  
            wx.showToast({
              title: '转发成功',
              duration: 5000
            })
          },
          fail: function(res) {
            console.log('fail');
            console.log(res);
            wx.showToast({
              title: 'fail:' + res.errMsg,
              duration: 5000
            })
          }
        });
      },
      fail: function(res) {
        // 转发失败
      }
    }
  }
})