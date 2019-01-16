const app = getApp();
const app_data = app.globalData;
const http = require("../../utils/http.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: 0,
    express_data:{},
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
      id: options.id,
    });
    this.getData();
  },

  //获取我要求捐信息
  getData(e) {
    let url = app_data.base + 'Donation/getExpress';
    let params = {token: app_data.token };
    http.Get({ url: url, params: params }).then((res) => {
      if (res.code == 'success') {
        this.setData({
          express_data: res.data.data
        })
      }
    });
  },

  //拨打快递电话
  callNumber(e){
    let tel = e.currentTarget.dataset.tel;
    wx.makePhoneCall({
      phoneNumber: tel // 仅为示例，并非真实的电话号码
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

  //查看更多物流信息
  moreExpress(e){
    wx.navigateTo({
      url: '../expresslist/expresslist'
    });
  },


  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return app_data.share;
  }
})