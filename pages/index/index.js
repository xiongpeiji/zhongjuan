//index.js
const app = getApp();
const base = app.globalData.base;
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
    console.log(e);
    let token = wx.getStorageSync('token')
    wx.navigateTo({
      url: '../donationdetail/donationdetail?token=' + token + '&id=' + id
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
  onLoad: function(options) {
    var token = wx.getStorageSync('token');
    if (token) {
      this.token = token;
    }
    this.invite_code = options.invite_code;
    if (this.invite_code) {
      wx.setStorage({
        key: 'invite_code',
        data: this.invite_code
      })
    }
    var userInfo = wx.getStorageSync('userInfo');
    if (userInfo) {
      this.userInfo = userInfo;
      var level = userInfo.level;
      if (level) {
        this.setData({
          level: userInfo.level
        })
      }
    }
    //初始化
    this.init();
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {
    this.setData({
      state: false,
      first_click: false,
    });
  },

  init() {
    var that = this;
    wx.request({
      url: base + 'Index/index',
      success(res) {
        var data = res.data.data;
        let arrList = [];
        let scity = data.city;
        let stype = data.type;
        let smaterial = data.material;
        let area = {
          title: '区域',
          info: scity,
          active: true
        };
        let type = {
          title: '类型',
          info: stype
        };
        let material = {
          title: '物资',
          info: smaterial
        };
        arrList.push(area);
        arrList.push(type);
        arrList.push(material);

        if (data.advert) {
          that.setData({
            imgUrls: data.advert,
            arrList: arrList
          });
        }
      },
      fail(err) {
        console.log(err)
      }
    });
    //获取求捐信息列表
    this.getHomeData();
  },

  getHomeData() {
    wx.request({
      url: base + 'Index/donation',
      data: {
        page: this.data.pageNum,
        type_id: this.data.type_id,
        city_id: this.data.city_id,
        material_id: this.data.material_id
      },
      success: res =>{
        var data = res.data.data;
        console.log(res, '求捐信息')
        if (data) {
          this.setData({
            qiujuanList: data
          });
        }
      },
      fail(err) {
        console.log(err)
      }
    })
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

  getData() {
    let token = wx.getStorageInfoSync('token')

    wx.request({
      url: '...',
      data: {},
      methods: 'post',
      header: {
        Authorization: token
      },
      success: res => {

      }
    })
  }
})