const db = wx.cloud.database()
Page({
  data: {
name:[],
number:[],
password:[]

  },
  onLoad() {
    var teacher = wx.getStorageSync('teacher')
    if (teacher && teacher.name) {
        this.setData({
            teacher:teacher,
            name: teacher.name,
            number:teacher.number,
            password:teacher.password
        })
    }
},
  getName(e) {
    this.setData({
        name: e.detail.value
    })
},
getID(e){
  this.setData({
    number:e.detail.value
  })
},
getpassword(e){
  this.setData({
    password:e.detail.value
  })
},
submit(e){
  let teacher = this.data.teacher
  let number = this.data.number
  let name = this.data.name
  let password=this.data.password
 
  db.collection('teachers').where({
    _id:teacher._id
  }).update({
    data: {
        name: name,
        password:password,
        number:number
    }
}).then(res => {
    teacher.name=name
    teacher.number=number
    teacher.password=password
    console.log(teacher)
    wx.setStorageSync('teacher', teacher)
    wx.showToast({
        title: '修改成功',
    }).catch (res=>{
      console.log('修改失败')
    })
})
  
 
}
})