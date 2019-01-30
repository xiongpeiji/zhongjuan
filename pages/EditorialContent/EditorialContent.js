// pages/EditorialContent/EditorialContent.js
const app = getApp();
const app_data = app.globalData;
const http = require("../../utils/http.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    focus:false,
    user_donation_id:0,
    num:'',
    content:'',
    images:[],
    user_info:{},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.checkLogin();
    wx.setNavigationBarTitle({
      title: '捐赠反馈'
    });
    this.setData({
      user_donation_id: options.user_donation_id,
    });
    this.getData();
  },
  getData() {
    let url = app_data.base + '/User/getUserDonationUserInfo'
    let params = { token: app_data.token, user_donation_id: this.data.user_donation_id };
    http.Get({ url: url, params: params }).then((res) => {
      if (res.code == 'success') {
        this.setData({
          user_info: res.data.user_info,
        });
      }
    })
  },

  setNum(e) {
    this.setData({
      num: e.detail.value
    })
  },

  setContent(e) {
    this.setData({
      content: e.detail.value
    })
  },

  uploadImg() {
    let url = app_data.base + 'Public/uploadImg?type=feedback';
    http.Select({ count: 9 - this.data.images.length }).then((res) => {
      return Promise.all(res.map((path, index) => {
        let num = index + 1;
        return http.Upload({ count: 9 - this.data.images.length, url: url, path: path, num: num });
      }));
    }).then((res) => {
      wx.hideLoading()
      if (res.length > 0) {
        let images = this.data.images;
        images = images.concat(res);
        this.setData({
          images: images
        })
      }
    })
  },
  // 删除图片
  deleteImg(e) {
    var imgs = this.data.images;
    var index = e.currentTarget.dataset.index;
    imgs.splice(index, 1);
    this.setData({
      images: imgs
    });
  },

  sendData() {
    let url = app_data.base + 'Feedback/saveFeedback'
    let num = this.data.num;
    let content = this.data.content;
    let images = this.data.images;
    if (!num) {
      app.alert({ title: '请输入分发人数！' })
      return
    }
    if (!content) {
      app.alert({ title: '请输入反馈内容！' })
      return
    }
    if (images.length < 1 || images.length > 9) {
      app.alert({ title: '请上传1-9张反馈图片！' })
      return
    }
    let params = {
      user_donation_id: this.data.user_donation_id,
      token: app_data.token,
      num: num,
      content: content,
      imgs: images,
    }
    http.Post({ url: url, params: params }).then((res) => {
      if (res.code == 'success') {
        this.setData({
          images: [],
          num: '',
          content: '',
        });
        wx.navigateTo({
          url: '../Feedbacksuccess/Feedbacksuccess?id='+res.data.id+'&type='+this.data.user_info.type,
        })
      }
    })
  },

  //展示textArea
  showTextArea(e){
    this.setData({
      focus:true
    })
  },

  /**
 * 用户点击右上角分享
 */
  onShareAppMessage: function () {
    return app_data.share;
  }
})