//app.js
const util = require('/utils/util.js')
const http = require("/utils/http.js")
App({
  globalData: {
    open_id :null,
    is_login: false,
    user_info: null,
    token: null,
    mobile_status:0,
    institution_status:0,
    base: "https://api.qibu131.cn/",
  },
  onLaunch: function (options) {
    this.setUserInfo(options);
    this.wxLogin();
  },
  setUserInfo(options) {
    let open_id = wx.getStorageSync('open_id')
    let user_info = wx.getStorageSync('user_info')
    let token = wx.getStorageSync('token')
    if (token) {
      this.globalData.token = token
    } 
    if (open_id) {
      this.globalData.open_id = open_id
    }
    if (user_info) {
      this.globalData.user_info = user_info
      this.globalData.is_login = true
      this.globalData.institution_status = user_info.institution_status
      this.globalData.mobile_status = user_info.mobile_status
    }
  },
  wxLogin() {
    if(!this.globalData.open_id){
      wx.login({
        success: (res) => {
          this.wxCodeGetOpenId(res.code)
        }
      })
    }else{
      let user_info = wx.getStorageSync('user_info')
      if(!user_info){
        this.getUserInfo();
      }
    }
  },
  wxCodeGetOpenId(code) {
    let url = this.globalData.base + 'Public/getOpenId'
    let data = { code: code }
    http.Post({ url: url, params: data}).then((res) => {
      if(res.code == 'success'){
        wx.setStorageSync('open_id', res.data.open_id);
        this.globalData.open_id = res.data.open_id;
        this.getUserInfo();
      }
    })
  },
  getUserInfo() {
    let open_id = wx.getStorageSync('open_id')
    let url = this.globalData.base + 'Public/getUserInfo'
    let data = { open_id: open_id }
    http.Post({ url: url, params: data }).then((res) => {
      if(res.code == 'success'){
        wx.setStorageSync('user_info', res.data);
        wx.setStorageSync('token', res.data.token);
        this.globalData.token = res.data.token;
        this.globalData.user_info = res.data;
        this.globalData.mobile_status = res.data.mobile_status;
        this.globalData.institution_status = res.data.institution_status;
        this.globalData.is_login = true;
      }
     
    })
  },
  modal(obj){
    return new Promise((resolve, reject) => {
      wx.showModal({
        title: obj.title ? obj.title : '提示',
        content: obj.content ? obj.content : '哈哈',
        showCancel: true,
        cancelText: obj.cancelText ? obj.cancelText : '取消',
        cancelColor: "#000",
        confirmText: obj.confirmText ? obj.confirmText : '确定',
        confirmColor: "#0f0",
        success: (res) => {
          resolve(res);
        },
        fail: (res) => {
          reject(res);
        }
      });
    });
  },
  alert(obj){
    wx.showToast({
      title: obj.title ? obj.title : 'ok',
      icon: 'none',
      duration: obj.time ? obj.time : 1000,
      mask: true
    })
  },
  redirectLogin() {
    wx.switchTab({
      url: '/pages/my/my',
    })
  },
  hideShareMenu() {
    wx.hideShareMenu();
  }
})