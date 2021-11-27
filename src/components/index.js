// 所有全局组件的注册
import PageTools from './PageTools'
import UploadExcel from './UploadExcel'
import ImageUpload from './ImageUpload'
import Print from 'vue-print-nb'
import ScreenFull from './ScreenFull'
export default {
  install(Vue) {
    // 当main.js调用这里的index时候会在install方法中传入Vue实例，调用Vue实例可以注册
    Vue.component('PageTools', PageTools)
    Vue.component('UploadExcel', UploadExcel)
    Vue.component('ImageUpload', ImageUpload) // 注册图片上传组件
    Vue.use(Print) // 注册打印组件
    Vue.component('ScreenFull', ScreenFull) // 全屏组件
  }
}
