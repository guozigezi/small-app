const db=wx.cloud.database()
const app = getApp()
var util = require('../utils.js');

// ==================== 调试开关 ====================
// 设置为 true 开启调试功能，false 关闭调试功能
const DEBUG_MODE = true
// ================================================
Page({
  data:{
answer:'',
option:[],
select:[],
current:0,
judje:[],
username:'',
userid:'',
formname:'',
input_answer:[],
input_current_answer:"",
showDebugButton: true  // 调试按钮显示开关
  },
  onLoad()
  {
    // 根据全局调试开关设置调试按钮显示状态
    this.setData({
      showDebugButton: DEBUG_MODE
    })
    
    let res1=wx.getStorageSync('question')
    let res=res1[1]
    console.log(res1)
    
    this.setData({
      username:res1[2],
      userid:res1[3],
      formname:res1[0],
      kinds:res1[4],
      kind:res1[5],
      judgetext:res1[7],
      judgekind:res1[6],
      avatural:res1[8]
    })

    let input_number=0;
    for(var i=0;i<res.length;i++){
      let single=res[i]
      
      var onquestion='question['+i+']'
      var onoption='option['+i+']'
    this.setData({
       [onquestion]:single[0],
       [onoption]:single[1]
    })
    if(single[1].length==1)
    {
      input_number+=1;
    }
  }
  this.setData({
    currentquestion:this.data.question[0],
    currentoption:this.data.option[0],
    input_number:input_number
  })
  for(var i=0;i<this.data.currentoption.length;i++)
  {
          let item=this.data.currentoption[i]
          var oncurrentoption0='currentoption0['+i+']'
          this.setData({
            [oncurrentoption0]:item[0]
          })
  }
  },
  view(){
wx.previewImage({
  urls: [this.data.option[this.data.current].question],
})
  },
  record(e){
    
    if(this.data.currentoption.length==1){
  this.data.select[this.data.current]=e.detail.value}
  else {
    this.data.select[this.data.current]=parseInt(e.detail.value)
  }
  console.log(e.detail.value)
  },
  inputanswer(e)
  {
     console.log(e.detail.value)
     this.data.input_answer[this.data.current]=e.detail.value
  },
  recodshow(){
this.setData({show:this.data.select[this.data.current]})
  },
  next(){
      var length=this.data.option.length
      if(this.data.select[this.data.current]==null){
        wx.showToast({
          title: '请选择题目',
          icon:  'error'
        })
      }else{
    if(this.data.current<length-1){
    this.setData({
      current:this.data.current+1
    })
    this.setData({
      currentquestion:this.data.question[this.data.current],
      currentoption:this.data.option[this.data.current],
      currentoption0:[]
    })
    if(this.data.currentoption.length!=1){
    for(var i=0;i<this.data.currentoption.length;i++)
  {
          let item=this.data.currentoption[i]
          var oncurrentoption0='currentoption0['+i+']'
          this.setData({
            [oncurrentoption0]:item[0]
          })
  }
  this.judje()
        }else {
          this.input()
        }
    }
  }
  },
  remove(){
    this.setData({
      current:this.data.current==0?this.data.current:this.data.current-1,
    })
   
    let select=this.data.select
   
    this.setData({
      currentquestion:this.data.question[this.data.current],
      currentoption:this.data.option[this.data.current],
      currentoption0:[]
    })
    if(this.data.currentoption.length!=1){
    for(var i=0;i<this.data.currentoption.length;i++)
    {
            let item=this.data.currentoption[i]
            var oncurrentoption0='currentoption0['+i+']'
            this.setData({
              [oncurrentoption0]:item[0],
            })
    }
    this.judje()
  }else {
    this.input()
  }
  },
async submmit(){
  if(this.data.select.length==this.data.question.length)
  {
  let select=this.data.select
  let option=this.data.option
  let kind=this.data.kind
  let sum = new Array(this.data.kinds.length).fill(0); 
  let time = util.formatTime(new Date());
  this.setData({
    currenttime:time
  })
  for(var i=0;i<option.length;i++){
    if(option[i].length==1)
    {
      let currentoption1=option[i]
      let currentoption2=currentoption1[0]
      if(currentoption2[0]==this.data.select[i]){
        sum[kind[i]-1]=sum[kind[i]-1]+currentoption2[1]
      }

    }
    else {
    let currentoption1=option[i]
    let currentoption2=currentoption1[select[i]]
    let score0=currentoption2[1]
    sum[kind[i]-1]=sum[kind[i]-1]+score0
    }
  }
  this.setData({
    score:sum
  })
  let score=this.data.score
  
     if(this.data.judgekind==0){
      var finalkind=[]
      for(var i=0;i<this.data.kinds.length;i++){
     var judgetext=["E","I","S","N","T","F","J","P"]
       if(score[i]>0){
         finalkind[i]=judgetext[2*i]

       }else{
        finalkind[i]=judgetext[2*i+1]
       }
      }
       this.setData({
         finalkind:finalkind
       })

     }
    if(this.data.judgekind==1){
      var judgetext={"R":score[0],"I":score[1],"A":score[2],"S":score[3],"E":score[4],"C":score[5]}
      var p=this.sortJudgetText(judgetext)
      var q=this.getTopThreeLetters(p)
      var finalkind=q[0]+q[1]+q[2]
      this.setData({
        finalkind:finalkind
      })
      /*var highscore,shortscore
      if(this.data.judgescore[2*i]>this.data.judgescore[2*i+1]){
        highscore=this.data.judgescore[2*i]
        shortscore=this.data.judgescore[2*i+1]
      }else {
        highscore=this.data.judgescore[2*i+1]
        shortscore=this.data.judgescore[2*i]
      }
      if(score[i]<shortscore){
        finalkind[i]=this.data.judgetext[3*i]
      }
      if(score[i]>shortscore&&score[i]<highscore){
        finalkind[i]=this.data.judgetext[3*i+1]
      }
      if(score[i]>highscore){
        finalkind[i]=this.data.judgetext[3*i+2]
      }
      this.setData({
        finalkind:finalkind
      })*/
    }

    if(this.data.judgekind==2){
      var finalkind=[]
      var judgetext=[]
      for(var i=0;i<score.length;i++)
      {
        score[i]=score[i]/2
      }
      console.log(score)
     for(var i=0;i<this.data.kinds.length;i++){
        if(score[i]>=8){
           finalkind[i]="高分"
           let ju=this.data.judgetext[this.data.kinds[i]]
           console.log(ju)
           judgetext[i]=ju[0]
        }
        else if(score[i]>3){
          finalkind[i]="中等"
          judgetext[i]="介于两者之间"
        }
        else {
          finalkind[i]="低分"
          let ju=this.data.judgetext[this.data.kinds[i]]
          console.log(ju)
           judgetext[i]=ju[1]
        }
     }
     this.setData({
       finalkind:finalkind,
       judgetext:judgetext
     })
    }
    if(this.data.judgekind==6){
      score[0]=score[0]/12
      score[1]=score[1]/12
      score[2]=score[2]/12
      score[3]=score[3]/12
      score[4]=score[4]/12
      var finalkind=[]
      for(var i=0;i<this.data.kinds.length;i++)
      {
        if(i==0){
          if(score[1]>=1.37){
            finalkind[i]="高分"
          }else{
            finalkind[i]="低分"
          }
        }
          if(i==1){
            if(score[1]>=2.64){
              finalkind[i]="高分"
            }else{
              finalkind[i]="低分"
            }
          }
            if(i==2){
              if(score[1]>=2.29){
                finalkind[i]="高分"
              }else{
                finalkind[i]="低分"
              }
            }
              if(i==3){
                if(score[1]>=2.33){
                  finalkind[i]="高分"
                }else{
                  finalkind[i]="低分"
                }
              }
                if(i==4){
                  if(score[1]>=2.91){
                    finalkind[i]="高分"
                  }else{
                    finalkind[i]="低分"
                  }
                }
        }
        this.setData({
          finalkind:finalkind
        })

      }
      if(this.data.judgekind==5){
        var finalkind=[]
        if(score[0]>40){
          finalkind="A型人格"
        }
        else if(score[0]<=40&&score[0]>=30){
          finalkind="介于两种人格之间"
        }else{
          finalkind="B型人格"
        }
        this.setData({
          finalkind:finalkind
        })
      }
      if(this.data.judgekind==3){
        finalkind=[]
        if(score[0]>76){
           finalkind="人际关系倾向的领导人"
        }
        if(score[0]<64){
          finalkind="任务导向的领导人"
       }
       if(score[0]<=76&&score[0]>64){
        finalkind="介于任务导向和人际关系倾向的领导人"
     }
     this.setData({
      finalkind:finalkind
    })
      }
      if(this.data.judgekind==4){
        var scores={"胆汁质":score[0],"多血质":score[1],"粘液质":score[2],"抑郁质":score[3]}
        let scores1=this.sortJudgetText(scores)
        var sortedEntries = Object.entries(scores1)
        var finalkind=[]
        
          var [key1, value1] = sortedEntries[0];
          var [key2, value2]=  sortedEntries[1];
          var [key3, value3] = sortedEntries[2];
          var [key4, value4] = sortedEntries[3];
          if(value1-value2>=4){
            finalkind[0]=key1
            
          }else if(value1-value3>=4){
            finalkind[0]=key1
            finalkind[1]=key2
          }else if(value1-value4>=4){
            finalkind[0]=key1
            finalkind[1]=key2
            finalkind[2]=key3
          }else {
            finalkind[0]=key1
            finalkind[1]=key2
            finalkind[2]=key3
            finalkind[3]=key4
          }
         this.setData({
           finalkind:finalkind
         })
      }
    
  wx.showLoading({
    title: '正在上传中',
  })

 await db.collection('record').add({
    data:{
    问卷:this.data.formname,
    姓名:this.data.username,
    学号:this.data.userid,
    题目:this.data.question,
    选项:this.data.option,
    答案:this.data.select,
    得分:this.data.score,
    题目类型:this.data.kinds,
    最终结果:this.data.finalkind,
    评价:this.data.judgetext,
    编号:this.data.judgekind,
    提交时间:this.data.currenttime
    }
  }).then(res=>{
    var newRecordId = res._id
    console.log(newRecordId)
    this.setData({
      newid:newRecordId
    })
    
  })
  
  
 wx.setStorageSync('delete', this.data.formname)
 wx.setStorageSync('userrecord', [this.data.username,this.data.newid,this.data.avatural])
 var pages = getCurrentPages();
 var prevPage = pages[pages.length - 2]; // 获取上一个页面实例对象
 var delta = pages.length - prevPage.index - 1; // 计算需要返回的页面数
    wx.redirectTo({
      url:'/pages/studentcheck/studentcheck',
    })  

  
  }
  else {
    wx.showToast({
      title: '还有未作答的题目',
      icon:'error'
    })
  }
/*wx.navigateBack({
    success:() => {
    // 执行前一页面的onLoad方法
    before.onLoad(); 
    }
})*/
},
sortJudgetText(judgetText) {
  // 将对象转换为数组，以便进行排序
  const entries = Object.entries(judgetText);

  // 对数组进行排序，根据每个对象的值（score）
  const sortedEntries = entries.sort((a, b) => b[1] - a[1]); // 降序排序

  // 根据排序后的数组重新构造对象
  const sortedJudgetText = {};
  sortedEntries.forEach(([key, value]) => {
    sortedJudgetText[key] = value;
  });

  return sortedJudgetText;
},
getTopThreeLetters(sortedJudgetText) {
  // 将对象转换为数组，以便能够获取前三个元素
  const entries = Object.entries(sortedJudgetText);
 
  // 截取前三个元素（已经是排序后的）
  const topThreeEntries = entries.slice(0, 3);
 
  // 提取键并转换为数组
  const topThreeLetters = topThreeEntries.map(([key]) => key);
 
  return topThreeLetters;
},

return(){
  wx.navigateBack({
   delta:1
  })
},
judje(){
  for(var i=0;i<this.data.currentoption0.length;i++)
  {
    var onjudje='judje['+i+']'
    this.setData({
      [onjudje]:false
    })
  }
  for(var i=0;i<this.data.currentoption0.length;i++){
    var onjudje='judje['+i+']'
    if(i==this.data.select[this.data.current]){
    this.setData({
      [onjudje]:true
    })
  }
    else {
      this.setData({
        [onjudje]:false
      })
    }
}
    },
  input(){
    console.log(1)
    this.setData({
      input_current_answer:""
    })
    this.setData({
      input_current_answer:this.data.select[this.data.current]
    })
  },
 sortScoresAndKinds(data) {  
    // 假设scores和kinds是等长的，并且它们之间的索引对应关系是正确的  
    let combinedScoresAndKinds = [];  
    for (let i = 0; i < data.score.length; i++) {  
      combinedScoresAndKinds.push({  
        score: data.score[i],  
        kinds: data.kinds[i]  
      });  
    }  
    
    // 根据score属性进行降序排序  
    combinedScoresAndKinds.sort((a, b) => b.score - a.score);  
    
    // 如果你需要的话，可以将排序后的数据更新回原始的结构  
    // 但通常推荐直接使用combinedScoresAndKinds，因为它更灵活  
    // 下面是如何更新回原始结构的方法（但通常不推荐这样做）  
    data.score = combinedScoresAndKinds.map(item => item.score);  
    data.kinds = combinedScoresAndKinds.map(item => item.kinds);  
    
    // 通常，你只需返回或处理排序后的combinedScoresAndKinds  
  return combinedScoresAndKinds;  
  },

  // 调试功能：一键完成问卷并提交
  debugSubmit() {
    console.log('开始调试模式：自动完成问卷')
    
    // 检查是否有题目数据
    if (!this.data.question || !this.data.option) {
      wx.showToast({
        title: '没有题目数据',
        icon: 'error'
      })
      return
    }
    
    // 自动为所有题目选择答案
    const select = []
    const input_answer = []
    
    for (let i = 0; i < this.data.question.length; i++) {
      const currentOption = this.data.option[i]
      
      if (currentOption.length === 1) {
        // 如果是输入题，设置一个默认答案
        const defaultAnswer = "调试答案"
        select[i] = defaultAnswer
        input_answer[i] = defaultAnswer
      } else {
        // 如果是选择题，随机选择第一个或第二个选项
        const randomIndex = Math.floor(Math.random() * Math.min(2, currentOption.length))
        select[i] = randomIndex
      }
    }
    
    // 设置自动选择的答案
    this.setData({
      select: select,
      input_answer: input_answer
    })
    
    console.log('自动选择完成，答案：', select)
    
    // 显示提示
    wx.showModal({
      title: '调试模式',
      content: '已自动完成所有题目，是否直接提交？',
      success: (res) => {
        if (res.confirm) {
          // 直接调用提交函数
          this.submmit()
        }
      }
    })
  },

  // 移除调试功能（隐藏调试按钮）
  removeDebug() {
    this.setData({
      showDebugButton: false
    })
    wx.showToast({
      title: '调试功能已关闭',
      icon: 'success'
    })
  },

  // 重新启用调试功能（显示调试按钮）
  enableDebug() {
    this.setData({
      showDebugButton: true
    })
    wx.showToast({
      title: '调试功能已开启',
      icon: 'success'
    })
  }

})


