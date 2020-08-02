<template>
  <div class="container-fluid">
    <h1 class="text-center mt-3">Gestion de Productos</h1>
    <div class="text-center">
      <router-link class="btn btn-success m-3 w-50" :to="{name:'ManageProductsInsert'}">Nuevo</router-link>
    </div>

    <div class="alert alert-info" v-if="getLoading">
      Cargando...
    </div>

    <!-- Alert delete -->
    <b-alert show dismissible variant="info" v-if="info">
      {{info}}      
    </b-alert>
    <!-- Alert delete error -->
    <b-alert show dismissible variant="danger" v-if="errors">
      {{errors}}
    </b-alert>

    <!-- table products -->
    <div v-if="products.total">    
    
      <table class="table">
        <thead>
          <tr class="text-center">
            <th scope="col">identificador</th>
            <th scope="col">nombre</th>
            <th scope="col">descripcion</th>
            <th scope="col">peso</th>
            <th scope="col">precio</th>
            <th scope="col">foto</th>
            <th scope="col">subcategoria</th>
            <th scope="col">acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr class="text-center" v-for="product of products.data" :key="product.identificador">
            <th scope="row">{{product.identificador}}</th>
            <td>{{product.nombre}}</td>
            <td>{{product.descripcion}}</td>
            <td>{{product.peso}}</td>
            <td>{{product.precio}}</td>
            
            <td>
              <img :src="`${URL_SERVER+product.foto}`" style="maxWidth: 100px" alt="">
            </td>
            <td>{{product.subcategoria}}</td>
            <td>
              <router-link class="btn btn-warning btn-sm m-2" :to="{name: 'ManageProductsUpdate', params:{'id':product.identificador}}">Editar</router-link>
              <button class="btn btn-danger btn-sm mr-2 mt-2 mb-2"  @click="deleteProduct(product.identificador)">Eliminar</button> 
            </td>

          </tr>
        </tbody>
      </table>

      <nav aria-label="Page navigation">
        <ul class="pagination">

          <li class="page-item" :class="{'disabled': !prevPage}">
            <router-link class="page-link" :to="{query: {pagina: 1}}">Primera</router-link>
          </li>
          <li class="page-item" :class="{'disabled': !prevPage}">
            <router-link class="page-link" :to="{query: {pagina: prevPage}}">Anterior</router-link>
          </li>

          <div class="page-item" :class="{'active': products.current_page === numPage}" v-for="numPage of numPages" :key="numPage.index">
            <li>
              <router-link class="page-link" :to="{query: {pagina: numPage}}">{{numPage}}</router-link>
            </li>
          </div>

          <li class="page-item" :class="{'disabled': !nextPage}">
            <router-link class="page-link" :to="{query: {pagina: nextPage}}">Siguiente</router-link> 
          </li>
          <li class="page-item" :class="{'disabled': !nextPage}">
            <router-link class="page-link" :to="{query: {pagina: products.last_page}}">Ultima</router-link> 
          </li>
        </ul>
        <span>Pagina: {{products.current_page}} de {{products.last_page}}</span>
      </nav>
    </div>
    
  </div>
</template>
<script>
import { mapGetters, mapState, mapMutations } from 'vuex'
export default {
  data() {
    return {
      info: '',
      errors: '',
      products: {
        data: [],
        current_page: 0,
        last_page: 0,
        per_page: 0,
        total: 0,
        links: {}
      },
      offset:2,
    }
  },
  watch:{
    "$route.query.pagina": {
      immediate: true,
      handler(pagina){
        pagina = parseInt(pagina) || 1;
        this.consultProducts(pagina);
      }
    }
  },  
  computed:{
    ...mapState(['token', 'user', 'session','URL_SERVER']),
    ...mapGetters(['getLoading','getToken']),
    prevPage(){
      return this.products.current_page ? this.products.current_page-1 : 0
    },
    nextPage(){      
      return this.products.current_page && this.products.last_page > this.products.current_page ? this.products.current_page+1 : 0
    },
    numPages(){
      if(!this.products.total){
        return [];
      }
      
      let from = this.products.current_page - this.offset;
      if(from < 1){
        from = 1;
      }

      let to = from + (this.offset*2);
      if(to >= this.products.last_page){
        to = this.products.last_page
      }

      let pagesArray = [];
      while(from <= to){
        pagesArray.push(from);
        from ++;
      }

      return pagesArray;

    }
  },
  methods:{
    ...mapMutations(['setLoading']),
    consultProducts(pagina){

      this.setLoading(true);
      let config = {
        method: 'get',
        headers:{
          'Accept': 'apliccatioon/json',
        }
      }
      fetch(`${this.URL_SERVER}api/products?page=${pagina}`)
      .then(res => res.json())
      .then(res => {
        this.products.data = res.data;
        this.products.current_page = res.current_page;
        this.products.last_page = res.last_page;
        this.products.per_page = res.per_page;
        this.products.total = res.total;
        this.products.links = res.links;

        this.setLoading(false);
      });
    },
    deleteProduct(id){
      console.log(id);
      this.setLoading(true);
      this.info = '';
      this.errors= '';

      let config = {
        method: 'delete',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${this.getToken}`
        },
      }
      fetch(`${this.URL_SERVER}api/products/${id}`, config)
      .then(res => res.json())
      .then(res => {
        if(res.success){
          this.info = res.success;
          let index = this.products.data.findIndex(element => element.identificador === id);
          this.products.data.splice(index,1);
        }
        else{
          this.errors = res.error;
        }
        this.setLoading(false);
      });
    }
  }
}
</script>