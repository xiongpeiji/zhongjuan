// pages/experiencelist/experiencelist.js
const app = getApp();
const app_data = app.globalData;
const http = require("../../utils/http.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    page:1,
    count : 0,
    list:{},
    isLast:false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '心得列表'
    });
    this.getData({ refresh: false,is_first:true});
  },

  getData(obj){
    let url = app_data.base +'User/experience';
    let params = {
      token:app_data.token,
      page:this.data.page,
    }
    http.Get({url:url,params:params,loading:obj.refresh}).then((res)=>{
      if(res.code == 'success'){
          let list = this.data.list;
          let res_list = res.data;
          if(obj.is_first){
            list = res_list
          }else{
            list = list.concat(res_list);
          }
          this.setData({
            list: list,
            count:list.length,
            isLast: res_list.length < 10 ? true : false,
          })
      }
    })
  },

  //没有心得去发布按钮
  toPush(id){
    wx.navigateTo({
      url: '../createexperience/createexperience'
    })
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.getData({ refresh: true, is_first: true });
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {
    var page = this.data.page;
    if (this.data.isLast) {
      app.alert({ title: '暂无更多数据',time:2000});
    } else {
      let page = this.data.page;
      page = page + 1;
      this.setData({
        page: page
      })
      this.getData({ refresh: true, is_first: false });
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})