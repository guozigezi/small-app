// pages/teacher/teacher.js
Page({
  data: {

  },
  onLoad() {
    var teacher=wx.getStorageSync('teacher')
    console.log(teacher)
    this.setData({
      teacher:teacher
    })
  },
  onShow(){
    this.onLoad()
  },
  tuichu() {
    wx.redirectTo({

      url: '/pages/firstpage/firstpage',
      
      });
    
},
  gotochange(){
    wx.navigateTo({
      url: '/pages/changeteacher/changeteacher',
    })
  },
  addform(){
    wx.navigateTo({
      url: '/pages/shangchuan/shangchuan',
    })
  },
  removeform(){
wx.navigateTo({
  url: 'url',
})
  },
  checkstudent(){
wx.navigateTo({
  url: '/pages/checkstudent/checkstudent',
})
  },
  showquestions(){
    wx.navigateTo({
      url: '/pages/showquestions/showquestions',
    })
  },
  checkstudentname(){
    wx.navigateTo({
      url: '/pages/name/name',
    })
  },
  showpublic(){
    wx.navigateTo({
      url: '/pages/showpublic1/showpublic1',
    })
  }
})