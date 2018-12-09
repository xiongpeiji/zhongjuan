// pages/message/message.js
const app = getApp();
const base = app.globalData.base;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    messageList:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '消息'
    });
  },
  //消息详情
  msgDetails(e){
    wx.navigateTo({
      url: '../messageDetail/messageDetail'
    })
  },
  //获取消息列表
  getMessageList(e){
    var that = this;
    wx.request({
      url: base + '/SystemInfo/index?token=123456&page=1',
      success(res) {
        var data = res.data.data;
        var msg = res.data.msg
        console.log(msg);
        that.setData({
          messageList:msg
        })
      },
      fail(err) {
        console.log(err)
      }
    });
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.getMessageList();
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