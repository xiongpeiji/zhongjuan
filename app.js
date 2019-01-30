//app.js
const util = require('/utils/util.js')
const http = require("/utils/http.js")
const common = require("/utils/common.js")
App({
  globalData: {
    app_id:'wx658570b5cb789b91',
    secret:'5cad1c056ffa74452aa4c43e057d1fc0',
    public_open_id: null,
    user_info: null,
    token: null,
    mobile:null,
    base: "https://api.qibu131.cn/",
    share_img: ['/images/share_img/1.jpg','/images/share_img/2.jpg'],
    share: {},
    deviceInfo: {}
  },
  onLaunch: function (options) {
    this.getDeviceInfo();
    let token = wx.getStorageSync('token')
    this.globalData.token = token;
    let open_id = wx.getStorageSync('open_id');
    if (open_id) {
      this.getUserInfo();
    }
    this.setShare();
  },

  //获取设备初始化宽高
  getDeviceInfo() {
    var res = wx.getSystemInfoSync();
    res.rpxR = 750 / res.windowWidth;
    res.rpxWidth = res.rpxR * res.windowWidth;
    res.rpxHeight = res.rpxR * res.windowHeight;
    this.globalData.deviceInfo = res;
  },
  
  wxLogin(obj) {
    let open_id = wx.getStorageSync('open_id');
    if(open_id){
      return new Promise((resolve)=>{
        this.getUserInfo().then((res)=>{
          resolve(res);
        });
      });  
    }else{
      return new Promise((resolve) => {
        common.wechatLogin().then((res) => {
          obj.code = res.code;
          return this.register(obj);
        }).then((res)=>{
            resolve(res);
        });
      });
    }
  },
  getUserInfo() {
    return new Promise((resolve) => {
      let open_id = wx.getStorageSync('open_id')
      let url = this.globalData.base + 'Public/getUserInfo'
      let data = { open_id: open_id }
      http.Post({ url: url, params: data }).then((res) => {
        if (res.code == 'success' && res.data.token) {
          wx.setStorageSync('user_info', res.data);
          wx.setStorageSync('token', res.data.token);
          this.globalData.token = res.data.token;
          this.globalData.public_open_id = res.data.public_open_id;
          this.globalData.user_info = res.data;
          this.globalData.mobile = res.data.mobile;
          resolve({ code: 'success' });
        }else{
          resolve({ code: 'fail' });
        }
      })
    });
  },

  register(obj){
    return new Promise((resolve) => {
      let url = this.globalData.base + 'Public/login';
      let login_data = { data: obj.encryptedData,iv:obj.iv,code:obj.code}
      return http.Post({
        url: url, params: login_data}).then((res) => {
        if (res.code == 'success') {
          wx.setStorageSync('open_id', res.data.open_id);
          wx.setStorageSync('user_info', res.data);
          wx.setStorageSync('token', res.data.token);
          this.globalData.token = res.data.token;
          this.globalData.public_open_id = res.data.public_open_id;
          this.globalData.user_info = res.data;
          this.globalData.mobile = res.data.mobile;
          resolve({ code: 'success' });
        } else {
          resolve({ code: 'fail' });
        }
      })
    });
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
  redirectIndex() {
    wx.switchTab({
      url: '/pages/index/index',
    })
  },
  redirectUser() {
    wx.switchTab({
      url: '/pages/my/my',
    })
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

  getToken(){
    return new Promise((resolve) => {
      resolve(this.globalData.token);
    });
  },

  checkLogin(){
    let token = this.globalData.token;
    if (!token) {
      wx.switchTab({
        url: '/pages/my/my',
      })
    }
  }
})