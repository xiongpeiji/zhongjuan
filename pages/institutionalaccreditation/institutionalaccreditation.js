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
    institution:'',//人像
    cardOne:'',//身份正面
    cardTwo:'',//身份反面
    prove_info:[],//机构图片
    id:'',
    name:'',//机构名称
    address:"",//详细地址
    userName:"",//用户名
    mobile:"",//手机
    desc:"",//机构简介
    number_people:''//机构人数
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad (options) {
    this.getType();//获取机构类型
    app.checkLogin();
    let status = options.status;
    if(status > 0){
      this.getUserinstitutionDetail();
    }
    wx.setNavigationBarTitle({
      title: '机构认证'
    });
  },

  //获取机构认证消息
  getUserinstitutionDetail(e){
    let url = app_data.base +'User/institutionDetail';
    let token = app_data.token;
    let params = {
      token:token
    }
    http.Post({url:url,params:params}).then(res=>{
      if(res.code == 'success'){
        let instituInfo = res.data;
        let curCity = {};
        let curType = {};
        let curSex = {};
        let addressInfo = '';
        let addressInfoArr = [];
        if (instituInfo.address){
          addressInfoArr = instituInfo.address.split("-");
          addressInfo = instituInfo.address.split("-")[3];
          this.data.city.map(v => {
            if (Number(v.id) === Number(instituInfo.city_id)) {
              curCity = v;
            }
          })
          this.data.type.map(v => {
            if (Number(v.id) === Number(instituInfo.type_id)) {
              curType = v;
            }
          })
          this.data.sex.map(v => {
            if (Number(v.id) === Number(instituInfo.liaison_sex)) {
              curSex = v;
            }
          })
        }
        this.setData({
          region:addressInfoArr,//设置省市区
          name:instituInfo.name,//设置机构名称
          address:addressInfo,//设置详细地址
          userName:instituInfo.liaison_person,//设置用户姓名
          mobile:instituInfo.liaison_tel,//设置手机
          institution:instituInfo.liaison_avatar,//人像面
          cardOne:instituInfo.id_card_just,//身份证正面
          cardTwo:instituInfo.id_card_back,//身份证反面
          prove_info:instituInfo.prove_info,//机构照片
          curSex:curSex,//设置性别
          curType:curType, // 当前机构类型
          curCity:curCity, // 当前选择的地域
          desc:instituInfo.desc,
          number_people:instituInfo.number_people
        })
      }
    })
  },

  //地址选择
  bindRegionChange (e) {
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

  setDesc(e) {
    this.setData({
      desc: e.detail.value
    })
  },


  //提交机构认证资料
  submitDataInfo(e){
    let value = e.detail.value;
    let url = app_data.base +'User/saveInstitution';
    let token = app_data.token;
    let type = this.data.curType;
    let params = {
      token:token,//用户token
      type_id:this.data.curType.id,//机构类型ID
      city_id:this.data.curCity.id,//机构区域ID
      name:value.name,//机构名称
      address:this.data.region[0]+'-'+this.data.region[1]+'-'+this.data.region[2]+'-'+value.address,//机构地址
      liaison_person:value.userName,//联络人
      liaison_sex:this.data.curSex.id,//联络人性别 1->男 2->女
      liaison_avatar:this.data.institution,//联络人图像【上传图像返回地址】
      liaison_tel:value.mobile,//联络人电话
      id_card_just:this.data.cardOne,//身份证正面【上传图像返回地址】
      id_card_back:this.data.cardTwo,//身份证反面【上传图像返回地址】
      prove_info:this.data.prove_info,//机构证明资料【上传图像返回地址组成json格式】
      desc:this.data.desc,
      number_people:value.number_people
    };
    http.Post({url:url,params:params}).then((res)=>{
        if(res.code == 'success'){
          app.alert({title:res.msg});
          setTimeout(()=>{
            app.redirectUser();
          },1000)
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
      wx.hideLoading()
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
      wx.hideLoading()
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
      wx.hideLoading()
      this.setData({
        cardTwo: res
      })
    });
  },

  //机构认证相关图片上传
  uploadArrPhoto() {
    let institution = this.data.institution;
    let url = app_data.base +'Public/uploadImg?type=institution';
    http.Select({ count: 9 - this.data.prove_info.length }).then((res)=>{
      return Promise.all(res.map((path, index) => {
        let num = index+1;
        institution = path;
        return http.Upload({count:1,url:url,path:path,num:num});
      }));
    }).then((res)=>{
      wx.hideLoading()
      let images = this.data.prove_info;
      images = images.concat(res);
      this.setData({
        prove_info:images
      })
    });
  },
  // 删除图片
  deleteImg (e) {
    var imgs = this.data.prove_info;
    var index = e.currentTarget.dataset.index;
    imgs.splice(index, 1);
    this.setData({
      prove_info: imgs
    });
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return app_data.share;
  }
})