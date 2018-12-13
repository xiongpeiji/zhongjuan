//index.js
const app = getApp();
const app_data = app.globalData;
let http = require("../../utils/http.js")
Page({
  data: {
    imgUrls: [], //banner图片
    qiujuanList: [], //求捐列表
    state: false,
    first_click: false,
    indicatorDots: true,
    autoplay: true,
    interval: 8000,
    duration: 1000,
    indicatorcolor: 'rgba(238,238,238,.6)',
    indicatoractivecolor: '#fff',
    arrList: [],
    pageNum: 1, //页码
    type_id: '',
    city_id: '',
    material_id: ''
  },
  //求捐详情页面
  qiujuanDetail(e) {
    var id = e.currentTarget.dataset.id;
    if (!app_data.token){
      app.modal({content: '请登录后再查看！',confirmText: '立即登录'}).then((res) => {
          if(res.confirm){
            app.redirectLogin();
          }
      });
      return false;
    }
    wx.navigateTo({
      url: '../donationdetail/donationdetail?token=' + app_data.token + '&id=' + id
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
    this.setInit();
    this.getHomeData();
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
    http.Get({ url: url }).then((res) => {
      let init_data = res.data;
      if (init_data.advert_time) {
        this.setData({
          interval: init_data.advert_time
        });
        let area = {
          title: '区域',
          info: init_data.city,
          active: true
        };
        let type = {
          title: '类型',
          info: init_data.type
        };
        let material = {
          title: '物资',
          info: init_data.material
        };
        arrList.push(area);
        arrList.push(type);
        arrList.push(material);
        this.setData({
          arrList: arrList
        });
        if (init_data.advert) {
          this.setData({
            imgUrls: init_data.advert
          });
        }
      }
    })
  },

  getHomeData() {
    let url = app_data.base + 'Index/donation';
    let data = {
        page: this.data.pageNum,
        type_id: this.data.type_id,
        city_id: this.data.city_id,
        material_id: this.data.material_id
    };
    http.Get({ url: url, params: data}).then((res)=>{
      this.setData({
        qiujuanList: res.data
      });
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
              material_id: id
            })
            break;
          case 2:
            this.setData({
              type_id: id
            })
            break;
        }
        curItem.active = true;
      }
      this.getHomeData();
      this.setData({
        arrList: arrList,
        state: false,
        first_click: false,
      })
    }
  },
})