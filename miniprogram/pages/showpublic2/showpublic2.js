// pages/showpublic2/showpublic2.js
Page({
  data: {

  },

  onLoad(options) {
      let forms=wx.getStorageSync('public')
      console.log(forms)
      this.setData({
        forms:forms,
        form:forms.题目
      })
  },
  onShow: function () {
    // 获取当前小程序的页面栈 
    let pages = getCurrentPages(); 
    // 数组中索引最大的页面--当前页面  
    let currentPage = pages[pages.length-1]; 
    // 打印出当前页面中的 options  
    console.log(currentPage.options)
},

delete(){
    let id=this.data.forms._id
    console.log(id)
     wx.showModal({
      title: '提示',
      content: '确定要删除吗？',
      success: async function (sm) {
        if (sm.confirm) {
          await wx.cloud.callFunction({
            name:"remove1",
            data:{
              id:id
                 }
            }).then(res=>{
              console.log(res,'成功')
            })
            wx.showToast({
              title: '删除成功',
              icon:"none"
            })
            var pages = getCurrentPages();
      var prevPage = pages[pages.length - 2]; // 获取上一个页面实例对象
      var delta = pages.length - prevPage.index - 1; // 计算需要返回的页面数

      wx.navigateBack({
        delta:delta,
        success: function () {
          prevPage.onLoad(); // 执行上一页的onLoad函数
        }
      })
          } else if (sm.cancel) {
            console.log('用户点击取消')
          }
        }
      })
      
  }
})