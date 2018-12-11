// pages/donationdetail/donationdetail.js
const app = getApp();
const base = app.globalData.base;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    focus: false, //是否获得焦点
    usersShow: true, //是否显示用户列表
    current: 1,
    swiper_all: 0,
    xindedetails: {},
    id:''
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
  //评论获取焦点
  commentFn(e) {
    this.setData({
      focus: true
    })
  },
  //进入列表页
  goCommentList(e) {
    wx.navigateTo({
      url: '../comment/comment'
    });
  },
  //我要捐助
  wantTodo(e) {
    wx.navigateTo({
      url: '../wanttodonate/wanttodonate'
    });
  },
  /**生命周期函数--监听页面加载*/
  onLoad(options) {
    this.data.id = options.id;//获取求捐详情id
    
    console.log(options);
    this.setData({
      id:this.data.id,
    });
    wx.setNavigationBarTitle({
      title: '求捐详情'
    });
    this.getDetail();
  },
  //获取详情信息
  getDetail() {
    var that = this;
    console.log(that.data.id);
    let token = wx.getStorageSync('token')
    wx.request({
      url: base + '/Donation/detail?token='+token+'&id=' + that.data.id,
      success(res) {
        var data = res.data.data;
        if (data) {
          console.log(data);
          that.setData({
            xindedetails: data,
          })
          if(data!=''){
            that.setData({
              swiper_all: that.data.xindedetails.image.length
            })
          }
          
        }
      },
      fail(err) {
        console.log(err)
      }
    });
  },
  //跳转到评论列表
  swiper(e) {
    var current = e.detail.current;
    this.setData({
      current: current + 1
    })
  },
  //分享
  //https://api.qibu131.cn/Donation/donationShare
  donationShare(e){
    var that = this;
    wx.request({
      url: base + '/Donation/donationShare?token=123456&id=' + that.data.id,
      success(res) {
        var data = res.data.data;
        if (data) {
          console.log(data);
          
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
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})