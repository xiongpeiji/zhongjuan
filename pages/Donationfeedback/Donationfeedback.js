// pages/Donationrecord/Donationrecord.js
const app = getApp();
const app_data = app.globalData;
const http = require("../../utils/http.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    donation_id:0,
    user_donation: {},
    donation: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '受捐反馈'
    });
    this.setData({
      donation_id: options.id,
    });
    app.checkLogin();
    this.getData();
  },
  //获取我的求捐列表
  getData(obj) {
    let url = app_data.base + 'User/getDonationDetail';
    let params = {
      token: app_data.token,
      id:this.data.donation_id,
    }
    http.Get({ url: url, params: params}).then((res) => {
      if (res.code == 'success') {
        this.setData({
          donation: res.data.donation,
          user_donation: res.data.user_donation
        })
      }
    })
  },
  redirectLink(e) {
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../Detailsofdonation/Detailsofdonation?id=' + id + '&type=donation'
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return app_data.share;
  }
})