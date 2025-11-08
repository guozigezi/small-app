const cloud = require('wx-server-sdk')
cloud.init({
  env:'cloud1-0gopr9bga04d4ea8'
})
var xlsx = require('node-xlsx');
const db = cloud.database()

exports.main = async(event, context) => {
  let {
    fileID
  } = event
  //1,通过fileID下载云存储里的excel文件
  const res = await cloud.downloadFile({
    fileID: fileID,
  })
  console.log(res)
  const buffer = res.fileContent

  const tasks = [] //用来存储所有的添加数据操作
  //2,解析excel文件里的数据
  var sheets = xlsx.parse(buffer); //获取到所有sheets
  
  let message= sheets.worksheets[0].data
  var questions=[]
  var title=message[0]
  var detail=message[1]
  var kinds=message[2]
  var kind=[]
  for(var i=1;i<kinds.length;i++)
  {
     kind[i-1]=kinds[i].value
  }
  var questionkind=[]
for(var i=3;i<message.length;i++){
  let question=message[i]
  let topic=question[1].value
  var option=[]
  questionkind[i-3]=question[0].value
for(var j=Number(question[2].value),h=0;h<j;h++){
  option[h]=[question[3+2*h].value,question[4+2*h].value]
}
questions[i-3]=[topic,option]
}
 await db.collection('questions')
.add({
  data: {
    题目:questions, 
    问卷:title[0].value,
    详情:detail[0].value,
    种类:kind,
    类型:questionkind
  }
})
   return  db.collection('questions').get()
}