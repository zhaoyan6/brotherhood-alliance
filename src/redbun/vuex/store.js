/**
 * Created by chenlei on 2017/1/4.
 */
import Vuex from 'vuex'
import Vue from 'vue'
Vue.use(Vuex)
window.Promise = Promise || {}
export default new Vuex.Store({
  state: {
    session: {
      userInfo: {},
      env: {},
      installedList: [], // 已经存在的安装游戏
      notInstalledList: []// 没有安装的游戏
    },
    loadingFlag: true,
    channel: util.getQueryVal('channel') || '',
    errMsg: {
      err1: '请先登录小米账号',
      err2: '游戏中心版本过低，请升级'
    },
    popup: {
      name: '', // 'rule'规则弹窗  'lotteryimg'秒杀中 'lotteryed'秒杀成功  'lotteryun'秒杀失败
      ruleKey: '', // 规则的key
      prize: {} // 中奖结果
    },
    currentCurIndex: '', // 当前的游戏券的id
    currentDownGameInfo: null, // 点击下载的当前gameInfo
    curList: [], // 所有游戏券
    installedCoupons: [], // 用于筛选我的页面中 可用和可领取券
    queryKey: '', // 搜索关键词
    hotKeys: [],
    myGameList: [],
    myGameFlag: false,
    normalList: [],
    newUserList: [],
    tipHint: '',
    timeStamp: 0,
    //isGc: util.app.isMiGC(), // 判断是否在游戏中心
    msg: {
      noLogin: '请进入小米游戏中心参与此活动',
      version: '游戏中心版本过低，请升级',
      haveDraw: '已经领取过了',
      noHave: '亲, 您没有抽奖机会哦',
      noNum: '亲，没有机会啦',
      other: '出现网络错误，请重试~',
      success: '领取成功~',
      noStart: '本轮秒杀尚未开始',
      isOver: '本轮秒杀已经结束',
      subSuc: '提醒设置成功！',
      subFail: '提醒设置失败！',
      subTitle: '【小米游戏】百元神券0元抢',
      subDesc: '您预订的秒杀神券活动即将开始.....',
      isActOver: '活动已经结束~'
    }
  },
  mutations: {
    sendStatistic: (state, params) => {
      if (!params) {
        return
      }
      var session = state.session
      params.cid = 'newYear2018' // 唯一标识：活动名称等
      params.type = 'statistics' // 操作行为:  1下载：download;  2点击：statistics
      params.curPage = '' // 当前页面url
      params.uid = session.userInfo.uid // 用户的fuid
      params.version = session.env.vn // 游戏中心版本号
      params.fromid = state.channel || '' // 页面url自带的渠道号
      util.sendStatistic(params)
    },
    setTimeStamp: (state, params) => {
      state.timeStamp = params
    },
    changeSessionInfo: (state, params) => {
      state.session = params
    },
    changeTipHint: (state, params) => {
      if (state.timer) {
        return
      }
      state.tipHint = params
      state.timer = setTimeout(function () {
        state.tipHint = ''
        state.timer = ''
      }, 1500)
    },
    changeInstalledList: (state, params) => {
      state.installedList = params
    },
    changeNotInstalledList: (state, params) => {
      state.notInstalledList = params
    },
    showPopupObj: (state, params) => {
      state.popup.ruleKey = params.ruleKey || ''
      state.popup.name = params.name || ''
      state.popup.prize = params.prize || ''
    },
    hidePopupObj: (state) => {
      state.popup.name = ''
    },
    // 切换tab键设置当前索引
    setCurrentCurIndex: (state, id) => {
      state.currentCurIndex = id
    },
    // 点击当前游戏的下载按钮设置gameInfo
    setCurrentDownGameInfo: (state, obj) => {
      state.currentDownGameInfo = obj
    },
    // 设置游戏券的原始数据
    setCurList: (state, arr) => {
      state.curList = arr
    },
    // 设置我的页面中的可使用和可领取数据
    setInstalledCoupons: (state, arr) => {
      state.installedCoupons = arr
    },
    // 设置搜索关键词
    setQueryKey: (state, str) => {
      state.queryKey = str
    },
    setHotKey: (state, str) => {
      state.hotKeys = str
    },
    setMyGameList: (state, data) => {
      state.myGameList = data
      state.myGameFlag = true
    },
    setNormalList: (state, data) => {
      state.normalList = data
    },
    setNewUserList: (state, data) => {
      state.newUserList = data
    },
    dealMyGameList (state, game) {
      state.myGameList.forEach(function (val, i, arr) {
        if ((val.gameId == game.gameId) && (val.isNew == game.isNew)) {
          state.myGameList.splice(i, 1, game)
        }
      })
    }
  },
  getters: {
    themeFlag (state) {
      /* 1518710400       2018/2/16 0:0:0
       * 1518883200       2018/2/18 0:0:0
       * 1519142400       2018/2/21 0:0:0
       * */
      let time = state.timeStamp
      if (time < 1518710400) { // 第一个活动
        return 0
      } else if (time >= 1518710400 && time < 1518883200) { // 第二个活动
        return 1
      } else if (time >= 1518883200 && time < 1519142400) { // 第三个活动
        return 2
      } else { // 第四个活动
        return 3
      }
    },
    getIsWifi (state) {
      return state.session.env.iswifi ? state.session.env.iswifi : 0
    },
    getToken (state) {
      return state.session.userInfo.token ? state.session.userInfo.token : ''
    },
    getVn (state) {
      let vn = state.session.env.versionCode ? state.session.env.versionCode : 0
      return ((vn >= 85011990) && (vn < 85099999)) || (vn >= 85111990)
    },
    getUid (state) {
      return state.session.userInfo.uid ? state.session.userInfo.uid : ''
    },
    currentCurIndex (state) {
      return state.currentCurIndex || 0
    },
    isSelectedIf (state) {
      return state.isSelectedIf
    },
    // 可使用券
    canUseCoupons (state) {
      // console.log('走可使用券')
      let tempArr = [] // return出去的可用券
      let tempCurArr = state.installedCoupons // 原始游戏券
      tempCurArr.forEach(function (val, i, arr) {
        if (val.receiveStatus == 1) {
          tempArr.push(val)
        }
      })
      return tempArr
    },
    // 可领取券
    canFetchCoupons (state) {
      // console.log('走可领取券')
      let tempArr = [] // return出去的可用券
      let tempCurArr = state.installedCoupons // 原始游戏券
      tempCurArr.forEach(function (val, i, arr) {
        if (val.receiveStatus == 0 && val.percentNum < '100') {
          tempArr.push(val)
        }
      })
      return tempArr
    },
    // 搜索出来的券
    searchedCoupons (state) {
      let tempArr = []
      let tempCurList = state.curList
      let queryKey = state.queryKey

      if (queryKey) {
        // console.log('走搜索券')
        tempCurList.forEach(function (val, index, arr) {
          let tempVal = val
          if (tempVal.title.indexOf(queryKey) > -1) {
            tempArr.push(tempVal)
          }
        })
      }
      return tempArr
    }
  },
  actions: {
    changeSessionInfo ({commit}, info) {
      commit('changeSessionInfo', info)
    },
    sendStatistic ({commit}, type) {
      commit('sendStatistic', type)
    },
    changeTipHint ({commit}, info) {
      commit('changeTipHint', info)
    },
    set_current_cur_index ({commit}, id) {
      commit('setCurrentCurIndex', id)
    },
    set_current_down_game_info ({commit}, obj) {
      commit('setCurrentDownGameInfo', obj)
    },
    set_cur_list ({commit}, arr) {
      commit('setCurList', arr)
    },
    set_selected ({commit}, n) {
      commit('setSelected', n)
    },
    set_installed_coupons: ({commit}, arr) => {
      commit('setInstalledCoupons', arr)
    },
    set_query_key: ({commit}, str) => {
      commit('setQueryKey', str)
    },
    set_hot_key: ({commit}, str) => {
      commit('setHotKey', str)
    }
  },
  plugins: []
})
