import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import { router } from './router'
import App from './App.vue'
import * as ElementPlusIconsVue from '@element-plus/icons-vue' //导入 ElementPlus 组件库中的所有图标
import store from '@/store/index'
import "@/permission"
const app = createApp(App)
app.use(router)
app.use(ElementPlus)
app.use(store)

//注册 ElementPlus 组件库中的所有图标到全局 Vue 应用中
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}
import 'virtual:windi.css'

import permission from './directives/permission'

app.use(permission)
import 'nprogress/nprogress.css'
app.mount('#app')