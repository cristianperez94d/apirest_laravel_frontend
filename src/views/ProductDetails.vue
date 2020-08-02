<template>
  <div class="container">
    <h1 class="text-center">{{product.nombre}}</h1>
    <div class="alert alert-info" type="alert" v-if="loading">
      cargando..
    </div>

    <div class="mx-auto d-block" style="maxWidth: 500px">
      <v-zoomer style="border: solid 1px silver;">
        <img :src="`${URL_SERVER+product.foto}`" alt="foto" class="img-fluid">
      </v-zoomer>
    </div>

    <!-- PHOTOS -->
    <div class="row row-cols-2 row-cols-sm-3 row-cols-md-5 mt-3 justify-content-center">
      <div class="col" style="maxWidth: 120px" v-for="photo of photos" :key="photo.identificador">
        <button class="btn btn-outline-dark h-100" @click="changePhoto(photo.foto)">
          <img :src="`${URL_SERVER+photo.foto}`" alt="" class="img-fluid">
        </button>
      </div>
    </div>

    <h3 class="text-center text-white bg-secondary mt-3">Precio</h3>
    <p class="text-center h3 text-danger">$ {{convertCurrency(product.precio)}}  <span class="small">{{textCurrency}}</span></p>
    <h3 class="text-center text-white bg-secondary mt-3">Caracteristicas</h3>
    <ul>
      <li>{{product.descripcion}}</li>
      <li>Peso: {{product.peso}}</li>
      <li>Subcategoria: {{product.subcategoria}}</li>
    </ul>
    
  </div>
</template>

<script>
import { mapState, mapMutations, mapGetters, mapActions } from 'vuex';
export default {
  data() {
    return {
      product:{
        identificador: '',
        nombre: '',
        descripcion: '',
        peso: 0,
        precio: 0,
        foto: '',
        subcategoria: 0,
      },
      photos:[]
    }
  },
  computed: {
    ...mapState(['URL_SERVER','loading']),
    ...mapGetters(['getCurrency','textCurrency']),
  },
  methods: {
    ...mapMutations(['setLoading']),
    consultProduct(){
      this.setLoading(true);
      let config = {
        method: 'get',
        headers:{
          'Accept': 'apliccatioon/json',
        }
      }
      fetch(`${this.URL_SERVER}api/products/${this.$route.params.id}`)
      .then(res => res.json())
      .then(res => {
        this.product = res.data;
        this.setLoading(false);
      });
    },
    consultPhotos(){
      this.setLoading(true);
      let config = {
        headers:{
          'Accept': 'application/json',
        }
      }
      fetch(`${this.URL_SERVER}api/products/${this.$route.params.id}/photos`,config)
      .then(res => res.json())
      .then(res => {
        if(res.total){
          this.photos = res.data;
        }
        this.setLoading(false);
      })
    },
    convertCurrency(valor){
      if(this.getCurrency.dollar){
        let dollarValue = this.getCurrency.dollarValue;
        return (valor/dollarValue).toFixed(2);
      }
      return valor;
    },
    changePhoto(url){
      this.product.foto = url
    },
  },
  created(){
    this.consultProduct();
    this.consultPhotos();
  }
}
</script>