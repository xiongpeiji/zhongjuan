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
    material:{},
    materArr:[],
    sendStatus:false,
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
    console.log('picker发送选择改变，携带值为', e.detail.value)
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
  //提交信息
  submitFormData(e){
    let value = e.detail.value;
    let url = app_data.base+'Donation/saveDonation';
    let strMater = JSON.stringify(this.data.materArr);

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
              url: '../donormanagement/donormanagement'
            })
          },1000)
        }
    })
  },
  //获取类别和区域
  getMaterial(e){
    let material = wx.getStorageSync("material");
    this.setData({
      material:material,
    })
  },
  //提交物资选择数据
  submitMaterial(e){
    let value = e.detail.value;
    let newObj=[];
    let material = this.data.material;
    material = JSON.stringify(material);
    material = JSON.parse(material);
    console.log(material)
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
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '编辑求捐信息'
    });
    this.getMaterial();//获取衣物类型
  }
})