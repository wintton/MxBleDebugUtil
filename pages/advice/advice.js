// pages/advice/advice.js
var util = require("../../utils/util.js");
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {

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
  doSubmit: function (res) {
    console.log(res);
    var content = res.detail.value.content;
    if (content == "") {
      showHintModal("内容不能为空哦");
      return;
    }
    submiterror(content, this);
  }
})

function showHintModal(msg) {
  wx.showModal({
    title: '提示',
    content: msg,
    showCancel: false,
    confirmText: "我知道了"
  })
}


function showHintModalCall(msg, call) {
  wx.showModal({
    title: '提示',
    content: msg,
    showCancel: false,
    success: call,
    confirmText: "我知道了"
  })
}

function submiterror(msg, that) {
  wx.showLoading({
    title: '提交中',
  })
  var data = {
    opertype:'add',
    userphone: "111",
    openid: "1111",
    errortype: 2,
    errormsg: msg,
  };
  util.requestPost("/error_rep.jsp", data, function (res) {
    console.log(res.data);
    wx.hideLoading();
    if (res.data.code == 0) {
    
      showHintModalCall("提交成功，非常感谢您对我们的建议，我们会不断优化，及时解决您的问题，祝您生活愉快", function (res) {
        wx.navigateBack({

        })
      });
    } else {
      showHintModal("很抱歉，提交失败，请稍后再试吧");
    }
  });
}
//发送通知给商家
function sendmsgToShopUser(phone, content) {

  var data = {
    phone: phone,
    content: content,
  };
  util.requestGet_Root("/baseapi/send_temple_msg.jsp", data, function (res) {
    console.log(res.data);
  });
}