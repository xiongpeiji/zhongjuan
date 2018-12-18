// pages/my/my.js
const app = getApp();
const app_data = app.globalData;
const http = require("../../utils/http.js")
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
    refresh:false,
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
    let token = wx.getStorageSync('token');
    if(token){
        let url = app_data.base+'User/index';
        let params = {token:token};
        let data = {url:url,params:params,loading:this.data.refresh};
        http.Post(data).then((res)=>{
            if(res.code == 'success'){
              if (this.data.refresh){
                wx.stopPullDownRefresh();
              }
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
    let open_id = wx.getStorageSync("open_id");
    if(!open_id){
      wx.login({
        success: (res) => {
          let url = _this.globalData.base + 'Public/getOpenId'
          let data = { code: res.code }
          http.Post({ url: url, params: data }).then((res) => {
            if (res.code == 'success') {
              wx.setStorageSync('open_id', res.data.open_id);
              let login_data = {
                open_id: res.data.open_id,
                username: wx_user_info.nickName,
                avatar: wx_user_info.avatarUrl,
              }
              _this.login(login_data);
            }
          })
        }
      })
    }else{
        let login_data = {
          open_id: open_id,
          username: wx_user_info.nickName,
          avatar: wx_user_info.avatarUrl,
        }
      this.login(login_data);
    }
  },

  login(login_data){
    let open_id = wx.getStorageSync("open_id");
    let url = app_data.base + 'Public/login';
    http.Post({ url: url, params: login_data, loading: true, message: '正在登录' }).then((res) => {
      if (res.code == "success") {
        wx.setStorageSync('token', res.data.token);
        this.checkUser();
        setTimeout(() => {
          app.getUserInfo();
        }, 1000);
      }
    })
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    app.setTabBarMsg()
    if(this.data.isLogin == true){
      this.setData({
        refresh: true
      })
      this.checkUser();
    }else{
      wx.stopPullDownRefresh();
    }
    
  },


  /**
  * 用户点击右上角分享
  */
  onShareAppMessage: function () {
    return app_data.share;
  }
})