<template>
  <div class="container mt-5">
    <h1 class="text-center">Iniciar sesion</h1>
    <form @submit.prevent="iniciarSesion()">

      <div class="form-group">
        <label for="">Correo</label>
        <input type="text" class="form-control" placeholder="Ingrese su correo" :class="{'is-invalid': $v.email.$error, 'is-valid': !$v.email.$invalid}" v-model="$v.email.$model">
        <div class="small text-danger" v-if="!$v.email.required">* El correo es requerido</div>
        <div class="small text-danger" v-if="!$v.email.email">* No es un correo valido</div>
      </div>
      <div class="form-group">
        <label for="">Contraseña</label>
        <input type="password" class="form-control" placeholder="Ingrese su Contraseña" :class="{'is-invalid': $v.password.$error, 'is-valid': $v.password.required}" v-model="$v.password.$model">
        <div class="small text-danger" v-if="!$v.password.required">* La contraseña es requerida</div>
      </div>

      <div class="alert alert-danger" type="alert" v-if="errors">
        {{errors}}
      </div>

      <div class="alert alert-info" type="alert" v-if="loading">
        cargando...
      </div>
      
      <button type="submit" class="btn btn-success btn-block" :disabled="loading || $v.$invalid">Iniciar Sesion</button>


    </form>
  </div>
</template>
<script>
import router from '@/router';
import {required, email} from 'vuelidate/lib/validators'
import { mapState, mapMutations, mapActions } from 'vuex';

export default {
  name: 'Login',
  data(){
    return {
      email: '',
      password: '',
      api_url: process.env.VUE_APP_API_SERVER,
      errors: '',
    }
  },
  validations:{
    email: {required, email},
    password: {required}
  },
  methods:{
    ...mapActions(['saveToken','saveUser','saveSession']),
    ...mapMutations(['setLoading']),
    iniciarSesion(){
      this.setLoading(true);
      let formData = new FormData();
      formData.append('grant_type', process.env.VUE_APP_API_GRANT_TYPE);
      formData.append('client_id', process.env.VUE_APP_API_CLIENT_ID);
      formData.append('client_secret', process.env.VUE_APP_API_CLIENT_SECRET);
      formData.append('username', this.$v.email.$model);
      formData.append('password', this.$v.password.$model);
      
      let config = {
        method: 'post',
        headers: {
          'Accept': 'application/json'
        },
        body: formData
      };
      (async () => {
        
        try {
          let res = await fetch(this.URL_SERVER+'oauth/token', config);
          let data = await res.json();
          if(data.error){
            this.errors = data.error
          }
          else{
            let user =  await fetch(this.URL_SERVER+'api/user', {
              method: 'get',
              headers:{
                'Accept':'application/json',
                'Authorization': 'Bearer '+data.access_token
              }
            });
            let resUser = await user.json();
            
            this.saveUser(resUser.data);
            this.saveToken(data);
            this.saveSession(true);
            router.replace({name: 'Home'});
          }
          this.setLoading(false);
        } catch (error) {
          console.log(error);
        }        
      })();
      
      
    }

  },
  computed:{
    ...mapState(['URL_SERVER', 'loading']),
  },

  
}
</script>
