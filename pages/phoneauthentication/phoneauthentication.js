// pages/phoneauthentication/phoneauthentication.js
const app = getApp();
const app_data = app.globalData;
const http = require("../../utils/http.js")
var interval = null //倒计时函数
Page({

  /**
   * 页面的初始数据
   */
  data: {
    mobile: 0,
    code: '',
    currentTime:60,
    timeText: '立即获取',
    fun_id:2,
    disabled:false,
    tip:"为了保证信息安全，请验证您的手机号",
    isFocus:false,
    isFocus1:false,
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.checkLogin();
    let mobile = app_data.mobile;
    let title = "手机认证";
    if(mobile){
      this.setData({
        tip: "手机更换之后，众捐小程序内您的联系方式将会变更为您的新号码，当前号码：" + mobile
      })
      title = '更换手机号' 
    }
    wx.setNavigationBarTitle({
      title:title
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  mobileInputEvent(e){
      this.setData({
        mobile:e.detail.value
      })
  },
  regCode(e) {
    this.setData({
      code: e.detail.value
    })
  },
  //input获取焦点
  isfocusThis(e){
    this.setData({
      isFocus:true,
      isFocus1:false
    })
  },
  //input获取焦点
  isfocusThis1(e) {
    this.setData({
      isFocus: false,
      isFocus1: true
    })
  },
  //去除焦点
  removeActive(e){
    this.setData({
      isFocus: false,
    })
  },
  //去除焦点
  removeActive1(e) {
    this.setData({
      isFocus1: false
    })
  },
  getCode (options){
    var that = this;
    var currentTime = that.data.currentTime
    interval = setInterval(function () {
      currentTime--;
      that.setData({
        timeText: currentTime+'秒'
      })
      if (currentTime <= 0) {
        clearInterval(interval)
        that.setData({
          timeText: '重新发送',
          currentTime:60,
          disabled: false   
        })
      }
    }, 1000)  
  },
  sendPhoneCode(e){
    var myreg = /^[1][3,4,5,7,8,9][0-9]{9}$/;
    var mobile = this.data.mobile;
    if (myreg.test(mobile)) {
      let url = app_data.base +'User/sendCode';
      let params = {token:app_data.token,mobile:mobile};
      http.Post({url:url,params:params}).then((res)=>{
        if(res.code == 'success'){
          wx.showToast({
            title: '验证码已发送'
          })
          this.setData({
            disabled:true
          });
          this.getCode();
        }
      })
    } else {
      wx.showToast({
        title: '手机号码格式错误',
        icon: 'none',
      })
    }
  },
  //验证码提交
  submit(){
    var code = this.data.code;
    var mobile = this.data.mobile;
    var reg = /^[0-9]{4}$/;
    var myreg = /^[1][3,4,5,7,8,9][0-9]{9}$/;
    if (!myreg.test(mobile)){
      wx.showToast({
        title: '手机号码格式错误',
        icon:'none',
      });
      return;
    }
    if (!reg.test(code)) {
      wx.showToast({
        title: '验证码错误',
        icon: 'none',
      });
      return;
    }
    let url = app_data.base + 'User/updateMobile';
    let params = { token: app_data.token, mobile: mobile,code:code};
    http.Post({ url: url, params: params }).then((res) => {
      if (res.code == 'success') {
        wx.showToast({
          title: res.msg
        });
        app.getUserInfo();
        setTimeout(() => {
          app.redirectUser();
        }, 1000);
      }
    })
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