// pages/shangchuan/shangchuan.js
const db=wx.cloud.database()
Page({
  data: {
forms:[]
  },
  onLoad(){
    let that=this
    var forms=[]
      db.collection('questions').limit(999).get().then(res=>{
       //console.log(res)
       this.setData({
         forms:res.data
       })
       let forms=res.data
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
      })
  },
  onShow(){
    db.collection('questions').limit(999).get().then(res=>{
      console.log(res)
      let forms=res.data
      console.log(forms)
      if(forms)this.setData({
        detail:[],
        forms:[],
        questions:[],
        title:[]
      })
       for(var i=0;i<forms.length;i++){
    
         var ontitle='title['+i+']'
         var onquestions='questions['+i+']'
         var ondetail='detail['+i+']'
         this.setData({
           [ontitle]:forms[i].问卷,
           [onquestions]:forms[i].题目,
           [ondetail]:forms[i].详情
         })
       }
      
    })
     
  },
  onReady()
  {
    db.collection('questions').limit(999).get().then(res=>{
      //console.log(res)
      this.setData({
        forms:res.data
      })
    })
      let forms=this.data.forms
      console.log(forms)
       for(var i=0;i<forms.length;i++){
         var ontitle='title['+i+']'
         var onquestions='questions['+i+']'
         var ondetail='detail['+i+']'
         this.setData({
           [ontitle]:forms[i].问卷,
           [onquestions]:forms[i].题目,
           [ondetail]:forms[i].详情
         })
       }
     
  },
  gotoupload(e){
      let a=e.currentTarget.dataset.text
      let b=this.data.title[a]
      console.log(a)
      wx.setStorageSync('check', a)
      wx.navigateTo({
        url: '/pages/showquestions/showquestions',
      })
  },
   onAddSurveyExcel: function () {
    let that = this
    wx.chooseMessageFile({
      count: 1,
      type: 'all',
      success:res=>{
        let path = res.tempFiles[0].path;
        let name = res.tempFiles[0].name
        console.log(path)
        console.log("选择excel成功", res)
        this.upload(name,path);
      }
    })
  },
  async upload(name,path){
    wx.cloud.init({
      env: 'cloud1-0gopr9bga04d4ea8'
    })

   await wx.cloud.uploadFile({
      cloudPath:name,
      filePath:path,
    })
.then(res=>{
console.log("上传成功啦",res);
this.jiexi(res.fileID)
wx.showToast({
      title: '文件上传成功',
      icon:"success",
      duration:2000
})
})
.catch(err=>{
console.log("上传失败啦",err);
})
  },
  jiexi(fileId){
    let that=this
  wx.cloud.callFunction({
    name:"require",
    data:{
      fileID:fileId
    },
    success(res){
    console.log('解析成功',res)
    that.setData({
      forms:res.result.data
    })
    that.onReady()
    },
    fail(res){
      console.log('解析失败',res)
    }
  })
  },
  download(){
   
    wx.downloadFile({
      url: 'cloud://cloud1-3gi51qcb61981a27.636c-cloud1-3gi51qcb61981a27-1324627516/userimg/测试.xlsx',
      // filePath: wx.env.USER_DATA_PATH + '/' + item.fullName,
      success (res) {
       if (res.statusCode === 200) {
      wx.hideLoading()
      // let tempFilePath = res.filePath  // 如果设置了filePath参数，则不会有tempFilePath
      let tempFilePath = res.tempFilePath
      wx.saveFile({
        tempFilePath,
        success (res) {
               // 可以进行到这里
            console.log(res);
            const savedFilePath = res.savedFilePath
            wx.showToast({
            title: '下载成功',
            icon: 'none',
          mask: true
          })
        },
        fail (err) {
         console.log(err);
         wx.showToast({
         title: '下载失败，请重新尝试',
          icon: 'none',
          mask: true
         })
        }
       })
      }
     }
    })

  }
})