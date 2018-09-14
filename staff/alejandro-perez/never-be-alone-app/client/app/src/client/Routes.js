
import Landing from './components/Landing'
import Register from './components/Register'
import Profile from './components/Profile'
import LoginPage from './components/Login'
import Group2 from './components/Group2'
import Events from './components/Event'

export default {
  routes: [
    {
        component:Landing,
        path: '/',
        exact: true,
        id: 1
    },
    {
        component: LoginPage,
        path: '/login',
        id: 5
    },
    {
      ...Profile,
      path:"/profile/:id",
      id:9678678
    },
    {
      component :Register,
      path:"/register",
      id:9678678
    },
    {
      ...Group2,
      path:"/group/:id",
      id:98767890
    },
    {
      ...Events,
      path:"/event/:id",
      id:197709709
    },

  ],
  privateRoutes:[

  ]
}
