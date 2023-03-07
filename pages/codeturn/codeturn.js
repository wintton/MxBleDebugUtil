// pages/codeturn/codeturn.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    index:2,
    array:[
      {
        name:"2进制",
        value:"2"
      },
      {
        name:"8进制",
        value:"8"
      },
      {
        name:"10进制",
        value:"10"
      },
      {
        name:"16进制",
        value:"16"
      },  
    ],
    needturn:"",
    oindex:2, 
    turnvalue:""
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
  bindPickerChange:function(res){
    this.setData({
      index: res.detail.value
    })
    refreshValue( this.data.value,this);
  },
  bindPickerChangeO:function(res){
    this.setData({
      oindex: res.detail.value
    })
    refreshValue( this.data.value,this);
  },
  doGetInput:function(res){
    this.data.value = res.detail.value;
    refreshValue(res.detail.value,this);
  }
})

function refreshValue(value,that){
  if(!value){
    that.setData({
      turnvalue:""
    })
    return;
  }
  let index = that.data.index;
  let oindex = that.data.oindex;
  var array = that.data.array;

  let start = array[index].value;
  let end = array[oindex].value;

  let strs = value.split("");
  strs = strs.filter(function(a){
    if(a >= start){
      return true;
    }
    return false;
  }); 
  if(strs.length > 0){
    that.setData({
      turnvalue:"错误的数据"
    })
    return;
  } 

  let result = turn(value,start,end);  
  if(result && result != 0){
    that.setData({
      turnvalue:result
    })
  } else {
    that.setData({
      turnvalue:"错误的数据"
    })
  }

}

function turn(num,m,n){
  var s = num+'';
  var result = parseInt(s,m).toString(n);
  return result;
}