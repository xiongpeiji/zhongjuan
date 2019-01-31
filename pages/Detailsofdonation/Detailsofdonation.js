// pages/Detailsofdonation/Detailsofdonation.js
const app = getApp();
const app_data = app.globalData;
const http = require("../../utils/http.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id:0,
    type:'user',
    institution: {},
    donation: {},
    user_donation: {},
    material: {},
    status_name: ['', '已发起', '运输中', '已签收', '已取消','已反馈'],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '捐赠详情'
    });
    app.checkLogin();
    this.setData({
      id: options.id,
      type:options.type
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
          donation: res.data.donation,
          user_donation: res.data.user_donation,
          material: res.data.material,
        })
      }
    });
  },
  sign(e){
    app.modal({title:'确认收货',content:'爱心物资物资已经到达，确定收到爱心物资吗？'}).then((res)=>{
      let id = e.currentTarget.dataset.id;
      let url = app_data.base + 'Donation/userDonationSign';
      let params = { id: id, token: app_data.token };
      http.Post({ url: url, params: params }).then((res) => {
        if (res.code == 'success') {
          this.getData();
        }
      });
    })
    
  },

  feedback(e){
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../EditorialContent/EditorialContent?user_donation_id=' + id
    })
  },

  toFeedback(e) {
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../Feedbackdetails/Feedbackdetails?user_donation_id=' + id
    })
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