const db=wx.cloud.database()
Page({
    // 页面的初始数据
    data: {
        userInfo: {
            nickName: 'q'
        },
        content: [],
        px: [],
        pxopen: false,
        pxopen1: false,
        pxshow: false,
        pxshow1: false,
        active:true,
        active1:true,
        imgUrl: "../../images/down.png",
        wenjuan:[],
        detail:[]
    },
onLoad(){
  this.setData({
    active:true
  })
var user = wx.getStorageSync('user2')
        console.log('me---', user)
        if (user && user.name) {
            this.setData({
                userInfo: user,
            })
        }
    db.collection('public').get().then(res=>{
    console.log(1)
      let forms=res.data
      for(var i=0;i<res.data.length;i++)
      {
        var onwenjuan='wenjuan['+i+']'
        var ondetail='detail['+i+']'
        var onquestions='questions['+i+']'
        this.setData({
          [onwenjuan]:forms[i].问卷,
          [ondetail]:res.data[i].详情,
          [onquestions]:forms[i].题目
        })
      }
    })
    
},
onShow(){
this.onLoad()
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
  if (this.data.pxopen) {
      this.setData({
          pxopen: false,
          pxshow: false,
          active: true,
          imgUrl: "../../images/1.png"
      })
  } else {
      this.setData({
          content: this.data.px,
          pxopen: true,
          pxshow: false,
          active:false,
          imgUrl: "../../images/2.jpg"
      })
  }
  db.collection('record').where({
    姓名:this.data.userInfo.name
  }).get().then(res=>{
    console.log(2)
    for(var i=0;i<res.data.length;i++){
      var onrecord='record['+i+']'
      this.setData({
        [onrecord]:res.data[i].问卷
      })
    }
    console.log(3)
    for(var j=0;j<this.data.record.length;j++){
    for(var i=0;i<this.data.wenjuan.length;i++){
      if(this.data.wenjuan[i]==this.data.record[j]){
        console.log('shanchu')
        this.data.wenjuan.splice(i,1)
        this.data.questions.splice(i,1)
        this.setData({
          wenjuan:this.data.wenjuan,
          questions:this.data.questions
        })
      }
    }
  }

  })
},
listpx1: function(e) {
  if (this.data.pxopen1) {
      this.setData({
          pxopen1: false,
          pxshow1: false,
          active1: true,
          imgUrl: "../../images/1.png"
      })
  } else {
      this.setData({
          content: this.data.px,
          pxopen1: true,
          pxshow1: false,
          active1:false,
          imgUrl: "../../images/2.jpg"
      })
  }
 
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
    onShow() {
        var user = wx.getStorageSync('user2')
        console.log('me---', user)
        if (user && user.name) {
            this.setData({
                userInfo: user,
            })
        }
    },
  gotodati(e){
    let a=e.currentTarget.dataset.text
    let infor=this.data.userInfo
    let message=[this.data.wenjuan[a],this.data.questions[a],infor.name,infor.phone]
    wx.setStorageSync('question',message)
    wx.navigateTo({
      url: '/pages/dati1/dati1',
    })
  },
  record(e)
  {
    let a=e.currentTarget.dataset.text

    wx.setStorageSync('userrecord', [this.data.userInfo.name,this.data.record[a]])
    wx.navigateTo({
      url: '/pages/studentcheck/studentcheck',
    })
  }
})