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
    images:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '我要捐助'
    });
    this.getMaterial();//获取衣物类型
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
  //获取类别和区域
  getMaterial(e){
    let material = wx.getStorageSync("material");
    this.setData({
      material:material,
    })
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
    let material = this.data.material;
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
    newObj.forEach((value, index)=>{
      console.log(value.num)
      if(value.num<=0){
        app.alert({
          title:'物资数量不能0！'
        })
        return false;
      }
    })
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
  /**
  * 用户点击右上角分享
  */
  onShareAppMessage: function () {
    return app_data.share;
  }
})