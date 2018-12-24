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
    instStatus:{ ////0 未认证 1 认证中 2 已认证 3 认证失败 
      0:"未认证",1:"认证中",2:"已认证",3:"认证失败"
    },
    statusClass:{
      0:"no-auth",1:"auth-ing",2:"auth-pass",3:"auth-fail"
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
    app.setTabBarMsg()
  },
  checkUser() {
    let token = app_data.token;
    console.log(token);
    if(token){
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
  //心得列表
  xindeList(e) {
    wx.navigateTo({
      url: '../experiencelist/experiencelist'
    })
  },
  //机构认证
  jigouAuth(e) {
    //0 未认证 1 认证中 2 已认证 3 认证失败 
    let institutionType = e.currentTarget.dataset.type;
    switch (Number(institutionType)) {
      case 0:
      case 3:
        wx.navigateTo({
          url: '../institutionalaccreditation/institutionalaccreditation'
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
      url: '../donationmanagement/donationmanagement'
    })
  },
  //求捐信息管理
  helpMsgDetal(e) {
    wx.navigateTo({
      url: '../donormanagement/donormanagement'
    })
  },
  //授权登录
  userLogin(e) {
    let _this = this;
    let wx_user_info = e.detail.userInfo;
    let obj = {
      username: wx_user_info.nickName,
      avatar: wx_user_info.avatarUrl
    }
    app.wxLogin(obj).then((res)=>{
      if(res.code == 'success'){
        this.checkUser();
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