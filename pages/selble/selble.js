// pages/selble/selble.js
var Bletool = require("../../utils/bletool.js");
var util = require("../../utils/util.js");
const app = getApp();
var bleUtil;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    getDevList: {},      //已扫描到设备列表 
    deviceslist: [
     
    ],   //蓝牙数据
    devicename: 0,
    repdata: "",
    hint: "",
    selmac:'' 
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.data.getDevList = {};
    app.globalData.issel = false;
    if (app.globalData.bleUtil == ""){
      bleUtil = new Bletool(); 
      app.globalData.bleUtil = bleUtil;
      bleUtil.initble(function (res) {
        console.log(res);
        if (res.return_code == "0") {
          setTimeout(function (res) {
            //开始蓝牙扫描 10秒后停止扫描
            wx.showNavigationBarLoading();
            bleUtil.startScanle(function (res) {
              //获取设备回调
              console.log(res);
              if (!that.data.getDevList[res.devices[0].deviceId]) {
                var devices = that.data.deviceslist;
                devices.push(res.devices[0]);
                that.data.getDevList[res.devices[0].deviceId] = devices.length;
                that.setData({
                  deviceslist: devices
                });
              } else {
                var devices = that.data.deviceslist;
                var index = that.data.getDevList[res.devices[0].deviceId] - 1;
                devices[index].RSSI = res.devices[0].RSSI;
                that.setData({
                  deviceslist: devices
                });
              }
            }, function (res) {
              if (res.msg == "扫描结束") {
                //扫描结束
                wx.hideNavigationBarLoading()
              }
            }, 10000, true);
          }, 1000);
        } else {
          bleUtil = undefined;
          app.globalData.bleUtil  = "";
          wx.showModal({
            title: '提示',
            content: '蓝牙初始化失败，请检查是否已打开蓝牙',
            showCancel: false,
            confirmText: "我知道了",
            success:function(Res){
              wx.navigateBack({
                complete: (res) => {
                  
                },
              })
            }
          })
        }
      }, function (res) {
        console.log(res);

      }, function (res) {
        console.log(res);
      });
    } else {
      bleUtil = app.globalData.bleUtil;
      that.refresh();
      app.globalData.bleUtil.disconnect(function (res) {
         console.log(res);
      });
    } 
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
    if (bleUtil) {
      bleUtil.stopScanle();
    }
    if (app.globalData.bleUtil != "") {
      app.globalData.bleUtil.close(function(res) {
        console.log(res);
        app.globalData.bleUtil = "";
      });
    }
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
     this.refresh();
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
  selItem: function (res) {
    var that = this;
    var item = res.currentTarget.dataset.item;
    app.globalData.selble = item;
    that.setData({
      selmac: item.deviceId
    })
  },
  doback:function(res){
    app.globalData.issel = true;
    bleUtil.stopScanle();
    wx.navigateTo({
      url: '../index/index',
    })
  },
  refresh:function(res){
    var that = this;
    if (bleUtil) {
      wx.showNavigationBarLoading();
      bleUtil.startScanle(function (res) {
        //获取设备回调
        console.log(res);
        if (!that.data.getDevList[res.devices[0].deviceId]) {
          var devices = that.data.deviceslist;
          devices.push(res.devices[0]);
          that.data.getDevList[res.devices[0].deviceId] = devices.length;
          that.setData({
            deviceslist: devices
          });
        } else {
          var devices = that.data.deviceslist;
          var index = that.data.getDevList[res.devices[0].deviceId] - 1;
          devices[index].RSSI = res.devices[0].RSSI;
          that.setData({
            deviceslist: devices
          });
        }
      }, function (res) {
        if (res.return_code == 1) {
          showHintModal("正在扫描中，请勿重复操作");
        }
        if (res.msg == "扫描结束") {
          //扫描结束
          wx.hideNavigationBarLoading()
        }
      }, 10000, true);
    } else {
      showHintModal("蓝牙未打开，请打开蓝牙后，重新打开该页面");
    }
  }
})

function showHintModal(msg) {
  wx.showModal({
    title: '提示',
    content: msg,
    showCancel: false,
    confirmText: "我知道了",
    success: function (res) { }
  })
}