import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/login.vue'
import ClientDashboard from '../views/client-dashboard.vue'
import MedicalExam from '../views/medical-exam.vue'
import TrainingRegister from '../views/training-register.vue'
import RegisterUser from '../views/register-user.vue'
import RegisterEmployee from '../views/register-employee.vue'
import EnrollUser from '../views/enroll-user.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/app/client-dashboard',
    name: 'ClientDashboard',
    component: ClientDashboard
  },
  {
    path: '/app/medical-exam',
    name: 'MedicalExam',
    component: MedicalExam
  },
  {
    path: '/app/training-register',
    name: 'TrainingRegister',
    component: TrainingRegister
  },
  {
    path: '/app/register-user',
    name: 'RegisterUser',
    component: RegisterUser
  },
  {
    path: '/app/register-employee',
    name: 'RegisterEmployee',
    component: RegisterEmployee
  },
  {
    path: '/app/enroll-user',
    name: 'EnrollUser',
    component: EnrollUser
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
