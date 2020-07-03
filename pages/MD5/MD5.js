// pages/numberturn/numberturn.js
var util = require("../../utils/util.js");
var md5util = require("../../utils/md5util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    lockvalue:"",  
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

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

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
  doGetValue:function(res){
    var value = res.detail.value;
    if(value){
     var lockvalue = md5util.md5(value);
     this.setData({
      lockvalue
     })
    } else {
      this.setData({
        lockvalue:"加密内容不能为空",  
      })
    }
  },
  doCopyNumber:function(res){
    var value = res.currentTarget.dataset.value;
    if(!value){
      util.showHintModal("加密内容不能为空");
      return;
    }
    wx.setClipboardData({
      data: value,
      success (res) {
         wx.showToast({
           title: '复制成功',
         })
      }
    })
  }
})
 