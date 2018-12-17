// pages/messageDetail/messageDetail.js
const app = getApp();
const app_data = app.globalData;
const http = require("../../utils/http.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    info:{},
    type:1,
    id:0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '消息详情'
    });
    this.setData({
      id:options.id
    });
    this.getData();
  },

 getData(){
   let url = app_data.base +'SystemInfo/detail';
   let params = {token:app_data.token,id:this.data.id};
   http.Get({url:url,params:params}).then((res)=>{
      if(res.code == 'success'){
        this.setData({
          info:res.data,
          type:res.data.express_id > 0 ? 2 : 1
        });
      }
   });
 },

  /**
  * 用户点击右上角分享
  */
  onShareAppMessage: function () {
    return app_data.share;
  }
})