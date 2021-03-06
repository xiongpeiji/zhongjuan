// pages/createexperience/createexperience.js
const app = getApp();
const app_data = app.globalData;
const http = require("../../utils/http.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id:0,
    images:[],
    title:'',
    content:'',
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '创建心得'
    });
    app.checkLogin();
    let id = options.id;
    if(id > 0){
      this.setData({
        id:id
      })
    }
    if(this.data.id > 0){
      this.getExperience();
    }
  },

  getExperience(){
    let url = app_data.base+'/User/experienceDetail'
    let params = {token:app_data.token,id:this.data.id};
    http.Get({url:url,params:params}).then((res)=>{
      if(res.code == 'success'){
        this.setData({
          title:res.data.title,
          content:res.data.content,
          images:res.data.images,
        });
      }
    })
  },

  setTitle(e){
    this.setData({
      title:e.detail.value
    })
  },

  setContent(e) {
    this.setData({
      content: e.detail.value
    })
  },

  uploadImg(){
    let user_avatar = this.data.avatar;
    let url = app_data.base + 'Public/uploadImg?type=experience';
    http.Select({ count: 9-this.data.images.length }).then((res) => {
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
            images:images
          })
      }
    })
  },
  // 删除图片
  deleteImg (e) {
    var imgs = this.data.images;
    var index = e.currentTarget.dataset.index;
    imgs.splice(index, 1);
    this.setData({
      images: imgs
    });
  },
  sendData(){
    let url = app_data.base +'Experience/saveExperience'
    let title = this.data.title;
    let content = this.data.content;
    let images = this.data.images;
    if(!title){
      app.alert({title:'请输入心得标题！'})
      return
    }
    if (!content) {
      app.alert({ title: '请输入心得内容！' })
      return
    }
    if (images.length < 1 || images.length > 9) {
      app.alert({ title: '请上传1-9张心得图片！' })
      return
    }
    let params = {
      id:this.data.id,
      token:app_data.token,
      title:title,
      content:content,
      imgs: images,
    }
    http.Post({url:url,params:params}).then((res)=>{
      if(res.code == 'success'){
        app.alert({title:res.msg,time:2000});
        setTimeout(()=>{
          wx.navigateTo({
            url: '/pages/experiencelist/experiencelist',
          })
          this.setData({
            id: 0,
            images: [],
            title: '',
            content: '',
          });
        },2000);
        
      }
    })
  },
  
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return app_data.share;
  },
  //ios下拉问题
  onPageScroll: function (e) {
    if (e.scrollTop < 0) {
      wx.pageScrollTo({
        scrollTop: 0
      })
    }
  }
})