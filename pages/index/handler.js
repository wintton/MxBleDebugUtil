let regeneratorRuntime = require("../../utils/runtime.js");
var util = require("../../utils/util.js");
const app = getApp(); 
var isSend = false;

//同步请求 
/**
 * request请求，GET  默认header
 */
function sendBleMsg(data,that) {
  that.appendLogs("发送数据 " + data + " 中",that); 
  return new Promise((success, fail) => {  
      app.globalData.bleUtil.sendMsg(data, function (res) {
        if (res.errCode == 0) {
          that.appendLogs("发送数据 " + data + " 成功",that);
          success(true);  
        } else { 
          that.appendLogs("发送数据 " + data + " 失败," + res.msg,that);
          success(false);
        }
      }, false);   
  });
}

function sleep(times,that) {
  return new Promise((success, fail) => {
    setTimeout(function (res) {
      success(true);
      that.appendLogs("延迟 " + times + " 毫秒",that);
    }, times);
  });
}  

 

var sendList = async (sendlist,sendtimes,that) => { 
  var i = 0; 
  isSend = true;
  while(isSend){
    await sendBleMsg(sendlist[i],that);
    await sleep(sendtimes,that);
    i++;
    if(i > sendlist.length - 1){
      i = 0;
    }
  }  
}

var stop = function(res){
  isSend = false;
} 

module.exports = { 
  sendList: sendList, 
  stop
}