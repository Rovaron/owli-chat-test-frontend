import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '../store'
import Landing from '../views/Landing.vue'
import Home from '../views/Home.vue'
import Login from '../views/Login.vue'
import SignUp from '../views/SignUp.vue'
import ChatDashboard from '../views/ChatDashboard.vue'
import ChatUser from '../views/ChatUser.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    component: Home,
    children: [
      { path: '', name: 'home', component: Landing },
      { path: '/login', component: Login, name: 'login' },
      { path: '/registration', component: SignUp }
    ]
  },
  {
    path: '/chat',
    component: ChatDashboard,
    meta: { requiresAuth: true },
    children: [
      { path: '/chat/:_id', component: ChatUser, name: 'chatUser' }
    ]
  }
]

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  const token = store.state.token
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (token) {
      next()
    } else {
      next('')
    }
  } else {
    if (token) {
      next('chat')
    } else {
      next()
    }
  }
})

export default router
