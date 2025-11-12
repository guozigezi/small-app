// 云端 Excel -> 问卷解析入口
const cloud = require('wx-server-sdk')
const fs = require('fs')
const path = require('path')
cloud.init({
  env: 'cloud1-0gopr9bga04d4ea8'
})
const xlsx = require('node-xlsx')
const db = cloud.database()

// judgekind 与量表之间的映射
const scaleAliasMap = {
  MBTI: 0,
  '霍兰德职业兴趣': 1,
  '卡特尔16PF人格因素': 2,
  'LPC领导风格': 3,
  '气质类型': 4,
  'A型人格': 5,
  '大五人格': 6,
}

// 预先加载评价配置，避免每次调用都读文件
const evaluationConfig = loadEvaluationConfig()

function loadEvaluationConfig() {
  // 将评价.txt 转成 {judgekind: {type: [desc...]}}
  const filePath = path.join(__dirname, '评价.txt')
  try {
    const content = fs.readFileSync(filePath, 'utf8') // 读取汉字评价
    const lines = content.split(/\r?\n/)
    const config = {}
    let currentScale = null
    let currentType = null
    let quoteBuffer = null

    // 顺次扫描文本，识别量表段与类型段
    lines.forEach((rawLine) => {
      const line = rawLine.trim()
      if (!line) return

      // 若处于多行引号块中，直接拼接
      if (quoteBuffer !== null) {
        if (currentScale === null) {
          quoteBuffer = null
          return
        }
        quoteBuffer += '\n' + line.replace(/"$/, '')
        if (line.endsWith('"')) {
          if (!currentType) {
            currentType = '__general'
            if (!config[currentScale][currentType]) {
              config[currentScale][currentType] = []
            }
          }
          config[currentScale][currentType].push(quoteBuffer.trim())
          quoteBuffer = null
        }
        return
      }

      // 行以双引号开头，认为是一个整体段落
      if (line.startsWith('"')) {
        if (currentScale === null) {
          quoteBuffer = null
          return
        }
        let text = line.slice(1)
        if (text.endsWith('"')) {
          text = text.slice(0, -1)
          if (!currentType) {
            currentType = '__general'
            if (!config[currentScale][currentType]) {
              config[currentScale][currentType] = []
            }
          }
          config[currentScale][currentType].push(text.trim())
        } else {
          quoteBuffer = text
        }
        return
      }

      const colonMatch = line.match(/^([^：:]+)[：:](.*)$/)
      if (colonMatch) {
        const header = colonMatch[1].trim()
        const rest = colonMatch[2].trim()

        if (Object.prototype.hasOwnProperty.call(scaleAliasMap, header)) {
          currentScale = scaleAliasMap[header]
          if (!config[currentScale]) {
            config[currentScale] = {}
          }
          currentType = null
          return
        }

        if (currentScale === null) {
          return
        }

        currentType = header
        if (!config[currentScale][currentType]) {
          config[currentScale][currentType] = []
        }
        if (rest) {
          config[currentScale][currentType].push(rest)
        }
        return
      }

      const text = line.replace(/^\d+[\.、]\s*/, '').trim()
      if (!text || currentScale === null) {
        return
      }
      if (!currentType) {
        currentType = '__general'
        if (!config[currentScale][currentType]) {
          config[currentScale][currentType] = []
        }
      }
      config[currentScale][currentType].push(text)
    })

    return config
  } catch (error) {
    console.error('读取评价配置失败', error)
    return {}
  }
}

// 根据标题和种类推断 judgekind，保证老表格也能兼容
function detectJudgeKind(title, kinds = []) {
  const normalizedTitle = (title || '').toLowerCase()
  const joinedKinds = kinds.join(',')

  if (/mbti/i.test(normalizedTitle)) return 0
  if (/霍兰德|职业兴趣|riasec/i.test(normalizedTitle)) return 1
  if (/卡特尔|16pf/i.test(normalizedTitle)) return 2
  if (/lpc/.test(normalizedTitle)) return 3
  if (/气质/.test(normalizedTitle)) return 4
  if (/a型|ab型/.test(normalizedTitle)) return 5
  if (/大五|five-factor|ocean/.test(normalizedTitle)) return 6

  if (kinds.some((k) => /E-I|S-N|T-F|J-P/i.test(k))) return 0

  const hollandSet = new Set(['R', 'I', 'A', 'S', 'E', 'C'])
  const upperKinds = kinds.map((k) => (k || '').toString().trim().toUpperCase())
  if (upperKinds.length >= 4 && upperKinds.every((k) => hollandSet.has(k))) {
    return 1
  }

  if (kinds.some((k) => /^因素/.test(k))) return 2
  if (kinds.some((k) => /胆汁质|多血质|粘液质|抑郁质/.test(k))) return 4
  if (kinds.some((k) => /A型|B型/.test(k))) return 5
  if (kinds.some((k) => /外向|宜人|尽责|责任|神经|开放/.test(k))) return 6

  if (/领导/.test(normalizedTitle) || /领导/.test(joinedKinds)) return 3

  return 0
}

exports.main = async (event) => {
  const { fileID } = event
  const res = await cloud.downloadFile({ fileID })
  const buffer = res.fileContent

  const sheets = xlsx.parse(buffer)
  const sheet = (sheets.worksheets ? sheets.worksheets[0] : sheets[0]) || {}
  const rows = sheet.data || []

  const getCellValue = (cell) => {
    if (cell && typeof cell === 'object' && 'value' in cell) {
      return cell.value
    }
    return cell
  }

  const cleanText = (value) => {
    if (typeof value !== 'string') {
      return value
    }
    return value.replace(/\s+/g, ' ').trim()
  }

  const parseScore = (value) => {
    if (typeof value === 'number') {
      return Number.isNaN(value) ? 0 : value
    }
    if (typeof value === 'string') {
      const match = value.match(/-?\d+/)
      return match ? Number(match[0]) : 0
    }
    return 0
  }

  const isEmpty = (value) =>
    value === undefined ||
    value === null ||
    value === '' ||
    (typeof value === 'number' && Number.isNaN(value))

  const titleRow = rows[0] || []
  const detailRow = rows[1] || []
  const typeRow = rows[2] || []

  const kind = []
  for (let i = 1; i < typeRow.length; i++) {
    const value = cleanText(getCellValue(typeRow[i]))
    if (!isEmpty(value)) {
      const entry = typeof value === 'string' ? value : String(value)
      kind.push(entry)
    }
  }

  const questions = []
  const questionkind = []

  for (let i = 3; i < rows.length; i++) {
    const question = rows[i]
    if (!question || question.length === 0) {
      continue
    }
    const values = question.map((cell) => getCellValue(cell))
    const typeRaw = values[0]
    let topic = cleanText(values[1])
    let optionStart = 3
    let optionCount = Number(values[2])
    if (Number.isNaN(optionCount) || optionCount <= 0) {
      optionStart = 2
      optionCount = Math.floor((values.length - optionStart) / 2)
      const looksLikeQuestion = /^\d+[\.．、]/.test(topic)
      if (!looksLikeQuestion && values[optionStart]) {
        topic = cleanText(values[optionStart])
        optionStart += 1
        optionCount = Math.floor((values.length - optionStart) / 2)
      }
    }
    const option = []

    for (let h = 0; h < optionCount; h++) {
      const textIndex = optionStart + 2 * h
      const scoreIndex = textIndex + 1
      const optionText = cleanText(values[textIndex])
      const optionScore = parseScore(values[scoreIndex])
      if (isEmpty(optionText)) {
        continue
      }
      option.push([optionText, optionScore])
    }
    if (isEmpty(topic) || option.length === 0) {
      continue
    }
    questionkind.push(isEmpty(typeRaw) ? '' : typeRaw)
    questions.push([topic, option])
  }

    // 生成最终写入记录（含量表编号与评价）
  const formTitle = cleanText(getCellValue(titleRow[0]) || '')
  const detail = cleanText(getCellValue(detailRow[0]) || '')
  const judgekind = detectJudgeKind(formTitle, kind)
  const evaluation = evaluationConfig[judgekind] || {}

  await db.collection('questions')
    .add({
      data: {
        题目: questions,
        问卷: formTitle || '',
        详情: detail || '',
        种类: kind,
        类型: questionkind,
        量表: judgekind,
        评价: evaluation,
      },
    })

  return db.collection('questions').get()
}






