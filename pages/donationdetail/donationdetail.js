// pages/DonationdetailsNew/DonationdetailsNew.js
const app = getApp();
const app_data = app.globalData;
let http = require("../../utils/http.js")
let utils = require("../../utils/util.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    focus: false,
    current: 1,
    swiper_all: 0,
    usersShow: true,
    moreShow: false, //显示更多
    moreJuanzhu: false,
    loveList: 4,
    juanzhuList: 3,
    showBar: '',
    toView: '',
    nav_bar: '',
    curScrollTop: '',
    id: 0,
    info: {},
    comment_num: 0,
    up_num: 0,
    share_num: 0,
    content: '',
    token: null,
    shareMax: true,
    moreShow: false,//显示更多
    isTalking: true,//是否可评论
    share_mini_program: '',
    flag: true,
    width: 0,
    height: 0,
    tempPath: "",
    show_flag: true,
    canvasHeight: 0,
    modalMarginTop: "6%",
    modal_height: "",
    avatar: '',
    share_img: '',
    username: '',
    warmTips: true,
    hiddenBody: false,
    textnum: 0,//详情文字数量
    status: 0,
    user_donation:{},
    comment:{},
    feedback:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.setNavigationBarTitle({
      title: '求捐详情'
    });
    this.isThree();
    if (options.scene) {
      options.id = options.scene;
    }
    this.setData({
      id: options.id,
      width: app_data.deviceInfo.windowWidth,
      height: app_data.deviceInfo.windowHeight
    })
    this.getDetail({ refresh: false });
     setTimeout(() => {
       this.isThree();
      }, 2000);
  },

  //回首页
  goHome(e) {
    wx.switchTab({
      url: '../index/index'
    })
  },

  //显示机构信息弹窗
  goInstitution(e) {
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../insdetail/insdetail?id=' + id + '&type=donation'
    });
  },
  //获取详情信息
  getDetail(obj) {
    let url = app_data.base + 'Donation/donationDetail';
    let params = { id: this.data.id, token: app_data.token };
    http.Get({ url: url, params: params,loading:obj.refresh }).then((res) => {
      if (res.code == 'success') {
        if (obj.refresh) {
          wx.stopPullDownRefresh();
        }
         this.setData({
          info: res.data,
          swiper_all: res.data.image.length,
          up_num: res.data.up_num,
          share_num: res.data.share_num,
          comment_num: res.data.comment_num,
          id: res.data.id,
          share_mini_program: res.data.share_img,
          status: res.data.status,
          user_donation:res.data.user_donation,
          feedback:res.data.feedback,
          comment:res.data.comment,
        });
        let num = new Date().getSeconds() % res.data.image.length;
        let img = res.data.image[num];
        this.getImgPath(img).then((res) => {
          this.setData({
            share_img: res
          })
        });
        this.getImgPath(res.data.share_img).then((res) => {
          this.setData({
            share_mini_program: res
          })
        });
      }
    });
  },
  commentUp(e) {
    if (!this.data.token) {
      this.showDialog();
      return;
    }
    let comment_id = e.currentTarget.dataset.id;
    let is_up = e.currentTarget.dataset.val;
    let index = e.currentTarget.dataset.index;
    let url = app_data.base + '/Comment/donationCommentUp'
    let params = { token: app_data.token, id: comment_id };
    http.Get({ url: url, params: params }).then((res) => {
      if (res.code == 'success') {
        let list = this.data.list;
        list[index].is_up = is_up == 0 ? 1 : 0;
        list[index].comment_up_num = is_up == 0 ? +list[index].comment_up_num + 1 : +list[index].comment_up_num - 1;
        this.setData({ list: list });
      }
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
    let url = app_data.base + '/Comment/addDonationComment'
    let params = { token: app_data.token, donation_id: this.data.id, content: this.data.content }
    http.Post({ url: url, params: params }).then((res) => {
      if (res.code == 'success') {
        this.getDetail();
        this.setData({
          content:'',
          focus:false,
        })
      }
    })
  },

  setContent(e) {
    this.setData({
      content: e.detail.value
    })
  },

  setCommentMax() {
    if (!this.data.content) {
      this.setData({ focus: false });
    }
  },

  //我想想捐助
  wantTodo(e) {
    if (this.data.status == 3) {
      app.alert({ title: '求捐已结束！' })
      return
    }
    if (!this.data.token) {
      this.showDialog();
      return;
    }
    let mobile_status = app_data.mobile;
    if (!mobile_status) {
      app.alert({ title: '请先进行手机认证！', time: 2000 });
      setTimeout(() => {
        wx.navigateTo({
          url: '../phoneauthentication/phoneauthentication',
        })
      }, 2000);
      return;
    }
    wx.navigateTo({
      url: '../wanttodonone/wanttodonone?id=' + this.data.id
    });

  },

  //设置输入框隐藏
  setFocus() {
    if (!this.data.token) {
      this.showDialog();
      return;
    }
    this.setData({
      focus: true
    })
  },
  swiper(e) {
    var current = e.detail.current;
    this.setData({
      current: current + 1
    })
  },
  //展示更多
  showMore(e) {
    //跳转到新页面
    this.setData({
       moreShow: true,
    })
  },
  //展示更多二
  showJuanzhu() {
    //跳转到新页面
    this.setData({
      moreJuanzhu: true,
    })
  },

  //显示捐赠用户列表
  showUser(e) {
    this.setData({
      usersShow: false
    })
  },
  //隐藏用户头像
  hideUsers(e) {
    this.setData({
      usersShow: true
    })
  },
  //scrollTop
  scrollTop(e) {
    let top = e.detail.scrollTop,
      nav_bar = '';
    this.curScrollTop = top;
    if (top >= 50) {
      this.setData({
        showBar: 'show'
      })
    } else {
      this.setData({
        showBar: ''
      })
    }
    if (this.stopScroll > 0) {
      this.stopScroll--;
      return;
    }
    if (top >= this.detailTop && top < this.unionTop) {
      nav_bar = 'detail'
    } else if (top >= this.unionTop && top < this.commentTop) {
      nav_bar = 'union'
    } else if (top >= this.commentTop) {
      nav_bar = 'comment';
    }
    this.setData({
      nav_bar: nav_bar
    })
  },

  toViewAction(e) {
    let id = e.currentTarget.dataset.id;
    this.setData({
      toView: id,
      nav_bar: id
    });
    setTimeout(() => {
      this.setData({
        curScrollTop: this.curScrollTop - 48
      });
    }, 0);
    this.stopScroll = 2;
  },
  //判断爱心列表是否大于3条才显示展示更多按钮
  isThree() {
    if (this.data.user_donation.length >= 3) {
      this.setData({
        moreShow: false
      })
    } else {
      this.setData({
        moreShow: true
      })
    }
    if (this.data.feedback.length >= 3) {
      this.setData({
        moreJuanzhu: false
      })
    } else {
      this.setData({
        moreJuanzhu: true
      })
    }
  },


  shareWeixin() {
    this.setData({
      shareMax: false
    })
  },

  closeShareMax() {
    this.setData({
      shareMax: true
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    this.setToken();
    this.dialog = this.selectComponent("#dialog");
    const detailQuery = wx.createSelectorQuery()
    detailQuery.select('#detail').boundingClientRect()
    detailQuery.selectViewport().scrollOffset()
    detailQuery.exec((res) => {
      this.detailTop = res[0].top;
      console.log(this)
    });
    const commentQuery = wx.createSelectorQuery()
    commentQuery.select('#comment').boundingClientRect()
    commentQuery.selectViewport().scrollOffset()
    commentQuery.exec((res) => {
      this.commentTop = res[0].top;
    })
    const unionQuery = wx.createSelectorQuery()
    unionQuery.select('#union').boundingClientRect()
    unionQuery.selectViewport().scrollOffset()
    unionQuery.exec((res) => {
      this.unionTop = res[0].top;
    })
  },

  setToken() {
    app.getToken().then((res) => {
      if (res) {
        this.setData({
          token: res,
        });
      }
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
        this.getData();
        this.getDetail();
        wx.showToast({
          title: '授权登录成功',
        })
      }
    });
  },

  //生成分享图
  createShareImg() {
    this.closeShareMax();
    if (!this.data.share_img || !this.data.share_mini_program) {
      app.alert({ title: '图片转换失败！' });
      return;
    }
    var that = this;
    var modal_width = this.data.width * 0.865;
    var modal_height = this.data.height * 0.9;
    var ctx = wx.createCanvasContext('share-image');
    //清空画布
    ctx.clearRect(0, 0, modal_width, modal_height)
    //绘制背景色
    ctx.setFillStyle('#fff')
    ctx.fillRect(0, 0, modal_width, modal_height);
    //绘制背景色
    var temp_height = 0;
    if (this.data.avatar) {
      //绘制背景图
      ctx.save()
      ctx.beginPath()
      ctx.arc(modal_width * 0.1, modal_width * 0.1, modal_width * 0.05, 0, 2 * Math.PI)
      ctx.clip()
      ctx.drawImage(this.data.avatar, modal_width * 0.05, modal_width * 0.05, 0.1 * modal_width, 0.1 * modal_width)
      ctx.restore()
      ctx.setFontSize(14)
      ctx.setFillStyle('#5a5a5a')
      ctx.fillText(this.data.username, modal_width * 0.2, modal_height * 0.05);
      ctx.setFontSize(18)
      ctx.setFillStyle('#000')
      var result = this.breakLinesForCanvas(this.data.info.title.replace(/\s/g, ""), modal_width * 0.7, ctx)
      for (var i = 0; i < result.length; i++) {
        if (i < 1) {
          ctx.fillText('"' + result[i] + '"', modal_width * 0.2, modal_height * 0.1)
        }
      }
    } else {
      ctx.setFontSize(18)
      ctx.setFillStyle('#000')
      var result = this.breakLinesForCanvas(this.data.info.title.replace(/\s/g, ""), modal_width * 0.8, ctx)
      for (var i = 0; i < result.length; i++) {
        if (i < 1) {
          ctx.fillText('"' + result[i] + '"', modal_width * 0.1, modal_height * 0.08)
        }
      }
    }
    ctx.save()
    temp_height = modal_width * 0.15 + 20;
    ctx.drawImage(this.data.share_img, modal_width * 0.1, temp_height, modal_width * 0.8, modal_height * 0.45)
    temp_height = temp_height + modal_height * 0.45
    ctx.setFontSize(14)
    ctx.setFillStyle('#000')
    var result = this.breakLinesForCanvas(this.data.info.share_content.replace(/\s/g, ""), modal_width - modal_width * 0.1, ctx)
    for (var i = 0; i < result.length; i++) {
      if (i < 3) {
        temp_height = temp_height + 20
        ctx.fillText(result[i], modal_width * 0.05, temp_height)
      }
    }
    ctx.save()
    temp_height = temp_height + 10
    ctx.drawImage(this.data.share_mini_program, modal_width / 3, temp_height, modal_width / 3, modal_width / 3)
    ctx.save()
    temp_height = temp_height + modal_width / 3 + 20
    ctx.setFontSize(14)
    ctx.setFillStyle('#5a5a5a')
    ctx.fillText('进入众捐小程序查看详情', modal_width / 4 + 10, temp_height);
    ctx.save()
    ctx.draw()
    that.setData({
      flag: false,
      canvasHeight: modal_height,
    })
    setTimeout(function () {
      that.setTempPath({ modal_width: modal_width, modal_height: modal_height });
      wx.hideLoading()
    }, 1000);
  },

  breakLinesForCanvas: function (text, width, ctx) {
    var result = [];
    var breakPoint = 0;
    while ((breakPoint = this.findBreakPoint(text, width, ctx)) !== -1) {
      result.push(text.substr(0, breakPoint));
      text = text.substr(breakPoint);
    }
    if (text) {
      result.push(text);
    }
    return result;
  },

  findBreakPoint: function (text, width, context) {
    var min = 0;
    var max = text.length - 1;
    while (min <= max) {
      var middle = Math.floor((min + max) / 2);
      var middleWidth = context.measureText(text.substr(0, middle)).width;
      var oneCharWiderThanMiddleWidth = context.measureText(text.substr(0, middle + 1)).width;
      if (middleWidth <= width && oneCharWiderThanMiddleWidth > width) {
        return middle;
      }
      if (middleWidth < width) {
        min = middle + 1;
      } else {
        max = middle - 1;
      }
    }

    return -1;
  },

  setTempPath(obj) {
    var that = this;
    wx.canvasToTempFilePath({
      canvasId: 'share-image',
      width: obj.modal_width,
      height: obj.modal_height,
      success: function (tempRes) {
        that.setData({
          tempPath: tempRes.tempFilePath,
        })
      }
    })
  },

  getImgPath(img_url) {
    return new Promise((resolve) => {
      wx.getImageInfo({
        src: img_url,
        success(res) {
          resolve(res.path);
        }
      })
    })
  },

  saveShareImg() {
    let that = this;
    if (!this.data.tempPath) {
      app.alert({ title: '保存失败' });
    }
    this.getWechatSetting().then((res) => {
      if (!res.authSetting['scope.writePhotosAlbum']) {
        wx.authorize({
          scope: 'scope.writePhotosAlbum',
          success() {
            that.saveImg();
          }, fail() {
            app.modal({ content: '将图片保存至相册需要访问相册权限，请设置为允许访问相册', confirmText: '允许' }).then((res) => {
              wx.openSetting({
                success: (res) => {
                  if (res.authSetting["scope.writePhotosAlbum"]) {
                    that.saveImg();
                  }
                }
              })
            })
          }
        });
      } else {
        this.saveImg();
      }
    });

  },

  getWechatSetting() {
    return new Promise((resolve) => {
      wx.getSetting({
        success: function (res) {
          resolve(res);
        }
      });
    })
  },

  saveImg() {
    let that = this;
    wx.saveImageToPhotosAlbum({
      filePath: this.data.tempPath,
      success: function (res) {
        that.setData({
          flag: true,
        })
        wx.showToast({
          title: '保存成功',
          icon: "success"
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
 * 页面相关事件处理函数--监听用户下拉动作
 */
  onPullDownRefresh: function () {
    this.getDetail({ refresh: true });
  },

  /**
 * 用户点击右上角分享
 */
  onShareAppMessage: function () {
    let share_img = this.data.info.image;
    let num = new Date().getSeconds() % share_img.length;
    let img = share_img[num];
    let _this = this;
    return {
      title: this.data.info.title,
      imageUrl: img,
      success: function (res) {
        let url = app_data.base + 'Donation/donationShare';
        let params = { token: app_data.token, id: _this.data.id };
        http.Post({ url: url, params: params }).then((res) => {
          if (res.code == 'success') {
            _this.setData({
              share_num: +_this.data.share_num + 1,
            })
          }
        });
      }
    }
  }
})