// pages/uploadimg/uploadimg.js
const app = getApp();
var util = require("../../utils/util.js");
var timer = {}; 
Page({

  /**
   * 页面的初始数据
   */
  data: { 
    msg: "", 
    status:'未连接Wss Server',   
    logs: [],
    sendtimes: 0, 
    lastindex: "item0", 
    isRund: false, //是否正在循环发送消息
    isConnect: false, //是否正在循环发送消息
    menu: [{
        value: "",
        issel: false,
      },
      {
        value: "",
        issel: false,
      },
      {
        value: "",
        issel: false,
      },
      {
        value: "",
        issel: false,
      },
    ]
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
  doOperaConnect:function(res){
    let url = res.detail.value.url;
    let that = this; 
    if(that.data.isConnect){
      appendLogs("断开连接中...",that);
     tcpObject.close();
      return;
    } 
    if(!url || url.indexOf("ws://") != 0){
      showHintModal("格式仅能为 ws://");
      return;
    } 
    var socket = wx.connectSocket({
      url:url,
      header:{
        'content-type': 'application/json'
      },
      protocols: ['protocol1']
    })
    setCallBack(socket,this);
  }, 
 
  doSendValue:function(res){ 
    let that = this;
    if (!that.data.isConnect) {
      showHintModal("未连接服务器");
      appendLogs("未连接服务器",this);
      return;
    } 
    var index = res.currentTarget.dataset.index;
    var menu = this.data.menu;
    if (!menu[index].value) {
      showHintModal("不能发送空值");
      appendLogs("不能发送空值",this);
      return;
    }
    sendMsg(menu[index].value,this);
  },
  doClearData: function (res) {
    this.setData({
      logs: []
    })
    wx.showToast({
      title: "清除成功",
      icon: "none"
    })
  },
  doRund: function (res) {
    if (this.data.isRund) {
      clearInterval(timer);
      this.setData({
        isRund:false
      })
      appendLogs("停止循环发送",this);
      return;
    }
    if (!that.data.isConnect) {
      showHintModal("未连接服务器");
      appendLogs("未连接服务器",this);
      return;
    }  
    var sendtimes = parseInt(this.data.sendtimes);

    if (!sendtimes && sendtimes != 0) {
      showHintModal("循环发送间隔不正确");
      appendLogs("循环发送间隔不正确", this);
      return;
    }

    var that = this;

    var menu = that.data.menu;
    var sendlist = [];

    for (var x in menu) {
      if (menu[x].value && menu[x].issel) {
        sendlist.push(menu[x].value);
      }
    }
    if (sendlist.length == 0) {
      showHintModal("需循环发送的内容为空");
      appendLogs("需循环发送的内容为空", this);
      return;
    }


    appendLogs("开始循环发送", this);

    this.setData({
      isRund: true
    })

    sendList(sendlist, sendtimes, that); 

  },
  doGetSendTimes: function (res) {
    this.data.sendtimes = res.detail.value;
  },
  appendLogs,
})

function compareVersion(v1, v2) {
  v1 = v1.split('.')
  v2 = v2.split('.')
  const len = Math.max(v1.length, v2.length)

  while (v1.length < len) {
    v1.push('0')
  }
  while (v2.length < len) {
    v2.push('0')
  }

  for (let i = 0; i < len; i++) {
    const num1 = parseInt(v1[i])
    const num2 = parseInt(v2[i])

    if (num1 > num2) {
      return 1
    } else if (num1 < num2) {
      return -1
    }
  }

  return 0
}

function setCallBack(socket,that){
  const version = wx.getSystemInfoSync().SDKVersion 

  if (compareVersion(version, '2.0.0') >= 0) {  
    //开启监听
    socket.onClose(function(res){
      console.log(res);
      if(timer){
        clearInterval(timer);
      }
      that.setData({
        status:"已关闭连接",
        isConnect:false,
        isRund:false
      })
      appendLogs("关闭连接",that);
    }); 
    socket.onOpen(function(res){
      console.log(res);
      that.setData({
        status:"已连接服务器",
        isConnect:true, 
      })
      appendLogs("已连接",that);
    });
    socket.onError(function(res){
      console.log(res);
      if(timer){
        clearInterval(timer);
      }
      that.setData({
        status:"连接异常，已关闭",
        isConnect:false,
        isRund:false
      })
      appendLogs("连接异常，已关闭",that);
    });
    socket.onMessage(function(res){ 
      let message = ab2Str(res.message);
      appendLogs("接收：" + message,that);
    });  
  } else {
    // 如果希望用户在最新版本的客户端上体验您的小程序，可以这样子提示
    wx.showModal({
      title: '提示',
      content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。',
      success:function(res){
        wx.navigateBack();
      }
    })
  }
}

function sendList(list,times,that){
   if(timer){
    clearInterval(timer);
   }
   timer = setInterval(function(res){
     if(!that.data.isRund){
      clearInterval(timer);
      return;
     }
    for(var item in list){
      sendMsg(item,that)
    }
   },100,times); 
}


function sendMsg(msg,that) {
   
  tcpObject.write(msg);

  appendLogs("发送数据 " + msg + " 成功",that);
}

function ab2Str(buffer){  
  return hex2str(ab2hex(buffer));
} 

function ab2hex(buffer) {
  var hexArr = Array.prototype.map.call(
    new Uint8Array(buffer),
    function (bit) {
      return ('00' + bit.toString(16)).slice(-2)
    }
  )
  return hexArr.join(' ');
}

function hex2str(str) {
  var len = str.length / 2;
  var result = "";
  for (var i = 0; i < len; i++) {
    let data = str.substring(i * 2, i * 2 + 2);
    result += String.fromCharCode(parseInt(data, 16));
  }
  return result;
}

function appendLogs(info, that) {
  var logs = that.data.logs;
  var date = new Date();
  var nowtime = util.formatTime(date);
  info = "【" + nowtime + "】" + info;
  if (logs.length > 1000) {
    logs.shift();
  }
  logs.push(info);
  that.setData({
    logs,
    lastindex: "item" + (logs.length - 1)
  })
}

function showHintModal(msg) {
  wx.showModal({
    title: '提示',
    content: msg,
    showCancel: false,
    confirmText: "我知道了"
  })
}
 
 