// pages/addsendbtn/addsendbtn.js
const app = getApp();
var util = require("../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    menu: [],
    hintinfo: {
      ishow: false,
      title: "选择操作内容",
      inputValue: "",
      confirmtext: "确定",
      canletext: "取消"
    },
    operToStr:{
      "SEND":"发送消息： ",
      "DE":"延迟： "
    },
    unitToStr:{
      "SEND":"",
      "DE":"毫秒"
    },
    items: [
      { name: 'SEND', value: '发送', checked: 'true' },
      { name: 'DE', value: '延迟' },  
    ],
    opera:"SEND",  
    isedit:0,   
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(options.title){
      this.setData({
         isedit:1,
         title:options.title
      })
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

  /**
   * 确认
   */
  doComfrim: function (res) {
    var that = this;
    var _hintinfo = that.data.hintinfo;
    var menu = that.data.menu;
    var operToStr = that.data.operToStr;
    var unitToStr = that.data.unitToStr;
    var opera = this.data.opera;

    if(!_hintinfo.inputValue){
      util.showHintModal("内容不能为空");
      return;
    }
    
    if(opera == "DE" && !parseInt(_hintinfo.inputValue)){
      util.showHintModal("延时时间只能为整数");
      return;
    }

    menu.push({
      title:operToStr[opera] + _hintinfo.inputValue + unitToStr[opera],
      opertype:opera,
      value: _hintinfo.inputValue
    })

    _hintinfo.ishow = false;

    that.setData({
      hintinfo: _hintinfo,
      menu
    })
  },
  checkboxChange: function (e) { 
    this.setData({
      opera:e.detail.value
    })
  },  
  getInputValue:function(res){ 
    this.data.hintinfo.inputValue = res.detail.value; 
  },
  doDelete:function(res){
    let index = res.currentTarget.dataset.index;
    let menu = this.data.menu;
    menu.splice(index,1);
    this.setData({
      menu
    })
  },
  doSave:function(res){
    if(!this.data.title){
      util.showHintModal("功能名称不能为空");
      return;
    }

    let menu = this.data.menu;

    wx.setStorageSync(this.data.title, menu);

    wx.showToast({
      title: '保存成功',
    })

    if(!this.data.edit && app.globalData.menu){
      app.globalData.menu.push(this.data.title);
      wx.setStorageSync("menulist", app.globalData.menu);
    }

  },
  doGetTitle:function(res){
    this.data.title = res.detail.value;
  },
  /**
   * 取消
   */
  doCanle: function (res) {
    var that = this;
    var _hintinfo = that.data.hintinfo;
    _hintinfo.ishow = false;

    that.setData({
      hintinfo: _hintinfo
    })
  },
  doShowDiaolog:function(res){
    this.setData({
      "hintinfo.ishow": true
    })
  }
})