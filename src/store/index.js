import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import app from './modules/app'
import settings from './modules/settings'
import user from './modules/user'
import tagsView from './modules/tagsView'

Vue.use(Vuex)

const store = new Vuex.Store({
  namespaced: true,
  state: {
    tableAll: [] // 缓存数据的数组
  },
  // 自定义一个名称，用来修改状态，也是唯一用来修改状态的，它可以呗Devtools调试工具记录一切修改的状态。
  mutations: {
    DataListMutation(state, data) {
      // 获取action全过来的数据
      state.tableAll = data
    }
  },

  actions: {

  },
  modules: {
    app,
    settings,
    user,
    tagsView
  },
  getters
})

export default store
