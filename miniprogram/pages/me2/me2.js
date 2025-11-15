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
   await db.collection('public').limit(999).get().then(res=>{
    
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
    // 使用云函数获取所有记录，突破20条限制
    wx.cloud.callFunction({
      name: 'getAllRecords',
      data: {
        collection: 'record',
        where: {
          姓名: this.data.userInfo.name
        }
      }
    }).then(res => {
      console.log('云函数查询结果:', res)
      if (res.result.success) {
        // 初始化空数组，避免数组长度问题
        this.setData({
          record: [],
          id: []
        })
        // 重新设置数据
        for(var i=0;i<res.result.data.length;i++){
          this.setData({
            [`record[${i}]`]: res.result.data[i].问卷,
            [`id[${i}]`]: res.result.data[i]._id
          })
        }
      }
    }).catch(err => {
      console.error('云函数调用失败:', err)
      // 降级使用本地查询
      db.collection('record').where({
        姓名:this.data.userInfo.name
      }).limit(999).get().then(res=>{
        console.log('降级查询结果:', res)
        // 初始化空数组，避免数组长度问题
        this.setData({
          record: [],
          id: []
        })
        // 重新设置数据
        for(var i=0;i<res.data.length;i++){
          this.setData({
            [`record[${i}]`]: res.data[i].问卷,
            [`id[${i}]`]: res.data[i]._id
          })
        }
      })
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
        
   
    // 使用云函数获取所有记录，突破20条限制
    wx.cloud.callFunction({
      name: 'getAllRecords',
      data: {
        collection: 'record',
        where: {
          姓名: this.data.userInfo.name
        }
      }
    }).then(res => {
      console.log('云函数查询结果:', res)
      if (res.result.success) {
        console.log('查询到的记录:', res.result.data)
        // 初始化空数组，避免数组长度问题
        this.setData({
          record: [],
          id: []
        })
        // 重新设置数据
        for(var i=0;i<res.result.data.length;i++){
          this.setData({
            [`record[${i}]`]: res.result.data[i].问卷,
            [`id[${i}]`]: res.result.data[i]._id
          })
        }
      }
    }).catch(err => {
      console.error('云函数调用失败:', err)
      // 降级使用本地查询
      db.collection('record').where({
        姓名:this.data.userInfo.name
      }).limit(999).get().then(res=>{
        console.log('降级查询结果:', res.data)
        // 初始化空数组，避免数组长度问题
        this.setData({
          record: [],
          id: []
        })
        // 重新设置数据
        for(var i=0;i<res.data.length;i++){
          this.setData({
            [`record[${i}]`]: res.data[i].问卷,
            [`id[${i}]`]: res.data[i]._id
          })
        }
      })
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