// pages/editingmaterials/editingmaterials.js
const app = getApp();
const app_data = app.globalData;
const http = require("../../utils/http.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    avatar: null,
    username:null,
    showModalStatus: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '编辑资料'
    });
    app.checkLogin();
    this.setUserInfo();
  },

  setUserInfo(){
    let user_info = wx.getStorageSync('user_info');
    this.setData({
      avatar:user_info.avatar,
      username:user_info.username
    })
  },

  //修改昵称提交
  submitDataName(e) {
    var name = e.detail.value.rName
    if(name){
      let url = app_data.base +'User/updateUsername';
      let token = app_data.token;
      let params = {username:name,token:token};
      http.Post({url:url,params:params}).then((res)=>{
          if(res.code == 'success'){
            this.setData({
              showModalStatus: false,
              username: name
            })
            app.alert({title:res.msg});
            app.getUserInfo();
          }
      });
    }else{
      app.alert({ title: '昵称不能为空' });
    }
  },
  //修改详情
  modifyinfo(e){
    this.setData({
      showModalStatus:true
    })
  },
  //关闭弹窗
  closeWindow(e){
    this.setData({
      showModalStatus:false
    })
  },
  
  //修改头像
  updateAvatar(e){
    let user_avatar = this.data.avatar;
    let url = app_data.base +'Public/uploadImg?type=user_avatar&is_small=1';
    http.Select({count:1}).then((res)=>{
      return Promise.all(res.map((path, index) => {
        let num = index+1;
        return http.Upload({count:1,url:url,path:path,num:num});
      }));
    }).then((res)=>{
        if(res[0]){
          user_avatar = res[0];
          let url = app_data.base + 'User/updateAvatar';
          let params = {token:app_data.token,avatar:res[0]};
          return http.Post({url:url,params:params});
        }else{
          return {code:'fail'}
        }
    }).then((res)=>{
        if(res.code == 'success'){
            app.getUserInfo();
            app.alert({title:res.msg});
            this.setData({
              avatar: user_avatar
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