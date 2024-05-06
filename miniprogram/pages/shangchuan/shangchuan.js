// pages/shangchuan/shangchuan.js
Page({

  
  data: {

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
  upload(name,path){
    wx.cloud.uploadFile({
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
  wx.cloud.callFunction({
    name:"require",
    data:{
      fileID:fileId
    },
    success(res){
    console.log('解析成功',res)
    },
    fail(res){
      console.log('解析失败',res)
    }
  })
  },
  
})