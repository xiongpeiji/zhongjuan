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
  },
  /**生命周期函数--监听页面加载*/
  onLoad(options) {
    this.data.id = options.id;//获取求捐详情id
    wx.setNavigationBarTitle({
      title: '心得详情'
    });
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
      }
    });
  },
  experienceUp(e) {
    if (this.data.is_up > 0) {
      app.alert({ title: '您已经点过赞了！' });
      return;
    }
    let url = app_data.base + '/Experience/experienceUp'
    let params = { token: app_data.token, id: this.data.id };
    http.Post({ url: url, params: params }).then((res) => {
      if (res.code == 'success') {
        let up_num = +this.data.up_num + 1;
        this.setData({ up_num: up_num, is_up: 1 });
      }
    })
  },
  commentUp(e){
    let comment_id = e.currentTarget.dataset.id;
    let is_up = e.currentTarget.dataset.val;
    let index = e.currentTarget.dataset.index;
    if (is_up > 0) {
      app.alert({ title: '您已经点过赞了！' });
      return;
    }
    let url = app_data.base + '/Comment/experienceCommentUp'
    let params = { token: app_data.token, id: comment_id };
    http.Get({ url: url, params: params }).then((res) => {
      if (res.code == 'success') {
        let list = this.data.list;
        list[index].is_up = is_up == 0 ? 1 : 0;
        list[index].comment_up_num = +list[index].comment_up_num+1;
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

  comment(e) {
    let content = e.detail.value;
    if (!content) {
      app.alert({ title: '请输入评论内容！' });
      return;
    }
    let url = app_data.base + '/Comment/addExperienceComment'
    let params = { token: app_data.token, experience_id: this.data.id, content: content };
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

  /**
  * 页面上拉触底事件的处理函数
  */
  onReachBottom() {
    let page = this.data.page;
    if (this.data.isLast) {
      app.alert({ title: '暂无更多评论', time: 2000 });
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