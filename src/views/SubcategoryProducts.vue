<template>
  <div class="container-fluid">

    <h1 class="text-center mt-3">{{$route.params.name}}</h1>

    <div class="alert alert-info" v-if="products.loading">
      Cargando productos...
    </div>

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

  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
export default {
  name: 'SubcategoryProducts',
  data() {
    return {
      products:{
        data:[],
        current_page: 0,
        last_page: 0,
        per_page: 0,
        total: 0,
        links: {},
        loading:false,
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
  computed: {
    ...mapState(['URL_SERVER']),
    ...mapGetters(['getCurrency','textCurrency']),
    verifyChangeCategory(){
      let id = this.$route.params.id;
      this.consultProducts(id);
    },
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
    consultProducts(pagina){
      this.products.data = [];
      this.products.loading = true;
      let config = {
        headers: {
          'Accept': 'application/json',
        }
      }
      fetch(`${this.URL_SERVER}api/subcategories/${this.$route.params.id}/products?page=${pagina}`,config)
      .then(res => res.json() )
      .then(res => {
        if(res.data.length > 0){
          this.products.data = res.data;
          this.products.current_page = res.current_page;
          this.products.last_page = res.last_page;
          this.products.per_page = res.per_page;
          this.products.total = res.total;
          this.products.links = res.links;
        }
        this.products.loading = false;
      });
    },
    convertCurrency(valor){
      if(this.getCurrency.dollar){
        let dollarValue = this.getCurrency.dollarValue;
        return (valor/dollarValue).toFixed(2);
      }
      return valor;
    },

  },
}
</script>