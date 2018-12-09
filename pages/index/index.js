//index.js
const app = getApp();
const base = app.globalData.base;
Page({
  data: {
    imgUrls: [],//banner图片
    qiujuanList:[],//求捐列表
    state:false,
    first_click:false,
    indicatorDots: true,
    autoplay: true,
    interval: 8000,
    duration: 1000,
    indicatorcolor:'rgba(238,238,238,.6)',
    indicatoractivecolor:'#fff'
  },
  //求捐详情页面
  qiujuanDetail(e){
    var id = e.currentTarget.dataset.id;
    console.log(e);
    wx.navigateTo({
      url: '../donationdetail/donationdetail?token=123456&id='+id
    });
  },
  //下拉加载
  toggle(){
      var list_state = this.data.state,
          first_state = this.data.first_click;
      if (!first_state){
          this.setData({
            first_click: true
          });
      }
      if (list_state){
          this.setData({
            state: false
          });
      }else{
          this.setData({
            state: true
          });
      }
  },
  //隐藏蒙版
  hideArea(e){
    this.setData({
      state:false,
      first_click:false,
    });
  },
  onLoad: function (options) {
    var token = wx.getStorageSync('token');
    if (token) {
      this.token = token;
    }
    this.invite_code = options.invite_code;
    if (this.invite_code) {
      wx.setStorage({
        key: 'invite_code',
        data: this.invite_code
      })
    }
    var userInfo = wx.getStorageSync('userInfo');
    if (userInfo) {
      this.userInfo = userInfo;
      var level = userInfo.level;
      if (level) {
        this.setData({
          level: userInfo.level
        })
      }
    }
    //初始化
    this.init();
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    this.setData({
      state:false,
      first_click:false,
    });
  },
  
  init() {
    var that = this;
    wx.request({
      url: base + '/Index/index',
      success(res) {
        var data = res.data.data;
        if (data.advert) {
          that.setData({
            imgUrls: data.advert
          });
        }
      },
      fail(err) {
        console.log(err)
      }
    });
    //获取求捐信息列表
    wx.request({
      url: base + '/Index/donation',
      success(res) {
        var data = res.data.data;
        console.log(res,'求捐信息')
        if (data) {
          that.setData({
            qiujuanList: data
          });
        }
      },
      fail(err) {
        console.log(err)
      }
    })
  },
})