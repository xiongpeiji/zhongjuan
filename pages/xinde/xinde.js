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
    isLast:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '心得'
    });
    this.getData({ refresh: false, is_first: true });
  },
  showDetail(e){
    let id = e.currentTarget.dataset.id;
    let token = wx.getStorageSync('token')
    if (!token) {
      app.modal({ content: '请登录后再查看！', confirmText: '立即登录' }).then((res) => {
        if (res.confirm) {
          app.redirectLogin();
        }
      });
      return false;
    }
    wx.navigateTo({
      url: '../experiencedis/experiencedis?id=' + id
    });
  },

  getData(obj) {
    let url = app_data.base + 'Index/experience';
    let params = {
      token: app_data.token,
      page: this.data.page,
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

  /**
  * 页面相关事件处理函数--监听用户下拉动作
  */
  onPullDownRefresh: function () {
    this.setData({
      page:1,
    })
    this.getData({ refresh: true, is_first: true });
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {
    let page = this.data.page;
    if (this.data.isLast) {
      app.alert({ title: '暂无更多数据', time: 2000 });
    } else {
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
    return app_data.share;
  }
})