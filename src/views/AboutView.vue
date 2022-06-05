<template>
  <div class="about">
    <div>
      <b-card>
        <b-img :src="this.images.uoc" width="100" height="80" fluid alt="Responsive image">
        </b-img>
        <h1>TFG Java EE</h1>
        <a rel="license" href="http://creativecommons.org/licenses/by-nc-nd/4.0/"><img alt="Licencia de Creative Commons" style="border-width:0" src="https://i.creativecommons.org/l/by-nc-nd/4.0/88x31.png" /></a><br />Este obra está bajo una <a rel="license" href="http://creativecommons.org/licenses/by-nc-nd/4.0/">licencia de Creative Commons Reconocimiento-NoComercial-SinObraDerivada 4.0 Internacional</a>.
        <h3>Profesores</h3>
        <h5>Santi Caballe Llobet</h5>
        <h5>Antoni Oller Arcas</h5>

        <h3>Alumno</h3>
        <h5>Francisco Javier Martín Cubino</h5>

        <p>Cliente conectandose al servidor rest en {{this.urlRest}} </p>

        <b-img :src="this.images.pacman" width="200" fluid alt="Responsive image"></b-img>
      </b-card>
     
    </div>
    
  </div>
</template>

<script>
  export default {
    components: {},
    data() {
      return {
        urlRest: `${process.env.VUE_APP_API_REST_BASE_URL}`,
        images: {
          sample: require('@/assets/images/logo.png'),
          pacman: require('@/assets/images/old-school-video-games.gif'),
          uoc: require('@/assets/images/logoUOC.png')

        },
      }
    }

  }
</script>