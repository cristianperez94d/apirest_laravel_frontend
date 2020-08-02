<template>
  <div class="container">
     <h1 class="text-center mt-3">Nueva Subcategoria</h1>

     <form @submit.prevent="insertSubcategory()">

      <div class="form-group">
        <label for="">Nombre Subcategoria</label>
        <input class="form-control" type="text" v-model="name">
      </div>

      <div class="form-group">
    		<label for="">Subir Imagen</label>
    		<input type="file" class="form-control-file" id="" name="nueva_imagen" @change="saveImage">
    	</div>

      <div class="form-group">

        <label for="">Id Categoria</label>
        
        <div class="row">
          <div class="col col-md-10">
            <input class="form-control" type="text" v-model="category" @click="showModalViewCategories()">
          </div>        
          <div class="col">
            <router-link class="btn btn-info btn-block" :to="{name: 'ManageCategoriesInsert'}">Agregar</router-link>
          </div>
        </div>

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

     <!-- Modal View Categories -->
    <b-modal
    id="modal-categories-view"
    ref="my-modal"
    hide-footer
    title="Listado"
    @hide=hideModalViewcategories
    >

      <h3>Lista de categorias</h3>
      <!-- Categories -->
      <div class="alert alert-info" v-if="categories.loading">
        Cargando categorias...
      </div>
      <b-form-group label="Seleccione una:" v-if="!categories.loading">
        <b-form-radio-group
          v-model="selected"
          :options="options"
          name="radios-stacked"
          stacked
        ></b-form-radio-group>
      </b-form-group>

      <div class="text-center">
        <button class="btn btn-success w-50" @click="selectedCategory()">Aceptar</button>
      </div>

    </b-modal>
    
  </div>
</template>

<script>
import router from '@/router';
import { mapState, mapGetters } from 'vuex';
export default {
  name: 'Insert',
  data() {
    return {
      errors: '',
      info: '',
      loading: false,
      name: '',
      photo: '',
      category: '',
      // Modal categories
      selected: '',
      options: [
        { text: '', value: '' },
      ],
      categories:{
        data: [],
        loading: false,
      },
    }
  },
  computed: {
    ...mapState(['URL_SERVER']),
    ...mapGetters(['getToken']),
    resetSubcategory(){
      this.name = '';
      this.photo = '';
      this.category = '';
    }
  },
  methods:{
    cancelInsert(){
      router.back();
    },
    insertSubcategory(){
      this.loading = true;
      this.info = '';
      this.errors = '';

      let data = new FormData();
      data.append('nombre', this.name);
      if(this.photo){ data.append('foto', this.photo); }
      data.append('categoria', this.category);

      let config = {
        method: 'post',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${this.getToken}`
        },
        body: data,

      }
      fetch(`${this.URL_SERVER}api/subcategories`,config)
      .then(res => res.json())
      .then(res => {

        if(res.success){
          this.info = res.success;
          this.resetSubcategory;
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
    consultCategories(){
      this.categories.loading = true;
      let config = {
        headers: {
          'Accept': 'application/json',
        }
      }
      fetch(`${this.URL_SERVER}api/categories?per_page=50`,config)
      .then(res => res.json() )
      .then(res => {
        // console.log(res);
        if(res.total){
          this.categories.data = res.data;
          this.setOptions();
        }
        this.categories.loading = false;
      });
    },
    setOptions(){
      if(this.categories.data.length > 0){
        this.options = [];
        for (const category of this.categories.data) {
          this.options.push({text: category.nombre , value: category.identificador});
        }

      }
    },    
    selectedCategory(valor){
      this.category = this.selected
      this.hideModalViewcategories();
    },
    showModalViewCategories(){
      this.$bvModal.show('modal-categories-view');
      this.consultCategories();
    },
    hideModalViewcategories(){
      this.$bvModal.hide('modal-categories-view');
    },
  }
}
</script>