// pages/DonationdetailsNew/DonationdetailsNew.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    focus:false,
    current: 1,
    swiper_all: 0,
    usersShow: true,
    moreShow: false,//显示更多
    moreJuanzhu:false,
    loveList:4,
    juanzhuList:3,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '求捐详情'
    });
    this.isThree();
  },
  //设置输入框隐藏
  setFocus() {
    if (!this.data.token) {
      // this.showDialog();
      return;
    }
    this.setData({
      focus: true
    })
  },
  swiper(e) {
    var current = e.detail.current;
    this.setData({
      current: current + 1
    })
  },
  //显示捐赠用户列表
  showUser(e) {
    this.setData({
      usersShow: false
    })
  },
  //隐藏用户头像
  hideUsers(e) {
    this.setData({
      usersShow: true
    })
  },
  //展示更多
  showMore(e) {
    this.setData({
      moreShow: true,
    })
  },
  //展示更多二
  showJuanzhu(){
    this.setData({
      moreJuanzhu: true,
    })
  },
  //判断爱心列表是否大于3条才显示展示更多按钮
  isThree(){
    console.log(this.data.loveList >= 3)
    if (this.data.loveList>=3){
      this.setData({
        moreShow: false
      })
    }else{
      this.setData({
        moreShow: true
      })
    }
  },

  isThree() {
    console.log(this.data.juanzhuList >= 3)
    if (this.data.juanzhuList >= 3) {
      this.setData({
        moreJuanzhu: false
      })
    } else {
      this.setData({
        moreJuanzhu: true
      })
    }
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