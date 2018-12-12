// pages/experiencedis/experiencedis.js
const app = getApp();
const base = app.globalData.base;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    current: 1,
    swiper_all: 0,
    id:'',
    xindedetails: {},
  },
  /**生命周期函数--监听页面加载*/
  onLoad(options) {
    this.data.id = options.id;//获取求捐详情id
    wx.setNavigationBarTitle({
      title: '心得详情'
    });
    this.getDetail();
  },
  //获取详情信息
  getDetail(id){
      let that = this;
      let token = wx.getStorageSync("token");
      wx.request({
        url: base + 'Experience/detail',
        data: {
          token:token,
          id:that.data.id
        },
        success(res) {
          var data = res.data.data;
          that.setData({
            xindedetails:data,
            swiper_all: data.image.length
          })
        },
        fail(err) {
          console.log(err)
        }
      });
  },
  //跳转到评论列表
  goCommentList(e){
    wx.navigateTo({
      url: '../comment/comment'
    });
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