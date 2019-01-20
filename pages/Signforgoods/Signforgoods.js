// pages/Signforgoods/Signforgoods.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    k:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '受捐反馈'
    });
  },
  //签收按钮
  singFn(e){
    wx.showModal({
      content: '爱心物资已经到达，确定收到 爱心物资吗？',
      cancelColor:'#818181',
      confirmColor:'#E14A32',
      success: function (res) {
        if (res.confirm) {
          console.log('点击确认回调')
          wx.navigateTo({
            url: '../Donationsign/Donationsign'
          });
        } else {
          console.log('点击取消回调')
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

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