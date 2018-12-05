// pages/donationdetail/donationdetail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    focus:false,//是否获得焦点
    usersShow:true,//是否显示用户列表
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
  //显示捐赠用户列表
  showUser(e){
    this.setData({
      usersShow:false
    })
  },
  //隐藏用户头像
  hideUsers(e){
    this.setData({
      usersShow:true
    })
  },
  //评论获取焦点
  commentFn(e){
    this.setData({
      focus:true
    })
  },
  //进入列表页
  goCommentList(e){
    wx.navigateTo({
      url: '../comment/comment'
    });
  },
  //我要捐助
  wantTodo(e){
    wx.navigateTo({
      url: '../wanttodonate/wanttodonate'
    });
  },
  /**生命周期函数--监听页面加载*/
  onLoad(options) {
    wx.setNavigationBarTitle({
      title: '求捐详情'
    });
    this.getDetail();
  },
  //获取详情信息
  getDetail(){
      this.setData({
        swiper_all: this.data.xindedetails.goods_gallery_urls.length
      })
  },
  //跳转到评论列表
  

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