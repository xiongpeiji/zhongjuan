// pages/editingmaterials/editingmaterials.js
const app = getApp();
const app_data = app.globalData;
const http = require("../../utils/http.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    avatar: null,
    username:null,
    showModalStatus: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '编辑资料'
    });
    this.setUserInfo();
  },

  setUserInfo(){
    let user_info = wx.getStorageSync('user_info');
    this.setData({
      avatar:user_info.avatar,
      username:user_info.username
    })
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
  updateAvatar(e){
    let url = app_data.base +'/Public/uploadImg?type=user_avatar';
    http.Select({count:3}).then((res)=>{
      return res.map((path,index)=>{
        let num = index+1;
        http.Upload({count:3,url:url,path:path,num:num});
      });
    }).then((res)=>{
        console.log(res);
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