// pages/Screen/Screen.js
const app = getApp();
const app_data = app.globalData;
let http = require("../../utils/http.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: {}, //求捐列表
    no_msg: '',
    isLast: false,
    region: ['全部', '全部', '全部'],
    customItem: '全部',
    active:true,
    province:'全部',
    city:'全部',
    area:'全部',
    page:1,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '筛选'
    });
    this.getData({ refresh: false, is_first: true });
  },
  //省市区选择
  bindRegionChange: function (e) {
    this.setData({
      region: e.detail.value,
      province: e.detail.value[0],
      city: e.detail.value[1],
      area: e.detail.value[2],
    })
    this.getData({ refresh: true, is_first: true });
  },

  getData(obj) {
    let url = app_data.base + 'Index/institutionList';
    let params = {
      page: this.data.page,
      province: this.data.province,
      city: this.data.city,
      area: this.data.area
    };
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
    });
  },

  showDetail(e) {
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../insdetail/insdetail?id=' + id + '&type=institution'
    });
  },

  showImages(e) {
    let img = e.currentTarget.dataset.img;
    let key = e.currentTarget.dataset.key;
    wx.previewImage({
      current: img, // 当前显示图片的http链接
      urls: this.data.list[key].image // 需要预览的图片http链接列表
    })
  },

  /**
  * 页面相关事件处理函数--监听用户下拉动作
  */
  onPullDownRefresh: function () {
    this.setData({
      page: 1,
    })
    this.getData({ refresh: true, is_first: true });
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {
    let page = this.data.page;
    if (this.data.isLast) {
      if (this.data.list.length > 0) {
        this.setData({
          no_msg: "没有更多机构啦~"
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return app_data.share;
  },
})