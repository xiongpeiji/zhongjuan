// pages/wanttodonate/wanttodonate.js
const app = getApp();
const app_data = app.globalData;
const http = require("../../utils/http.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: 0,
    institution: {},
    user_donation: {},
    donation: {},
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
      id: options.id
    });
    this.getData();
  },
  //获取我要求捐信息
  getData(e) {
    let url = app_data.base + 'Donation/getUserDonationDetail';
    let params = { id: this.data.id, token: app_data.token };
    http.Get({ url: url, params: params }).then((res) => {
      if (res.code == 'success') {
        this.setData({
          institution: res.data.institution,
          user_donation: res.data.user_donation,
          donation: res.data.donation,
          material: res.data.material,
        })
      }
    });
  },





  //进入页面
  /**
  * 用户点击右上角分享
  */
  onShareAppMessage: function () {
    return app_data.share;
  }
})