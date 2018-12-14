// pages/my/my.js
const app = getApp();
const app_data = app.globalData;
const http = require("../../utils/http.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isLogin: false,
    username: '',
    avatar: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '我的'
    });
  },
  //编辑资料
  editUserInfo(e) {
    wx.navigateTo({
      url: '../editingmaterials/editingmaterials'
    })
  },
  //手机认证
  phoneAuth(e) {
    wx.navigateTo({
      url: '../phoneauthentication/phoneauthentication'
    })
  },
  //心得列表
  xindeList(e) {
    wx.navigateTo({
      url: '../experiencelist/experiencelist'
    })
  },
  //机构认证
  jigouAuth(e) {
    wx.navigateTo({
      url: '../institutionalaccreditation/institutionalaccreditation'
    })
  },
  //我的捐赠
  myDona(e) {
    wx.navigateTo({
      url: '../donationmanagement/donationmanagement'
    })
    this.checkUser();
  },
  //求捐信息管理
  helpMsgDetal(e) {
    wx.navigateTo({
      url: '../donormanagement/donormanagement'
    })
  },

  checkUser(){

  },
  //授权登录
  onGotUserInfo(e) {
    let _errMsg_ = e.detail.errMsg;
    let _userInfo_ = e.detail.userInfo;
    let _rawData_ = e.detail.rawData;

    if (_userInfo_) {
      this.setData({
        isLogin: true,
        nickName: _userInfo_.nickName,
        avatarUrl: _userInfo_.avatarUrl,
      });
      this.login();
    }
  },
  login(e) {
    let that = this;
    let _openId_ = wx.getStorageSync("openId")
    wx.request({
      url: 'https://api.qibu131.cn/Public/login',
      data: {
        open_id: _openId_,
        username: that.data.nickName,
        avatar: that.data.avatarUrl
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: 'post',
      success: res => {
        console.log(res)
        wx.setStorageSync("token", res.data.data.token)
      },
      fail: err => {
        console.log(err)
      }
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})