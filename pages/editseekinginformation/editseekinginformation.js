// pages/editseekinginformation/editseekinginformation.js
const app = getApp();
const app_data = app.globalData;
const http = require("../../utils/http.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    images:[],
    first_click: false,
    title:"",//文章标题
    contentText:"",//文章内容
    material:[],
    sendStatus:false,
    after_material:[],
    date:'',
    id:0
  },
  //添加图片
  modifyPhoto(e){
    let url = app_data.base + 'Public/uploadImg?type=donation';
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
  //时间选择
  bindTimeChange(e) {
    this.setData({
      date: e.detail.value
    })
  },
  //打开选择面板
  addGoods(e){
    var that = this;
    that.setData({
      first_click:true,
    })
  },
  //隐藏选择面板
  hideMasxing(e){
    var that = this;
    that.setData({
      first_click:false,
    })
  },
  //回显求捐信息
  getDonaData(e){
    let url = app_data.base+'/Donation/detail';
    let params = {
      token:app_data.token,
      id:this.data.id
    }
    http.Get({ url: url, params: params}).then((res)=>{
      if(res.code == "success"){
        this.setAfterMaterial(res.data.material_data);
        this.setData({
          images:res.data.image,
          title:res.data.title,//文章标题
          contentText:res.data.content,//文章内容
          date:res.data.end_time
        })
      }
    })
  },

  setAfterMaterial(after_material){
    let material_cache = wx.getStorageSync("material");
    material_cache = JSON.stringify(material_cache);
    material_cache = JSON.parse(material_cache);
    let new_after_material = []; 
    let material = [];
    material_cache.map(r => {
      let temp_num = '';
      after_material.map(v => {
        if(r.id == v.material_id){
          new_after_material.push({
            material_id: r.id,
            name: r.name,
            num: v.num,
            icon: r.icon
          });
          temp_num = v.num;
        }
      });
      material.push({
        material_id: r.id,
        name: r.name,
        num: temp_num,
        icon: r.icon
      });
    });
    this.setData({
      after_material:new_after_material,
      material:material
    })  
  },
  //提交信息
  submitFormData(e){
    let value = e.detail.value;
    let url = app_data.base+'Donation/saveDonation';
    let strMater = JSON.stringify(this.data.after_material);
    let params = {
      token:app_data.token,
      id:this.data.id,
      title:value.title,
      content:value.contentText,
      imgs:this.data.images,
      material:strMater,
      end_time:this.data.date
    }
    http.Post({ url: url, params: params, loading: true,}).then((res)=>{
        if(res.code == "success"){
          app.alert({title:res.msg});
          setTimeout(()=>{
            wx.navigateTo({
              url: '../Donationrecord/Donationrecord'
            })
            this.setData({
              images: [],
              title: "",//文章标题
              contentText: "",//文章内容
              date: '',
            })
          },1000)
        }
    })
  },
  //获取类别和区域
  getMaterial(e){
    let material_cache = wx.getStorageSync("material");
    material_cache = JSON.stringify(material_cache);
    material_cache = JSON.parse(material_cache);
    let material = [];
    material_cache.map(v => {
      material.push({
        material_id: v.id,
        name: v.name,
        num: '',
        icon: v.icon
      });
    })
    this.setData({
      material:material,
    })
  },
  //提交物资选择数据
  submitMaterial(e){
    let value = e.detail.value;
    let material = this.data.material;
    let after_material = [];
    let select_status = false;
    for (var index in value) {
      if(value[index] > 0){
        material.map( v => {
          if(v.material_id == index){
            after_material.push({
              material_id: v.material_id,
              name: v.name,
              num: value[index],
              icon: v.icon
            });
          }
        })
      }
    }
    if (after_material.length>0){
      this.setData({
        after_material: after_material,
        first_click:false
      })
    }else{
      app.alert({
        title:'物资数量不能为空！'
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '编辑求捐信息'
    });
    app.checkLogin();
    this.setData({
      id:options.id
    })
    if(options.id > 0){
      this.getDonaData();
    }else{
      this.getMaterial();//获取衣物类型
    }
   
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