// pages/wanttodonate/wanttodonate.js
const app = getApp();
const app_data = app.globalData;
const http = require("../../utils/http.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    first_click:false,
    images:[],
    id:0,
    material:[],
    after_material:[],
    mobile:'',
    express_data:[],//快递信息
    express:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.checkLogin();
    this.data.id = options.id;
    wx.setNavigationBarTitle({
      title: '我要捐助'
    });
    this.getData();
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
  //选择快递公司
  bindExpressChange(e){
    let index = e.detail.value;
    let express = this.data.express_data[index];
    if (express){
      this.setData({
        express: express
      })
    }
  },
  //获取我要求捐信息
  getData(e){
    let url = app_data.base + 'Donation/getDonationMaterial';
    let params = { id: this.data.id, token: app_data.token };
    http.Get({ url: url, params: params }).then((res) => {
      if (res.code == 'success') {
        this.setData({
          material: res.data.material_data,
          mobile:app_data.mobile,
          express_data:res.data.express_data,
        })
      }
    });
  },
  //提交我要捐助消息 Donation/saveUserDonation
  submitDonaData(e){
    let url = app_data.base + 'Donation/saveUserDonation';
    let express_num = e.detail.value.express_num;
    let material = JSON.stringify(this.data.after_material);
    let params = {
      id:this.data.id,
      token:app_data.token,
      mobile: app_data.mobile, //手机号码
      material: material,//捐助物品
      express_num:express_num,//快递单号
      express_id:this.data.express.id,//快递id
      imgs:this.data.images, //图片
    };
    http.Post({ url: url, params: params }).then((res) => {
      if (res.code == 'success') {
          app.alert({title:res.msg,time:2000});
          setTimeout(()=>{  
            wx.navigateTo({
              url: '/pages/donationmanagement/donationmanagement',
            })
          },2000)
      }
    });
  },
    //相关图片上传
  uploadArrPhoto() {
      let user_avatar = this.data.avatar;
      let url = app_data.base + 'Public/uploadImg?type=user_donation';
      http.Select({ count: 9-this.data.images.length }).then((res) => {
        return Promise.all(res.map((path, index) => {
          let num = index + 1;
          return http.Upload({ count: 9- this.data.images.length, url: url, path: path, num: num });
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
  //提交物资选择数据
  submitMaterial(e){
    let value = e.detail.value;
    let newObj=[];
    let material = this.data.material;
    let error_msg = null;
    for(let key in value){
      if (value[key] > 0 && !error_msg){
        let num  = '';
        let icon = '';
        let name = '';
        material.some((v,k)=>{
          if (Number(v.material_id) === Number(key)){
            if (value[key] > v.num){
              error_msg = v.name+'可捐赠数量不能超过'+v.num;
              return true;
            }
            name = v.name;
            icon = v.icon;
          } 
        })
        newObj.push({
          material_id:key,
          name:name,
          num:value[key],
          icon:icon
        })
      }
    }
    if (error_msg) {
      app.alert({title:error_msg,time:2000});
    }else{
      if (newObj.length > 0) {
        this.setData({
          after_material: newObj,
          first_click: false
        })
      } else {
        app.alert({
          title: '捐赠物资数量不能为空！'
        })
      }
    }
   
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
  //进入页面
  /**
  * 用户点击右上角分享
  */
  onShareAppMessage: function () {
    return app_data.share;
  }
})