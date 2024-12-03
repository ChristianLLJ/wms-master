import Vue from 'vue'
import 'normalize.css/normalize.css'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import FastDateSelect from './common/FastDateSelect.vue'
import '@/styles/index.scss' // global css
import App from './App'
import store from './store'
import router from './router'
import '@/icons' // icon
import '@/permission' // permission control
import * as echarts from 'echarts'
import 'vx-easyui/dist/themes/default/easyui.css'
import 'vx-easyui/dist/themes/icon.css'
import 'vx-easyui/dist/themes/vue.css'
import EasyUI from 'vx-easyui'
import moment from 'moment'
import './utils/directive'
import Print from 'vue-print-nb'
import Prints from '@/utils/print'
Vue.use(Prints)
Vue.use(Print)
import VueBarcode from 'vue-barcode'
Vue.component('barcode', VueBarcode)
Vue.use(require('vue-moment'))
Vue.prototype.moment = moment
Vue.use(EasyUI)
Vue.component('fast-date-select', FastDateSelect)
Vue.prototype.$echarts = echarts
Vue.use(ElementUI)
Vue.config.productionTip = false
Vue.filter('dateYMDHMSFormat', function(dateStr, pattern = 'YYYY-MM-DD') {
  return dateStr ? moment(dateStr).format(pattern) : ''
  // return moment(dateStr).format(pattern)
})
Vue.filter('dateYMDHMSFormat2', function(dateStr, pattern = 'YY-MM-DD') {
  return dateStr ? moment(dateStr).format(pattern) : ''
  // return moment(dateStr).format(pattern)
})
ElementUI.Dialog.props.closeOnClickModal.default = false
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
