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
    isActive:false,
    money:'',
    placeholder:'请输入物资价值',
    donation:{},
    institution:{},
    material:{},
    mobile: '',
    editPhone:false,
    form_info:'',
    disabled:false,
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
          mobile: app_data.mobile,
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
    let mobile = value.mobile;
    let newObj = [];
    let material = this.data.material;
    let error_msg = null;
    for (let key in value) {
      if (key != "money" && key != 'mobile' && value[key] > 0 && !error_msg) {
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
    var myreg = /^[1][3,4,5,7,8,9][0-9]{9}$/;
    if (!myreg.test(mobile)) {
      app.alert({
        title: '手机号码格式错误'
      })
      return;
    }
    this.setData({
      disabled: true
    })
    let url = app_data.base + 'Donation/saveUserDonationFirst';
    let post_material = JSON.stringify(newObj);
    let params = {
      id: this.data.id,
      token: app_data.token,
      mobile: mobile, //手机号码
      material: post_material,//捐助物品
      money:money,
    };
    http.Post({ url: url, params: params }).then((res) => {
      if (res.code == 'success') {
        wx.navigateTo({
          url: '/pages/perfectinformation/perfectinformation?id=' + res.data.id + '&donation_num=' + res.data.donation_num,
        })
      }else{
        this.setData({
          disabled: false
        })
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
  isfocusThisOne(e) {
    this.setData({
      isFocus: true,
      isActive:true
    })
  },
  isfocusThisTwo(e) {
    this.setData({
      isFocus: true,
      isActive:true
    })
  },
  //去除焦点
  removeActive(e) {
    if (e.detail.value!=''){
      this.setData({
        isActive: true,
        placeholder: ''
      })
    }else{
      this.setData({
        isFocus: false,
        isActive: false
      })
    }
  },


  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    this.setData({
      form_info:'',
      disabled:false
    })
  },



  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return app_data.share;
  }
})