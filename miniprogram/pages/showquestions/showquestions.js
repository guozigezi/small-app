
const db=wx.cloud.database()
const app = getApp()
var util = require('../utils.js');
Page({
  data: {
number:0,//当前题号
current:0,//控制页面跳转
title:[],//所有问卷的名字
questions:[],
currentquestions:[],
forms:[],
limittime:[],
publishtiem:[],
limitdate:[],
ifpublic:false
  },
  onLoad() {
    var time = util.formatTime(new Date());
    // 再通过setData更改Page()里面的data，动态更新页面的数据
    this.setData({
      currenttime: time
    });
     let that=this
    var forms=[]
      db.collection('questions').get().then(res=>{
       //console.log(res)
       this.setData({
         forms:res.data
       })
       let forms=res.data
        for(var i=0;i<res.data.length;i++){
          var ontitle='title['+i+']'
          var onquestions='questions['+i+']'
          var ondetail='detail['+i+']'
          this.setData({
            [ontitle]:res.data[i].问卷,
            [onquestions]:res.data[i].题目,
            [ondetail]:res.data[i].详情
          })
        }
       
      })
  },
question(e){
  this.setData({
    current:1
  })
  var number=e.currentTarget.dataset.text
  this.setData({
    number:number+1,
    currentquestions:this.data.questions[number]
  })
},
return(){
  this.setData({
    number:0,
    current:0
  })
},
remove()
{
 let id=this.data.forms[this.data.number-1]._id
 console.log(id)
  wx.cloud.callFunction({
    name:"remove",
    data:{
      id:id
         }
    }).then(res=>{
      console.log(res,'成功')
      let a=this.data.number-1
      this.data.title.splice(a,1)
      this.data.forms.splice(a,1)
      this.data.questions.splice(a,1)
      this.data.detail.splice(a,1)
      this.setData({
        title:this.data.title,
        forms:this.data.forms,
        questions:this.data.questions,
        detail:this.data.detail
      })
    })
    this.setData({
      current:0
    })
},

bindDateChange: function(e) {
  this.setData({
     limitdate: e.detail.value
  })
},
bindtimeChange: function(e) {
  this.setData({
     limittime: e.detail.value
  })
},
publish()
  {  
    if(this.data.ifpublic){
       wx.showToast({
         title: '已经发布过了',
         icon:null
       })
    }
    else {
    let a=this.data.number-1
    db.collection('public').add({
      data:{
          发布时间:this.data.currenttime,
          截止日期:this.data.limitdate,
          截止时间:this.data.limittime,
          详情:this.data.detail[a],
          问卷:this.data.title[a],
          题目:this.data.questions[a]
      }
    }).then(res=>{
      console.log('添加成功',res)
    })
    this.setData({
      ifpublic:true
    })
  }
  }
})