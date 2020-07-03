// pages/numberturn/numberturn.js
var util = require("../../utils/util.js");
var numberToStr = {
  0:"零",
  1:"壹",
  2:"贰",
  3:"叁",
  4:"肆",
  5:"伍",
  6:"陆",
  7:"柒",
  8:"捌",
  9:"玖",
}
var unitToStr = {
  "-3":"厘",
  "-2":"分",
  "-1":"角",
  0:"",
  1:"拾",
  2:"佰",
  3:"仟",
  4:"万", 
  5:"拾万", 
  6:"佰万", 
  7:"仟万", 
  8:"亿", 
  9:"拾亿", 
  10:"佰亿",
  11:"仟亿",  
  12:"万亿", 
  13:"拾万亿", 
  14:"佰万亿",
  15:"仟万亿",   
  16:"万万亿", 
  17:"拾万万亿", 
  18:"佰万万亿", 
  19:"仟万万亿", 
  20:"万万万亿",     
}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    number1:"", 
    number2:"",
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
    if(isNumber(value)){
      numberTurn(value,this);
    } else {
      this.setData({
        number1:"非数字，请输入正确的格式", 
        number2:"非数字，请输入正确的格式", 
      })
    }
  },
  doCopyNumber:function(res){
    var value = res.currentTarget.dataset.value;
    if(!value){
      util.showHintModal("请输入正确的数字");
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
 
function numberTurn(value,that){
  var result  = [];
  var result2 = [];
  let fen = (value + "").split(".");
  let integerStr = fen[0].split(""); 
  var len =  integerStr.length - 1;
  var i = 0;
  var lastvalue = -1;
  var lastunit = "";
  for(var x = len;x >= 0;x--){
    if(integerStr[x] != 0){  
      result.push(unitToStr[i].replace(lastunit,""));
      result2.push(unitToStr[i].replace(lastunit,"")); 
      if(unitToStr[i].indexOf("万") >= 0){
        lastunit = "万";
      } 
      if(unitToStr[i].indexOf("亿") >= 0){
        lastunit = "亿";
      } 
      if(unitToStr[i].indexOf("万亿") >= 0){
        lastunit = "万亿";
      } 
    } 
    i++;
    if(lastvalue == 0 && integerStr[x] == 0){
      continue;
    }
    result.push(numberToStr[integerStr[x]]); 
    result2.push(integerStr[x]);
    lastvalue = integerStr[x];
    console.log(result);
  }
  if(result[0] == "零" && result.length > 1){
    result.shift();
  }
  if(result2[0] == "0" && result2.length > 1){
    result2.shift();
  }
  if(fen[1]){
    let floatStr = fen[1];
    var floatResult = []; 
    var floatResult2 = []; 
    for(var x in floatStr){ 
      floatResult.push(numberToStr[floatStr[x]]);
      floatResult.push(unitToStr[(parseInt(x) + 1) * -1]); 
      floatResult2.push(floatStr[x]);
      floatResult2.push(unitToStr[(parseInt(x) + 1) * -1]); 
    } 
    result.reverse();
    result = result.join("") + "元" + floatResult.join(""); 
    result2.reverse();
    result2 = result2.join("") + "元" + floatResult2.join(""); 
  } else {
    result.reverse();
    result = result.join("") + "元整";
    result2.reverse();
    result2 = result2.join("") + "元整";
    console.log(result);
  }
  that.setData({
    number1:result,
    number2:result2
  })
}

function isNumber(val){

  var regPos = /^\d+(\.\d+)?$/; //非负浮点数
  var regNeg = /^(-(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*)))$/; //负浮点数
  if(regPos.test(val) || regNeg.test(val)){
      return true;
  }else{
      return false;
  }

}