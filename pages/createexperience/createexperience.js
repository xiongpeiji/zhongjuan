// pages/createexperience/createexperience.js
const app = getApp();
const app_data = app.globalData;
const http = require("../../utils/http.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id:0,
    images:[],
    title:'',
    content:'',
  },
  //添加图片
  uploadImg(e){
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '创建心得'
    });
    let id = options.id;
    if(id > 0){
      this.setData({
        id:id
      })
    }
    if(this.data.id > 0){
      this.getExperience();
    }
  },

  getExperience(){
    let url = app_data.base+'/User/experienceDetail'
    let params = {token:app_data.token,id:this.data.id};
    http.Get({url:url,params:params}).then((res)=>{
      if(res.code == 'success'){
        this.setData({
          title:res.data.title,
          content:res.data.content,
          images:res.data.images,
        });
      }
    })
  },

  sendData(e){
    console.log(e);
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