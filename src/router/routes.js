const LayoutInconnected = () => import('layouts/layoutInConnected')
const LayoutConnected = () => import('layouts/layoutConnected')
const NotFound = () => import('pages/Error404.vue')
const Home = () => import('pages/Home')
const UserIdeas = () => import('pages/UserIdeas');
const About = () => import('pages/about')

import '../../axios'
import StorageService from '../services/storage-service';

// routes for anonymous user
const RoutesConnected = [
  {
    path: '',
    component: LayoutConnected,
    children: [
      {
        path: '/home',
        components: {
          default: Home
        }
      },
      {
        name: 'UserIdeas',
        path: '/my-ideas',
        components: {
          default: UserIdeas
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

const connected = StorageService.getToken();
console.log('connected =', connected);

var routes
switch (true) {
  case connected && connected !== '':
    routes = [...RoutesConnected, ...Routes];
    if (!StorageService.getFirstConnection()) {
      StorageService.setFirstConnection("true");
    }
    break;
  default:
    routes = [...RoutesInconnected, ...Routes]
}

export default routes
