//app.js
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        wx.request({
          url: 'https://api.qibu131.cn/Public/getOpenId',
          data: {
            code: res.code
          },
          header: {
            'content-type': 'application/x-www-form-urlencoded'
          },
          method: 'post',
          success: res => {
            wx.setStorageSync('openId',res.data.data.open_id);
            let openId = wx.getStorageSync('openId');
            if (openId) {
              let that = this;
              wx.getUserInfo({
                success: function (res) {
                  console.log(res)
                },
                fail: function () {
                  // fail
                  console.log("获取失败！")
                },
                complete: function () {
                  // complete
                  console.log("获取用户信息完成！")
                }
              })
            }
          }
        })
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  init() {
    var that = this;
    wx.request({
      url: this.globalData.base,
      data: {
        source: "mini_program"
      },
      success(res) {
        var data = res.data.data;
        that.globalData.initData = data;
        console.log(res)
      },
      fail(err) {
        console.log(err)
      }
    })
  },
  globalData: {
    userInfo: null,
    base: "https://api.qibu131.cn/",
    initData: {}
  }
})