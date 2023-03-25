// pages/uploadimg/uploadimg.js
const app = getApp();
var util = require("../../utils/util.js"); 
var handler = require("handler.js");
var timer = {};
var menuToCmd = {};
Page({

  /**
   * 页面的初始数据
   */
  data: {  
    imgswiperset: {        //swiper信息设置
      indicator_dots: false,        //是否显示面板指示点
      autoplay: false,               //是否自动切换
      interval: 10000,                //自动切换时间间隔
      duration: 200,                  //滑动动画时长
      indicator_color: '#b0b0b0', //指示点颜色
      indicator_active_color: 'rgb(19, 157, 236)',       //当前选中的指示点颜色
      circular: false,                       //是否采用衔接滑
    },
    msg:"",
    isShowDialog: false,     //是否显示弹窗
    statusinfo: { 
      status: '未连接(点击切换蓝牙)',
    },
    write_id:"--",
    notifty_id:"--",
    title:"选择服务",
    ishex:true,
    logs:[],
    sendtimes:0,
    servicelist:[],
    lastindex:"item0",
    ismenuRund:false,//是否循环发送
    customMen:[],//自定义控制菜单
    isRund:false,//是否正在循环发送消息
    hexsend:false,
    menu:[
      { 
        value:"",
        issel:false,
      },
      { 
        value:"",
        issel:false,
      },
      { 
        value:"",
        issel:false,
      },
      { 
        value:"",
        issel:false,
      },
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    if(app.globalData.selble.deviceId){
      wx.setNavigationBarTitle({
        title:(app.globalData.selble.name || "未知设备") + "(" + app.globalData.selble.deviceId + ")"
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    if (app.globalData.issel && app.globalData.bleUtil != "") {
      var that = this;
      that.data.statusinfo.status = '连接中';
      app.globalData.issel = false;
      appendLogs("连接设备中",that);
      that.setData({
        statusinfo: that.data.statusinfo
      })
      //连接蓝牙
      app.globalData.bleUtil.connect(app.globalData.selble.deviceId, function(res) {
        //连接回调
        if (res.return_code == "0") {
          that.data.statusinfo.status = '已连接';
          appendLogs("连接设备成功",that);
          that.setData({
            statusinfo: that.data.statusinfo
          })
        } else {
          that.data.statusinfo.status = '连接失败';
          appendLogs("连接设备失败",that);
          that.setData({
            statusinfo: that.data.statusinfo
          })
          wx.onBLEMTUChange(function (res) {
             that.setData({
              mtuValue:res.mtu
             })
             thiat.data.inputMtu = res.mtu;
          })
        }
      }, function(res) {
        //接收到数据回调 
        console.log("接受到消息：" + res.value.strHexData);  
        appendLogs("接受到消息 " + res.value.strHexData,that); 
      });
    }
    getMenuList(this);
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() { 
    this.selBle();
    handler.stop();
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  }, 
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  menuCheckBocChange:function(res){
    this.data.ismenuRund = res.detail.value;
  },
  gotoStop:function(res){
    handler.stop(this); 
  },
  hexChange(res){ 
    this.data.hexsend = res.detail.value[0];
  },
  changeMTUSet(res){
    this.data.inputMtu = res.detail.value;
  },
  doSendMtu(res){
    let that = this;
    if (app.globalData.bleUtil == "") {
      showHintModal("未连接设备");
      appendLogs("未连接设备",this);
      return;
    }  
    if(!this.data.inputMtu || this.data.inputMtu < 22 || this.data.inputMtu > 512){
      showHintModal("MTU值格式不正确");
      appendLogs("MTU值格式不正确",this);
      return;
    }
    if (this.data.write_id == '--') {
      showHintModal("未选择可写服务");
      appendLogs("未选择可写服务",this);
      return;
    }
    wx.setBLEMTU({
      deviceId:app.globalData.bleUtil.deviceId,
      mtu:that.data.inputMtu * 1,
      success:() => {
        showHintModal("MTU设置成功");
        appendLogs("MTU设置成功",that);
      },
      fail:res => {
        showHintModal("MTU设置失败");
        appendLogs("MTU设置失败",that);
      }
    })
  },
  doSendItem:function(res){ 
    if (app.globalData.bleUtil == "") {
      showHintModal("未连接设备");
      appendLogs("未连接设备",this);
      return;
    } 

    if (this.data.write_id == '--') {
      showHintModal("未选择可写服务");
      appendLogs("未选择可写服务",this);
      return;
    }

    var item = res.currentTarget.dataset.item;
    var sendlist = getCMD(item);

    if(!sendlist){
      return;
    } 

    handler.sendCoustomList(sendlist,item,this);

  },
  doClearData:function(res){
    this.setData({
      logs:[]
    })
    wx.showToast({
      title: "清除成功",
      icon:"none"
    })
  },
  doRund:function(res){
    if(this.data.isRund){
      handler.stop(this); 
      return;
    }
    if (app.globalData.bleUtil == "") {
      showHintModal("未连接设备");
      appendLogs("未连接设备",this);
      return;
    } 
    if (!app.globalData.bleUtil.isCanWrite()) {
      showHintModal("未选择可写服务");
      appendLogs("未选择可写服务",this);
      return;
    }

    var sendtimes = parseInt(this.data.sendtimes);

    if(!sendtimes && sendtimes != 0){
      showHintModal("循环发送间隔不正确");
      appendLogs("循环发送间隔不正确",this);
      return;
    }
 
    var that = this;

    var menu = that.data.menu;
    var sendlist = [];

    for(var x in menu){
      if(menu[x].value && menu[x].issel){
        sendlist.push(menu[x].value);
      }
    }
    if(sendlist.length == 0){
      showHintModal("需循环发送的内容为空");
      appendLogs("需循环发送的内容为空",this);
      return;
    }
     

    appendLogs("开始循环发送",this);

    this.setData({
      isRund:true
    }) 

    handler.sendList(sendlist,sendtimes,that);
    
     
  },
  doGetSendTimes:function(res){
    this.data.sendtimes = res.detail.value;
  },
  selBle: function(res) {
    var that = this; 
    that.data.statusinfo.status = '已断开连接';
    that.setData({
      statusinfo:that.data.statusinfo
    })
    if (!app.globalData.bleUtil && app.globalData.bleUtil != "") {
      app.globalData.bleUtil.disconnect(function(res) {});
    }
    appendLogs("断开当前连接",this); 
  },
  doSend:function(res){
    if (app.globalData.bleUtil == "") {
      showHintModal("未连接设备");
      appendLogs("未连接设备",this);
      return;
    }
    var msg = res.detail.value.msg;
    
    sendBleMsg(msg,this);
  },
  doSendValue:function(res){ 
    if (app.globalData.bleUtil == "") {
      showHintModal("未连接设备");
      appendLogs("未连接设备",this);
      return;
    }
    if (!app.globalData.bleUtil.isCanWrite()) {
      showHintModal("未选择可写服务");
      appendLogs("未选择可写服务",this);
      return;
    }
    var index = res.currentTarget.dataset.index;
    var menu = this.data.menu;
    if (!menu[index].value) {
      showHintModal("不能发送空值");
      appendLogs("不能发送空值",this);
      return;
    }
    sendBleMsg(menu[index].value,this,false);
  },
  checkBoxHex:function(res){
    console.log(res);
    let value = res.detail.value;
    this.setData({
      ishex:value
    })
  },
  doShowSelService:function(res){
    var type = res.currentTarget.dataset.type;
    if(!app.globalData.bleUtil || !app.globalData.bleUtil.getdevConStatus()){
      showHintModal("未连接成功，请先连接成功再试");
      return;
    }
    var servicelist = app.globalData.bleUtil.getServiceList();
    if(!servicelist){
      showHintModal("未成功获取服务，或服务不存在");
      return;
    }
    var title = type == "write"?"选择可写服务":"选择可读/通知服务";
    this.setData({
      type,
      isShowDialog:true,
      title,
      servicelist
    })
  },
  /**
  * 隐藏显示
  */
 doHidenDiaolog: function (res) {  
    this.setData({
      isShowDialog:false
    })
  },
  donothing: function (res) {

  },
  changeOpen:function(res){ 
    var index = res.currentTarget.dataset.index;
    var servicelist = this.data.servicelist;
    servicelist[index].open = !servicelist[index].open;
    this.setData({
      servicelist
    })
  },
  doShowMenu:function(res){
    var item = res.currentTarget.dataset.item;
    var index = res.currentTarget.dataset.index;
    wx.showActionSheet({
      itemList: ["编辑","删除"],
      success:function(res) {
        switch(res.tapIndex){
          case 0:{
            wx.navigateTo({
              url: '../addsendbtn/addsendbtn?title=' + item ,
            })
          } 
          break;
          case 1:{
            wx.showModal({
              content:"确认删除按钮 " + item + ",删除后不可恢复",
              success:function(res) {
                if(res.confirm){
                   app.globalData.menu.splice(index,1);
                   wx.setStorageSync("menulist", app.globalData.menu);
                   that.setData({
                    customMen:app.globalData.menu
                   })
                }
              }
            })
          }
          break;
        }
      }
    })
  },
  doSelUuid:function(res){
    var item = res.currentTarget.dataset.item;
    var each =  res.currentTarget.dataset.each; 
    if(this.data.type == "write" && each.properties.write){
      app.globalData.bleUtil.setWriteUUID(item.uuid,each.uuid);
      wx.showToast({
        title: '设置成功',
        icon:"none"
      })
      this.setData({
        isShowDialog:false,
        write_id:each.uuid
      })
    } else if (this.data.type == "reno" && (each.properties.read || each.properties.notify)){
      if(each.properties.notify){
        app.globalData.bleUtil.setNotiftyUUID(item.uuid,each.uuid);
      } else if(each.properties.read){
        app.globalData.bleUtil.setReadUUID(item.uuid,each.uuid);
      } 
      wx.showToast({
        title: '设置成功',
        icon:"none"
      })
      this.setData({
        isShowDialog:false,
        notifty_id:each.uuid
      })
    } else {
      var hint = this.data.type == "write"?"当前服务不可写":"当前服务不可读且不可通知";
      showHintModal(hint);
    } 
  },
  doGetInput:function(res){
    var index = res.currentTarget.dataset.index;
    var menu = this.data.menu;
    menu[index].value = res.detail.value;
  },
  checkboxChange:function(res){
    console.log(res);
    const index = res.detail.value;
    var menu = this.data.menu;
    for(var x in menu){
      menu[x].issel = false;
    }
    for(var j in index){
      menu[index[j]].issel = true;
    } 
  },
  doReadValue:function(res){
    if (app.globalData.bleUtil == "") {
      showHintModal("未连接设备");
      appendLogs("未连接设备",this);
      return;
    }
    if (!app.globalData.bleUtil.isCanRead() && !app.globalData.bleUtil.isCanNotifty()) {
      showHintModal("未选择可写服务");
      appendLogs("未选择可写服务",this);
      return;
    }
    app.globalData.bleUtil.doRead();
    appendLogs("成功读取",this);
  },
  gotoAddSendBtn:function(res){
    wx.navigateTo({
      url: '../addsendbtn/addsendbtn',
    })
  },
  appendLogs,
})

function appendLogs(info,that){
  var logs = that.data.logs;
  var date = new Date();
  var nowtime = util.formatTime(date);
  info = "【" + nowtime + "】" + info;
  if(logs.length > 1000){
    logs.shift();
  }
  logs.push(info);
  that.setData({
    logs,
    lastindex:"item" + (logs.length - 1)
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
 
function sendBleMsg(msg,that,ishex) {
  appendLogs("发送数据 " + msg + " 中",that); 
    app.globalData.bleUtil.sendMsg(msg, function(res) {
      if (res.errCode == 0) {
        appendLogs("发送数据 " + msg + " 成功",that);
        return false;
      } else {
        appendLogs("发送数据 " + msg + " 失败," + res.msg,that);
        return true;
      }
    }, ishex); 
}

function getMenuList(that){
  if(app.globalData.menu){
    that.setData({
      customMen:app.globalData.menu
    })
    return;
  }
  let menulist = wx.getStorageSync('menulist');
  if(!menulist){
    menulist = [];
  }
  app.globalData.menu = menulist;
  that.setData({
    customMen:menulist
  })
}

function getCMD(title){
  if(menuToCmd[title]){
    return menuToCmd[title];
  }
  let send = wx.getStorageSync(title);
  if(!send){
    util.showHintModal("不存在该条指令");
    return;
  }
  menuToCmd[title] = send;
  return send;
}