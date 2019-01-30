// pages/Donoragencies/Donoragencies.js
const app = getApp();
const app_data = app.globalData;
let http = require("../../utils/http.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id:0,
    info:{},
    isFocus: false,
    sourceList: [{
      name: '',
      num: '',
      unit: ''
    }],
    money:'',
    remark:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.setNavigationBarTitle({
      title: '捐助机构'
    });
    app.checkLogin();
    this.setData({
      id: options.id,
      mobile:app_data.mobile
    })
    this.getData();
  },

  //获取机构信息详情
  getData() {
    let url = app_data.base + 'Index/institutionDetail';
    let params = { id: this.data.id };
    http.Get({ url: url, params: params }).then((res) => {
      if (res.code == 'success') {
        this.setData({
          info: res.data,
        })
      }
    });
  },
  //手机获得焦点
  phoneFocus(e) {
    this.setData({
      isFocus: true,
    })
  },
  //继续添加
  addList() {
    let sourceList = this.data.sourceList;
    let lastArr = sourceList.length;
    if (!sourceList[lastArr - 1].name || !sourceList[lastArr - 1].num || !sourceList[lastArr - 1].unit) {
      return;
    }
    sourceList.push({
      name: '',
      num: '',
      unit: ''
    })
    this.setData({
      sourceList: sourceList
    })
  },

  setValue(e){
    let value = e.detail.value;
    let key = e.target.dataset.key;
    let index = e.target.dataset.index;
    let list = this.data.sourceList;
    if(key == '1'){
      list[index].num = value;
    }else if(key =='2'){
      list[index].unit = value;
    }else{
      list[index].name = value;
    }
    this.setData({
      sourceList:list
    })
  },
  saveData(e){
    let value = e.detail.value;
    let url = app_data.base + 'Donation/saveSelectUserDonationFirst';
    let material = JSON.stringify(this.data.sourceList);
    let params = {
      id: this.data.id,
      token: app_data.token,
      material_content: material,
      mobile: value.mobile, //手机号码
      money:value.money,
      remark:value.remark,
    };
    http.Post({ url: url, params: params }).then((res) => {
      if (res.code == 'success') {
        wx.navigateTo({
          url: '/pages/perfectinformation/perfectinformation?id=' + res.data.id + '&donation_num=' + res.data.donation_num,
        })
      }
    });
  },

  /**
  * 生命周期函数--监听页面隐藏
  */
  onHide: function () {
    this.setData({
      money: '',
      remark: '',
      sourceList: [{
        name: '',
        num: '',
        unit: ''
      }],
    })
  },
  //删除当前
  delateArr(e) {
    let sourceList = this.data.sourceList,
      index = e.currentTarget.dataset.index,
      len = sourceList.length;
      console.log(index)
    if (len === 1) return;
    sourceList.splice(index, 1);
    this.setData({
      sourceList: sourceList
    })
  },

  /**
 * 用户点击右上角分享
 */
  onShareAppMessage: function () {
    return app_data.share;
  }
})