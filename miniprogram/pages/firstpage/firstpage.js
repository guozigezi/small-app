// pages/firstpage/firstpage.js
Page({
  data: {
current:0,
inputdata:'',
inputpassword:'',
students:[],
teachers:[],
animationData1: {}, // 按钮一的动画数据  
animationData2: {}, // 按钮二的动画数据  
  },
  async onLoad() {
   // let count= wx.cloud.database().collection('students').count();
   // let number=(await count).total
   // console.log(number)
   /* for(var i=0;i<=number;i+=20)
    {
      var list=[];
    wx.cloud.database().collection('students').skip(i).get()
    .then(res=>{
      console.log(res,'请求成功')
      list=list.concat(res.data)
      this.setData({
        students:list
      })
    })
  }*/
    wx.cloud.database().collection('teachers').get()
    .then(res1=>{
      console.log('老师',res1)
      this.setData({
        teachers:res1.data
      })
      })
  },
teacher(){
  wx.navigateTo({
    url: '/pages/teacherlog/teaxherlog',
  })
},
logteacher()
{
  let teachers=this.data.teachers
  for(var i=0;i<this.data.teachers.length;i++)
  {
    if(this.data.inputdata==this.data.teachers[i].number)
    {
         if(this.data.inputpassword==this.data.teachers[i].password){
           console.log('密码正确')
             wx.redirectTo({
               url: '/pages/teacher/teacher',
             })
             wx.setStorageSync('teacher', this.data.teachers[i])
             break;
         }else{
                wx.showToast({
                  title: '账号或密码错误',
                  icon:'error'
                })
         }
    }
    else
    {
     wx.showToast({
     title: '账号或密码错误',
     icon:'none'
     })
    }
  }
},
gotostudent(){
  wx.navigateTo({
    url: '/pages/me2/me2',
  })
  /*this.setData({
    current:2
  })*/
  /*wx.getSetting({
    success(res){
      if (!res.authSetting['scope.userInfo']){
        wx.authorize({
          scope: "scope.userInfo",
          success:(
            wx.getUserInfo({
              success:function(res){
                console.log(res.userInfo)
              }
              })
            )
        }
        )
      }
    }
  })*/
},
logstudent()
{
  wx.setNavigationBarTitle({
    title: '个人中心',
  })
  wx.getSetting({
    success(res){
      if (!res.authSetting['scope.userInfo']){
        wx.authorize({
          scope: "scope.userInfo",
          success:(
            wx.getUserInfo({
              success:function(res){
                console.log(res.userInfo)
              }
              })
            )
        }
        )
      }
    }
  })
  for(var i=0;i<this.data.students.length;i++)
   {
     if(this.data.inputdata==this.data.students[i].number)
     {
          if(this.data.inputpassword==this.data.students[i].password){
              wx.redirectTo({
                url: '/pages/student/student',
              })
              wx.showToast({
                title: '登录成功',
                icon:'none'
              })
              break;
          }else{
                 wx.showToast({
                   title: '账号或密码错误',
                   icon:'error'
                 })
                 
          }
     }
     else
     {
      wx.showToast({
      title: '账号或密码错误',
      icon:'none'
      })
     }
   }
},
return()
{
  this.setData({
    current:0
  })
},
bindinputdata(e)
{
this.setData({
  inputdata:e.detail.value
})
},
bindinputpassword(e)
{
  this.setData({
    inputpassword:e.detail.value
  })
},
register(){
  wx.navigateTo({
    url: '/pages/registerno/registerno',
  })
},
onShareAppMessage: function() {
  return {
    title: '测试小屋更新了，还不过来看看？', // 分享的标题
    imageUrl: 'https://636c-cloud1-0gopr9bga04d4ea8-1336284918.tcb.qcloud.la/%E7%88%B1%E5%9B%A0%E6%96%AF%E5%9D%A6.jpg?sign=f570945f5d54f8a831c63f5ec42d1316&t=1744626709', 
    path: '/pages/firstpage/firstpage', // 分享的页面路径
    success: function(res) {
      console.log('分享成功', res);
    },
    fail: function(err) {
      console.log('分享失败', err);
    }
  };
}
})