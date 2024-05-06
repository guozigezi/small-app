const db=wx.cloud.database()
Page({
  data:{
answer:'',
option:[],
select:[],
current:0,
judje:[],
username:'',
userid:'',
formname:''
  },
  onLoad()
  {
    let res1=wx.getStorageSync('question')
    let res=res1[1]
    console.log(res1)
    this.setData({
      username:res1[2],
      userid:res1[3],
      formname:res1[0]
    })
    for(var i=0;i<res.length;i++){
      let single=res[i]
      var onquestion='question['+i+']'
      var onoption='option['+i+']'
    this.setData({
       [onquestion]:single[0],
       [onoption]:single[1]
    })
  }
  this.setData({
    currentquestion:this.data.question[0],
    currentoption:this.data.option[0],
  })
  for(var i=0;i<this.data.currentoption.length;i++)
  {
          let item=this.data.currentoption[i]
          var oncurrentoption0='currentoption0['+i+']'
          this.setData({
            [oncurrentoption0]:item[0]
          })
  }
  },
  view(){
wx.previewImage({
  urls: [this.data.option[this.data.current].question],
})
  },
  record(e){
    console.log(e.detail.value)
  this.data.select[this.data.current]=parseInt(e.detail.value)
  },
  recodshow(){
this.setData({show:this.data.select[this.data.current]})
  },
  next(){
      var length=this.data.option.length
    if(this.data.current<length-1){
    this.setData({
      current:this.data.current+1
    })
    this.setData({
      currentquestion:this.data.question[this.data.current],
      currentoption:this.data.option[this.data.current],
      currentoption0:[]
    })
    for(var i=0;i<this.data.currentoption.length;i++)
  {
          let item=this.data.currentoption[i]
          var oncurrentoption0='currentoption0['+i+']'
          this.setData({
            [oncurrentoption0]:item[0]
          })
  }
  this.judje()
    this.setData({
      judjeA:false,
      judjeB:false,
      judjeC:false,
      judjeD:false})
      let select=this.data.select
      if(this.data.select[this.data.current]){
      switch(select[this.data.current].value){
        case 'A':this.setData({judjeA:true});break;
          case 'B':this.setData({judjeB:true});break;
            case 'C':this.setData({judjeC:true});break;
              case 'D':this.setData({judjeD:true});break;
                default:
      }
    }
    }

  },
  remove(){
    this.setData({
      current:this.data.current==0?this.data.current:this.data.current-1,
    })
   
    this.setData({
      judjeA:false,
      judjeB:false,
      judjeC:false,
      judjeD:false
    })
    let select=this.data.select
   
    this.setData({
      currentquestion:this.data.question[this.data.current],
      currentoption:this.data.option[this.data.current],
      currentoption0:[]
    })
    for(var i=0;i<this.data.currentoption.length;i++)
    {
            let item=this.data.currentoption[i]
            var oncurrentoption0='currentoption0['+i+']'
            this.setData({
              [oncurrentoption0]:item[0],
            })
    }
    this.judje()
  },
submmit(){
  let select=this.data.select
  let option=this.data.option
  var sum=0
  for(var i=0;i<option.length;i++){
    let currentoption1=option[i]
    let currentoption2=currentoption1[select[i]]
    let score0=currentoption2[1]
    sum=sum+score0
  }
  this.setData({
    score:sum
  })
  db.collection('record').add({
    data:{
    问卷:this.data.formname,
    姓名:this.data.username,
    学号:this.data.userid,
    题目:this.data.question,
    选项:this.data.option,
    答案:this.data.select,
    得分:this.data.score
    }
  })
 wx.setStorageSync('delete', this.data.formname)
 wx.redirectTo({
   url: '/pages/me2/me2',
 })
 var pages = getCurrentPages();
var before = pages[pages.length - 2];
/*wx.navigateBack({
    success:() => {
    // 执行前一页面的onLoad方法
    before.onLoad(); 
    }
})*/
},
return(){
  wx.navigateBack({
   delta:1
  })
},
judje(){
  for(var i=0;i<this.data.currentoption0.length;i++)
  {
    var onjudje='judje['+i+']'
    this.setData({
      [onjudje]:false
    })
  }
  for(var i=0;i<this.data.currentoption0.length;i++){
    var onjudje='judje['+i+']'
    if(i==this.data.select[this.data.current]){
    this.setData({
      [onjudje]:true
    })
  }
    else {
      this.setData({
        [onjudje]:false
      })
    }
}
    }

})


