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
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '我的'
    });
    this.checkUser({ refresh: false });
  },
  checkUser(obj) {
    let token = wx.getStorageSync('token');
    if(token){
        let url = app_data.base+'User/index';
        let params = {token:token};
        http.Post({url:url,params:params,loading:obj.refresh}).then((res)=>{
            if(res.code == 'success'){
              if(obj.refresh == true){
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
    wx.navigateTo({
      url: '../institutionalaccreditation/institutionalaccreditation'
    })
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
    this.checkUser({refresh:true});
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