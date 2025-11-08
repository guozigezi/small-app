// pages/checkstudent/checkstudent.js
const db=wx.cloud.database()
Page({

  data: {
current:0
  },
  onLoad(options) {
    db.collection('public').get().then(res=>{
      console.log(res)
      this.setData({
        forms:res.data
      })
      for(var i=0;i<res.data.length;i++){
        var ontitle='title['+i+']'
        this.setData({
          [ontitle]:res.data[i].问卷,
        })
      }
    })
  },
  showrecord(e){
 this.setData({
   current:1
 })
 this.setData({
   name:[],
   score:[]
 })
 console.log(this.data.title)
 db.collection('record').where({
     问卷:this.data.title[e.currentTarget.dataset.text]
 }).get().then(res=>{
   console.log(res)
   for(var i=0;i<res.data.length;i++){
    var onname='name['+i+']'
    var onscor='score['+i+']'
     this.setData({
       [onname]:res.data[i].姓名,
       [onscor]:res.data[i].得分
     })
   }
 })
  },
  return(){
    this.setData({
      current:0
    })
  },
  returnmain(){
  wx.redirectTo({
    url: '/pages/teacher/teacher',
  })
  }
})