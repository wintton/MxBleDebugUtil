// pages/eatshake/eatshake.js
const app = getApp();
var timer = {};
var data = [
  {
    x:2,
    y:3
  },
  {
    x:2,
    y:4
  },
  {
    x:2,
    y:5
  },
];
    
var options = {
  row:20,
  column:20
}

var foodPonint = "";

Page({

  /**
   * 页面的初始数据
   */
  data: {
    shake:[],
    curDirect:0,
    state:2, //当前游戏难度
    dirlist:[
      {
        name:"上",
        value:0
      }, 
      {
        data:[
          {
            name:"左",
            value:2
          },
          {
            name:"右",
            value:3
          },
        ]
      },
      {
        name:"下",
        value:1
      },
    ],
    btnlist:[ 
      {
        name:"暂停",
        value:4
      },
      {
        name:"难度：2",
        value:5
      }, 
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    data = [
      {
        x:2,
        y:3
      },
      {
        x:2,
        y:4
      },
      {
        x:2,
        y:5
      },
    ];
    this.setData({
      width:app.globalData.width,
      height:app.globalData.height,
    })
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
 
    var that = this;
     
    timer = setInterval(function(res) {
      drawShake(data,options,that,foodPonint);
      let nextPonint = {x:0,y:0};
      let x = 0;
      var curDirect = that.data.curDirect; // 0 - 上 1 - 下 2 - 左 3 - 右
      switch(curDirect){
        case 0:{
          nextPonint.x = data[x].x;
          nextPonint.y = data[x].y - 1;
        }
        break;
        case 1:{
          nextPonint.x = data[x].x;
          nextPonint.y = data[x].y + 1;
        }
        break;
        case 2:{
          nextPonint.x = data[x].x - 1;
          nextPonint.y = data[x].y;
        }
        break;
        case 3:{
          nextPonint.x = data[x].x + 1;
          nextPonint.y = data[x].y;
        }
        break;
      }
      
      if(nextPonint.x < 0){
        nextPonint.x = options.column - 1;
      }

      if(nextPonint.y < 0){
        nextPonint.y = options.row - 1;
      }

      if(nextPonint.x > options.column){
        nextPonint.x = 0;
      }

      if(nextPonint.y > options.row){
        nextPonint.y = 0;
      } 
      
      data.unshift(nextPonint);
      if(foodPonint && nextPonint.x == foodPonint.x && nextPonint.y == foodPonint.y){
        foodPonint = "";
      } else {
        data.pop();
      }
       
      if(!foodPonint){
        foodPonint = {}; 
        foodPonint.x = Math.floor(Math.random() * (options.column - 1));
        foodPonint.y = Math.floor(Math.random() * (options.row - 1));
      }

    },1000 / that.data.state);
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  clearInterval(timer);
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    clearInterval(timer);
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
  doGoToOpera:function(res) {
    var that = this;
    var value = res.currentTarget.dataset.value;
    var index = res.currentTarget.dataset.index;
    var btnlist = this.data.btnlist[index];
    if(value == 5){
      wx.showActionSheet({
        itemList: ["难度1","难度2","难度3","难度4","难度5","难度6"],
        success:function(res) {
          btnlist.name = "难度" + (res.tapIndex + 1);
          that.setData({
            state:res.tapIndex + 1,
            btnlist:that.data.btnlist
          })
          clearInterval(timer);
          that.onShow();
        }
      });
      return;
    }
    if(value == 4){ 
      if(btnlist.name == "暂停"){
        clearInterval(timer);
      }
      if(btnlist.name == "继续"){
         this.onShow();
      }
      btnlist.name = btnlist.name == "暂停"?"继续":"暂停";
      this.setData({
        btnlist:that.data.btnlist
      })
      return;
    }
    if(this.data.curDirect + value == 1){
      return;
    }
    if(this.data.curDirect + value == 5){
      return;
    }
    this.data.curDirect = value;
  }
})

function drawShake(data,options,that,foodPonint) { 
  

  let width = that.data.width * 0.7;
  let height = that.data.width * 0.7;

  let ctx = wx.createCanvasContext('shake'); 

  let row = options.row || 10;
  let column =  options.column || 10;

  let widtheach = parseInt(width / column);
  let heighteach = parseInt(height / row);

  ctx.setStrokeStyle("#000");
  let curPoint = {
    x:0,
    y:0,
  }

  // for(var i = 0;i <= row;i++){
  //   for(var j = 0;j <= column;j++){
  //     curPoint.y = i * heighteach;
  //     curPoint.x = j * widtheach;
  //     ctx.strokeRect(curPoint.x,curPoint.y, widtheach, heighteach);
  //   }
  // }  

  ctx.setFillStyle("#00f");
  for(var x in data){

    curPoint.y = data[x].y * heighteach;
    curPoint.x = data[x].x * widtheach;  
    ctx.fillRect(curPoint.x,curPoint.y, widtheach, heighteach);
  }

  ctx.setFillStyle("#0f0");
  if(foodPonint && (foodPonint.x || foodPonint.x  == 0) && (foodPonint.y || foodPonint.y == 0)){
    curPoint.y = foodPonint.y * heighteach;
    curPoint.x = foodPonint.x * widtheach;
    ctx.fillRect(curPoint.x,curPoint.y, widtheach, heighteach);
  }

  ctx.draw();
}