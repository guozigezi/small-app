
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
ifpublic:false,
publicquestion:[],
currenttype:0,
isChecked: false,
numberRange: [],
selectedNumber: 0
  },
 async onLoad() {
    let a=wx.getStorageSync('check')
    console.log(a)
    var time = util.formatTime(new Date());
    var forms=[]
     await db.collection('questions').get().then(res=>{
       console.log(res.data)
       this.setData({
         forms:res.data
       })
       let forms=res.data
        for(var i=0;i<res.data.length;i++){
          var ontitle='title['+i+']'
          var onquestions='questions['+i+']'
          var ondetail='detail['+i+']'
          var kinds=[]
          var kind=[]
          this.setData({
            [ontitle]:res.data[i].问卷,
            [onquestions]:res.data[i].题目,
            [ondetail]:res.data[i].详情,
            kinds:res.data[i].种类,
            kind:res.data[i].类型
          })
        }
        this.setData({
          kind:res.data[a].类型,
        kinds:res.data[a].种类,
        })
        
      })
      this.setData({
        
        currenttime: time,
        number:a,
        current:2,
        currentquestions:this.data.questions[a]
      });
    await  db.collection('public').get().then(res=>{
        
        for(var i=0;i<res.data.length;i++){
          var onpublicquestion='publicquestion['+i+']'
        this.setData({
         [onpublicquestion]:res.data[i].问卷
        })
      }
      })
      this.setData({  
        numberRange: Array.from({ length: this.data.kinds.length }, (_, i) => i + 1),  
        // 初始化selectedNumber为数组的第一个元素  
        selectedNumber:0  
      });  
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
async remove()
{
 let id=this.data.forms[this.data.number]._id
 console.log(id)
 await wx.cloud.callFunction({
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
var pages = getCurrentPages();
var prevPage = pages[pages.length - 2]; // 获取上一个页面实例对象
var delta = pages.length - prevPage.index - 1; // 计算需要返回的页面数

    wx.navigateBack({
      delta:delta,
     
      
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
    if(this.data.publicquestion.length!=0){
    for(var i=0;i<this.data.publicquestion.length;i++){
      if(this.data.title[this.data.number]==this.data.publicquestion[i]){
        this.setData({
          ifpublic:true
        })
      }
    }
  }
    if(this.data.ifpublic){
       wx.showToast({
         title: '已经发布过了',
         icon:null
       })
    }
    else {
    let a=this.data.number
    let data=this.data.forms
    db.collection('public').add({
      data:{
        发布时间:this.data.currenttime,
        截止日期:this.data.limitdate,
        截止时间:this.data.limittime,
        详情:this.data.detail[this.data.number],
        问卷:this.data.title[this.data.number],
        题目:this.data.questions[this.data.number],
        分类:this.data.kinds,
        每道题所属种类:this.data.kind,
        评价:data[a].评价,
        量表:this.data.number
      }
    }).then(res=>{
      console.log('添加成功',res)
    })
    this.setData({
      ifpublic:true
    })
    }
  },
  settype1(e)
  {
     console.log(e)
      this.setData
      ({
        currenttype:e.currentTarget.dataset.index
      })
  },
getthreshold_m(e)
{
  const index = e.currentTarget.dataset.index; // 获取索引  
  const value = e.detail.value; // 获取textarea的值
  var onthreshold_m='threshold_m['+index+']'
  this.setData({
    [onthreshold_m]:value
  })
},
gettext_m(e)
{
  const index = e.currentTarget.dataset.index; // 获取索引  
  const value = e.detail.value; // 获取textarea的值

  var onjudgetext_m='judgetext_m['+index+']'
  this.setData({
    [onjudgetext_m]:value
  })
  
},
getthreshold_k(e)
{
  const index = e.currentTarget.dataset.index; // 获取索引  
  const value = e.detail.value; // 获取textarea的值
  var onthreshold_k='threshold_k['+index+']'
  this.setData({
    [onthreshold_k]:value
  })
},
gettext_k(e)
{
  const index = e.currentTarget.dataset.index; // 获取索引  
  const value = e.detail.value; // 获取textarea的值

  var onjudgetext_k='judgetext_k['+index+']'
  this.setData({
    [onjudgetext_k]:value
  })
  
},
switchChange: function(e) {  
  // e.detail.value是一个布尔值，表示switch的新状态  
  this.setData({  
    isChecked: e.detail.value  
  });  
}  ,
bindPickerChange: function(e) {  
  // 更新选中的索引  
  this.setData({  
    
    
    selectedNumber:  parseInt(e.detail.value) +1
  });  
} ,
judge3(e){
  const value = e.detail.value; // 获取textarea的值
  this.setData({
    judge3:value
  })
}
})