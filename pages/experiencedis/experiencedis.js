// pages/experiencedis/experiencedis.js
const app = getApp();
const app_data = app.globalData;
let http = require("../../utils/http.js")
Page({
  /**
   * 页面的初始数据
   */
  data: {
    current: 1,
    swiper_all: 0,
    id:0,
    info: {},
    page:1,
    list:{},
    comment_num:0,
    up_num:0,
    share_num:0,
    is_up:0,
    content:'',
    token:null,
    no_msg: '',
    shareMax:true,
    input_status:true,
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
  },
  /**生命周期函数--监听页面加载*/
  onLoad(options) {
    wx.setNavigationBarTitle({
      title: '心得详情'
    });
    if (options.scene) {
      options.id = options.scene;
    }  
    this.setData({
      id: options.id,
      width: app_data.deviceInfo.windowWidth,
      height: app_data.deviceInfo.windowHeight
    })
    this.getDetail();
    this.getData({ refresh: false, is_first: true });
  },
  //获取详情信息
  getDetail(){
    let url = app_data.base +'Experience/detail';
    let params = {id:this.data.id,token:app_data.token};
    http.Get({url:url,params:params}).then((res)=>{
      if(res.code == 'success'){
        this.setData({
          info: res.data,
          swiper_all: res.data.image.length,
          up_num:res.data.up_num,
          share_num:res.data.share_num,
          is_up:res.data.is_up,
          comment_num:res.data.comment_num
        })
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
  experienceUp(e) {
    if (!this.data.token) {
      this.showDialog();
      return;
    }
    let url = app_data.base + '/Experience/experienceUp'
    let params = { token: app_data.token, id: this.data.id };
    http.Post({ url: url, params: params }).then((res) => {
      if (res.code == 'success') {
        let is_up = this.data.is_up == 1 ? 0 : 1;
        let up_num = is_up == 1 ? +this.data.up_num + 1 : +this.data.up_num - 1;
        this.setData({ up_num: up_num, is_up: is_up});
      }
    })
  },
  commentUp(e){
    if (!this.data.token) {
      this.showDialog();
      return;
    }
    let comment_id = e.currentTarget.dataset.id;
    let is_up = e.currentTarget.dataset.val;
    let index = e.currentTarget.dataset.index;
    let url = app_data.base + '/Comment/experienceCommentUp'
    let params = { token: app_data.token, id: comment_id };
    http.Get({ url: url, params: params }).then((res) => {
      if (res.code == 'success') {
        let list = this.data.list;
        list[index].is_up = is_up == 0 ? 1 : 0;
        list[index].comment_up_num = is_up == 0 ? +list[index].comment_up_num + 1 : +list[index].comment_up_num - 1;
        this.setData({list:list});
      }
    })
  },
  getData(obj) {
    let url = app_data.base + 'Comment/experienceComment';
    let params = {
      experience_id:this.data.id,
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

  setContent(e){
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
    let url = app_data.base + '/Comment/addExperienceComment'
    let params = { token: app_data.token, experience_id: this.data.id, content: this.data.content };
    http.Post({ url: url, params: params }).then((res) => {
      if (res.code == 'success') {
        this.getData({ refresh: false, is_first: true });
        let comment_num = +this.data.comment_num + 1;
        this.setData({ content: '', comment_num: comment_num });
      }
    })
  },
  //跳转到评论列表
  goCommentList(e){
    if (!this.data.token) {
      this.showDialog();
      return;
    }
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../experiencecomment/experiencecomment?id='+id
    });
  },

  swiper(e) {
    var current = e.detail.current;
    this.setData({
      current: current + 1
    })
  },

  shareWeixin(){
    this.setData({
      shareMax:false
    })
  },

  closeShareMax(){
    this.setData({
      shareMax: true
    })
  },

  /**
  * 页面上拉触底事件的处理函数
  */
  onReachBottom() {
    let page = this.data.page;
    if (this.data.isLast) {
      this.setData({
        no_msg: "没有更多评论啦~"
      })
    } else {
      page = page + 1;
      this.setData({
        page: page
      })
      this.getData({ refresh: true, is_first: false });
    }
  },

  onReady: function () {
    //获得dialog组件
    this.setToken();
    this.dialog = this.selectComponent("#dialog");
    if (app_data.token) {
      let user_info = wx.getStorageSync('user_info');
      if (user_info.avatar) {
        this.getImgPath(user_info.avatar).then((res) => {
          this.setData({
            avatar: res,
            username: user_info.username
          })
        });
      }
    }
  },

  setToken() {
    app.getToken().then((res) => {
      if(res){
        this.setData({
          token: res,
          input_status:false,
        });
      }
    })
  },
  
  setInputStatus(){
    if (!this.data.token) {
      this.showDialog();
      return;
    }
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

  showImages(e){
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
    let share_img = this.data.info.image;
    let num = new Date().getSeconds() % share_img.length;
    let img = share_img[num];
    let _this = this;
    return {
      title: this.data.info.title,
      imageUrl: img,
      success: function (res) {
        let url = app_data.base + 'Experience/experienceShare';
        let params = { token: app_data.token, id: _this.data.id };
        http.Post({ url: url, params: params }).then((res) => {
          if (res.code == 'success') {
            _this.setData({
              shareMax:true,
              share_num: +_this.data.share_num + 1,
            })
          }
        });
      }
    }
  },

  /**
* 页面相关事件处理函数--监听用户下拉动作
*/
  onPullDownRefresh: function () {
    this.setData({
      page: 1,
    })
    this.getDetail();
    this.getData({ refresh: true, is_first: true });
  }
})