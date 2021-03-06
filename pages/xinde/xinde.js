// pages/xinde/xinde.js
const app = getApp();
const app_data = app.globalData;
let http = require("../../utils/http.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:{},
    page:1,
    isLast:false,
    no_msg:'',
    token:null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '心得'
    });
    if(app_data.token){
      this.setData({
        token:app_data.token
      })
    }
    this.getData({ refresh: false, is_first: true });
  },
  showDetail(e){
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../experiencedis/experiencedis?id=' + id
    });
  },
  //创建心得
  creatXinde(e){
    let id = e.currentTarget.dataset.id;
    if(!this.data.token){
      this.showDialog();
    }else{
      wx.navigateTo({
        url: '../createexperience/createexperience?id=' + id
      })
    }
  },
  getData(obj) {
    let url = app_data.base + 'Index/experience';
    let params = {
      page: this.data.page,
      token:this.data.token
    }
    http.Get({ url: url, params: params, loading: obj.refresh }).then((res) => {
      if (res.code == 'success') {
        if (obj.refresh) {
          wx.stopPullDownRefresh();
        }
        let list = this.data.list;
        let res_list = res.data;
        if (obj.is_first) {
          list = res_list
        } else {
          list = list.concat(res_list);
        }
        this.setData({
          list: list,
          isLast: res_list.length < 10 ? true : false,
        })
      }
    })
  },

  showImages(e) {
    let img = e.currentTarget.dataset.img;
    let key = e.currentTarget.dataset.key;
    wx.previewImage({
      current: img, // 当前显示图片的http链接
      urls: this.data.list[key].image // 需要预览的图片http链接列表
    })
  },

  experienceUp(e){
    let id = e.currentTarget.dataset.id;
    let key = e.currentTarget.dataset.key;
    if (!this.data.token) {
      this.showDialog();
      return
    }
    let url = app_data.base + '/Experience/experienceUp'
    let params = { token: this.data.token, id:id };
    http.Post({ url: url, params: params }).then((res) => {
      if (res.code == 'success') {
        let list = this.data.list;
        list[key].is_up = list[key].is_up == 1 ? 0 : 1;
        list[key].up_num = list[key].is_up == 1 ? +list[key].up_num + 1 : +list[key].up_num - 1;
        this.setData({list:list});
      }
    })
  },

  /**
  * 页面相关事件处理函数--监听用户下拉动作
  */
  onPullDownRefresh: function () {
    this.setData({
      page:1,
    })
    this.getData({ refresh: true, is_first: true });
    app.setTabBarMsg()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {
    let page = this.data.page;
    if (this.data.isLast) {
      if (this.data.list.length > 0) {
        this.setData({
          no_msg: "没有更多心得啦~"
        });
      }
    } else {
      page = page + 1;
      this.setData({
        page: page
      })
      this.getData({ refresh: true, is_first: false });
    }
  },
  //获取未读消息条数
  onShow(){
    app.setTabBarMsg()
  },

  onReady: function () {
    //获得dialog组件
    if(!this.data.token){
      this.setToken();
    }
    this.dialog = this.selectComponent("#dialog");
  },

  setToken() {
    app.getToken().then((res) => {
      this.setData({
        token: res
      });
    })
  },

  showDialog: function () {
    this.dialog.showDialog();
  },

  confirmEvent: function () {
    this.dialog.hideDialog();
  },

  bindGetUserInfo: function (e) {
    // 用户点击授权后，这里可以做一些登陆操作
    let obj = {
      encryptedData: e.detail.encryptedData,
      iv: e.detail.iv,
    }
    app.wxLogin(obj).then((res) => {
      if (res.code == 'success') {
        app.getUserInfo();
        this.getData({ refresh: false, is_first: true });
        this.setToken();
        wx.showToast({
          title: '授权登录成功',
        })
      }
    });
  },

 

  /**
  * 用户点击右上角分享
  */
  onShareAppMessage: function () {
    return app_data.share;
  }
})