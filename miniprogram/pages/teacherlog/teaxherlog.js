// pages/teacherlog/teaxherlog.js
Page({
  data: {
  },
  onLoad() {
    wx.cloud.database().collection('teachers').limit(999).get()
    .then(res1=>{
      console.log('老师',res1)
      this.setData({
        teachers:res1.data
      })
      })
  },
  id(e){
     this.setData({
    inputdata:e.detail.value
     })
  },
  password(e){
this.setData({
  inputpassword:e.detail.value
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

})