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
    info:[],
    material:[],
    after_material:[],
    mobile:'',
    express_data:[],//快递信息
    curExp:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
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
    let index = e.detail.value,
    curExp = this.data.express_data[index];
    if(curExp){
      this.setData({
        curExp:curExp
      })
    }
  },
  //获取我要求捐信息
  getData(e){
    let url = app_data.base + 'Donation/getDonationMaterial';
    let params = { id: this.data.id, token: app_data.token };
    http.Get({ url: url, params: params }).then((res) => {
      if (res.code == 'success') {
        console.log(res.data.material_data);
        let curExp ={};
        this.data.express_data.map(v => { 
          if (Number(v.id) === Number(res.data.express_data.id)){ 
            curExp = v; 
          } 
        })
        this.setData({
          info: res.data.material_data,
          mobile:app_data.mobile,
          express_data:res.data.express_data,
          curExp:curExp // 当前选择的地域
        })
      }
    });
  },
  //提交我要捐助消息 Donation/saveUserDonation
  submitDonaData(e){
    console.log(e)
    let url = app_data.base + 'Donation/saveUserDonation';
    let express_num = e.detail.value.express_num;
    let strMater = JSON.stringify(this.data.materArr);
    let params = {
      id:this.data.id,
      token:app_data.token,
      mobile: app_data.mobile, //手机号码
      material:strMater,//捐助物品
      express_num:express_num,//快递单号
      express_id:this.data.curExp.id,//快递id
      imgs:this.data.images, //图片
    };
    http.Post({ url: url, params: params }).then((res) => {
      if (res.code == 'success') {
        console.log(res.data)
        this.setData({
          info: res.data
        })
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
    let material = this.data.info;
    material = JSON.stringify(material);
    material = JSON.parse(material);
    for (var index in value) {
      if(value[index]){
        let name = '';
        let icon = '';
        material.map(v => { 
          if (Number(v.id) === Number(index)){ 
            name = v.name;
            icon = v.icon;
          } 
        })
        newObj.push({
          material_id:index,
          name:name,
          num:value[index],
          icon:icon
        })
      }
    }
    if(newObj.length>0){
      this.setData({
        materArr:newObj,
        first_click:false
      })
    }else{
      app.alert({
        title:'物资数量不能为空！'
      })
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