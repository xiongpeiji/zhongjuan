function wechatLogin(){
  return new Promise((resolve, reject) => {
    wx.login({
      success: (res) => {
        resolve(res);
      }  
    });
  });
}
module.exports = {
  wechatLogin: wechatLogin,
}