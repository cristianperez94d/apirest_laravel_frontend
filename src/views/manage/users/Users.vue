<template>
  <div class="container">
    
    <h1 class="text-center">Gestion de usuarios</h1>

    <div class="alert alert-info" v-if="getLoading">
      Cargando...
    </div>

    <!-- Alert delete -->
    <b-alert show dismissible variant="info" v-if="info">
      {{info}}
      
    </b-alert>

    <!-- table users -->
    <div v-if="users.total">    
    
      <table class="table">
        <thead>
          <tr>
            <th scope="col">Id</th>
            <th scope="col">Nombre</th>
            <th scope="col">Correo</th>
            <th scope="col">Tipo Usuario</th>
            <th scope="col">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user of users.data" :key="user.identificador">
            <th scope="row">{{user.identificador}}</th>
            <td>{{user.nombre}}</td>
            <td>{{user.correo}}</td>
            <td>{{isAdmin(user.esAdministrador)}}</td>
            
            <button class="btn btn-warning btn-sm m-2" @click="showModal(user.identificador)">Editar</button> 
            <button class="btn btn-danger btn-sm mr-2 mt-2 mb-2" @click="deleteUser(user.identificador)">Eliminar</button> 
            
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

          <div class="page-item" :class="{'active': users.current_page === numPage}" v-for="numPage of numPages" :key="numPage.index">
            <li>
              <router-link class="page-link" :to="{query: {pagina: numPage}}">{{numPage}}</router-link>
            </li>
          </div>

          <li class="page-item" :class="{'disabled': !nextPage}">
            <router-link class="page-link" :to="{query: {pagina: nextPage}}">Siguiente</router-link> 
          </li>
          <li class="page-item" :class="{'disabled': !nextPage}">
            <router-link class="page-link" :to="{query: {pagina: users.last_page}}">Ultima</router-link> 
          </li>
        </ul>
        <span>Pagina: {{users.current_page}} de {{users.last_page}}</span>
      </nav>

    </div>

    <!-- Modal Update Users -->
    <b-modal
    id="modal-user-update"
    ref="my-modal"
    hide-footer
    title="Actualizar"
    @hide=hideModal
    >
      <h3>¿Seguro de Actualizar el usuario?</h3>
      
      <form ref="form" @submit.stop.prevent="handleSubmit">

        <div class="form-group">
          <label for="">Identificador:</label>
          <input type="text" class="form-control"  :disabled="true"  v-model="modalUser.identificador">
          <!-- :class="{ 'is-invalid': $v.name.$error, 'is-valid': !$v.name.$invalid}" -->
          <!-- <div class="small text-danger" v-if="!$v.name.required">* El nombre es requerido</div> -->
        </div>
        
        <div class="form-group">
          <label for="">Nombre:</label>
          <input type="text" class="form-control" placeholder="Actualizar nombre usuario" :disabled="false"  v-model="modalUser.nombre">
          <!-- :class="{ 'is-invalid': $v.name.$error, 'is-valid': !$v.name.$invalid}" -->
          <!-- <div class="small text-danger" v-if="!$v.name.required">* El nombre es requerido</div> -->
        </div>

        <div class="form-group">  
          <label for="">Correo:</label>
          <input type="text" class="form-control" placeholder="actualizar correo" v-model="modalUser.correo">
          <!-- :class="{'is-invalid': $v.email.$error, 'is-valid': !$v.email.$invalid}" -->
          <!-- <div class="small text-danger" v-if="!$v.email.required">* El correo es requerido</div> -->
          <!-- <div class="small text-danger" v-if="!$v.email.email">* Direccion de correo incorrecta </div> -->
        </div>

        <div class="form-group">  
          <label for="">Tipo Usuario:</label>
          <input type="text" class="form-control" :disabled="true" :value="isAdmin(modalUser.esAdministrador)">
          <!-- :class="{'is-invalid': $v.email.$error, 'is-valid': !$v.email.$invalid}" -->
          <!-- <div class="small text-danger" v-if="!$v.email.required">* El correo es requerido</div> -->
          <!-- <div class="small text-danger" v-if="!$v.email.email">* Direccion de correo incorrecta </div> -->
        </div>

        <div class="alert alert-danger" v-if="errors">
        {{errors}}
        </div>

        <button type="submit" class="btn btn-success float-right ml-3">Actualizar</button>
        <button type="reset" class="btn btn-secondary float-right" @click="hideModal()">Cancelar</button>

      </form>

    </b-modal>

    
    
  </div>
