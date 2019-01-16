// pages/perfectinformation/perfectinformation.js
const app = getApp();
const app_data = app.globalData;
const http = require("../../utils/http.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id:0,
    donation_num:0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.checkLogin();
    wx.setNavigationBarTitle({
      title: '我要捐助'
    });
    this.setData({
      id:options.id,
      donation_num:options.donation_num,
    });
  },


  //完善物流
  perfectLogistics(e){
    wx.navigateTo({
      url: '../inexpress/inexpress?id=' + this.data.id
    })
  },
  //取消捐赠
  cancelJz(e) {
    let url = app_data.base + '/Donation/cancelUserDonation'
    let params = { token: app_data.token, id: this.data.id };
    http.Post({ url: url, params: params }).then((res) => {
      if (res.code == 'success') {
        wx.navigateTo({
          url: '../stutaspage/stutaspage?status=fail'
        })
      }
    })
  },
  //稍后完善
  waitMoment(e){
    wx.navigateTo({
      url: '../Initiatedonation/Initiatedonation?id='+this.data.id
    })
  },
 


  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return app_data.share;
  }
})