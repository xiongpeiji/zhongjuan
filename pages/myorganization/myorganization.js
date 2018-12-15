// pages/myorganization/myorganization.js
const app = getApp();
const app_data = app.globalData;
const http = require("../../utils/http.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    myOrgInfos:{},
    instStatus:{ // 1 认证中 2 已认证 3 认证失败 
      1:"认证中",2:"已认证",3:"认证失败"
    },
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '我的'
    });
    this.getMyOrgInfo();
  },
  //获取机构认证状态信息
  getMyOrgInfo(e){
    let url = app_data.base+'User/institutionDetail';
    let token = wx.getStorageSync('token');
    let params = {
      token:token
    }
    http.Get({url: url, params: params}).then((res)=>{
        if(res.code == 'success'){
          console.log(res)
          
          this.setData({
            myOrgInfos:res.data
          });
        }
    });
  },
  //重新编辑认证资料
  repeatEidetInfo(e){
    console.log(e)
    // wx.navigateTo({
    //   url: '../institutionalaccreditation/institutionalaccreditation'
    // })
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