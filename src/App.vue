<template>
  <div id="app">

    <div class="">

      <b-navbar toggleable="lg" type="dark" variant="info">

        <b-container>
          <b-navbar-brand :to="{name: 'Home'}">Ecommerce</b-navbar-brand>

          <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

          <b-collapse id="nav-collapse" is-nav>
            <b-navbar-nav>
              <b-nav-item :to="{name: 'Home'}">Inicio</b-nav-item>

              <b-nav-item-dropdown text="Categorias" right>
                <b-dropdown-item :to="{name: 'CategorySubcategories', params:{ name: category.nombre, id:category.identificador}}" v-for="category of getCategories.data" :key="category.identificador">
                  
                  <img :src="`${URL_SERVER+category.foto}`" alt="" style="maxWidth: 40px" class="img-fluid">
                  <span class="pl-1">{{category.nombre}}</span>                    
                  
                </b-dropdown-item>
              </b-nav-item-dropdown>

              <!-- Administrador -->
              <b-nav-item-dropdown text="Gestion" right v-if="session && user.admin===1">
                <b-dropdown-item :to="{name: 'ManageCategoriesInsert'}">Categorias</b-dropdown-item>
                <b-dropdown-item :to="{name: 'ManageProducts'}">Productos</b-dropdown-item>
                <b-dropdown-item :to="{name: 'ManageSubcategoriesInsert'}">Subcategorias</b-dropdown-item>
                <b-dropdown-item :to="{name: 'ManageUsers'}">Usuarios</b-dropdown-item>
              </b-nav-item-dropdown>

            </b-navbar-nav>            

            <!-- Right aligned nav items -->
            <b-navbar-nav class="ml-auto">
              <b-nav-form>
                <b-form-input size="sm" class="mr-sm-2" placeholder="Search"></b-form-input>
                <b-button size="sm" class="my-2 my-sm-0" type="submit">Search</b-button>
              </b-nav-form>

              <b-nav-item-dropdown text="Moneda" right>
                <b-dropdown-item @click="getPesosValue()">Pesos</b-dropdown-item>
                <b-dropdown-item @click="getDollarValue()">Dolar</b-dropdown-item>
              </b-nav-item-dropdown>

              <b-nav-item-dropdown right>
                <!-- Using 'button-content' slot -->
                <template v-slot:button-content>
                  <span v-if="user.name">{{user.name}}</span>
                  <span v-else>Usuario</span>
                </template>
                <b-dropdown-item :to="{name: 'Login'}" v-if="!session">Iniciar Sesion</b-dropdown-item>
                <b-dropdown-item :to="{name: 'Register'}" v-if="!session">Registrarse</b-dropdown-item>
                <b-dropdown-item :to="{name: 'Profile'}" v-if="session">Perfil</b-dropdown-item>
                <b-dropdown-item @click="logout(session)" v-if="session">Cerrar Sesion</b-dropdown-item>
              </b-nav-item-dropdown>

            </b-navbar-nav>
          </b-collapse>
        </b-container>
      </b-navbar>

      <div class="alert alert-info" type="alert" v-if="getLoading">
        Cargando....
      </div>

    </div>

    <router-view/>
  </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'
export default {
  data() {
    return {
      
    }
  },
  computed:{
    ...mapState(['user', 'session','token','URL_SERVER']),
    ...mapGetters(['getCategories','getLoading']),
  },
  methods:{
    ...mapActions(['logout','loadToken','getDollarValue','getPesosValue','consultCategories']),
  },
  created(){
    this.consultCategories();
  }
}
</script>
