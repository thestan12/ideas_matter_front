const LayoutInconnected = () => import('layouts/layoutInConnected')
const LayoutConnected = () => import('layouts/layoutConnected')
const NotFound = () => import('pages/Error404.vue')
const Home = () => import('pages/Home')
const About = () => import('pages/about')

import '../../axios'

// routes for anonymous user
const RoutesConnected = [
  {
    path: '',
    component: LayoutConnected,
    children: [
      {
        name: 'Home',
        path: '/home',
        components: {
          default: Home
        }
      },
      {
        path: '/about',
        components: {
          default: About
        }
      },
      {
        path: '',
        redirect: '/home'
      }
    ]
  }
]

// routes for connected user
const RoutesInconnected = [
  {
    path: '',
    component: LayoutInconnected,
    children: [
      {
        path: '/home',
        components: {
          default: Home
        }
      },
      {
        path: '/about',
        components: {
          default: About
        }
      },
      {
        path: '',
        redirect: '/home'
      }
    ]
  }
]
const Routes = [
  {
    // Always leave this as last one
    path: '*',
    component: NotFound
  }
]

const connected = sessionStorage.getItem('token')
const user = JSON.parse(sessionStorage.getItem('user'))

var routes
switch (true) {
  case connected && !user.isAdmin:
    routes = [...RoutesConnected, ...Routes]
    break
  default:
    routes = [...RoutesInconnected, ...Routes]
}

export default routes
