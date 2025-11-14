const db=wx.cloud.database()
// pages/studentcheck/studentcheck.js
Page({
  data: {
avatural:[],
choose:1
  },

  onLoad(options) {
   let info=wx.getStorageSync('userrecord')
   console.log(info)
   this.setData({
     avatural:info[2]
   })
   
   var option 
  db.collection('record').where({
     _id:info[1]
   }).limit(999).get().then(res=>{
     console.log(res)
     this.setData({
       title:res.data[0].题目,
       answeer:res.data[0].答案,
       score:res.data[0].得分,
       final:res.data[0].最终结果,
       kinds:res.data[0].题目类型,
       judge:res.data[0].评价,
       number:res.data[0].编号,
       submmittime:res.data[0].提交时间
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
    if(this.data.number==0){
      let finaltype=this.data.final[0]+this.data.final[1]+this.data.final[2]+this.data.final[3];
      let judgetext=this.data.judge[finaltype];
      this.setData({
        finaltype:finaltype,
        judgetext:judgetext
      })
    }
      if(this.data.number==1){
        let finaltype=this.data.final;
        let judgetext=this.data.judge[finaltype];
        this.setData({
          finaltype:finaltype,
          judgetext:judgetext
        })
    }
      if(this.data.number==2){
        // 处理评价类型的数据显示
        console.log('评价数据:', this.data.judge);
        this.setData({
          finaltype: this.data.final, // 最终结果（高分/中等/低分）
          judgetext: this.data.judge || [] // 评价文本数组
        });
      }
      if(this.data.number==3){
        this.setData({
          finaltype:this.data.final,
          judgetext:this.data.judge[this.data.final]
        })

      }
      if(this.data.number==4){
        var judgetext=[]
        for(var i=0;i<this.data.final.length;i++){
         
          judgetext[i]=this.data.judge[this.data.final[i]]
        }
        this.setData({
          finaltype:this.data.final,
          judgetext:judgetext
        })

      }
      if(this.data.number==5){
        let judgetext=this.data.judge[this.data.final]
        this.setData({
          finaltype:this.data.final,
          judgetext:judgetext
        })

      }
      if(this.data.number==6){
        var judge=[]
        for(var i=0;i<this.data.kinds.length;i++){
          judge[i]=this.data.judge[this.data.kinds[i]]
        }
        this.setData({
          judge:judge
        })

      }
   })
  },
  choose(e)
  {
      let choice=e.currentTarget.dataset.text
      if(choice==1)
      {
        this.setData({
          choose:1
        })
      }else{
        this.setData({
          choose:2
        })
      }
  }
})