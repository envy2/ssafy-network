import Vue from 'vue'
import Router from 'vue-router'
import HomePage from './views/HomePage.vue'
import NotePage from './views/NotePage.vue'
import AboutPage from './views/AboutPage.vue'
import CodePage from './views/CodePage.vue'
import SocialPage from './views/SocialPage.vue'


Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomePage
    },
    {
      path: '/about',
      name: 'about',
      component: AboutPage
    },{
      path: '/code',
      name: 'code',
      component: CodePage
    },{
      path: '/social',
      name: 'social',
      component: SocialPage
    },{
      path: '/note',
      name: 'note',
      component: NotePage
    }

  ]
})
