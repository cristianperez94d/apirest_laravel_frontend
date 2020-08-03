<template>
  <div class="container-fluid mt-3">
    <button class="btn btn-warning float-right " @click="showModalViewFilters()">Filtros</button>
    <HelloWorld msg="Lista General de Productos" class="mb-3"/>
    <div class="alert alert-info" v-if="getLoading">
      Cargando...
    </div>
    {{selectedItemPerPage}}
    {{'per-page: '+perPage}}
    {{selectedOrderBy}}
    {{'orderBy: '+orderBy}}
    <div id="" class="row row-cols-1 row-cols-sm-2 row-cols-md-4 m-1 justify-content-center" v-if="products.total">
      
      <div v-for="product of products.data" :key="product.identificador">
        
        <b-card
          :title="product.nombre"
          :img-src="URL_SERVER+product.foto"
          img-alt="Image"
          img-top
          tag="article"
          style="max-width: 20rem;"
          class="mb-2 mr-1 col h-100"
        >
          <p class="card-text text-truncate">
            {{product.descripcion}}
          </p>
                    
          <!-- Currency -->
          <p class="text-center h2 text-danger">$ {{convertCurrency(product.precio)}}</p>
          <p class="text-center">
            {{textCurrency}}
          </p>

          <div class="container">
            <router-link class="btn btn-outline-info btn-block" :to="{name:'ProductDetails', params: {'id':product.identificador}}">Ver detalles</router-link>
          </div>
          
        </b-card>

      </div>

    </div>

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

    <!-- Modal View Filters -->
    <b-modal
    id="modal-filters-view"
    ref="my-modal"
    hide-footer
    title="Filtros"
    @hide=hideModalViewFilters
    >

      <h3>Lista de filtros</h3>
      <!-- Filters -->
      <!-- Filter items per page  -->
      <b-form-group label="¿Numero de productos por Pagina?">
        <b-form-radio-group
          v-model="selectedItemPerPage"
          :options="itemsPerPage"
          name="radios-stacked"
          stacked
        ></b-form-radio-group>
      </b-form-group>
      <!-- Filter order By -->
      <b-form-group label="¿Ordenar productos:?">
        <b-form-radio-group
          v-model="selectedOrderBy"
          :options="itemsOrderBy"
          name="radios-Order-By"
          stacked
        ></b-form-radio-group>
      </b-form-group>

      <div class="text-center">
        <button type="button" class="btn btn-success w-50" @click="saveFilters()">Aceptar</button>
      </div>

    </b-modal>
    
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue'
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'

export default {
  name: 'Home',
  components: {
    HelloWorld
  },
  data() {
    return {
      products:{
        data: [],
        current_page: 0,
        last_page: 0,
        per_page: 0,
        total: 0,
        links: {}
      },
      offset:2,
      // Modal filters
      selectedItemPerPage: 10,
      itemsPerPage: [
        { text: '5 Productos por Pagina', value: 5 },
        { text: '10 Productos por Pagina', value: 10 },
        { text: '15 Productos por Pagina', value: 15 },
        { text: '25 Productos por Pagina', value: 25 },
        { text: '50 Productos por Pagina', value: 50 },
      ],
      selectedOrderBy: '',
      itemsOrderBy: [
        { text: 'ordenar por precio', value: 'sort_by=precio' },
        { text: 'ordenar por nombre', value: 'sort_by=nombre' },
      ],
      // filters
      perPage: 10,
      orderBy: ''

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
  computed: {
    ...mapState(['token', 'user', 'session','URL_SERVER']),
    ...mapGetters(['getLoading','getCurrency','textCurrency']),
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
      fetch(`${this.URL_SERVER}api/products?page=${pagina}&per_page=${this.perPage}&${this.orderBy}`)
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
    convertCurrency(valor){
      if(this.getCurrency.dollar){
        let dollarValue = this.getCurrency.dollarValue;
        return (valor/dollarValue).toFixed(2);
      }
      return valor;
    },
    saveFilters(){
      this.perPage = this.selectedItemPerPage;
      this.orderBy = this.selectedOrderBy; 
      this.consultProducts(1);
      this.hideModalViewFilters();
    },
    showModalViewFilters(){
      this.$bvModal.show('modal-filters-view');
    },
    hideModalViewFilters(){
      this.$bvModal.hide('modal-filters-view');
    },
  },
  

}
</script>
