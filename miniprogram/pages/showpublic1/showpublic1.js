
const db=wx.cloud.database()
Page({
  data: {
    forms:[],
    title:[],
    questions:[],
    detail:[]
  },
    onLoad(options) {
      db.collection('public').get().then(res=>{
        console.log(res)
        this.setData({
          forms:res.data
        })
        let forms=res.data
        if(forms.length!=0){
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
        }else{
          this.setData({
            forms:[],
            title:[],
            questions:[],
            detail:[]
          })
        }
       })
      
  },
  onShow: function () {
    db.collection('public').get().then(res=>{
      console.log(res)
      this.setData({
        forms:res.data
      })
      let forms=res.data
      if(forms.length!=0){
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
      }else{
        this.setData({
          forms:[],
          title:[],
          questions:[],
          detail:[]
        })
      }
     })
    
},
onReady(){
  db.collection('public').get().then(res=>{
    console.log(res)
    this.setData({
      forms:res.data
    })
    let forms=res.data
    if(forms.length!=0){
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
    }else{
      this.setData({
        forms:[],
        title:[],
        questions:[],
        detail:[]
      })
    }
   })
  
},
 publicquestion(e){
  var number=e.currentTarget.dataset.text
  wx.setStorageSync('public', this.data.forms[number])
 
 wx.navigateTo({
   url: '/pages/showpublic2/showpublic2',
 })
}
})