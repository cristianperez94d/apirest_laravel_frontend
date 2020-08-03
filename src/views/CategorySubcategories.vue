<template>
  <div class="container-fluid">
    {{verifyChangeCategory}}
    <h1 class="text-center mt-3">{{$route.params.name}}</h1>

    <div id="" class="row row-cols-1 row-cols-sm-2 row-cols-md-4 m-1 justify-content-center" v-if="subcategories.data.length > 0">
      
      <div v-for="subcategory of subcategories.data" :key="subcategory.identificador">
        
        <b-card
          :title="subcategory.nombre"
          :img-src="URL_SERVER+subcategory.foto"
          img-alt="Image"
          img-top
          tag="article"
          style="max-width: 20rem;"
          class="mb-2 mr-1 col h-100"
        >

          <div class="container">
            <router-link class="btn btn-outline-info btn-block" :to="{name: 'SubcategoryProducts', params:{'id':subcategory.identificador, 'name':subcategory.nombre}}">Ver productos</router-link>
          </div>
          
        </b-card>
      
      </div>

    </div>
    
  </div>
</template>

<script>
import { mapState } from 'vuex';
export default {
  name: 'CategorySubcategories',
  data() {
    return {
      subcategories:{
        data:[],
        loading:false,
      }
    }
  },
  computed: {
    ...mapState(['URL_SERVER']),
    verifyChangeCategory(){
      let id = this.$route.params.id;
      this.consultSubcategories(id);
    }
  },
  methods:{
    consultSubcategories(id){
      this.subcategories.data = [];
      this.subcategories.loading = true;
      let config = {
        headers: {
          'Accept': 'application/json',
        }
      }
      fetch(`${this.URL_SERVER}api/categories/${id}/subcategories?per_page=20`,config)
      .then(res => res.json() )
      .then(res => {
        if(res.data.length > 0){
          this.subcategories.data = res.data;
        }
        this.subcategories.loading = false;
      });
    },

  },
  created() {
    this.consultSubcategories(this.$route.params.id);
  },
}
</script>