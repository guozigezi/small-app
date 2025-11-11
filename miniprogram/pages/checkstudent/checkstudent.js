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
    const allSingleChar=cleaned.every(item=>typeof item==='string'&&item.length===1)
    return cleaned.join(allSingleChar?'':'、')
  }
  if(result===null||result===undefined||result===''){
    return '-'
  }
  if(typeof result==='object'){
    try{
      return JSON.stringify(result)
    }catch(err){
      return '-'
    }
  }
  return String(result)
 }
})
