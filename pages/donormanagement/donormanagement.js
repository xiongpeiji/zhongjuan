// pages/donormanagement/donormanagement.js
const app = getApp();
const app_data = app.globalData;
const http = require("../../utils/http.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    page:1,
    count : 0,
    list:{},
    isLast:false,
    institution:{},
    stutas:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '求捐管理'
    });
    this.getData({ refresh: false,is_first:true});
  },
  //去发布求捐
  goCreat(e){
    //正在审核
    if(this.data.stutas==1){
      app.alert({ title: '机构信息正在认证中，请等待认证通过后再发布！',time:2000});
      return;
    }
    //审核失败，
    if(this.data.stutas==3){
      app.alert({ title: '机构信息认证失败，请重新认证通过后再发布！',time:2000});
      return;
    }
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../editseekinginformation/editseekinginformation?id='+id
    });
  },
  //获取我的求捐列表
  getData(obj){
    let url = app_data.base +'User/donation';
    let params = {
      token:app_data.token,
      page:this.data.page,
    }
    http.Get({url:url,params:params,loading:obj.refresh}).then((res)=>{
      if(res.code == 'success'){
          if (obj.refresh) {
            wx.stopPullDownRefresh();
          }
          let class_name = ['#FF5722', '#5FB878','#ff0000','#141414'];
          let status_name = ['审核中','进行中','审核失败','已结束'];
          let icon_type=['waiting','success','cancel','warn']
          let list = this.data.list;
          let res_list = res.data.data;
          res_list.map((item,index)=>{
            let status = item.status;
            res_list[index]['color_name'] = class_name[status];
            res_list[index]['status_name'] = status_name[status];
            res_list[index]['icon_type'] = icon_type[status];
          })
          let count = res.data.count;
          if(obj.is_first){
            list = res_list
          }else{
            list = list.concat(res_list);
          }
          this.setData({
            list: list,
            count:count,
            isLast: res_list.length < 10 ? true : false,
            institution:res.data.institution,
            stutas:res.data.institution.status
          })
      }
    })
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.setData({
      page:1
    });
    this.getData({ refresh: true, is_first: true });
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {
    let page = this.data.page;
    if (this.data.isLast) {
      app.alert({ title: '暂无更多数据',time:1000});
    } else {
      page = page + 1;
      this.setData({
        page: page
      })
      this.getData({ refresh: true, is_first: false });
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return app_data.share;
  }
})