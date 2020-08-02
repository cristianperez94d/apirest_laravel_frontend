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
        
        <div class="row">
          <div class="col col-md-10">
            <input class="form-control" type="text" @click="showModalViewSubcategories()" v-model="subcategoria">
          </div>
          <div class="col">
            <router-link class="btn btn-info btn-block" :to="{name: 'ManageSubcategoriesInsert'}">Agregar</router-link>
          </div>
        </div>

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
      <button type="button" class="btn btn-secondary btn-block mb-3" @click="cancelInsert()">Cancelar</button>

    </form>

    <!-- Modal View Subcategories -->
    <b-modal
    id="modal-subcategories-view"
    ref="my-modal"
    hide-footer
    title="Listado"
    @hide=hideModalViewSubcategories
    >

      <h3>Lista de Subcategorias</h3>
      <!-- Subcategories -->
      <div class="alert alert-info" v-if="subcategories.loading">
        Cargando subcategorias...
      </div>
      <b-form-group label="Seleccione una:" v-if="!subcategories.loading">
        <b-form-radio-group
          v-model="selected"
          :options="options"
          name="radios-stacked"
          stacked
        ></b-form-radio-group>
      </b-form-group>

      <div class="text-center">
        <button class="btn btn-success w-50" @click="selectedSubcategory()">Aceptar</button>
      </div>

    </b-modal>

  </div>
</template>

<script>
import router from '@/router';
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
      // Modal Subcategories
      selected: '',
      options: [
        { text: '', value: '' },
      ],
      subcategories:{
        data: [],
        loading: false,
      },
    }
  },
  computed: {
    ...mapState(['URL_SERVER','loading']),
    ...mapGetters(['getLoading','getToken']),
  },
  methods: {
    ...mapMutations(['setLoading']),
    cancelInsert(){
      router.back();
    },
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
    consultSubcategories(){
      this.subcategories.loading = true;
      let config = {
        headers: {
          'Accept': 'application/json',
        }
      }
      fetch(`${this.URL_SERVER}api/subcategories?per_page=50`,config)
      .then(res => res.json() )
      .then(res => {
        // console.log(res);
        if(res.total){
          this.subcategories.data = res.data;
          this.setOptions();
        }
        this.subcategories.loading = false;
      });
    },
    setOptions(){
      if(this.subcategories.data.length > 0){
        this.options = [];
        for (const subcategory of this.subcategories.data) {
          this.options.push({text: subcategory.nombre , value: subcategory.identificador});
        }

      }
    },
    selectedSubcategory(valor){
      this.subcategoria = this.selected
      this.hideModalViewSubcategories();
    },
    showModalViewSubcategories(){
      this.$bvModal.show('modal-subcategories-view');
      this.consultSubcategories();
    },
    hideModalViewSubcategories(){
      this.$bvModal.hide('modal-subcategories-view');
    },

  },
  created(){
     
  }  
}
</script>