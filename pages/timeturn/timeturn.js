// pages/timeturn/timeturn.js
var timer = {};
var util = require("../../utils/util.js"); 
Page({

  /**
   * 页面的初始数据
   */
  data: {
    curtimes:"",
    turntimes:"",
    turndate:"",
    state:0, // 当前状态 0 - 开始 1 - 停止
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
    refreshTime(that);
    if(this.data.state == 0){
      timer = setInterval(function(res){
        refreshTime(that);
      },1000);
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    clearInterval(timer);
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    clearInterval(timer);
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  doGetInput:function(res){
    var value = res.detail.value;
    if(value.length >= 10){
      var date = new Date();
      date.setTime(value * 1000);
      var turndate = util.formatTime(date);
      this.setData({
        turndate
      })
    } else {
      this.setData({
        turndate:""
      })
    }
  },
  doGetInputDate:function(res){
    var value = res.detail.value;
    if(isNaN(value)&&!isNaN(Date.parse(value))){
      var date =  Date.parse(value);
      this.setData({
        turntimes:(date / 1000).toFixed(0)
      })
    } else {
      this.setData({
        turntimes:""
      })
    }
  },
  doStart:function(res){
    this.data.state = 0;
    clearInterval(timer);
    this.onShow();
  },
  doStop:function(res){
    this.data.state = 1;
    clearInterval(timer);
  },
  doCopy:function(res){
    var curtimes = this.data.curtimes;
    wx.setClipboardData({
      data: curtimes,
      success:function(res){
        wx.showToast({
          title: '复制成功',
        })
      }
    })
  },
})

function refreshTime(that){
  let date = new Date();
  let time = (date.getTime() / 1000).toFixed(0);
  that.setData({
    curtimes:time
  })
}