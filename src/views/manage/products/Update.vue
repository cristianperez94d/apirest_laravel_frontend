<template>
  <div class="container">
     <h1 class="text-center mt-3">Actualizar Producto</h1>

    <!--View Photos -->
    <div class="" >
      <h3>Editar fotos</h3>
      <div v-if="photos.loading" class="alert alert-info">Cargando Imagenes...</div>
      <div v-else>
        <p class="text-right h4">Total fotos: {{photos.total}}</p>
        <button class="btn btn-success mr-3" @click="showModalViewPhotos">Ver</button>
        <button class="btn btn-success" @click="showModal">Agregar</button>
      </div>
    </div>

    <hr>
    <form @submit.prevent="updateProduct()" enctype="multipart/form-data">
      <h3>Editar datos</h3>

      <div class="form-group">
        <label for="">Identificador:</label>
        <input class="form-control" type="text" v-model="identificador" disabled="true">
      </div>
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
    		<label for="">Subir Imagen</label>
    		<input type="file" class="form-control-file" id="" name="nueva_imagen" @change="saveImage">
    		<!-- <small>Peso maximo 3 MB- formato de imagen jpeg,png</small> -->
    	  <img id="img_previsualizar" :src="`${URL_SERVER+foto}`" style="maxWidth: 150px">
    	</div>

      <div class="form-group">
        <label for="">Subcategoria</label>
        <input class="form-control" type="text" v-model="subcategoria" @click="showModalViewSubcategories()">
      </div>

      <div class="alert alert-info" v-if="info">
        {{info}}
      </div>
      <ul class="alert alert-danger" v-if="errors && typeof(errors) == 'string'">
          {{errors}}
      </ul>
      <ul class="alert alert-danger" v-if="errors && typeof(errors) == 'object'">
        <li v-for="error of errors" :key="error.index">
          {{error}}
        </li>
      </ul>
      <div class="alert alert-info" v-if="getLoading">
        Cargando...
      </div>

      <button type="submit" class="btn btn-success btn-block mb-3">Editar</button>
      <button type="button" class="btn btn-secondary btn-block mb-3" @click="cancelUpdate()">Cancelar</button>

    </form>

    <!-- Modal Insert Photos -->
    <b-modal
    id="modal-photo-add"
    ref="my-modal"
    hide-footer
    title="Agregar"
    @hide=hideModal
    >

      <h3>Agregar Fotografia</h3>
      
      <form ref="form" @submit.stop.prevent="handleSubmit">

        <div class="form-group">
          <label for="">Subir Imagen</label>
          <input type="file" class="form-control-file" id="" name="nueva_imagen" @change="saveImageModal">
          <!-- <small>Peso maximo 3 MB- formato de imagen jpeg,png</small> -->
        </div>

        <div class="alert alert-danger" v-if="errors">
        {{errors}}
        </div>

        <button type="submit" class="btn btn-success float-right ml-3">Agregar</button>
        <button type="reset" class="btn btn-secondary float-right" @click="hideModal()">Cancelar</button>

      </form>

    </b-modal>

    <!-- Modal View Photos -->
    <b-modal
    id="modal-photo-view"
    ref="my-modal"
    hide-footer
    title="Listado"
    @hide=hideModal
    >

      <h3>Fotografias</h3>
      <!-- PHOTOS -->
      <div class="row row-cols-1 row-cols-sm-2 row-cols-md-3 mt-3 justify-content-center">
        <div class="col" style="maxWidth: 120px" v-for="photo of photos.data" :key="photo.identificador">
          <div class="h-100">
            <img :src="`${URL_SERVER+photo.foto}`" alt="" class="img-fluid">
          </div>
        </div>
      </div>

    </b-modal>

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
      
      identificador: '',
      nombre: '',
      descripcion: '',
      peso: '',
      precio: '',
      foto: '',
      fotoUpdate:'',
      subcategoria: '',

      info: '',
      errors: '',

      modalPhoto:{
        foto: '',
      },
      photos:{
        data: [],
        total: 0,
        loading: false,
      },
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
    cancelUpdate(){
      router.back();
    },
    setProduct(product){
      if(product){
        this.identificador = product.identificador;
        this.nombre = product.nombre;
        this.descripcion = product.descripcion;
        this.peso = product.peso;
        this.precio = product.precio;
        this.foto = product.foto;
        this.subcategoria = product.subcategoria;
      }
      else{
        this.identificador = '';
        this.nombre = '';
        this.descripcion = '';
        this.peso = '';
        this.precio = '';
        this.foto = '';
        this.subcategoria = '';
      }
    },
    consultProduct(){
      this.setLoading(true);
      let config = {
        method: 'get',
        headers:{
          'Accept': 'apliccatioon/json',
        }
      }
      fetch(`${this.URL_SERVER}api/products/${this.$route.params.id}`,config)
      .then(res => res.json())
      .then(res => {
        this.setProduct(res.data);
        this.setLoading(false);
      });
    },
    updateProduct(){
      this.setLoading(true);
      let data = new FormData();
      
      data.append('.method', 'put');
      data.append('nombre', this.nombre);
      data.append('descripcion', this.descripcion);
      data.append('peso', this.peso);
      if(this.fotoUpdate){ data.append('foto', this.fotoUpdate); }
      data.append('precio', this.precio);
      data.append('subcategoria', this.subcategoria);
      
      let config = {
        method: 'post',
        headers:{
          'Accept': 'application/json',
          'Authorization': `Bearer ${this.getToken}`
        },
        body: data
      }
      fetch(`${this.URL_SERVER}api/products/${this.$route.params.id}`,config)
      .then(res => res.json())
      .then(res => {
        if(res.success){
          this.info = res.success;
          this.setProduct(res.data);
        }
        else{
          this.errors = res.error  
        }
        this.setLoading(false);
      })
    },
    consultProductPhotos(){
      this.photos.loading = true;
      let config = {
        headers:{
          'Accept': 'application/json'
        }
      }
      fetch(`${this.URL_SERVER}api/products/${this.$route.params.id}/photos`,config)
      .then(res => res.json())
      .then(res => {
        if(res.total>0){
          this.photos.data = res.data;
          this.photos.total = res.total;
        }
        this.photos.loading = false;
      })
    },
    saveImage(e){
      let file = e.target.files[0];
      this.fotoUpdate = file;
    },
    showModal(){
      this.$bvModal.show('modal-photo-add');
    },
    hideModal(){
      this.resetModal();
      this.$bvModal.hide('modal-photo-add');
    },
    resetModal() {
      this.modalPhoto.foto = '';
      this.modalPhoto.producto = '';
      this.errors = ''
    },
    saveImageModal(e){
      let file = e.target.files[0];
      this.modalPhoto.foto = file;
    },
    handleSubmit() {
      let data = new FormData();
      if(this.modalPhoto.foto){ data.append('foto', this.modalPhoto.foto); }

      console.log(data.get('correo'));
      this.setLoading(true);
      let config = {
        method: 'post',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${this.getToken}`
        },
        body: data
      }
      fetch(`${this.URL_SERVER}api/products/${this.$route.params.id}/photos`,config)
      .then(res => res.json())
      .then(res => {     
        
        if(res.success){
          this.hideModal();
          this.errors = ''
          this.consultProductPhotos();
        }
        else{
          this.errors = res.error;
        }
        this.setLoading(false);
        
      })
      .catch(error => {
        console.log(error);
      })
      
    },
    // Modal view Photos
    showModalViewPhotos(){
      this.$bvModal.show('modal-photo-view');
    },
    hideModalViewPhotos(){
      this.$bvModal.hide('modal-photo-view');
    },
    // Modal view Subcategories
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
    this.consultProduct();
    this.consultProductPhotos();
  }  
}
</script>