function POST(obj) {
  let post_promise = new Promise((resolve, reject) => {
    if (obj.loading == true) {
      wx.showLoading({
        title: obj.message ? obj.message : '正在加载',
      })
    }
    wx.request({
      url: obj.url,
      data: obj.params ? obj.params : {},
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: (res)=> {
        if (obj.loading == true) {
          wx.hideLoading()
        }
        if (res.statusCode == 200) {
          if (res.data.code != 'success') {
            wx.showToast({
              icon:'none',
              title: res.data.msg,
            })
          }
          resolve(res.data)
        }else{
          wx.showToast({
            icon: 'none',
            title: '请求异常！',
          })
        }
      },
      fail: (res) => {
        if (obj.loading == true) {
          wx.hideLoading()
        }
        console.log(res)
        reject(res.data)
      }
    })
  });
  return post_promise
}
function GET(obj) {
  let get_promise = new Promise((resolve, reject) => {
    if(obj.loading == true){
      wx.showLoading({
        title: obj.message ? obj.message : '正在加载',
      })
    }
    wx.request({
      url: obj.url,
      data: obj.params ? obj.params : {},
      method: 'GET',
      success:  (res) => {
        if (obj.loading == true) {
          wx.hideLoading()
        }
        if(res.statusCode == 200){
          if (res.data.code != 'success') {
            wx.showToast({
              icon: 'none',
              title: res.data.msg,
            })
          }
          resolve(res.data)
        }else{
          wx.showToast({
            icon: 'none',
            title: '请求异常！',
          })
        }
      },
      fail: (res) => {
        if (obj.loading == true) {
          wx.hideLoading()
        }
        console.log(res)
        reject(res.data)
      }
    })
  });
  return get_promise
}
module.exports = {
  Post: POST,
  Get: GET,
}