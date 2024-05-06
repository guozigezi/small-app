// pages/name/name.js
const db=wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  
  onLoad(options) {
    db.collection('user').get().then(res=>{
      let message=res.data
      for(var i=0;i<message.length;i++){
        var onname='name['+i+']'
        var onid='id['+i+']'
        this.setData({
          [onname]:message[i].name,
          [onid]:message[i].phone
        })
      }
    })
  },

})