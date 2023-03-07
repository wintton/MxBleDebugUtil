var rootDocment = 'https://16p252413p.zicp.fun';
var rootDocmentRoot = rootDocment + '/waresys';

const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':')
} 

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}
const formatNumberM = n => {
  n = n.toString()
  return n.length > 2 ? n : formatNumberM('0' + n)
}
function showHintModal(msg, callback) {
  let data = {
    title: '提示',
    content: msg,
    showCancel: false,
    confirmText: "我知道了",
  }
  if (callback && typeof callback == "function") {
    data.success = callback;
  }
  wx.showModal(data);
}

function trim(str) {
  return str.replace(/(^\s*)|(\s*$)/g, "");
}

function requestGet(url, data, cb) {
  wx.request({
    url: rootDocment + url,
    data: data,
    method: 'GET',
    header: {
      'content-type': 'application/json'
    },
    success: function (res) {

      return typeof cb == "function" && cb(res)
    },
    fail: function () {

    }
  })
}
function requestPost(url, data, cb) {
  wx.request({
    url: rootDocment + url,
    data: data,
    method: 'post',
    header: {
      'content-type': 'application/json'
    },
    success: function (res) {

      return typeof cb == "function" && cb(res)
    },
    fail: function () {

    }
  })
}

function requestGet_Root(url, data, cb) {
  wx.request({
    url: rootDocmentRoot + url,
    data: data,
    method: 'GET',
    header: {
      'content-type': 'application/json'
    },
    success: function (res) {

      return typeof cb == "function" && cb(res)
    },
    fail: function () {

    }
  })
}

function ab2hex(buffer) {
  var hexArr = Array.prototype.map.call(
    new Uint8Array(buffer),
    function (bit) {
      return ('00' + bit.toString(16)).slice(-2)
    }
  )
  return hexArr.join('');
}

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

function hexCharCodeToStr(hexCharCodeStr) {
  var trimedStr = hexCharCodeStr.trim();
  var rawStr = trimedStr.substr(0, 2).toLowerCase() === "0x" ? trimedStr.substr(2) : trimedStr;
  var len = rawStr.length;
  if (len % 2 !== 0) {
    alert("Illegal Format ASCII Code!");
    return "";
  }
  var curCharCode;
  var resultStr = [];
  for (var i = 0; i < len; i = i + 2) {
    curCharCode = parseInt(rawStr.substr(i, 2), 16); // ASCII Code Value
    resultStr.push(String.fromCharCode(curCharCode));
  }
  return resultStr.join("");
}
/**
 * 
 */
function arrayBufferToHexString(buffer) {
  let bufferType = Object.prototype.toString.call(buffer)
  if (buffer != '[object ArrayBuffer]') {
    return
  }
  let dataView = new DataView(buffer)

  var hexStr = '';
  for (var i = 0; i < dataView.byteLength; i++) {
    var str = dataView.getUint8(i);
    var hex = (str & 0xff).toString(16);
    hex = (hex.length === 1) ? '0' + hex : hex;
    hexStr += hex;
  }

  return hexStr.toUpperCase();
}

module.exports = {
  formatTime: formatTime,
  trim: trim,
  showHintModal: showHintModal,
  requestGet: requestGet,
  ab2hex: ab2hex,
  strToHexCharCode: strToHexCharCode,
  hexCharCodeToStrhexCharCodeToStr: hexCharCodeToStr,
  arrayBufferToHexString: arrayBufferToHexString,
  requestGet_Root: requestGet_Root, 
  requestPost
}