import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import store from '@/store' 

Vue.use(VueRouter)
  
  const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/iniciar-sesion',
    name: 'Login',
    component: () => import('../views/user/Login.vue')
  },
  {
    path: '/registrar-usuario',
    name: 'Register',
    component: () => import('../views/user/Register.vue')
  },
  {
    path: '/producto/:id',
    name: 'ProductDetails',
    component: () => import('../views/ProductDetails.vue')
  },
  {
    path: '*',
    name: 'Error',
    component: () => import('../views/Error.vue')
  },
  // ROUTE USER REGULAR O ADMIN
  {
    path: '/perfil-usuario',
    name: 'Profile',
    component: () => import('../views/user/Profile.vue'),
    meta:{requiresAuth:true}
  },
  // ROUTE ADMINISTRATOR
  {
    path: '/getion/usuarios',
    name: 'ManageUsers',
    component: () => import('../views/manage/users/Users.vue'),
    meta: { requiresAuth: true , requiresAdmin: true}
  },
  // ROUTE ADMINISTRATOR FOR PRODUCTS
  {
    path: '/getion/productos',
    name: 'ManageProducts',
    component: () => import('../views/manage/products/Products.vue'),
    meta: { requiresAuth: true , requiresAdmin: true}
  },
  {
    path: '/getion/productos-editar/:id',
    name: 'ManageProductsUpdate',
    component: () => import('../views/manage/products/Update.vue'),
    meta: { requiresAuth: true , requiresAdmin: true}
  },
  {
    path: '/getion/productos-nuevo',
    name: 'ManageProductsInsert',
    component: () => import('../views/manage/products/Insert.vue'),
    meta: { requiresAuth: true , requiresAdmin: true}
  },
  // ROUTE ADMINISTRATOR FOR SUBCATEGORIES
  {
    path: '/getion/subcategorias-nuevo',
    name: 'ManageSubcategoriesInsert',
    component: () => import('../views/manage/subcategories/Insert.vue'),
    meta: { requiresAuth: true , requiresAdmin: true}
  },
  // ROUTE ADMINISTRATOR FOR CATEGORIES
  {
    path: '/getion/categorias-nuevo',
    name: 'ManageCategoriesInsert',
    component: () => import('../views/manage/categories/Insert.vue'),
    meta: { requiresAuth: true , requiresAdmin: true}
  },

]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
})


router.beforeEach((to, from, next) => {

  if(!to.name){
    next({name: 'Error', path: to.path});
  }
  else{
    let protectedRouteAdmin = to.matched.some(record => record.meta.requiresAuth && record.meta.requiresAdmin);
    let protectedRouteRegular = to.matched.some(record => record.meta.requiresAuth);
    let getSession = store.state.session;
    let getToken = localStorage.getItem('token');

    if(getSession || getToken || protectedRouteAdmin
    || protectedRouteRegular){
      if(getSession){
        verifyAccessUrl(to,next, getSession);
      }
      else if(getToken){
        // login with token
        (async () => {
          await store.dispatch('loginToken', getToken);
          if(store.getters.getSession){
            verifyAccessUrl(to,next, true);
          }
          else{
            verifyAccessUrl(to,next,false);
          }
          
        })()
        
      }
      else{
        verifyAccessUrl(to,next,false);
      }

    }
    else{
      next();
    }

  }
  
})

function verifyAccessUrl(to,next, session){
  let protectedRouteAdmin = to.matched.some(record => record.meta.requiresAuth && record.meta.requiresAdmin);
  let protectedRouteRegular = to.matched.some(record => record.meta.requiresAuth);
  // protected route for session and administrator
  if(protectedRouteAdmin){
    if(store.state.user.admin === 1 && session){
      next();
    }
    else if(store.state.user.admin === 0 && session){
      next({name: 'Error', path: to.path});
    }
    else{
      next({name: 'Login'});
    }
  }
  // protected route for session
  else if(protectedRouteRegular){
    if(session){
      next();
    }
    else{
      next({name: 'Login'});
    }
  }
  // Route Not proteccion
  else{
    if(session && (to.name === 'Login' || to.name === 'Register')){
      next({name: 'Home'});
    }
    else{
      next();
    }
  }
  
}

export default router