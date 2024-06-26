import Vue from 'vue'
import SvgIcon from '../components/SvgIcon.vue'
import './db'
import '../styles/app.scss'
import '../styles/normalize.css'
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css'
import 'highlight.js/styles/atom-one-dark.css'

Vue.component('SvgIcon', SvgIcon)

const importAllSGV = () => {
  const requireAll = requireContext => requireContext.keys().map(requireContext)
  const req = require.context('../assets/svgIcon/', false, /\.svg$/)
  requireAll(req)
}
importAllSGV()
