import material from 'vue-material/material'
import MdDatepicker from './MdDatepicker'
import MdDaterangePicker from './MdDaterangePicker'

export default Vue => {
  material(Vue)
  Vue.component(MdDatepicker.name, MdDatepicker)
  Vue.component(MdDaterangePicker.name, MdDaterangePicker)
}