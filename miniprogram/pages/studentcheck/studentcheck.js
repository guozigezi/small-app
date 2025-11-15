const db=wx.cloud.database()

function formatRecordOptions(optionList){
  if(!Array.isArray(optionList)){
    return []
  }
  return optionList.map(questionOptions=>{
    if(!Array.isArray(questionOptions)){
      return []
    }
    return questionOptions.map(option=>{
      if(Array.isArray(option)){
        return option[0]
      }
      return option
    })
  })
}

function extractFinalValue(record){
  if(!record){
    return undefined
  }
  const fallbackKeys=['finalResult','finalkind','最终结果','最终结论']
  for(const key of fallbackKeys){
    if(record[key]!==undefined){
      return record[key]
    }
  }
  const fuzzyKey=Object.keys(record).find(key=>{
    return key.indexOf('最终')>-1 || key.indexOf('结')>-1
  })
  return fuzzyKey?record[fuzzyKey]:undefined
}

function buildEvaluationPayload({number,final,kinds,judge}){
  const payload={}
  const finalValue=final
  const judgeMap=judge||{}
  switch(number){
    case 0:{
      const finaltype=Array.isArray(finalValue)?finalValue.slice(0,4).join(''):finalValue
      payload.finaltype=finaltype
      payload.judgetext=judgeMap?judgeMap[finaltype]:undefined
      break
    }
    case 1:{
      payload.finaltype=finalValue
      payload.judgetext=judgeMap?judgeMap[finalValue]:undefined
      break
    }
    case 2:{
      payload.finaltype=finalValue
      payload.judgetext=judgeMap||[]
      break
    }
    case 3:{
      payload.finaltype=finalValue
      payload.judgetext=judgeMap?judgeMap[finalValue]:undefined
      break
    }
    case 4:{
      if(Array.isArray(finalValue)){
        payload.finaltype=finalValue
        payload.judgetext=finalValue.map(item=>judgeMap?judgeMap[item]:undefined)
      }
      break
    }
    case 5:{
      payload.finaltype=finalValue
      payload.judgetext=judgeMap?judgeMap[finalValue]:undefined
      break
    }
    case 6:{
      if(Array.isArray(kinds)){
        payload.finaltype=finalValue
        payload.judgetext=kinds.map(kind=>judgeMap?judgeMap[kind]:undefined)
      }
      break
    }
    default:{
      payload.finaltype=finalValue
      payload.judgetext=undefined
    }
  }
  return payload
}

function fetchRecordById(recordId){
  if(!recordId){
    return Promise.reject(new Error('missing record id'))
  }
  const collection=db.collection('record')
  return collection.doc(recordId).get().catch(()=>{
    return collection.where({_id:recordId}).limit(1).get().then(res=>{
      const data=res.data&&res.data[0]?res.data[0]:null
      return {data}
    })
  })
}

// pages/studentcheck/studentcheck.js
Page({
  data: {
    avatural:[],
    choose:1,
    record:[]
  },

  onLoad() {
    const info=wx.getStorageSync('userrecord')||[]
    console.log(info)
    this.setData({
      avatural:info[2]||''
    })
    const recordId=info[1]
    fetchRecordById(recordId).then(res=>{
      const record=res.data
      if(!record){
        console.warn('未找到记录',recordId)
        return
      }
      const finalValue=extractFinalValue(record)
      const formattedOptions=formatRecordOptions(record.选项)
      const baseData={
        title:record.题目||[],
        answeer:record.答案||[],
        score:record.得分,
        final:finalValue,
        kinds:record.题目类型||[],
        judge:record.评价||{},
        number:record.编号,
        submmittime:record.提交时间||''
      }
      const evaluationPayload=buildEvaluationPayload({
        number:baseData.number,
        final:baseData.final,
        kinds:baseData.kinds,
        judge:baseData.judge
      })
      this.setData(Object.assign({},baseData,evaluationPayload,{
        record:formattedOptions
      }))
    }).catch(err=>{
      console.error('获取记录失败',err)
    })
  },
  choose(e){
    const choice=Number(e.currentTarget.dataset.text)||1
    if(this.data.choose===choice){
      return
    }
    this.setData({
      choose:choice
    })
  }
})
