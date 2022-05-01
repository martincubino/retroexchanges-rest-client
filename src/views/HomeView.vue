<template>
  <div class="home">
    <MainView msg="¡Bienvenido!"/>
  </div>
</template>

<script>
// @ is an alias to /src
import MainView from '@/components/MainView.vue'

export default {
  name: 'HomeView',
  components: {
    MainView
  }
}
</script>
