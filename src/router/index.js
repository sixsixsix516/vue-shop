import Vue from 'vue'
import VueRouter from 'vue-router'

import Login from '../components/Login'
import Home from '../components/Home'
import Welcome from '../components/Welcome'
import User from '../components/user/User'
import Right from '../components/power/Right'

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    component: Login,
  },
  {
    path: '/home',
    component: Home,
    redirect: '/Welcome',
    children: [
      {path: '/Welcome', component: Welcome},
      {path: '/users', component: User},
      {path: '/rights', component: Right}
    ]
  }

];

const router = new VueRouter({
  routes
});

// 挂载路由导航守护
router.beforeEach((to, from, next) => {
  // to将要访问的路径
  // from从哪个路径跳转而来
  // next表示函数 代表放行
  if (to.path === '/login') {
    return next();
  }
  let token = window.sessionStorage.getItem("token");
  if (!token) {
    return next('/login');
  }
  return next();
});

export default router
