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
    nickName:''
  },
  onLoad: function() {
    getList(this);

    var that = this;
    wx.getUserInfo({
      success: function (res) {
        console.log(res.userInfo.nickName);
        that.data.userInfo = res.userInfo.nickName;
        that.setData({
          nickName: that.data.userInfo
        })
      }
    })
    wx.showShareMenu({
      withShareTicket: true
    });
  },
  onShow: function() {
    getList(this);
  },
  onReady: function() {
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