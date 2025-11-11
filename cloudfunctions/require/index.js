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
  const sheet = (sheets.worksheets ? sheets.worksheets[0] : sheets[0]) || {};
  const rows = sheet.data || [];

  const getCellValue = (cell) => {
    if (cell && typeof cell === 'object' && 'value' in cell) {
      return cell.value;
    }
    return cell;
  };
  const cleanText = (value) => {
    if (typeof value !== 'string') {
      return value;
    }
    return value.replace(/\s+/g, ' ').trim();
  };
  const parseScore = (value) => {
    if (typeof value === 'number') {
      return Number.isNaN(value) ? 0 : value;
    }
    if (typeof value === 'string') {
      const match = value.match(/-?\d+/);
      return match ? Number(match[0]) : 0;
    }
    return 0;
  };
  const isEmpty = (value) =>
    value === undefined ||
    value === null ||
    value === '' ||
    (typeof value === 'number' && Number.isNaN(value));

  const titleRow = rows[0] || [];
  const detailRow = rows[1] || [];
  const typeRow = rows[2] || [];

  const kind = [];
  for (let i = 1; i < typeRow.length; i++) {
    const value = getCellValue(typeRow[i]);
    if (!isEmpty(value)) {
      kind.push(value);
    }
  }

  const questions = [];
  const questionkind = [];

  for (let i = 3; i < rows.length; i++) {
    const question = rows[i];
    if (!question || question.length === 0) {
      continue;
    }
    const values = question.map((cell) => getCellValue(cell));
    const typeRaw = values[0];
    const topic = cleanText(values[1]);
    let optionStart = 3;
    let optionCount = Number(values[2]);
    if (Number.isNaN(optionCount) || optionCount <= 0) {
      optionStart = 2;
      optionCount = Math.floor((values.length - optionStart) / 2);
    }
    const option = [];

    for (let h = 0; h < optionCount; h++) {
      const textIndex = optionStart + 2 * h;
      const scoreIndex = textIndex + 1;
      const optionText = cleanText(values[textIndex]);
      const optionScore = parseScore(values[scoreIndex]);
      if (isEmpty(optionText)) {
        continue;
      }
      option.push([optionText, optionScore]);
    }
    if (isEmpty(topic) || option.length === 0) {
      continue;
    }
    questionkind.push(isEmpty(typeRaw) ? '' : typeRaw);
    questions.push([topic, option]);
  }

  await db.collection('questions')
  .add({
    data: {
      题目:questions, 
      问卷:getCellValue(titleRow[0]) || '',
      详情:getCellValue(detailRow[0]) || '',
      种类:kind,
      类型:questionkind
    }
  })
   return  db.collection('questions').get()
}
