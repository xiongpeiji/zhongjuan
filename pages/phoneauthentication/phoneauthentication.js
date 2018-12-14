// pages/phoneauthentication/phoneauthentication.js
const app = getApp();
const base = app.globalData.base;
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
  onReady: function () {
    
  },
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
    var that = this
    that.setData({
      disabled:true
    })
    let token = wx.getStorageSync('token');
    var myreg = /^[1][3,4,5,7,8,9][0-9]{9}$/;
    var mobile = this.data.mobile;
    console.log(mobile)
    if (myreg.test(mobile)) {
      wx.request({
        url: base + '/User/sendCode',
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        method: 'post',
        data: {
          mobile: mobile,
          token:token
        },
        success(res) {
          var code = res.data.code;
          if (code == 'success') {
            that.getCode();
            wx.showToast({
              title: '验证码已发送'
            })
          }else{
            that.setData({
              disabled:false
            })
          }
        }
      })
    } else {
      that.setData({
        disabled:false
      })
      wx.showToast({
        title: '号码格式错误'
      })
    }
  },
  //验证码提交
  submit(){
    let token = wx.getStorageSync('token');
    var code = this.data.code;
    var mobile = this.data.mobile;
    var reg = /^[0-9]{4}$/;
    var myreg = /^[1][3,4,5,7,8,9][0-9]{9}$/;
    if (!myreg.test(mobile)){
      wx.showToast({
        title: '手机格式错误'
      });
      return;
    }
    if (!reg.test(code)) {
      wx.showToast({
        title: '验证码错误'
      });
      return;
    }
    wx.request({
      url: base + '/User/updateMobile',
      data: {
        token: token,
        mobile: this.data.mobile,
        code: this.data.code
      },
      method: 'post',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success(res) {
        var code = res.data.code;
        wx.showToast({
          title: code
        })
      }
    })
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