// pages/Donoragencies/Donoragencies.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isFocus: false,
    sourceList: [{
      name: '',
      count: '',
      company: ''
    }]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.setNavigationBarTitle({
      title: '捐助机构'
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
    if (!sourceList[lastArr - 1].name || !sourceList[lastArr - 1].count || !sourceList[lastArr - 1].company) {
      return;
    }
    sourceList.push({
      name: '',
      count: '',
      company: ''
    })
    this.setData({
      sourceList: sourceList
    })
  },
  //保存数据
  saveData(e) {
    let value = e.detail.value,
      sourceList = this.data.sourceList,
      len = sourceList.length,
      maxIndex = len - 1;
    if (value[`company_${maxIndex}`] && value[`count_${maxIndex}`] && value[`source_${maxIndex}`]) {
      sourceList.push({
        name: '',
        count: '',
        company: ''
      });
      this.setData({
        sourceList: sourceList
      })
    }
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
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})