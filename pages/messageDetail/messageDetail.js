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
    button_name:['等待审核','去查看','立即编辑','已结束'],
    color: ['#FFB800', '#5FB878', '#FF5722','#c2c2c2']
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '消息详情'
    });
    app.checkLogin();
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
        res.data.data.color = this.data.color[res.data.data.status];
        res.data.data.button_name = this.data.button_name[res.data.data.status];
        this.setData({
          info:res.data,
          type:res.data.type
        });
      }
   });
 },

  redirectLink(){
    let status = this.data.info.data.status;
    let type   = this.data.type;
    let id     = this.data.info.type_id;
    switch (type) {
      case 'institution':
        if(status == 1){
          wx.navigateTo({
            url: '../myorganization/myorganization'
          })
        }else if(status == 2){
          wx.navigateTo({
            url: '../institutionalaccreditation/institutionalaccreditation?status=3'
          })
        }
        break;
      case 'donation':
        if (status == 1) {
          wx.navigateTo({
            url: '../editseekinginformation/editseekinginformation?id='+id
          })
        } else if (status == 2) {
          wx.navigateTo({
            url: '../donationdetail/donationdetail?id=' + id
          })
        }
        break;
      case 'experience':
        if (status == 1) {
          wx.navigateTo({
            url: '../experiencedis/experiencedis?id=' + id
          })
        } else if (status == 2) {
          wx.navigateTo({
            url: '../createexperience/createexperience?id=' + id
          })
        }
        break;
    }
  },

  /**
  * 用户点击右上角分享
  */
  onShareAppMessage: function () {
    return app_data.share;
  }
})