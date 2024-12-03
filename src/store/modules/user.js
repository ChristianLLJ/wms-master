import { login, loginOut } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'

const state = {
  token: getToken(),
  name: ''
}
const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  }
}
const actions = {
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password: password }).then(res => {
        commit('SET_TOKEN', res.data.id)
        window.sessionStorage.setItem('getUserId', res.data.id)
        window.sessionStorage.setItem('getUserName', res.data.name)
        setToken(res.data.id)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  async getInfo({ commit }) {
    return new Promise((resolve, reject) => {
      const data = {
        name: sessionStorage.getItem('getUserName')
      }
      if (!data) {
        return reject('验证失败，请重新登录！！')
      }
      const { name } = data
      commit('SET_NAME', name)
      resolve(data)
    })
  },

  loginOut({ state }) {
    return new Promise((resolve, reject) => {
      loginOut(state.token).then(() => {
        // 不可以自动登陆捏
        removeToken()
        sessionStorage.clear()
        resetRouter()
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },
  // remove token
  resetToken() {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
