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
    status_name:['等待审核', '审核成功', '审核失败', '已结束'],
    button_name:['等待审核','去查看','立即编辑','已结束'],
    color: ['#FFB800', '#5FB878', '#FF5722','#c2c2c2'],
    button_status:true,
    type_name:'类型状态',
    content_name:'消息提醒',
    cate:'check'
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
        res.data.data.status_name = this.data.status_name[res.data.data.status];
        let button_status = true;
        let type_name = "类型状态";
        let content_name = "消息信息";
        let cate = 'check';
        if(res.data.type != 'user_donation' || res.data.type != 'express'){
          if(res.data.data.status == 1 || res.data.data.status == 2){
            button_status = false;
          }
        }
        if(res.data.type == 'user_donation'){
          type_name = "求捐信息";
          content_name = "捐赠信息";
          cate = 'donation';
        }else if(res.data.type.search('comment') != -1){
          content_name = '评论信息';
          cate = 'comment';
        } else if (res.data.type.search('reply') != -1){
          content_name = '评论回复';
          cate = 'comment';
        }
        this.setData({
          info:res.data,
          type:res.data.type,
          button_status:button_status,
          type_name:type_name,
          content_name:content_name,
          cate:cate
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
      case 'donation_comment':
      case 'donation_replay':
        if (status == 1) {
          wx.navigateTo({
            url: '../donationdetail/donationdetail?id=' + id
          })
        } else if (status == 2) {
          wx.navigateTo({
            url: '../editseekinginformation/editseekinginformation?id=' + id
          })
        }
        break;
      case 'experience':
      case 'experience_comment':
      case 'experience_reply':
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