import { createApp } from 'vue';
import App from './App';
import router from './router';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import 'element-plus/theme-chalk/display.css';
import './styles/index.less';
import VueLazyLoad from 'vue3-lazyload';
import * as elIcons from '@element-plus/icons-vue';

// 自定义字体文件
import '@/assets/fonts/font.css';
// import axios from 'axios';

import i18n from './language/index';

const app = createApp(App);
// app.config.globalProperties.$http = axios;
//统一注册el-icon图标
for (let icon in elIcons) {
  // @ts-ignore
  app.component(`ElIcon${icon}`, elIcons[icon]);
}
// @ts-ignore
import modal from './plugins/modal';
app.config.globalProperties.$Spin = modal;

app.use(router).use(i18n).use(VueLazyLoad, {}).use(ElementPlus).mount('#app');
