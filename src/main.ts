// src/main.ts
import { createApp } from 'vue';
import App from './App.vue';
import router from './router';      // 引入路由配置
// import pinia from './stores';       // 引入 Pinia (即使我们这步还没深度使用它)
import './styles/style.css';
import './styles/scrollbar.css';

const app = createApp(App);

// app.use(pinia); // 先注册 Pinia
app.use(router); // 再注册 Router

app.mount('#app');