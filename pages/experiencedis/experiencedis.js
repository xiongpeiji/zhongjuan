// pages/experiencedis/experiencedis.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    current: 1,
    swiper_all: 0,
    xindedetails: {
      goods_gallery_urls:[
        '/images/img_big1_03.jpg',
        '/images/img_big2.jpg',
        '/images/img_big1_03.jpg',
        '/images/img_big2.jpg',
        '/images/img_big1_03.jpg',
        '/images/img_big2.jpg',
      ]
    },
  },
  /**生命周期函数--监听页面加载*/
  onLoad(options) {
    wx.setNavigationBarTitle({
      title: '心得详情'
    });
    this.getDetail();
  },
  getDetail(){
      this.setData({
        swiper_all: this.data.xindedetails.goods_gallery_urls.length
      })
  },
  swiper(e) {
    var current = e.detail.current;
    this.setData({
      current: current + 1
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
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})