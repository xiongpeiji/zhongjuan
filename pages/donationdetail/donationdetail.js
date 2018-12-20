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
    id: 0,
    info: {},
    page: 1,
    list: {},
    comment_num: 0,
    up_num: 0,
    share_num: 0,
    content: '',
    avatar:'',
    maxing:false,
    no_msg:''
  },
  /**生命周期函数--监听页面加载*/
  onLoad(options) {
    wx.setNavigationBarTitle({
      title: '求捐详情'
    });
    this.setData({
        id:options.id,
        avatar:app_data.user_info.avatar
    })
    app.checkLogin();
    this.getDetail();
    this.getData({ refresh: false, is_first: true });
  },
  //获取详情信息
  getDetail() {
    let url = app_data.base + 'Donation/detail';
    let params = { id: this.data.id, token: app_data.token };
    http.Get({ url: url, params: params }).then((res) => {
      if (res.code == 'success') {
        this.setData({
          info: res.data,
          swiper_all: res.data.image.length,
          up_num: res.data.up_num,
          share_num: res.data.share_num,
          comment_num: res.data.comment_num,
          id:res.data.id
        })
      }
    });
  },
  commentUp(e) {
    let comment_id = e.currentTarget.dataset.id;
    let is_up = e.currentTarget.dataset.val;
    let index = e.currentTarget.dataset.index;
    if (is_up > 0) {
      app.alert({ title: '您已经点过赞了！' });
      return;
    }
    let url = app_data.base + '/Comment/donationCommentUp'
    let params = { token: app_data.token, id: comment_id };
    http.Get({ url: url, params: params }).then((res) => {
      if (res.code == 'success') {
        let list = this.data.list;
        list[index].is_up = is_up == 0 ? 1 : 0;
        list[index].comment_up_num = +list[index].comment_up_num + 1;
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
    let content = e.detail.value;
    if (!content) {
      app.alert({ title: '请输入评论内容！' });
      return;
    }
    let url = app_data.base + '/Comment/addDonationComment'
    let params = { token: app_data.token, donation_id: this.data.id, content: content };
    http.Post({ url: url, params: params }).then((res) => {
      if (res.code == 'success') {
        this.getData({ refresh: false, is_first: true });
        let comment_num = +this.data.comment_num + 1;
        this.setData({ content: '', comment_num: comment_num, focus:false});
      }
    })
  },
  //跳转到评论列表
  goCommentList(e) {
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
  //设置输入框隐藏
  setFocus(){
    this.setData({
      focus:false
    })
  },
  //我想想捐助
  wantTodo(e){
    let mobile_status = app_data.mobile_status;
    if(mobile_status!=1){
      app.alert({title:'请先进行手机认证！',time:2000});
      setTimeout(()=>{
        wx.navigateTo({
          url: '../phoneauthentication/phoneauthentication',
        })
      },2000);
      return;
    }
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../wanttodonate/wanttodonate?id=' + id
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
  //评论获取焦点
  commentFn(e) {
    this.setData({
      focus: true
    })
  },

  /**
  * 页面上拉触底事件的处理函数
  */
  onReachBottom() {
    let page = this.data.page;
    if (this.data.isLast) {
      // app.alert({ title: '暂无更多评论', time: 1000 });
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