// pages/my/my.js
const app = getApp();
const app_data = app.globalData;
const http = require("../../utils/http.js")
const common = require("../../utils/common.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isLogin: false,
    username: '',
    avatar: '',
    mobile_status:0,
    institution_status:0,
    msg_count:0,
    instStatus:{ ////0 未认证 1 认证中 2 已认证 3 认证失败 
      0:"未认证",1:"认证中",2:"已认证",3:"认证失败",4:"待完善资料"
    },
    statusClass:{
      0: "no-auth", 1: "auth-ing", 2: "auth-pass", 3: "auth-fail", 4: "auth-ing"
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onShow: function (options) {
    wx.setNavigationBarTitle({
      title: '我的'
    });
    this.checkUser();
  },
  checkUser() {
    let token = app_data.token;
    if(token){
        app.getUserInfo();
        let url = app_data.base+'User/index';
        let params = {token:token};
        let data = {url:url,params:params};
        http.Post(data).then((res)=>{
            if(res.code == 'success'){
              this.setData({
                isLogin:true,
                username:res.data.username,
                avatar:res.data.avatar,
                mobile:res.data.mobile,
                institution_status:res.data.institution_status,
                mobile_status:res.data.mobile_status,
                msg_count:res.data.msg_count
              });
              wx.setStorageSync('user_info', res.data);
            }
        });
    }
  },
  //编辑资料
  editUserInfo(e) {
    wx.navigateTo({
      url: '../editingmaterials/editingmaterials'
    })
  },
  //手机认证
  phoneAuth(e) {
    wx.navigateTo({
      url: '../phoneauthentication/phoneauthentication'
    })
  },
  //通知
  xindeList(e) {
    wx.navigateTo({
      url: '../message/message'
    })
  },
  //机构认证
  jigouAuth(e) {
    //0 未认证 1 认证中 2 已认证 3 认证失败 
    let institutionType = e.currentTarget.dataset.type;
    switch (Number(institutionType)) {
      case 0:
        wx.navigateTo({
          url: '../institutionalaccreditation/institutionalaccreditation?status=0'
        })
        break;
      case 3:
      case 4:
        wx.navigateTo({
          url: '../institutionalaccreditation/institutionalaccreditation?status=1'
        })
        break;
      case 1:
      case 2:
        wx.navigateTo({
          url: '../myorganization/myorganization'
        })
        break;
    }
    
  },
  //我的捐赠
  myDona(e) {
    wx.navigateTo({
      url: '../donationlist/donationlist'
    })
  },
  //求捐信息管理
  helpMsgDetal(e) {
    wx.navigateTo({
      url: '../Donationrecord/Donationrecord'
    })
  },

  //求捐信息管理
  selectDonation(e) {
    wx.navigateTo({
      url: '../Electionrecord/Electionrecord'
    })
  },
  //授权登录
  userLogin(e) {
    let obj = {
      encryptedData: e.detail.encryptedData,
      iv:e.detail.iv,
    }
    app.wxLogin(obj).then((res)=>{
      if(res.code == 'success'){
        app.getUserInfo();
        this.checkUser();
        wx.showToast({
          title: '授权登录成功',
        })
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