// pages/xinde/xinde.js
const app = getApp();
const base = app.globalData.base;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    xindeList:{},
    pageNum:1,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '心得'
    });
  },
  showDetail(e){
    wx.navigateTo({
      url: '../experiencedis/experiencedis'
    });
  },
  //获取心得列表
  getXinDeList(e){
    var that = this;
    wx.request({
      url: base + '/Index/experience',
      data: {
        page: this.data.pageNum
      },
      success(res) {
        var data = res.data.data;
        if (data) {
          console.log(data);
          that.setData({
            xindeList:data
          })
        }
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
    this.getXinDeList();
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
    this.setData({
      pageNum: ++this.data.pageNum
    })
    this.getXinDeList();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})