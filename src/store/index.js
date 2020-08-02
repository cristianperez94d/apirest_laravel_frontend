import Vue from 'vue'
import Vuex from 'vuex'
import router from '../router'


Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    URL_SERVER: process.env.VUE_APP_API_SERVER,
    loading: false,
    token: '',
    user: {
      name: '',
      email: '',
      admin: 0,
    },
    session: false,
    currency: {
      dollar: false,
      dollarValue: 0,
    }
    

  },
  mutations: {
    // USER
    setLoading(state, valor){
      if(valor === true){
        state.loading = valor;
      }
      else{
        state.loading = false;
      }
    },
    setToken(state, payload){
      if(payload){
        state.token = payload;
      }
      else{
        state.token = '';
      }
      
    },
    setUser(state, payload){
      if(payload){
        state.user.name = payload.nombre
        state.user.email = payload.correo
        state.user.admin = payload.esAdministrador
      }
      else{
        state.user.name = ''
        state.user.email = ''
        state.user.admin = 0;
      }
    },
    setSession(state, payload){
      if(payload === true){
        state.session = payload;
      }
      else{
        state.session = false;
      }
    },
    setDollarValue(state, payload){
      if(payload){
        state.currency.dollar = true;
        state.currency.dollarValue = payload;
      }
      else{
        state.currency.dollar = false;
        state.currency.dollarValue = 0;
      }
    },
    // PRODUCTS
    
  },
  actions: {
    getDollarValue({commit,getters}){
      if(!getters.getCurrency.dollar){
        commit('setLoading', true);
        //http://api.currencylayer.com/live?access_key=1db248843310a9b8cc1605ef1d3953bb&currencies=COP&source=USD&format=1
        fetch(`http://api.currencylayer.com/live?access_key=${process.env.VUE_APP_API_CURRENCY_ACCESS_KEY}&currencies=COP&source=USD&format=1`)
        .then(res => res.json())
        .then(res => {
          console.log(res);
          if(res.success){
            commit('setDollarValue',res.quotes.USDCOP);
            commit('setLoading', false);
          }
        })        
      }
      // commit('setDollarValue','3733.33');
    },
    getPesosValue({commit}){
      commit('setDollarValue', null)
    },
    saveLoading({commit},payload){
      commit('setLoading', payload);
    },
    // USER
    saveToken({commit}, payload){
      localStorage.setItem('token', payload.access_token);
      commit('setToken', payload.access_token)
    },
    saveUser({commit},payload){
      commit('setUser', payload)
    },
    saveSession({commit}, payload){
      commit('setSession', payload)
    },
    async loginToken({commit, getters}, token){
      commit('setLoading', true);
      if(token){
        let res = await fetch (`${process.env.VUE_APP_API_SERVER}api/user`,{
          method: 'get',
          headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
        let user = await res.json();
        if(user.data){
          commit('setToken', token);
          commit('setUser', user.data);
          commit('setSession', true)      
        }
        else{
          commit('setToken', '');
          commit('setUser', null);
          commit('setSession', false)
          localStorage.removeItem('token');
        }
        commit('setLoading', false);

      }
    },
    logout({commit}, session){
      if(session){
        commit('setSession',false);
        commit('setUser',null);
        commit('setToken', '');
        localStorage.removeItem('token');
        router.push({name: 'Login'});
      }
    },
    // MANAGE USERS
    saveUsers({commit}, payload){
      commit('setUsers', payload);
    },

  },
  modules: {
  },
  getters:{
    // USER
    getUser(state){
      return state.user;
    },
    getSession(state){
      return state.session;
    },
    getLoading(state){
      return state.loading;
    },
    getToken(state){
      return state.token;
    },
    getCurrency(state){
      return state.currency;
    },
    textCurrency(state){
      if(state.currency.dollar){
        return 'USD'
      }
      else{
        return 'COP'
      }
    },

  },
  
})
