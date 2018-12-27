// pages/donationdetail/donationdetail.js
const app = getApp();
const app_data = app.globalData;
let http = require("../../utils/http.js")
Page({
  /**
  * 页面的初始数据
  */
  data: {
    focus:false,
    usersShow:true,
    current: 1,
    swiper_all: 0,
    institution_current:1,
    institution_swiper_all:0,
    id: 0,
    info: {},
    page: 1,
    list: {},
    comment_num: 0,
    up_num: 0,
    share_num: 0,
    content: '',
    no_msg:'',
    institution_info:{},
    institution_model:true,
    token:null,
    focus:false,
    shareMax: true,
    moreShow:false,//显示更多
    isTalking:true,//是否可评论
    share_mini_program:'',
    flag: true,
    width:0,
    height:0,
    tempPath: "",
    show_flag: true,
    canvasHeight: 0,
    modalMarginTop: "6%",
    modal_height: "",
    avatar:'',
    share_img:'',
    username:'',
    warmTips:true,
    hiddenBody:false,
    textnum:0,//详情文字数量
    status,
  },
  /**生命周期函数--监听页面加载*/
  onLoad(options) {
    wx.setNavigationBarTitle({
      title: '求捐详情'
    });
    this.setData({
        id:options.id,
        width: app_data.deviceInfo.windowWidth,
        height: app_data.deviceInfo.windowHeight
    })
    this.getDetail();
    this.getData({ refresh: false, is_first: true });
  },
  //展示更多
  showMore(e){
    this.setData({
      moreShow:false,
    })
  },
  //显示机构信息弹窗
  showMaxing(){
    this.setData({
      institution_model:false,
      hiddenBody:true
    })
  },
  //关闭弹窗
  closeModals(e){
    this.setData({
      institution_model: true,
      hiddenBody: false
    })
  },
  //关闭弹窗
  closeWarm(e){
    this.setData({
      warmTips:true,
      hiddenBody: false
    })
  },
  //获取机构详情文字长度
  getTextLength(val){
    return val.replace(/[\u0391-\uFFE5]/g, "a").length;   //先把中文替换成两个字节的英文，在计算长度
  },
  //获取详情信息
  getDetail() {
    let url = app_data.base + 'Donation/detail';
    let params = { id: this.data.id, token: app_data.token };
    http.Get({ url: url, params: params }).then((res) => {
      if (res.code == 'success') {
        let textLength = this.getTextLength(res.data.institution_info.desc);//获取文字长度
        this.setData({
          info: res.data,
          swiper_all: res.data.image.length,
          up_num: res.data.up_num,
          share_num: res.data.share_num,
          comment_num: res.data.comment_num,
          id:res.data.id,
          institution_swiper_all: res.data.institution_info.images.length,
          institution_info:res.data.institution_info,
          share_mini_program:res.data.share_img,
          textnum: textLength,
          status:res.data.status
        });
        console.log(this.data.textnum)
        if(this.data.textnum>=160){
          this.setData({
            moreShow:true
          })
        }else{
          this.setData({
            moreShow: false
          })
        }
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
  getData(obj) {
    let url = app_data.base + 'Comment/donationComment';
    let params = {
      donation_id: this.data.id,
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
        this.getData({ refresh: false, is_first: true });
        let comment_num = +this.data.comment_num + 1;
        this.setData({ content: '', comment_num: comment_num, focus:false});
      }
    })
  },

  setContent(e) {
    this.setData({
      content: e.detail.value
    })
  },

  setCommentMax(){
    if(!this.data.content){
      this.setData({focus: false });
    }
  },
  //跳转到评论列表
  goCommentList(e) {
    if (!this.data.token) {
      this.showDialog();
      return;
    }
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../donationcomment/donationcomment?id=' + id
    });
  },

  swiper(e) {
    var current = e.detail.current;
    this.setData({
      current: current + 1
    })
  },
  institutionSwiper(e){
    var current = e.detail.current;
    this.setData({
      institution_current: current + 1
    })
  },
  //设置输入框隐藏
  setFocus(){
    this.setData({
      focus:false
    })
  },
  //我想想捐助
  wantTodo(e){
    if(this.data.status == 3){
      app.alert({title:'求捐已结束'})
      return
    }
    if (!this.data.token) {
      this.showDialog();
      return;
    }
    let mobile_status = app_data.mobile;
    if(!mobile_status){
      app.alert({title:'请先进行手机认证！',time:2000});
      setTimeout(()=>{
        wx.navigateTo({
          url: '../phoneauthentication/phoneauthentication',
        })
      },2000);
      return;
    }
    this.setData({
      warmTips: false,
      hiddenBody: true
    })
    
  },
  //爱心已送出按钮
  sendLove(e){
    this.setData({
      warmTips: true,
      hiddenBody: false
    })
    wx.navigateTo({
      url: '../wanttodonate/wanttodonate?id=' + this.data.id
    });
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

  setFocus(){
    if (!this.data.token) {
      this.showDialog();
      return;
    }
    this.setData({
      focus:true
    })
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
  * 页面上拉触底事件的处理函数
  */
  onReachBottom() {
    let page = this.data.page;
    if (this.data.isLast) {
      this.setData({
        no_msg: '暂无更多评论~'
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
    if(app_data.token){
      let user_info = wx.getStorageSync('user_info');
      if(user_info.avatar){
        this.getImgPath(user_info.avatar).then((res) => {
          this.setData({
            avatar: res,
            username:user_info.username
          })
        });
      }
    }

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
      var result = this.breakLinesForCanvas(this.data.info.title, modal_width * 0.7, ctx)
      for (var i = 0; i < result.length; i++) {
        if (i < 1) {
          ctx.fillText('"' + result[i] + '"' , modal_width * 0.2, modal_height * 0.1)
        }
      }
    } else {
      ctx.setFontSize(18)
      ctx.setFillStyle('#000')
      var result = this.breakLinesForCanvas(this.data.info.title, modal_width * 0.8, ctx)
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
    var result = this.breakLinesForCanvas(this.data.info.content, modal_width - modal_width * 0.1, ctx)
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

  setTempPath(obj){
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

  getImgPath(img_url){
    return new Promise((resolve)=>{
      wx.getImageInfo({
        src: img_url,
        success(res) {
          resolve(res.path);
        }
      })
    })
  },

  saveShareImg(){
    let that = this;
    if(!this.data.tempPath){
      app.alert({title:'保存失败'});
    }
    this.getWechatSetting().then((res)=>{
      if (!res.authSetting['scope.writePhotosAlbum']) {
        wx.authorize({
          scope: 'scope.writePhotosAlbum',
          success() {
            that.saveImg();
          },fail(){
            app.modal({ content: '将图片保存至相册需要访问相册权限，请设置为允许访问相册', confirmText:'允许'}).then((res)=>{
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
      }else{
        this.saveImg();
      }     
    });

  },

  getWechatSetting(){
    return new Promise((resolve) => {
      wx.getSetting({
        success: function (res) {
          resolve(res);
        }
      });
    })
  },

  saveImg(){
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
      success:function(res){
        let url = app_data.base +'Donation/donationShare';
        let params = {token:app_data.token,id:_this.data.id};
        http.Post({url:url,params:params}).then((res)=>{
          if(res.code == 'success'){
              _this.setData({
                share_num:+_this.data.share_num+1,
              })
          }
        });
      }
    }
  }
})