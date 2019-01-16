// pages/wanttodonate/wanttodonate.js
const app = getApp();
const app_data = app.globalData;
const http = require("../../utils/http.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    images: [],
    id: 0,
    institution:{},
    user_donation:{},
    donation:{},
    express_data: [],//快递信息
    express_num: '',
    express: {},
    disabled:false,
    username:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.checkLogin();
    wx.setNavigationBarTitle({
      title: '我要捐助'
    });
    this.setData({
      username:app_data.user_info.username,
      id:options.id
    });
    this.getData();
  },
  //选择快递公司
  bindExpressChange(e) {
    let index = e.detail.value;
    let express = this.data.express_data[index];
    if (express) {
      this.setData({
        express: express
      })
    }
  },

  setExpressNum(e){
    this.setData({
      express_num: e.detail.value
    })
  },
  //获取我要求捐信息
  getData(e) {
    let url = app_data.base + 'Donation/getUserDonationDetail';
    let params = { id: this.data.id, token: app_data.token };
    http.Get({ url: url, params: params }).then((res) => {
      if (res.code == 'success') {
        this.setData({
          institution: res.data.institution,
          user_donation: res.data.user_donation,
          donation: res.data.donation,
          material: res.data.material,
          express_data: res.data.express,
        })
      }
    });
  },
  //提交我要捐助消息 Donation/saveUserDonation
  submit() {
    let url = app_data.base + 'Donation/saveUserDonationLast';
    let params = {
      id: this.data.id,
      token: app_data.token,
      express_num: this.data.express_num,//快递单号
      express_id: this.data.express.id,//快递id
      imgs: this.data.images, //图片
    };
    this.setData({
      disabled: true
    })
    http.Post({ url: url, params: params }).then((res) => {
      if (res.code == 'success') {
          wx.navigateTo({
            url: '/pages/stutaspage/stutaspage?status=success',
          })
      }else{
        this.setData({
          disabled: false
        })
      }
    });
  },
  //相关图片上传
  uploadArrPhoto() {
    let user_avatar = this.data.avatar;
    let url = app_data.base + 'Public/uploadImg?type=user_donation';
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

  /**
  * 生命周期函数--监听页面隐藏
  */
  onHide: function () {
    this.setData({
      express_num: '',
      disabled: false
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
  //进入页面
  /**
  * 用户点击右上角分享
  */
  onShareAppMessage: function () {
    return app_data.share;
  }
})