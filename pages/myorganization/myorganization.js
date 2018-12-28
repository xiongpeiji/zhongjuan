// pages/myorganization/myorganization.js
const app = getApp();
const app_data = app.globalData;
const http = require("../../utils/http.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    myOrgInfos:{},
    instStatus:{ // 1 认证中 2 已认证 3 认证失败 
      1:"认证中",2:"已认证",3:"认证失败"
    },
    current: 1,
    swiper_all: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '我的'
    });
    app.checkLogin();
    this.getMyOrgInfo();
  },
  //获取机构认证状态信息
  getMyOrgInfo(e){
    let url = app_data.base+'User/institutionDetail';
    let token = wx.getStorageSync('token');
    let params = {
      token:token
    }
    http.Get({url: url, params: params}).then((res)=>{
        if(res.code == 'success'){
          console.log(res)
          this.setData({
            myOrgInfos:res.data,
            swiper_all: res.data.prove_info.length,
          });
        }
    });
  },
  //重新编辑认证资料
  repeatEidetInfo(e){
    let status = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../institutionalaccreditation/institutionalaccreditation?status=' + status
    })
  },
  swiper(e) {
    var current = e.detail.current;
    this.setData({
      current: current + 1
    })
  },

  showImages(e) {
    let img = e.currentTarget.dataset.img;
    wx.previewImage({
      current: img, // 当前显示图片的http链接
      urls: this.data.myOrgInfos.prove_info // 需要预览的图片http链接列表
    })
  },
  /**
  * 用户点击右上角分享
  */
  onShareAppMessage: function () {
    return app_data.share;
  },
  //ios下拉问题
  onPageScroll: function (e) {
    if (e.scrollTop < 0) {
      wx.pageScrollTo({
        scrollTop: 0
      })
    }
  }
})