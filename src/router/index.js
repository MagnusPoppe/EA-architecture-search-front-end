import Vue from 'vue'
import Router from 'vue-router'
import RunsSelector from '@/components/RunSelector'
import RunDetails from '@/components/Run'

Vue.use(Router)

export default new Router({
  routes: [{
    path: '/',
    name: 'page',
    component: RunsSelector
  }, {
    path: '/:id',
    name: 'page',
    component: RunDetails
  }]
})
