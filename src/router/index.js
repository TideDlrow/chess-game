import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter);

const Login = () => import('@/components/Login');
const Register = () => import('@/components/Register');
const Board = ()=>import('@/components/Board');
const Board2 = ()=>import('@/components/Board2')
const MainLayout = ()=>import('@/components/MainLayout');

const routes = [
  {
    path: '',
    redirect: '/board'
  },
  {
    path: '/login',
    component: Login
  },
  {
    path: '/register',
    component: Register
  },
  {
    path: '/board',
    component: MainLayout,
    // children:[
    //
    // ]
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
