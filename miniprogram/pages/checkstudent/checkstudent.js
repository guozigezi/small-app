// pages/checkstudent/checkstudent.js
const db=wx.cloud.database()
Page({

  data: {
    current:0,
    forms:[],
    title:[]
  },
  onLoad() {
    db.collection('public').limit(999).get().then(res=>{
      console.log(res)
      const forms=res.data||[]
      const titles=forms.map(item=>item.问卷)
      this.setData({
        forms,
        title:titles
      })
    })
  },
  showrecord(e){
    const index=Number(e.currentTarget.dataset.text)||0
    const targetTitle=this.data.title?this.data.title[index]:undefined
    this.setData({
      current:1,
      name:[],
      score:[]
    })
    if(!targetTitle){
      console.warn('未找到对应问卷标题',index)
      return
    }
    const updateList=(records)=>{
      const {names,scores}=this.buildRecordDisplay(records)
      this.setData({
        name:names,
        score:scores
      })
    }
    // Fetch every record via cloud function to bypass the 20-item limit
    wx.cloud.callFunction({
      name: 'getAllRecords',
      data: {
        collection: 'record',
        where: {
          问卷: targetTitle
        }
      }
    }).then(res => {
      console.log('云函数查询结果', res)
      if (res.result.success) {
        updateList(res.result.data||[])
      }
    }).catch(err => {
      console.error('云函数调用失败', err)
      // 降级使用本地查询
      db.collection('record').where({
          问卷:targetTitle
      }).limit(999).get().then(res=>{
        console.log(res)
        updateList(res.data||[])
      }).catch(fallbackErr=>{
        console.error('本地查询失败',fallbackErr)
      })
    })
  },
  return(){
    this.setData({
      current:0
    })
  },
  returnmain(){
    wx.redirectTo({
      url: '/pages/teacher/teacher',
    })
  },
  buildRecordDisplay(records){
    const names=[]
    const scores=[]
    if(Array.isArray(records)){
      records.forEach((currentRecord,index)=>{
        const finalResult=this.extractFinalResult(currentRecord)
        names[index]=currentRecord.姓名
        scores[index]=this.formatResult(finalResult)
      })
    }
    return {names,scores}
  },
  extractFinalResult(record){
    if(!record){
      return undefined
    }
    const fallbackKeys=['finalResult','finalkind','\u6700\u7ec8\u7ed3\u679c','\u6700\u7ec8\u7ed3\u8bba']
    for(const key of fallbackKeys){
      if(record[key]!==undefined){
        return record[key]
      }
    }
    const fuzzyKey=Object.keys(record).find(key=>{
      return key.indexOf('\u6700\u7ec8')>-1 || key.indexOf('\u7ed3')>-1
    })
    return fuzzyKey?record[fuzzyKey]:undefined
  },
  formatResult(result){
    if(Array.isArray(result)){
      const cleaned=result.filter(item=>item!==null&&item!==undefined&&item!=='')
      if(cleaned.length===0){
        return '-'
      }
      // 检查是否为评价类数组（每个元素可能包含多个字符）
      const isEvaluationArray=cleaned.some(item=>typeof item==='string'&&item.length>1)
      if(isEvaluationArray){
        // 对于评价类数组，使用分号分隔
        return cleaned.join(';')
      }
      // 对于性格类型等单字符数组，保持原有逻辑
      const allSingleChar=cleaned.every(item=>typeof item==='string'&&item.length===1)
      return cleaned.join(allSingleChar?'':'/')
    }
    if(result===null||result===undefined||result===''){
      return '-'
    }
    if(typeof result==='object'){
      try{
        // 检查是否为包含详细评价的对象
        if(Object.keys(result).some(key => key.includes('评价'))){
          // 如果是评价对象，尝试提取评价文本
          const evaluationTexts=Object.values(result).filter(value => 
            typeof value === 'string' && value.length > 1
          );
          if(evaluationTexts.length > 0){
            return evaluationTexts.join(';')
          }
        }
        return JSON.stringify(result)
      }catch(err){
        console.error('格式化结果失败', err)
        return '-'
      }
    }
    return String(result)
  }
})
