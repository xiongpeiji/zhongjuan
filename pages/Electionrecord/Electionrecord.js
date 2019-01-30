// pages/Donationrecord/Donationrecord.js
const app = getApp();
const app_data = app.globalData;
const http = require("../../utils/http.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    page: 1,
    list: {},
    isLast: false,
    institution: {},
    stutas: '',
    no_msg: '',
    donation_count: 0,
    institution_count: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '选捐记录'
    });
    app.checkLogin();
    this.getData({ refresh: false, is_first: true });
  },
  //去选捐
  ToQiuJuan() {
    wx.navigateTo({
      url: '../Donationrecord/Donationrecord',
    })
  },
  //发起求捐
  InitiateHelp(e) {
    //正在审核
    if (this.data.stutas == 1) {
      app.alert({ title: '机构信息正在认证中，请等待认证通过后再发布！', time: 2000 });
      return;
    }
    //审核失败，
    if (this.data.stutas == 3) {
      app.alert({ title: '机构信息认证失败，请重新认证通过后再发布！', time: 2000 });
      return;
    }
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../editseekinginformation/editseekinginformation?id=' + id
    });
  },
  //获取我的求捐列表
  getData(obj) {
    let url = app_data.base + 'User/getDonationList';
    let params = {
      token: app_data.token,
      page: this.data.page,
      type:'institution'
    }
    http.Get({ url: url, params: params, loading: obj.refresh }).then((res) => {
      if (res.code == 'success') {
        if (obj.refresh) {
          wx.stopPullDownRefresh();
        }
        let list = this.data.list;
        let res_list = res.data.data;
        if (obj.is_first) {
          list = res_list
        } else {
          list = list.concat(res_list);
        }
        this.setData({
          list: list,
          donation_count: res.data.donation_count,
          institution_count: res.data.institution_count,
          isLast: res_list.length < 10 ? true : false,
          institution: res.data.institution,
          stutas: res.data.institution.status
        })
      }
    })
  },

  redirectLink(e) {
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../Detailsofdonation/Detailsofdonation?id=' + id + '&type=institution'
    })
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.setData({
      page: 1
    });
    this.getData({ refresh: true, is_first: true });
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {
    let page = this.data.page;
    if (this.data.isLast) {
      this.setData({
        no_msg: "没有更多选捐信息啦~"
      });
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