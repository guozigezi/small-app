const db=wx.cloud.database()
// pages/studentcheck/studentcheck.js
Page({
  data: {

  },

  onLoad(options) {
   let info=wx.getStorageSync('userrecord')
   console.log(info)
   var option 
  db.collection('record').where({
     姓名:info[0],
     问卷:info[1]
   }).get().then(res=>{
     console.log(res)
     this.setData({
       title:res.data[0].题目,
       answeer:res.data[0].答案,
       score:res.data[0].得分
     })
//for(var i=0;i<this.data.length;i++)


     let option=res.data[0].选项
     for(var i=0;i<option.length;i++){
      let onrecord='record['+i+']'
      var option0=option[i]
      for(var j=0;j<option0.length;j++){
        let onrecord1='record1['+j+']'
        let option1=option0[j]
        this.setData({
        [onrecord1]:option1[0]
        })
      }
      this.setData({
        [onrecord]:this.data.record1
      })
      this.setData({
        record1:[]
      })
    }
   })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})