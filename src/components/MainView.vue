<template>
  <div class="main">
    <div>
      <b-container class="bv-example-row">
        <h1>Ultimos productos en ponerse a la venta</h1>
        <Category />
      </b-container>
    </div>
  </div>
</template>

<script>

import Category from '@/components/Category.vue'
export default {
  name: 'App',
  components: {
    Category
  }, 
    data() {
      return {
        gettingLocation: false
      }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  h3 {
    margin: 40px 0 0;
  }

  ul {
    list-style-type: none;
    padding: 0;
  }

  li {
    display: inline-block;
    margin: 0 10px;
  }

  a {
    color: #42b983;
  }
</style>