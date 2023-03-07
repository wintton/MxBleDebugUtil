// pages/compass/compass.js
var canvas = "";
var width = 0;
var height = 0;
var lasttime = 0;
var isrun = false;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    direction:0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    wx.startCompass({
      success: (res) => {
        isrun = true;
        console.log(res);  
      },
      fail:res=>{
        console.log(res);
      }
    })
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {
    
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    let that = this;
    lasttime = Date.now(); 
    wx.onCompassChange((result) => { 
      //更新频率缩小至50ms 
      if(Date.now() - lasttime < 50){
        return;
      } 
      lasttime = Date.now();
      that.setData({direction:result.direction}) 
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() { 
    doCloseCompass();
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {
    doCloseCompass();
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})

function doCloseCompass(){
  if(isrun){
    isrun = false;
  wx.offCompassChange();
  wx.stopCompass({
    success: (res) => {
      console.log(res);
    },
    fail:res=>{
      console.log(res);
    }
  })
}
}