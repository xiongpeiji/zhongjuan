// zhongjuan/pages\wanttodonone/wanttodonone.js
const app = getApp();
const app_data = app.globalData;
const http = require("../../utils/http.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isFocus:false,
    money:'',
    placeholder:'请输入物资价值',
    donation:{},
    institution:{},
    material:{},
    mobile: '',
    editPhone:false
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

  //获取我要求捐信息
  getData(e) {
    let url = app_data.base + 'Donation/getDonationDetail';
    let params = { id: this.data.id, token: app_data.token };
    http.Get({ url: url, params: params }).then((res) => {
      if (res.code == 'success') {
        this.setData({
          material: res.data.material,
          donation: res.data.donation,
          institution: res.data.institution,
        })
      }
    });
  },

  //提交物资选择数据
  submitMaterial(e) {
    let value = e.detail.value;
    let money = value.money;
    let newObj = [];
    let material = this.data.material;
    let error_msg = null;
    for (let key in value) {
      if (key != "money" && value[key] > 0 && !error_msg) {
        let num = '';
        let icon = '';
        let name = '';
        material.some((v, k) => {
          if (Number(v.material_id) === Number(key)) {
            if (value[key] > v.num) {
              error_msg = v.name + '可捐赠数量不能超过' + v.num;
              return true;
            }
            name = v.name;
            icon = v.icon;
          }
        })
        newObj.push({
          material_id: key,
          name: name,
          num: value[key],
          icon: icon
        })
      }
    }
    if (error_msg) {
      app.alert({ title: error_msg, time: 2000 });
      return;
    }
    if (newObj.length == 0) {
      app.alert({
        title: '捐赠物资数量不能为空！'
      })
      return;
    }

  },

  submitDonaData(e) {
    let url = app_data.base + 'Donation/saveUserDonation';
    let express_num = e.detail.value.express_num;
    let material = JSON.stringify(this.data.after_material);
    let params = {
      id: this.data.id,
      token: app_data.token,
      mobile: app_data.mobile, //手机号码
      material: material,//捐助物品
      express_num: express_num,//快递单号
      express_id: this.data.express.id,//快递id
      imgs: this.data.images, //图片
    };
    http.Post({ url: url, params: params }).then((res) => {
      if (res.code == 'success') {
        app.alert({ title: res.msg, time: 2000 });
        setTimeout(() => {
          this.setData({
            express_id: '',
            express_num: '',
            after_material: [],
            images: [],
          })
          wx.navigateTo({
            url: '/pages/donationmanagement/donationmanagement',
          })
        }, 2000)
      }
    });
  },
  //修改手机号码
  changeNumber(e){
    this.setData({
      editPhone: true
    })
  },
  //input获取焦点
  isfocusThis(e) {
    this.setData({
      isFocus: true,
      placeholder:''
    })
  },
  //完成捐助
  nextExpress(e){
    wx.navigateTo({
      url: '../inexpress/inexpress'
    })
  },
  //去除焦点
  removeActive(e) {
    if (!this.data.money>=1){
      this.setData({
        isFocus: false,
        placeholder:'请输入物资价值'
      })
    }
    
  },


  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },



  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return app_data.share;
  }
})