</template>
<script>
import { mapState, mapGetters, mapActions, mapMutations } from 'vuex'

export default {
  name: 'Users',
  components:{
  },
  data() {
    return {
      users: {
        data: [],
        current_page: 0,
        last_page: 0,
        per_page: 0,
        total: 0,
        links: {}
      },
      offset:2,
      errors: '',
      info: '',
      modalUser:{ //Data update users
        identificador: 0,
        nombre: '',
        correo: '',
        esAdministrador: 0,
      }

    }
  },
  watch:{
    "$route.query.pagina": {
      immediate: true,
      handler(pagina){
        pagina = parseInt(pagina) || 1;
        this.consultUsers(pagina);
      }
    }
  },
  methods:{
    ...mapActions([]),
    ...mapMutations(['setLoading']),
    consultUsers(pagina){
      this.setLoading(true);
      let config = {
        method: 'get',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${this.getToken}`
        }        
      }
      fetch(`${this.URL_SERVER}api/users?page=${pagina}`,config)
      .then(res => res.json())
      .then(users => {     
        // console.log(users);
        this.users.data = users.data;
        this.users.current_page = users.current_page;
        this.users.last_page = users.last_page;
        this.users.per_page = users.per_page;
        this.users.total = users.total;
        this.users.links = users.links;
        this.setLoading(false);
      })
    },
    deleteUser(id){
      this.info = ''
      let config = {
        method: 'delete',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${this.getToken}`
        },
      }
      fetch(`${this.URL_SERVER}api/users/${id}`,config)
      .then(res => res.json())
      .then(res => {
        if(res.success){
          this.info = res.success;
          let index = this.users.data.findIndex(element => element.identificador === id);
          this.users.data.splice(index,1);
        }
        else{
          this.info = res.error;
        }
      })
    },    
    isAdmin(data){
      return (data === 1) ? 'Administrador' : 'Regular'
    },
    searchUserUpdate(id){
      let userUpdate = this.users.data.find(element => element.identificador === id);
      return userUpdate;
    },
    showModal(id){
      let userUpdate = this.searchUserUpdate(id);

      this.modalUser.identificador = userUpdate.identificador;
      this.modalUser.nombre = userUpdate.nombre;
      this.modalUser.correo = userUpdate.correo;
      this.modalUser.esAdministrador = userUpdate.esAdministrador;
      this.$bvModal.show('modal-user-update');
    },
    hideModal(){
      this.resetModal();
      this.$bvModal.hide('modal-user-update');
    },
    resetModal() {
      this.modalUser.identificador = 0;
      this.modalUser.nombre = '';
      this.modalUser.correo = '';
      this.modalUser.esAdministrador = 0;
      this.errors = ''
    },
    handleSubmit() {
      let data = new FormData();
      data.append('.method', 'put');
      data.append('nombre', this.modalUser.nombre);
      data.append('correo', this.modalUser.correo);

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
      fetch(`${this.URL_SERVER}api/users/${this.modalUser.identificador}`,config)
      .then(res => res.json())
      .then(res => {     
        console.log(res);
        if(res.success){
          let indexUpdate = this.users.data.findIndex(element => element.identificador === this.modalUser.identificador);
          this.users.data[indexUpdate] = res.data;
          this.hideModal();
          this.errors = ''
        }
        else{
          this.errors = res.error;
        }
        this.setLoading(false);
        
      })
      .catch(error => {
        console.log(error);
      })
      
    }

  },
  computed:{
    ...mapState(['URL_SERVER']),
    ...mapGetters(['getLoading', 'getToken']),
    prevPage(){
      return this.users.current_page ? this.users.current_page-1 : 0
    },
    nextPage(){      
      return this.users.current_page && this.users.last_page > this.users.current_page ? this.users.current_page+1 : 0
    },
    numPages(){
      if(!this.users.total){
        return [];
      }
      
      let from = this.users.current_page - this.offset;
      if(from < 1){
        from = 1;
      }

      let to = from + (this.offset*2);
      if(to >= this.users.last_page){
        to = this.users.last_page
      }

      let pagesArray = [];
      while(from <= to){
        pagesArray.push(from);
        from ++;
      }

      return pagesArray;

    }
  },
  getters:{

  },
  created() {
    
  },
}
</script>