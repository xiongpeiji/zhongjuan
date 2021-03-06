//index.js
const app = getApp();
const app_data = app.globalData;
let http = require("../../utils/http.js")
Page({
  data: {
    imgUrls: [], //banner图片
    list: {}, //求捐列表
    state: false,
    first_click: false,
    indicatorDots: true,
    autoplay: true,
    interval: 8000,
    duration: 1000,
    indicatorcolor: 'rgba(238,238,238,.6)',
    indicatoractivecolor: '#fff',
    arrList: [],
    page: 1, //页码
    type_id: '',
    city_id: '',
    material_id: '',
    isLast:false,
    no_msg:'',
    is_follow:false
  },
  //求捐详情页面
  qiujuanDetail(e) {
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../donationdetail/donationdetail?id=' + id
    });
  },
  //下拉加载
  toggle() {
    var list_state = this.data.state,
      first_state = this.data.first_click;
    if (!first_state) {
      this.setData({
        first_click: true
      });
    }
    if (list_state) {
      this.setData({
        state: false
      });
    } else {
      this.setData({
        state: true
      });
    }
  },
  //隐藏蒙版
  hideArea(e) {
    this.setData({
      state: false,
      first_click: false,
    });
  },
  onLoad(options) {
    if (app_data.public_open_id){
      this.setData({
        is_follow:true
      })
    }
    this.setInit();
    this.getData({ refresh: false, is_first: true });
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {
    this.setData({
      state: false,
      first_click: false,
    });
  },

  setInit: function () {
    let arrList = [];
    let url = app_data.base + 'Index/index';
    let params={token:app_data.token};
    http.Get({ url: url,params:params }).then((res) => {
      console.log(res);
      let init_data = res.data;
      wx.setStorageSync('type', init_data.type);//存储机构类型
      wx.setStorageSync('city', init_data.city);//存储城市名称
      wx.setStorageSync('material', init_data.material);//存储物品类型
      if (init_data.advert_time) {
        this.setData({
          interval: init_data.advert_time
        });
        let area = {
          title: '捐助地区',
          info: [{ id: '0', name: '全部' }].concat(init_data.city),
          active: true
        };
        let type = {
          title: '捐助机构',
          info: [{ id: '0', name: '全部' }].concat(init_data.type)
        };
        let material = {
          title: '捐助物品',
          info: [{ id: '0', name: '全部' }].concat(init_data.material)
        };
        arrList.push(area);
        arrList.push(type);
        arrList.push(material);
        this.setData({
          arrList: arrList,
          is_follow:init_data.is_follow
        });
        if (init_data.advert) {
          this.setData({
            imgUrls: init_data.advert
          });
        }
      }
    })
  },

  getData(obj) {
    let url = app_data.base + 'Index/donation';
    let params = {
        page: this.data.page,
        type_id: this.data.type_id,
        city_id: this.data.city_id,
        material_id: this.data.material_id
    };
    http.Get({ url: url, params: params,loading:obj.refresh}).then((res)=>{
      if(res.code == 'success'){
        if (obj.refresh) {
          wx.stopPullDownRefresh();
        }
        let list = this.data.list;
        let res_list = res.data;
        if (obj.is_first) {
          list = res_list
        } else {
          list = list.concat(res_list);
        }
        this.setData({
          list: list,
          isLast: res_list.length < 10 ? true : false,
        })
      }
    });
  },
  changeArea(e) {
    let index = e.currentTarget.dataset.index,
      arrList = this.data.arrList;
    if (arrList[index]) {
      let cur = arrList[index];
      arrList.map(v => {
        v.active = false;
      })
      cur.active = true;
      this.setData({
        arrList: arrList
      })
    }
  },
  changeDetail(e) {
    let index = e.currentTarget.dataset.index,
      cindex = e.currentTarget.dataset.cindex,
      result = 0,
      arrList = this.data.arrList;
    if (arrList[index]) {
      let info = arrList[index].info;
      info.map(v => {
        v.active = false;
      });

      if (info[cindex]) {
        let curItem = info[cindex];
        let id = curItem.id;
        switch (Number(index)) {
          case 0:
            this.setData({
              city_id: id
            })
            break;
          case 1:
            this.setData({
              type_id: id
            })
            break;
          case 2:
            this.setData({
              material_id: id
            })
            break;
        }
        curItem.active = true;
      }
      this.getData({ refresh: true, is_first: true });
      this.setData({
        arrList: arrList,
        state: false,
        first_click: false,
      })
    }
  },

  redirectLink: function (e) {
    var url = e.currentTarget.dataset.url
    wx.redirectTo({
      url: '/pages/webView/webView?url='+url,
    })
  },
  /**
  * 页面相关事件处理函数--监听用户下拉动作
  */
  onPullDownRefresh: function () {
    if (this.data.first_click){
      wx.stopPullDownRefresh()
      return false;
    }
    this.setData({
      page:1
    });
    this.setInit();
    this.getData({ refresh: true, is_first: true });
  },
  

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {
    let page = this.data.page;
    if (this.data.isLast) {
      // app.alert({ title: '暂无更多数据', time: 1000 });
      if(this.data.list.length > 0){
        this.setData({
          no_msg: "没有更多求捐信息啦~"
        });
      }
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
  },
})