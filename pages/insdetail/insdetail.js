// pages/insdetail/insdetail.js
const app = getApp();
const app_data = app.globalData;
let http = require("../../utils/http.js")
let utils = require("../../utils/util.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id:0,
    current: 1,
    swiper_all: 0,
    myOrgInfos:{},
    instStatus: { // 1 认证中 2 已认证 3 认证失败 
      1: "认证中", 2: "已认证", 3: "认证失败"
    },
    type:'donation',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let id =options.id;
    wx.setNavigationBarTitle({
      title: '机构资料'
    });
    this.setData({
      id: options.id,
      type:options.type
    })
    if (app_data.token) {
      this.setData({
        token: app_data.token
      })
    }
    this.getData();
  },
  //获取机构信息详情
  getData(){
    let url = app_data.base + 'Index/institutionDetail';
    let params = { id: this.data.id};
    http.Get({ url: url, params: params }).then((res) => {
      if (res.code == 'success') {
        this.setData({
          myOrgInfos: res.data,
          swiper_all: res.data.images.length,
        })
      }
    });
  },

  showImages(e) {
    let img = e.currentTarget.dataset.img;
    wx.previewImage({
      current: img, // 当前显示图片的http链接
      urls: this.data.myOrgInfos.images // 需要预览的图片http链接列表
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return app_data.share;
  },
  swiper(e) {
    var current = e.detail.current;
    this.setData({
      current: current + 1
    })
  },
  //ios下拉问题
  onPageScroll: function (e) {
    if (e.scrollTop < 0) {
      wx.pageScrollTo({
        scrollTop: 0
      })
    }
  },
  //去捐助按钮
  Tohelp(e){
    if (!this.data.token) {
      this.showDialog();
      return
    }
    let mobile_status = app_data.mobile;
    if (!mobile_status) {
      app.alert({ title: '请先进行手机认证！', time: 2000 });
      setTimeout(() => {
        wx.navigateTo({
          url: '../phoneauthentication/phoneauthentication',
        })
      }, 2000);
      return;
    }
    wx.navigateTo({
      url: '../Donoragencies/Donoragencies?id='+this.data.id,
    })
  },

  onReady: function () {
    //获得dialog组件
    if (!this.data.token) {
      this.setToken();
    }
    this.dialog = this.selectComponent("#dialog");
  },

  setToken() {
    app.getToken().then((res) => {
      this.setData({
        token: res
      });
    })
  },

  showDialog: function () {
    this.dialog.showDialog();
  },

  confirmEvent: function () {
    this.dialog.hideDialog();
  },

  bindGetUserInfo: function (e) {
    // 用户点击授权后，这里可以做一些登陆操作
    let obj = {
      encryptedData: e.detail.encryptedData,
      iv: e.detail.iv,
    }
    app.wxLogin(obj).then((res) => {
      if (res.code == 'success') {
        app.getUserInfo();
        this.setToken();
        wx.showToast({
          title: '授权登录成功',
        })
      }
    });
  },

})