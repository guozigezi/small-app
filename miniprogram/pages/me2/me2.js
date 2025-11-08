const db=wx.cloud.database()
Page({
    // 页面的初始数据
    data: {
        userInfo: {
            nickName: 'q'
        },
        content: [],
        px: [],
        imgUrl: "../../images/down.png",
        wenjuan:[],
        detail:[],
        target:0,
        record:[]
    },
 async onLoad(){
  this.setData({
    active:true
  })
var user = wx.getStorageSync('user2')
        if (user && user.name) {
            this.setData({
                userInfo: user,
            })
        }
   await db.collection('public').get().then(res=>{
    
      let forms=res.data
      for(var i=0;i<res.data.length;i++)
      {
        var onwenjuan='wenjuan['+i+']'
        var ondetail='detail['+i+']'
        var onquestions='questions['+i+']'
        var onkinds='kinds['+i+']'
        var onkind='kind['+i+']'
        var onjudgekind='judgekind['+i+']'
        var onjudgetext='judgetext['+i+']'
        this.setData({
          [onwenjuan]:forms[i].问卷,
          [ondetail]:res.data[i].详情,
          [onquestions]:forms[i].题目,
          [onkinds]:forms[i].分类,
          [onkind]:forms[i].每道题所属种类,
          [onjudgetext]:forms[i].评价,
          [onjudgekind]:forms[i].量表
        })
        
      }
    })
    db.collection('record').where({
      姓名:this.data.userInfo.name
    }).get().then(res=>{
      console.log(res)
      for(var i=0;i<res.data.length;i++){
        var onrecord='record['+i+']'
        var onid='id['+i+']'
        this.setData({
          [onrecord]:res.data[i].问卷,
          [onid]:res.data[i]._id
        })
      }
      
    //   for(var j=0;j<this.data.record.length;j++){
    //   for(var i=0;i<this.data.wenjuan.length;i++){
    //     if(this.data.wenjuan[i]==this.data.record[j]){
    //       console.log('shanchu')
    //       this.data.wenjuan.splice(i,1)
    //       this.data.questions.splice(i,1)
    //       this.data.kind.splice(i,1)
    //       this.data.kinds.splice(i,1)
    //       this.data.judgekind.splice(i,1)
    //       this.data.judgetext.splice(i,1)
    //       this.setData({
    //         wenjuan:this.data.wenjuan,
    //         questions:this.data.questions,
    //         kind:this.data.kind,
    //         kinds:this.data.kinds,
    //         judgekind:this.data.judgekind,
    //         judgetext:this.data.judgetext
    //       })
    //     }
    //   }
    // }
  
    })
},
 onShow(){
  this.setData({
    active:true
  })
var user = wx.getStorageSync('user2')
        if (user && user.name) {
            this.setData({
                userInfo: user,
            })
        }
        
   
    db.collection('record').where({
      姓名:this.data.userInfo.name
    }).get().then(res=>{
      
      for(var i=0;i<res.data.length;i++){
        var onrecord='record['+i+']'
        this.setData({
          [onrecord]:res.data[i].问卷
        })
      }
      
    //   for(var j=0;j<this.data.record.length;j++){
    //   for(var i=0;i<this.data.wenjuan.length;i++){
    //     if(this.data.wenjuan[i]==this.data.record[j]){
    //       console.log('删除执行')
    //       this.data.wenjuan.splice(i,1)
    //       this.data.questions.splice(i,1)
    //       this.data.kind.splice(i,1)
    //       this.data.kinds.splice(i,1)
    //       this.data.judgekind.splice(i,1)
    //       this.data.judgetext.splice(i,1)
    //       this.setData({
    //         wenjuan:this.data.wenjuan,
    //         questions:this.data.questions,
    //         kind:this.data.kind,
    //         kinds:this.data.kinds,
    //         judgekind:this.data.judgekind,
    //         judgetext:this.data.judgetext
    //       })
    //     }
    //   }
    // }
  
    })
},
delete(){
console.log(this.data.wenjuan)
let that=this
for(var i=0;i<2;i++){
  if(this.data.wenjuan[i]==this.data.questions){
    console.log('删除',this.data.wenjuan[i])
    this.data.wenjuan.splice(i,1)
    this.data.questions.splice(i,1)
    that.setData({
      wenjuan:that.data.wenjuan,
      questions:that.data.questions
    })
  }
  else console.log('cuowu',this.data.wenjuan[i])
}
},
listpx: function(e) {
let a=e.currentTarget.dataset.text
this.setData({
  target:a
})
},
listpx1: function(e) {
  let a=e.currentTarget.dataset.text
this.setData({
  target:a
})
},
fanhui(){
this.setData({
  target:0
})
},
login() {
        wx.navigateTo({
            url: '/pages/login/login',
        })
    },
    //退出登录
    tuichu() {
        this.setData({
            userInfo: null,
        })
        wx.setStorageSync('user2', null)
    },
    // 修改个人资料
    goChange() {
        wx.navigateTo({
            url: '/pages/change/change',
        })
    },
  gotodati(e){
    console.log(e)
    let a=Number(e.currentTarget.dataset.text)
    console.log(a,"第几个")
    let infor=this.data.userInfo
    let message=[this.data.wenjuan[a],this.data.questions[a],infor.name,infor.phone,this.data.kinds[a],this.data.kind[a],this.data.judgekind[a],this.data.judgetext[a],this.data.userInfo.avatarUrl]
    wx.setStorageSync('question',message)
    wx.navigateTo({
      url: '/pages/dati1/dati1',
    })
  },
  record(e)
  {
    let a=e.currentTarget.dataset.text

    wx.setStorageSync('userrecord', [this.data.userInfo.name,this.data.id[a],this.data.userInfo.avatarUrl])
    wx.navigateTo({
      url: '/pages/studentcheck/studentcheck',
    })
  }
})