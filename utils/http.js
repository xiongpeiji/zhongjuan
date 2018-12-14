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
      fail: (err) => {
        if (obj.loading == true) {
          wx.hideLoading()
        }
        console.log(err)
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
      fail: (err) => {
        if (obj.loading == true) {
          wx.hideLoading()
        }
        console.log(err)
      }
    })
  });
  return get_promise
}

function SELECTIMG(obj){
  let select_promise = new Promise((resolve, reject) => {
      wx.chooseImage({
        count: obj.count,
        sizeType: ['original', 'compressed'],
        sourceType: ['album', 'camera'],
        success(res) {
          resolve(res.tempFilePaths);
        }
      });
  });  
  return select_promise;
}
function UPLOAD(obj) {
  let upload_promise = new Promise(function (resolve, reject) {
    if(obj.count > 1){
      wx.showLoading({
        title: '第' + obj.num + '张图片正在上传',
      })
    }else{
      wx.showLoading({
        title: '正在上传',
      })
    }
   
    wx.uploadFile({
      url: obj.url,
      filePath: obj.path,
      name: 'photo',
      success(res) {
        wx.hideLoading();
        if (res.statusCode == 200) {
          let data = JSON.parse(res.data);
          if (data.code == 'success') {
            resolve(data.data.img_url);
          }else{
            wx.showLoading({
              title: '第' + obj.num + '张图片'+data.msg,
            })
            reject(data);
          }
        }
      },
      fail(res) {
        wx.hideLoading()
      }
    })
  })
  return upload_promise
}

module.exports = {
  Post: POST,
  Get: GET,
  Upload:UPLOAD,
  Select:SELECTIMG,
}