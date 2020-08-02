<template>
  <div class="container">
    
    <h1 class="text-center">Perfil de Usuario</h1>
    
    <ul class="list-group bg-dark">
      <li class="list-group-item list-group-item-info">Nombre: <span class="font-weight-bold">{{user.name}}</span></li>
      <li class="list-group-item list-group-item-info">Correo: <span class="font-weight-bold">{{user.email}}</span></li>
      <li class="list-group-item list-group-item-info">Tipo de usuario: <span class="font-weight-bold">{{user.admin === 1 ? 'Administrador': 'Regular'}}</span></li>
    </ul>
    

  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  computed: {
    ...mapState(['user'])
  },
}
</script>