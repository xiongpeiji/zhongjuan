//app.js
const util = require('/utils/util.js')
const http = require("/utils/http.js")
App({
  globalData: {
    open_id :null,
    user_info: null,
    token: null,
    mobile_status:null,
    mobile:null,
    base: "https://api.51aizj.com/",
    share_img: ['/images/share_img/1.jpg','/images/share_img/2.jpg'],
    share: {}
  },
  onLaunch: function (options) {
    this.setUserInfo(options);
    this.wxLogin();
    this.setShare();
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
      this.globalData.mobile = user_info.mobile
      this.globalData.is_login = true
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
      if(res.code == 'success' && res.data){
        wx.setStorageSync('user_info', res.data);
        wx.setStorageSync('token', res.data.token);
        this.globalData.token = res.data.token;
        this.globalData.user_info = res.data;
        this.globalData.mobile = res.data.mobile;
        this.globalData.mobile_status = res.data.mobile_status;
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
  setTabBarMsg(){
    let token = this.globalData.token;
    if(token){
      let url = this.globalData.base + 'SystemInfo/getSystemInfoCount'
      let data = { token: token }
      http.Get({ url: url, params: data }).then((res) => {
        if (res.code == 'success') {
          let numbers = res.data.count;
          if (numbers>0){
            wx.setTabBarBadge({
              index: 2,
              text: numbers
            })
          }else{
            wx.removeTabBarBadge({
              index: 2
            })
          }
        }
      })
    }
  },
  redirectLogin() {
    wx.switchTab({
      url: '/pages/my/my',
    })
  },
  hideShareMenu() {
    wx.hideShareMenu();
  },
  setShare(){
    let share_img = this.globalData.share_img;
    let num = new Date().getSeconds() % share_img.length;
    let img = share_img[num];
    this.globalData.share = {
        title: '折翼天使的救助站',
        path: '/pages/index/index',
        imageUrl: img
    }
  },
  //检测没有登录则跳转至我的页面
  checkLogin(){
    let open_id = wx.getStorageSync('token');
    if(!open_id){
      wx.switchTab({
        url: '/pages/my/my',
      })
    }
  }
})