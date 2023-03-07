// pages/main/main.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    menu:[
      {
        img:"/images/ic_ble.png",
        name:"蓝牙调试",
        url:"../selble/selble"
      }, 
      {
        img:"/images/ic_number.png",
        name:"数字转换",
        url:"../numberturn/numberturn"
      },
      {
        img:"/images/ic_time.png",
        name:"时间戳转换",
        url:"../timeturn/timeturn"
      },
      {
        img:"/images/ic_code.png",
        name:"进制转换",
        url:"../codeturn/codeturn"
      },
      {
        img:"/images/ic_shake.png",
        name:"贪吃蛇",
        url:"../eatshake/eatshake"
      },
      {
        img:"/images/ic_compass.png",
        name:"指南针",
        url:"../compass/compass"
      },
      {
        img:"/images/id_edit.png",
        name:"意见反馈",
        url:"../advice/advice"
      },
      {
        img:"/images/ic_aboutus.png",
        name:"关于我们",
        url:"../aboutus/aboutus"
      }
    ] 
    // ,
    //   {
    //     img:"/images/ic_lock.png",
    //     name:"MD5加密",
    //     url:"../MD5/MD5"
    //   }
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
  doOpenMenu:function(res){
    var item = res.currentTarget.dataset.item;
    if(!item.url){
      wx.showModal({
         showCancel:false,
         content:"开发中",
         confirmText:"我知道了"
      })
      return;
    }
    wx.navigateTo({
      url: item.url,
    })
  }
})