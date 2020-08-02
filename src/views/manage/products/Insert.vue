<template>
  <div class="container">
     <h1 class="text-center mt-3">Nuevo Producto</h1>

    <form @submit.prevent="insertProduct()" enctype="multipart/form-data">

      <div class="form-group">
        <label for="">Nombre producto</label>
        <input class="form-control" type="text" v-model="nombre">
      </div>
      <div class="form-group">
        <label for="">Descripcion</label>
        <input class="form-control" type="text" v-model="descripcion">
      </div>
      <div class="form-group">
        <label for="">Peso</label>
        <input class="form-control" type="text" v-model="peso">
      </div>
      <div class="form-group">
        <label for="">Precio</label>
        <input class="form-control" type="text" v-model="precio">
      </div>
      
      <div class="form-group">
    		<label for="">Subir Foto</label>
    		<input type="file" class="form-control-file" id="" name="nueva_imagen" @change="saveImage">
    		<!-- <small>Peso maximo 3 MB- formato de imagen jpeg,png</small> -->
    	</div>

      <div class="form-group">
        <label for="">Subcategoria</label>
        <input class="form-control" type="text" v-model="subcategoria">
      </div>

      <div class="alert alert-info" v-if="info">
        {{info}}
      </div>
      <ul class="alert alert-danger" v-if="errors">
        <li v-for="error of errors" :key="error.index">
          {{error}}
        </li>
      </ul>
      <div class="alert alert-info" v-if="getLoading">
        Cargando...
      </div>

      <button type="submit" class="btn btn-success btn-block">Guardar</button>

    </form>


  </div>
</template>

<script>
import { mapState, mapMutations, mapGetters } from 'vuex';
export default {
  data() {
    return {
      nombre: '',
      descripcion: '',
      peso: '',
      precio: '',
      foto: '',
      subcategoria: '',
      info: '',
      errors:'',
    }
  },
  computed: {
    ...mapState(['URL_SERVER','loading']),
    ...mapGetters(['getLoading','getToken']),
  },
  methods: {
    ...mapMutations(['setLoading']),
    resetForm(){
      this.nombre = '';
      this.descripcion = '';
      this.peso = '';
      this.precio = '';
      this.foto = '';
      this.subcategoria = '';
    },
    insertProduct(){
      this.setLoading(true);
      this.errors = '';
      this.info = '';
      let data = new FormData();
      data.append('nombre', this.nombre);
      data.append('descripcion', this.descripcion);
      data.append('peso', this.peso);
      data.append('precio', this.precio);
      data.append('foto', this.foto);
      data.append('subcategoria', this.subcategoria);

      let config = {
        method: 'post',
        headers:{
          'Accept': 'apliccatioon/json',
          'Authorization': `Bearer ${this.getToken}`
        },
        body: data
      }
      fetch(`${this.URL_SERVER}api/products`,config)
      .then(res => res.json())
      .then(res => {
        console.log(res);
        if(res.success){
          this.info = res.success
          this.resetForm();

        }
        else{
          this.errors = res.error
        }
        this.setLoading(false);
      });
    },
    saveImage(e){
      let file = e.target.files[0];
      this.foto = file;
    },

  },
  created(){
     
  }  
}
</script>