<template>
  <div class="container">
    <h1 class="text-center">Registrar Usuario</h1>
    <form @submit.prevent="userRegister()" autocomplete="off">
      
      <div class="form-group">
        <label for="">Nombre:</label>
        <input type="text" class="form-control" placeholder="Ingrese su nombre" :class="{ 'is-invalid': $v.name.$error, 'is-valid': !$v.name.$invalid}" v-model="$v.name.$model">
        <div class="small text-danger" v-if="!$v.name.required">* El nombre es requerido</div>
      </div>

      <div class="form-group">  
        <label for="">Correo:</label>
        <input type="text" class="form-control" placeholder="su_correo@gmail.com" :class="{'is-invalid': $v.email.$error, 'is-valid': !$v.email.$invalid}" v-model="$v.email.$model">
        <div class="small text-danger" v-if="!$v.email.required">* El correo es requerido</div>
        <div class="small text-danger" v-if="!$v.email.email">* Direccion de correo incorrecta </div>
      </div>  
      
      <div class="form-group">
        <label for="">Contraseña:</label>
        <input type="password" class="form-control" placeholder="Ingrese su Contraseña" :class="{'is-invalid':$v.password.$error, 'is-valid':!$v.password.$invalid}" v-model="$v.password.$model">
        <div class="small text-danger" v-if="!$v.password.required">* La contraseña es requerida</div>
        <div class="small text-danger" v-if="!$v.password.minLength">* Minimo 6 caracteres</div>
        <input type="password" class="form-control" placeholder="Confirmar Contraseña" :class="{'is-invalid':$v.confirm_password.$error, 'is-valid':!$v.confirm_password.$invalid && $v.confirm_password.$model}" v-model="$v.confirm_password.$model">
        <div class="small text-danger" v-if="!$v.confirm_password.sameAsPassword "> * Las contraseñas no son iguales</div>
      </div>
    
      <div class="alert alert-danger" type="alert" v-if="errors">
        {{errors}}
      </div>
      
      <div class="alert alert-info" type="alert" v-if="loading">
        cargando...
      </div>

      <button type="submit" class="btn btn-success btn-block" :disabled="$v.$invalid || loading">Registrarse</button>
      
    </form>
  </div>
</template>

<script>
import router from '@/router'
import {mapState, mapActions} from 'vuex'
import { required, email, minLength, sameAs} from 'vuelidate/lib/validators'
export default {
  name: 'Register',
  data() {
    return {
      
      name: '',
      email: '',
      password: '',
      confirm_password: '',
      errors: null,
    }
  },
  validations: {
    name: {
      required,
    },
    email: {
      required,
      email,
    },
    password:{
      required,
      minLength: minLength(6),
    },
    confirm_password:{
      sameAsPassword: sameAs('password')
    }
      
  },  
  methods:{
    ...mapActions(['sendData']),
    userRegister(){

      if(this.$v.$invalid){
        this.errors = "Los campos con * son requeridos";
      }
      else{  
        this.sendData(true)
        
        let formData = new FormData();
        formData.append('nombre', this.$v.name.$model);
        formData.append('correo', this.$v.email.$model);
        formData.append('contraseña', this.$v.password.$model);
        formData.append('confirmar_contraseña', this.$v.confirm_password.$model);

        let url = this.URL_SERVER+"api/users";
        const config = {
          method: 'post',
          headers: {
            'Accept': 'application/json',
          },
          body: formData
        }
        
        fetch(url,config)
        .then(res => res.json())
        .then(res =>{
          this.sendData(false);
          if(!res.error){
            router.push({name: 'Login'})
          }
          else{
            this.errors = res.error
          }

        })
        .catch(err => {
          console.log(err);
        });
      }

    }
    
  }, //fin methods
  computed:{
    ...mapState(['URL_SERVER', 'loading']),

  }, //fin computed
  

}
</script>