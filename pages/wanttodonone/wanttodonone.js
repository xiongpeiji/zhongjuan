// zhongjuan/pages\wanttodonone/wanttodonone.js
const app = getApp();
const app_data = app.globalData;
const http = require("../../utils/http.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isFocus:false,
    money:'',
    placeholder:'请输入物资价值'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '我要捐助'
    });
  },
  //input获取焦点
  isfocusThis(e) {
    this.setData({
      isFocus: true,
      placeholder:''
    })
  },
  //完成捐助
  nextExpress(e){
    wx.navigateTo({
      url: '../inexpress/inexpress'
    })
  },
  //去除焦点
  removeActive(e) {
    if (!this.data.money>=1){
      this.setData({
        isFocus: false,
        placeholder:'请输入物资价值'
      })
    }
    
  },
  moneyNum(e){
    let money = e.detail.value;
    this.setData({
      money: money,
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