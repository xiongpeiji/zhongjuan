// pages/institutionalaccreditation/institutionalaccreditation.js
const app = getApp();
const app_data = app.globalData;
const http = require("../../utils/http.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    region: [],
    city:[],
    type:[],
    sex:[
      {id:1,name:'男'},
      {id:2,name:'女'}
    ],
    curSex:{},//
    curType: {}, // 当前机构类型
    curCity: {}, // 当前选择的地域
    index:0,
    institution:'',
    cardOne:'',
    cardTwo:'',
    prove_info:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad (options) {
    wx.setNavigationBarTitle({
      title: '机构认证'
    });
    this.getType();
  },
  //地址选择
  bindRegionChange (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      region: e.detail.value
    })
  },
  //类别选择
  bindTypeChange (e) {
  let index  = e.detail.value,
      curType = this.data.type[index];
      if (curType) {
        this.setData({
          curType: curType
        })
      }
  },
  //获取类别和区域
  getType(e){
    let type = wx.getStorageSync("type");
    let city =  wx.getStorageSync("city");
    this.setData({
      type:type,
      city:city
    })
  },
  //设置性别
  bindSexChange(e){
    let index = e.detail.value,
    curSex = this.data.sex[index];
    if(curSex){
      this.setData({
        curSex:curSex
      })
    }

  },

  bindCityChange(e) { 
    let index = e.detail.value,
    curCity = this.data.city[index];
    if (curCity) {
      this.setData({
        curCity: curCity
      })
    }

  },




  //提交机构认证资料
  submitDataInfo(e){
    console.log(e);
    let value = e.detail.value;
    let url = app_data.base +'User/saveInstitution';
    let token = app_data.token;
    let type = this.data.curType;
    let params = {
      token:token,//用户token
      type_id:this.data.curType.id,//机构类型ID
      city_id:this.data.curCity.id,//机构区域ID
      name:value.name,//机构名称
      address:this.data.region[0]+this.data.region[1]+this.data.region[2]+value.address,//机构地址
      liaison_person:value.userName,//联络人
      liaison_sex:this.data.curSex.id,//联络人性别 1->男 2->女
      liaison_avatar:this.data.institution,//联络人图像【上传图像返回地址】
      liaison_tel:value.mobile,//联络人电话
      id_card_just:this.data.cardOne,//身份证正面【上传图像返回地址】
      id_card_just:this.data.cardTwo,//身份证反面【上传图像返回地址】
      prove_info:'',//机构证明资料【上传图像返回地址组成json格式】
    };
    http.Post({url:url,params:params}).then((res)=>{
        if(res.code == 'success'){
          
          app.alert({title:res.msg});
          
        }
    });
  },
  //上传人像照片
  uploadHuman() {
    let institution = this.data.institution;
    let url = app_data.base +'Public/uploadImg?type=institution';
    http.Select({count:1}).then((res)=>{
      return Promise.all(res.map((path, index) => {
        let num = index+1;
        institution = path;
        return http.Upload({count:1,url:url,path:path,num:num});
      }));
    }).then((res)=>{
      this.setData({
        institution: res
      })
    });
  },
  //身份证正面
  uploadCardOne() {
    let institution = this.data.institution;
    let url = app_data.base +'Public/uploadImg?type=institution';
    http.Select({count:1}).then((res)=>{
      return Promise.all(res.map((path, index) => {
        let num = index+1;
        institution = path;
        return http.Upload({count:1,url:url,path:path,num:num});
      }));
    }).then((res)=>{
      this.setData({
        cardOne: res
      })
    });
  },
  //身份反面
  uploadCardTwo() {
    let institution = this.data.institution;
    let url = app_data.base +'Public/uploadImg?type=institution';
    http.Select({count:1}).then((res)=>{
      return Promise.all(res.map((path, index) => {
        let num = index+1;
        institution = path;
        return http.Upload({count:1,url:url,path:path,num:num});
      }));
    }).then((res)=>{
      this.setData({
        cardTwo: res
      })
    });
  },
  //机构认证相关图片上传
  uploadArrPhoto() {
    let institution = this.data.institution;
    let url = app_data.base +'Public/uploadImg?type=institution';
    http.Select({count:5}).then((res)=>{
      return Promise.all(res.map((path, index) => {
        let num = index+1;
        institution = path;
        return http.Upload({count:1,url:url,path:path,num:num});
      }));
    }).then((res)=>{
      console.log(res)
      this.setData({
        prove_info: res
      })
    });
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})