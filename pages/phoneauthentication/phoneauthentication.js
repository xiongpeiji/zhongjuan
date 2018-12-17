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
    disabled:false
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '手机认证'
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
        })
        setTimeout(() => {
          app.redirectLogin();
        }, 2000);
      }
    })
  },
  
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return app_data.share;
  }
})