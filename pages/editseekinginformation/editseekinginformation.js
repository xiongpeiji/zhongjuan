// pages/editseekinginformation/editseekinginformation.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    images:null,
    len:9,
    first_click: false,
  },
  //添加图片
  modifyPhoto(e){
    var that = this;
    wx.chooseImage({
      count:that.data.len,
      sizeType: ['original'],
      sourceType: ['album'],
      success: res=> {
        const tempFilePaths = res.tempFilePaths
        that.setData({
          images:tempFilePaths,
        })
        // that.setData({
        //   len:9-that.data.images.length
        // })
        // console.log(that.data.len)
      }
    })
  },
  //打开选择面板
  addGoods(e){
    var that = this;
    that.setData({
      first_click:true,
    })
  },
  //隐藏选择面板
  hideMasxing(e){
    var that = this;
    that.setData({
      first_click:false,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '编辑求捐信息'
    });
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