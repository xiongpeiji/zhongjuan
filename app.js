//app.js
const util = require('/utils/util.js')
const http = require("/utils/http.js")
App({
  globalData: {
    open_id :null,
    is_login: false,
    user_info: null,
    token: null,
    base: "https://api.qibu131.cn/",
    util: util,
    http: http
  },
  onLaunch: function (options) {
    this.setUserInfo(options);
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
    }
  },
  wxLogin() {
    if(!this.globalData.open_id){
      wx.login({
        success: (res) => {
          this.wxCodeGetOpenId(res.code)
        }
      })
    }
  },
  wxCodeGetOpenId(code) {
    let url = this.globalData.base + 'Public/getOpenId'
    let data = { code: code }
    http.Post({ url: url, params: data}).then((res) => {
      if(res.code == 'success'){
        wx.setStorageSync('open_id', res.data.open_id);
        this.globalData.open_id = res.data.open_id;
      }
    })
  },
  getUserInfo() {
    let token = wx.getStorageSync('token')
    let url = this.globalData.base + 'User/index'
    let data = { token: token }
    http.Post({ url: url, params: data }).then((res) => {
      if (res.code == 'not_login') {
        return false
      }
      wx.setStorageSync('user_info', res.data);
      this.globalData.user_info = res.data;
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
  redirectLogin() {
    wx.navigateTo({
      url: '/pages/my/my',
    })
  },
})