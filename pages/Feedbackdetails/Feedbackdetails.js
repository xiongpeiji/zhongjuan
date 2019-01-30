// pages/experiencedis/experiencedis.js
const app = getApp();
const app_data = app.globalData;
let http = require("../../utils/http.js")
Page({
  /**
   * 页面的初始数据
   */
  data: {
    id: 0,
    user_donation_id:0,
    info: {},
    comment_num: 0,
    up_num: 0,
    is_up: 0,
    content: '',
    token: null,
    placeholder:'输入评论…',
    from_user_id:0,
    inputFocus:false,
  },
  /**生命周期函数--监听页面加载*/
  onLoad(options) {
    wx.setNavigationBarTitle({
      title: '动态详情'
    });
    if (app_data.token) {
      this.setData({
        token: app_data.token
      })
    }
    if(options.id){
      this.setData({
        id: options.id,
      })
    }
    if (options.user_donation_id) {
      this.setData({
        user_donation_id: options.user_donation_id,
      })
    }
    this.getDetail();
  },
  //获取详情信息
  getDetail() {
    let url = app_data.base + 'Feedback/detail';
    let params = { id: this.data.id, user_donation_id: this.data.user_donation_id, token: app_data.token };
    http.Get({ url: url, params: params }).then((res) => {
      if (res.code == 'success') {
        this.setData({
          id:res.data.id,
          user_donation_id:res.data.user_donation_id,
          info: res.data,
          up_num: res.data.up_num,
          is_up: res.data.is_up,
          comment_num: res.data.comment_num
        })
      }
    });
  },
  setFrom(e){
    let from_user_id = e.currentTarget.dataset.id;
    let name = e.currentTarget.dataset.name;
    this.setData({
      from_user_id:from_user_id,
      placeholder: name,
      inputFocus:true,
    })
  },
  feedbackUp(e) {
    if (!this.data.token) {
      this.showDialog();
      return;
    }
    let url = app_data.base + '/Feedback/feedbackUp'
    let params = { token: app_data.token, id: this.data.id };
    http.Post({ url: url, params: params }).then((res) => {
      if (res.code == 'success') {
        let is_up = this.data.is_up == 1 ? 0 : 1;
        let up_num = is_up == 1 ? +this.data.up_num + 1 : +this.data.up_num - 1;
        this.setData({ up_num: up_num, is_up: is_up });
      }
    })
  },
  setContent(e) {
    this.setData({
      content: e.detail.value
    })
  },

  comment(e) {
    if (!this.data.token) {
      this.showDialog();
      return;
    }
    if (!this.data.content) {
      app.alert({ title: '请输入评论内容！' });
      return;
    }
    let url = app_data.base + '/Comment/addFeedbackComment'
    let params = { token: app_data.token, feedback_id: this.data.id, from_user_id:this.data.from_user_id,content: this.data.content };
    http.Post({ url: url, params: params }).then((res) => {
      if (res.code == 'success') {
        this.setData({
          content:'',
          from_user_id:0,
          placeholder: '输入评论…',
          inputFocus: false,
        })
        this.getDetail({ refresh: false, is_first: true });
      }
    })
  },

  onReady: function () {
    //获得dialog组件
    if (!this.data.token) {
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
        this.setToken();
        this.getDetail();
        this.getData({ refresh: false, is_first: true });
        wx.showToast({
          title: '授权登录成功',
        })
      }
    });
  },

  showImages(e) {
    let img = e.currentTarget.dataset.img;
    wx.previewImage({
      current: img, // 当前显示图片的http链接
      urls: this.data.info.image // 需要预览的图片http链接列表
    })
  },

  /**
  * 用户点击右上角分享
  */
  onShareAppMessage: function () {
    return app_data.share;
  },

  /**
* 页面相关事件处理函数--监听用户下拉动作
*/
  onPullDownRefresh: function () {
    this.getDetail();
  }
})