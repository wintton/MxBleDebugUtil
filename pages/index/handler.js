let regeneratorRuntime = require("../../utils/runtime.js");
var util = require("../../utils/util.js");
const app = getApp(); 
var isSend = false;

function strToHexCharCode(str) {
  if (str === "")
    return "";
  var hexCharCode = [];
  hexCharCode.push("0x");
  for (var i = 0; i < str.length; i++) {
    hexCharCode.push((str.charCodeAt(i)).toString(16));
  }
  return hexCharCode.join("");
}
//同步请求 
/**
 * request请求，GET  默认header
 */
function sendBleMsg(data,that) {
  that.appendLogs("发送数据 " + data + " 中",that); 
  if(that.data.hexsend){
    data = strToHexCharCode(data);
  }
  return new Promise((success, fail) => {  
     var isSuccess = false;
      app.globalData.bleUtil.sendMsg(data, function (res) {
        isSuccess = true;
        if (res.errCode == 0) {
          that.appendLogs("发送数据 " + data + " 成功",that);
          success(true);  
        } else { 
          that.appendLogs("发送数据 " + data + " 失败",that);
          success(false);
        }
      }, false);   
      //3秒后若没有发送成功，则认为发送失败
      setTimeout(function(res){
          if(!isSuccess){
            success(false);
            that.appendLogs("发送数据 " + data + " 失败",that);
          }
      },3000);
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
    let result = await sendBleMsg(sendlist[i],that);
    if(!result){ 
      stop(that);
      return;
    }
    await sleep(sendtimes,that);
    i++;
    if(i > sendlist.length - 1){
      i = 0;
    }
  }  
}


var sendCoustomList = async (sendlist,title,that) => { 
  that.appendLogs("开始发送功能 " + title ,that); 
  that.setData({
    isRund:true
  }) 
  isSend = true;
  while(isSend){
    for(var x in sendlist){
      if(sendlist[x].opertype == "DE"){
        await sleep(sendlist[x].value,that);
      } else if(sendlist[x].opertype == "SEND"){
       let result = await sendBleMsg(sendlist[x].value,that);
       if(!result){ 
        stop(that);
        return;
       }
      }
    } 
    if(that.data.ismenuRund){
      isSend = true;
    } else {
      isSend = false;
    }
  }
  
  that.setData({
    isRund:false
  })
  that.appendLogs("功能 " + title + "发送完毕",that); 
  
}


var stop = function(that){
  isSend = false;
  if(that){
    that.setData({
      isRund:false
    })
    that.appendLogs("停止发送",that);
  }
} 

module.exports = { 
  sendList: sendList, 
  stop,
  sendCoustomList
}