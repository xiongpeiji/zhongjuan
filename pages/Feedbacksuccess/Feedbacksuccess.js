// pages/Feedbacksuccess/Feedbacksuccess.js
const app = getApp();
const app_data = app.globalData;
const http = require("../../utils/http.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: 0,
    type:'donation',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '捐赠反馈'
    });
    this.setData({
      id: options.id,
      type:options.type,
    });
  },
  goFeedbackDetail(){
    wx.navigateTo({
      url: '../Feedbackdetails/Feedbackdetails?id=' + this.data.id
    })
  },

  toUser(){
    if(this.data.type == 'donation'){
      wx.navigateTo({
        url: '../Donationrecord/Donationrecord',
      })
    }else{
      wx.navigateTo({
        url: '../Electionrecord/Electionrecord',
      })
    }
  },
  /**
  * 用户点击右上角分享
  */
  onShareAppMessage: function () {
    return app_data.share;
  }
})