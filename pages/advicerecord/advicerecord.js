// pages/advicerecord/advicerecord.js
const DB = wx.cloud.database({
  env: 'cloud1-4gt2aqbg17c46b58'
})

Page({

  /**
   * 页面的初始数据
   */
  data: {
    datalist:[
     
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    doQueryDataList(0,this);
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
    doQueryDataList(this.data.datalist.length,this);
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})

function doQueryDataList(index,that){
  DB.collection('advice_db').skip(index).limit(10)
  .get().then(res => {
    console.log(res);
     let data = res.data; 
     let datalist = that.data.datalist;
     data = data.map(function(item){
       item.createtime = formatTime(item.time);
       if(item.retime){
        item.retime = formatTime(item.retime);
       }
       item.statestr = item.state?'已处理':'未处理';
       return item;
     })
     if(index == 0){
      that.setData({
        datalist:data
      })
     } else {
      datalist = datalist.concat(data);
      that.setData({
        datalist:data
      })
     }
  });
}


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
 