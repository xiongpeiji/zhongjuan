//index.js
const app = getApp();
const base = app.globalData.base;
Page({
  data: {
    imgUrls: [
      // '/images/banner.jpg',
      // '/images/banner.jpg',
      // '/images/banner.jpg',
    ],
    indicatorDots: true,
    autoplay: true,
    interval: 8000,
    duration: 1000,
    indicatorcolor:'rgba(238,238,238,.6)',
    indicatoractivecolor:'#fff'
  },
  //求捐详情页面
  qiujuanDetail(e){
    wx.navigateTo({
      url: '../donationdetail/donationdetail'
    });
  },
  onLoad: function (options) {
    var token = wx.getStorageSync('token');
    if (token) {
      this.token = token;
    }
    this.invite_code = options.invite_code;
    if (this.invite_code) {
      wx.setStorage({
        key: 'invite_code',
        data: this.invite_code
      })
    }
    var userInfo = wx.getStorageSync('userInfo');
    if (userInfo) {
      this.userInfo = userInfo;
      var level = userInfo.level;
      if (level) {
        this.setData({
          level: userInfo.level
        })
      }
    }

    this.init();
  },
  init() {
    var that = this;
    wx.request({
      url: base + '/Index/index?token=123456',
      success(res) {
        var data = res.data.data;
        console.log(res)
        if (data.advert) {
          that.setData({
            imgUrls: data.advert
          });
        }
        //http://api.qibu131.cn/Index/index?token=123456
      },
      fail(err) {
        console.log(err)
      }
    })
  },
})