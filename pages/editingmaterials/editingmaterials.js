// pages/editingmaterials/editingmaterials.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    images: '/images/user_icon_01.png',
    nick_name:'大箩贝先生',
    showModalStatus: false,
    nameLength:9
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '编辑资料'
    });
  },
  //修改昵称提交
  submitDataName(e) {
    var name = e.detail.value.rName
    if(name){
      this.setData({
        showModalStatus:true,
        nick_name:name
      });
      this.setData({
        showModalStatus:false
      })
    }else{
      wx.showToast({
          title: '昵称不能为空',
          icon:'none',
          duration: 1000,
          mask:true
      })
    }
    
  },
  //修改详情
  modifyinfo(e){
    console.log(e)
    this.setData({
      showModalStatus:true
    })
  },
  //关闭弹窗
  closeWindow(e){
    this.setData({
      showModalStatus:false
    })
  },
  
  //修改头像
  modifyPhoto(e){
    var that = this;
    wx.chooseImage({
      count:1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: res=> {
        const tempFilePaths = res.tempFilePaths
        console.log(tempFilePaths)
        that.setData({
          images:tempFilePaths
        })
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