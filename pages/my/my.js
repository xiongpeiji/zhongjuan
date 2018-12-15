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
              app_data.mobile_status = res.data.mobile_status;
              app_data.institution_status = res.institution_status;
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
    let wx_user_info = e.detail.userInfo;
    if (wx_user_info) {
        let url = app_data.base+'Public/login';
        let open_id = wx.getStorageSync("open_id");
        let params = {
          open_id:open_id,
          username:wx_user_info.nickName,
          avatar:wx_user_info.avatarUrl,
        }
      http.Post({ url: url, params: params, loading: true, message:'正在登录'}).then((res)=>{
          if(res.code == "success"){
            this.setData({
              isLogin: true,
              username: res.data.username,
              avatar: res.data.avatar,
              mobile: res.data.mobile,
              institution_status: res.data.institution_status,
              mobile_status: res.data.mobile_status,
            });
            app_data.mobile_status = res.data.mobile_status;
            app_data.institution_status = res.institution_status;
            wx.setStorageSync('user_info', res.data);
            wx.setStorageSync('token', res.data.token);
          }
      })
    }
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.setData({
      refresh:true
    })
    this.checkUser();
  },


  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})