<template>
  <div class="container">
    
    <h1 class="text-center mt-3">Nueva Categoria</h1>

    <form @submit.prevent="insertCategory()">

      <div class="form-group">
        <label for="">Nombre Categoria</label>
        <input class="form-control" type="text" v-model="name">
      </div>

      <div class="form-group">
    		<label for="">Subir Imagen</label>
    		<input type="file" class="form-control-file" id="" name="nueva_imagen" @change="saveImage">
    	</div>

      <!-- Alert Errors -->
      <div v-if="errors">      
        <div class="alert alert-danger" v-if="typeof(errors) == 'string' ">
          {{errors}}
        </div>
        <ul class="alert alert-danger" v-if="typeof(errors) == 'object'">
          <li v-for="error of errors" :key="error.index">
            {{error}}  
          </li>
        </ul>
      </div>
      <!-- Alert info -->
      <div class="alert alert-info" v-if="info">
        {{info}}
      </div>
      <!-- Alert Cargando -->
      <div class="alert alert-info" v-if="loading">
        Cargando...
      </div>

      <button type="submit" class="btn btn-success btn-block">Guardar</button>
      <button type="button" class="btn btn-secondary btn-block" @click="cancelInsert">Cancelar</button>

    </form>

  </div>
</template>

<script>
import router from '@/router';
import { mapState, mapGetters } from 'vuex'
export default {
  name: 'Insert',
  data() {
    return {
      errors: '',
      info: '',
      loading: false,
      name: '',
      photo: '',
    }
  },
  computed: {
    ...mapState(['URL_SERVER']),
    ...mapGetters(['getToken']),
    resetCategory(){
      this.name = '';
      this.photo = '';
    }
  },
  methods: {
    cancelInsert(){
      router.back();
    },
    insertCategory(){
      this.loading = true;
      this.info = '';
      this.errors = '';

      let data = new FormData();
      data.append('nombre', this.name);
      if(this.photo){ data.append('foto', this.photo); }

      let config = {
        method: 'post',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${this.getToken}`
        },
        body: data,

      }
      fetch(`${this.URL_SERVER}api/categories`,config)
      .then(res => res.json())
      .then(res => {

        if(res.success){
          this.info = res.success;
          this.resetCategory;
          router.back()
        }
        else{
          this.errors = res.error;
        }
        this.loading = false;

      })
    },
    saveImage(e){
      let file = e.target.files[0];
      this.photo = file;
    },
  },
}
</script>