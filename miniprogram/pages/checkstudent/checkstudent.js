// pages/checkstudent/checkstudent.js
const db=wx.cloud.database()
Page({

  data: {
current:0
  },
  onLoad(options) {
    db.collection('public').get().then(res=>{
      console.log(res)
      this.setData({
        forms:res.data
      })
      for(var i=0;i<res.data.length;i++){
        var ontitle='title['+i+']'
        this.setData({
          [ontitle]:res.data[i].问卷,
        })
      }
    })
  },
showrecord(e){
 this.setData({
   current:1
 })
 this.setData({
   name:[],
   score:[]
 })
 console.log(this.data.title)
 db.collection('record').where({
     问卷:this.data.title[e.currentTarget.dataset.text]
 }).get().then(res=>{
   console.log(res)
   for(var i=0;i<res.data.length;i++){
    var onname='name['+i+']'
    var onscor='score['+i+']'
    const currentRecord=res.data[i]
    const finalResult=this.extractFinalResult(currentRecord)
     this.setData({
        [onname]:currentRecord.姓名,
        [onscor]:this.formatResult(finalResult)
      })
    }
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
  }
,
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
      return cleaned.join('；')
    }
    // 对于性格类型等单字符数组，保持原有逻辑
    const allSingleChar=cleaned.every(item=>typeof item==='string'&&item.length===1)
    return cleaned.join(allSingleChar?'':'、')
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
          return evaluationTexts.join('；')
        }
      }
      return JSON.stringify(result)
    }catch(err){
      console.error('格式化结果失败:', err)
      return '-'
    }
  }
  return String(result)
 }
})
