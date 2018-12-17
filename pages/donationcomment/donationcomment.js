// pages/comment/comment.js
const app = getApp();
const app_data = app.globalData;
const http = require("../../utils/http.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: 0,
    list: [],
    info: [],
    page: 1,
    isLast: false,
    up_num: 0,
    comment_num: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '求捐评论回复'
    });
    this.data.id = options.id;
    this.getDetail();
    this.getData({ refresh: false, is_first: true });
  },
  getDetail() {
    let url = app_data.base + 'Comment/donationReply';
    let params = {
      token: app_data.token,
      donation_comment_id: this.data.id
    }
    http.Get({ url: url, params: params }).then((res) => {
      if (res.code == 'success') {
        let info = res.data;
        this.setData({
          info: info,
          up_num: info.comment_up_num,
          comment_num: info.comment_num,
        })
      }
    })
  },
  getData(obj) {
    let url = app_data.base + 'Comment/donationReplyComment';
    let params = {
      token: app_data.token,
      page: this.data.page,
      donation_comment_id: this.data.id
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

  setContent(e) {
    this.setData({
      content: e.detail.value
    })
  },

  comment(e) {
    if (!this.data.content) {
      app.alert({ title: '请输入回复内容！' });
      return;
    }
    let url = app_data.base + '/Comment/addDonationReplayComment'
    let params = { token: app_data.token, donation_comment_id: this.data.id, content: this.data.content };
    http.Post({ url: url, params: params }).then((res) => {
      if (res.code == 'success') {
        this.getData({ refresh: false, is_first: true });
        let comment_num = +this.data.comment_num + 1;
        this.setData({ content: '', comment_num: comment_num });
      }
    })
  },

  commentUp(e) {
    let comment_id = e.currentTarget.dataset.id;
    let is_up = e.currentTarget.dataset.val;
    let index = e.currentTarget.dataset.index;
    if (is_up > 0) {
      app.alert({ title: '您已经点过赞了！' });
      return;
    }
    let url = app_data.base + '/Comment/donationCommentReplyUp'
    let params = { token: app_data.token, id: comment_id };
    http.Get({ url: url, params: params }).then((res) => {
      if (res.code == 'success') {
        let list = this.data.list;
        list[index].is_up = is_up == 0 ? 1 : 0;
        list[index].up_num = +list[index].up_num + 1;
        this.setData({ list: list });
      }
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

  }
})