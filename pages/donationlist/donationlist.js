// pages/donationmanagement/donationmanagement.js
const app = getApp();
const app_data = app.globalData;
const http = require("../../utils/http.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    avatar: '',
    mobile: '',
    username: '',
    page: 1,
    count: 0,
    date:'',
    list: {},
    isLast: false,
    class_name: ['', 'timeing', 'ings', 'signed', 'cancel','feedback'],
    status_name: ['', '已发起', '查看物流', '查看详情', '查看详情','查看详情'],
    no_msg:'',
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '捐赠管理'
    });
    app.checkLogin();
    this.setUserInfo();
    this.getData({ refresh: false, is_first: true });
  },

  setUserInfo() {
    let user_info = app_data.user_info;
    this.setData({
      username: user_info.username,
      avatar: user_info.avatar,
      mobile: user_info.mobile
    });
  },


  getData(obj) {
    let url = app_data.base + 'User/userDonation';
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
        let res_list = res.data.data;
        let count = res.data.count;
        let money = res.data.money;
        let date = res.data.date;
        if (obj.is_first) {
          list = res_list
        } else {
          list = list.concat(res_list);
        }
        this.setData({
          list: list,
          count: count,
          money:money,
          date:date,
          isLast: res_list.length < 10 ? true : false,
        })
      }
    })
  },
  //去看看
  goHome(e) {
    wx.switchTab({
      url: '../index/index'
    })
  },

  redirectLink(e){
    let id = e.currentTarget.dataset.id;
    let status = e.currentTarget.dataset.status;
    switch (Number(status)){
      case 1:
        wx.navigateTo({
          url: '../inexpress/inexpress?id=' + id
        })
        break;
      case 2:
      case 3:
      case 4:
      case 5:
        wx.navigateTo({
          url: '../Detailsofdonation/Detailsofdonation?id=' + id + '&type=user'
        })
        break;
    }
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
        no_msg: "暂无更多数据~"
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