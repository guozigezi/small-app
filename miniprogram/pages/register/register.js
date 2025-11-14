
const db = wx.cloud.database();
const dbUser = db.collection("user")
Page({
  data: {
    avatarUrl: '',
    theme: wx.getSystemInfoSync().theme,
 
  },
 
  onChooseAvatar(e) {
    const { avatarUrl } = e.detail 
   
    this.setData({
      avatarUrl,
    })
    app.globalData.userInfo.avatarUrl = avatarUrl
   
  },
    // 注册
    reg(e) {
        let user = e.detail.value
        console.log('user', user)
        if (!user.phone) {
            wx.showToast({
                icon: 'error',
                title: '请填写手机',
            })
        } else if (!user.password) {
            wx.showToast({
                icon: 'error',
                title: '请填写密码',
            })
        } else if (!user.name) {
            wx.showToast({
                icon: 'error',
                title: '请填写姓名',
            })
        } else {
            dbUser.doc(user.phone).get()
                .then(res => {
                    console.log('查询结果', res)
                    if (res.data) {
                        wx.showToast({
                            icon: 'error',
                            title: '手机号已注册过',
                            duration: 1500
                        })
                    } else {
                        this.addUser(user)
                    }
                }).catch(res => {
                    console.log('没有注册过')
                    this.addUser(user)
                })
        }
    },
    //添加用户
    addUser(user) {
        user._id = user.phone
        // 给用户一个默认头像
        user.avatarUrl = this.data.avatarUrl
        console.log(user)
        dbUser.add({
            data: user
        }).then(res => {
            console.log('注册成功', res)
            wx.showToast({
                title: '注册成功！',
                icon: 'success',
                duration: 2500
            })
            setTimeout(function () {
                wx.navigateTo({
                    url: '/pages/login/login',
                })
            }, 1000)
        })
    },
opentank(){
this.setData({
  userInfo_tank:true
})
    },
    closeTank(e) {
   this.setData({
    userInfo_tank: false})
  },
  onChooseAvatar(e) {
    console.log(e);
    this.setData({
        avatarUrl: e.detail.avatarUrl
    })
},
submit(e) {
  if (!this.data.avatarUrl) {
      return wx.showToast({
          title: '请选择头像',
          icon: 'error'
      })
  }
 
  this.setData({
      userInfo_tank: false
  })
  let tempPath = this.data.avatarUrl

  let suffix = /\.[^\.]+$/.exec(tempPath)[0];
  console.log(suffix);

  //上传到云存储
  wx.cloud.uploadFile({
      cloudPath: 'userimg/' + new Date().getTime() + suffix, //在云端的文件名称
      filePath: tempPath, // 临时文件路径
      success: res => {
          console.log('上传成功', res)
          let fileID = res.fileID
          wx.hideLoading()
      },
      fail: err => {
          wx.hideLoading()
          console.log('上传失败', res)
          wx.showToast({
              icon: 'error',
              title: '上传头像错误',
          })
      }
  })
},
})