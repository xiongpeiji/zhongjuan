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
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let id =options.id;
    console.log(id)
    wx.setNavigationBarTitle({
      title: '机构资料'
    });
    this.setData({
      id: options.id,
    })
    this.getData();
  },
  //获取机构信息详情
  getData(){
    let url = app_data.base + 'Index/institutionDetail';
    let params = { id: this.data.id};
    http.Get({ url: url, params: params }).then((res) => {
      if (res.code == 'success') {
        console.log(res.data)
      }
    });
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