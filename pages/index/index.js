const weightWholeOptions = Array.from({ length: 281 }, (_, index) => String(index + 20))
const weightDecimalOptions = Array.from({ length: 10 }, (_, index) => String(index))

Page({
  data: {
    weight: '58.6',
    weightTone: 'tone-4',
    water: 1200,
    activeNav: 'home',
    modalVisible: false,
    modalType: 'meal',
    modalTitle: '记录饮食',
    nameLabel: '吃了什么',
    namePlaceholder: '例如：鸡胸肉沙拉',
    amountLabel: '大约热量',
    amountPlaceholder: '420',
    inputUnit: 'kcal',
    hideNameField: false,
    inputName: '',
    inputAmount: '',
    inputNote: '',
    weightWholeOptions,
    weightDecimalOptions,
    weightPickerValue: [38, 6],
    trendPeriod: 'week',
    trendLoss: '0.7',
    chartPoints: [
      { x: 2, y: 55, label: '8/06' }, { x: 18, y: 72, label: '8/07' }, { x: 34, y: 91, label: '8/08' },
      { x: 50, y: 106, label: '8/09' }, { x: 66, y: 127, label: '8/10' }, { x: 82, y: 142, label: '8/11' }, { x: 98, y: 158, label: '今天' }
    ],
    chartSegments: [],
    logs: [
      { cls: 'food', title: '鸡胸肉沙拉', time: '午餐 · 12:18', amount: '420 kcal' },
      { cls: 'water', title: '补充水分', time: '上午 · 10:35', amount: '300 ml' },
      { cls: 'walk', title: '公园散步', time: '运动 · 09:10', amount: '32 分钟' }
    ],
    weightHistory: [
      { day: '12', date: '8月', weight: '58.6', note: '晨起空腹', change: '-0.2', down: true },
      { day: '11', date: '8月', weight: '58.8', note: '晨起空腹', change: '-0.1', down: true },
      { day: '10', date: '8月', weight: '58.9', note: '晨起空腹', change: '-0.2', down: true },
      { day: '09', date: '8月', weight: '59.1', note: '晚餐后', change: '-0.2', down: true }
    ]
  },

  modalConfigs: {
    meal: { title: '记录饮食', nameLabel: '吃了什么', namePlaceholder: '例如：鸡胸肉沙拉', amountLabel: '大约热量', amountPlaceholder: '420', inputUnit: 'kcal', hideNameField: false, unit: 'kcal', cls: 'food' },
    water: { title: '记录饮水', nameLabel: '饮品名称', namePlaceholder: '例如：温水', amountLabel: '饮水量', amountPlaceholder: '300', inputUnit: 'ml', hideNameField: false, unit: 'ml', cls: 'water' },
    sport: { title: '记录运动', nameLabel: '运动项目', namePlaceholder: '例如：快走', amountLabel: '运动时长', amountPlaceholder: '30', inputUnit: '分钟', hideNameField: false, unit: '分钟', cls: 'walk' },
    weight: { title: '记录体重', amountLabel: '当前体重', amountPlaceholder: '58.6', inputUnit: 'kg', hideNameField: true, unit: 'kg', cls: 'scale' }
  },

  onLoad() {
    this.setData({ weightTone: this.getWeightTone(this.data.weight) })
    this.buildChartSegments(this.data.chartPoints)
  },

  getWeightTone(value) {
    const distance = Number(value) - 54
    if (distance <= 0) return 'tone-goal'
    if (distance < 1.5) return 'tone-close'
    if (distance < 3) return 'tone-1'
    if (distance < 4.5) return 'tone-2'
    if (distance < 6) return 'tone-3'
    if (distance < 8) return 'tone-4'
    return 'tone-5'
  },

  buildChartSegments(points) {
    const chartWidth = 610
    const chartHeight = 210
    const segments = points.slice(0, -1).map((point, index) => {
      const next = points[index + 1]
      const dx = ((next.x - point.x) / 100) * chartWidth
      const dy = next.y - point.y
      const width = (Math.sqrt(dx * dx + dy * dy) / chartWidth) * 100
      const angle = Math.atan2(dy, dx) * 180 / Math.PI
      return { left: point.x, top: point.y + 5, width: width.toFixed(2), angle: angle.toFixed(2) }
    })
    this.setData({ chartSegments: segments, chartHeight })
  },

  openModal(e) {
    const type = e.currentTarget.dataset.type
    const config = this.modalConfigs[type]
    const update = { modalVisible: true, modalType: type, ...config, inputName: '', inputAmount: '', inputNote: '' }
    if (type === 'weight') {
      const [whole, decimal = '0'] = String(this.data.weight).split('.')
      const wholeIndex = Math.max(0, Math.min(weightWholeOptions.length - 1, Number(whole) - 20))
      const decimalIndex = Math.max(0, Math.min(9, Number(decimal.charAt(0)) || 0))
      update.weightPickerValue = [wholeIndex, decimalIndex]
      update.inputAmount = `${weightWholeOptions[wholeIndex]}.${weightDecimalOptions[decimalIndex]}`
    }
    this.setData(update)
  },
  closeModal() { this.setData({ modalVisible: false }) },
  stopBubble() {},
  onInput(e) { this.setData({ [e.currentTarget.dataset.field]: e.detail.value }) },
  onWeightPickerChange(e) {
    const [wholeIndex, decimalIndex] = e.detail.value
    this.setData({
      weightPickerValue: [wholeIndex, decimalIndex],
      inputAmount: `${weightWholeOptions[wholeIndex]}.${weightDecimalOptions[decimalIndex]}`
    })
  },

  saveRecord() {
    const { inputName, inputAmount, inputNote, modalType, water, hideNameField } = this.data
    if (!inputAmount || (!hideNameField && !inputName)) {
      wx.showToast({ title: '请把信息填写完整', icon: 'none' })
      return
    }
    if (modalType === 'weight' && (!Number.isFinite(Number(inputAmount)) || Number(inputAmount) < 20 || Number(inputAmount) > 300)) {
      wx.showToast({ title: '请输入正确的体重', icon: 'none' })
      return
    }
    const config = this.modalConfigs[modalType]
    const now = new Date()
    const timeLabel = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')} · 刚刚`
    const title = modalType === 'weight' ? '体重记录' : inputName
    const nextLog = { cls: config.cls, title, time: inputNote || timeLabel, amount: `${inputAmount} ${config.unit}` }
    const update = { logs: [nextLog, ...this.data.logs], modalVisible: false }

    if (modalType === 'water') update.water = water + Number(inputAmount)
    if (modalType === 'weight') {
      const nextWeight = Number(inputAmount).toFixed(1)
      const difference = (Number(this.data.weight) - Number(nextWeight)).toFixed(1)
      update.weight = nextWeight
      update.weightTone = this.getWeightTone(nextWeight)
      update.weightHistory = [{ day: '今', date: '今天', weight: nextWeight, note: inputNote || '刚刚记录', change: difference > 0 ? `-${difference}` : '0.0', down: difference > 0 }, ...this.data.weightHistory]
    }
    this.setData(update)
    wx.showToast({ title: '记录成功', icon: 'success' })
  },

  switchNav(e) { this.setData({ activeNav: e.currentTarget.dataset.nav }) },
  switchPeriod(e) {
    const period = e.currentTarget.dataset.period
    const lossMap = { week: '0.7', month: '1.8', quarter: '3.4' }
    this.setData({ trendPeriod: period, trendLoss: lossMap[period] })
  },
  actionToast(e) {
    const messages = { profile: '这是你的轻盈档案', goal: '目标设置即将开放', reminder: '记录提醒即将开放', about: '这不得瘦死 · 轻盈生活手帐' }
    wx.showToast({ title: messages[e.currentTarget.dataset.action] || '功能即将开放', icon: 'none' })
  }
})
