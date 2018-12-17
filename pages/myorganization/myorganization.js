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
          this.setData({
            myOrgInfos:res.data
          });
        }
    });
  },
  //重新编辑认证资料
  repeatEidetInfo(e){
    wx.navigateTo({
      url: '../institutionalaccreditation/institutionalaccreditation'
    })
  },

  /**
  * 用户点击右上角分享
  */
  onShareAppMessage: function () {
    return app_data.share;
  }
})