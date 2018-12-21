//app.js
const util = require('/utils/util.js')
const http = require("/utils/http.js")
const common = require("/utils/common.js")
App({
  globalData: {
    app_id:'wxaa31789e58d234c5',
    secret:'ec443912e8488508cee7ee8a584afa70',
    open_id:null,
    union_id:null,
    user_info: null,
    token: null,
    mobile_status:null,
    mobile:null,
    base: "https://api.51aizj.com/",
    share_img: ['/images/share_img/1.jpg','/images/share_img/2.jpg'],
    share: {}
  },
  onLaunch: function (options) {
    let token = wx.getStorageSync('token')
    this.globalData.token = token;
    let open_id = wx.getStorageSync('open_id');
    this.globalData.open_id = open_id;
    if (open_id){
      this.getUserInfo();
    }
    this.setShare();
  },
  wxLogin(obj) {
    let open_id = wx.getStorageSync('open_id');
    let union_id = wx.getStorageSync('union_id');
    if(open_id && union_id){
      return new Promise((resolve)=>{
        this.getUserInfo().then((res)=>{
          if(res.code == 'fail'){
            if (obj.username && obj.avatar) {
              return this.register(obj);
            }else{
              return { code: 'fail'}
            }
          }else{
            return res;
          }
        }).then((res)=>{
          resolve(res);
        })
      });  
    }else{
      return new Promise((resolve) => {
        common.wechatLogin().then((res) => {
          return this.getOpenId(res.code);
        }).then((res) => {
          if (res.code == 'success') {
            return this.getUserInfo();
          } else {
            return res;
          }
        }).then((res)=>{
          if (res.code == 'fail') {
            return this.register(obj);
          }else{
            return res;
          }
        }).then((res) => {
            resolve(res);
        });
      });
    }
  },

  getOpenId(code){
    return new Promise((resolve) => {
      let url = this.globalData.base + 'Public/getOpenId'
      let data = { code: code }
      return http.Post({ url: url, params: data }).then((res)=>{
        if (res.code == 'success') {
          console.log(res);
          wx.setStorageSync('open_id', res.data.open_id);
          wx.setStorageSync('union_id', res.data.union_id);
          resolve({ code: 'success' });
        }else{
          resolve({ code: 'fail' });
        }
      });
    });
  },
  getUserInfo() {
    return new Promise((resolve) => {
      let open_id = wx.getStorageSync('open_id')
      let url = this.globalData.base + 'Public/getUserInfo'
      let data = { open_id: open_id }
      http.Post({ url: url, params: data }).then((res) => {
        if (res.code == 'success' && res.data) {
          wx.setStorageSync('user_info', res.data);
          wx.setStorageSync('token', res.data.token);
          this.globalData.user_info = res.data;
          this.globalData.mobile = res.data.mobile;
          this.globalData.mobile_status = res.data.mobile_status;
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
      let open_id = wx.getStorageSync('open_id');
      let union_id = wx.getStorageSync('union_id');
      let login_data = { open_id: open_id, username: obj.username, avatar: avatar, union_id: union_id }
      return http.Post({
        url: url, params: login_data, loading: true, message: '正在登录'}).then((res) => {
        if (res.code == 'success') {
          wx.setStorageSync('user_info', res.data);
          wx.setStorageSync('token', res.data.token);
          this.globalData.token = res.data.token;
          this.globalData.user_info = res.data;
          this.globalData.mobile = res.data.mobile;
          this.globalData.mobile_status = res.data.mobile_status;
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
  redirectLogin() {
    console.log(111111);
    wx.switchTab({
      url: '/pages/index/index',
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