<template>
  <div class="form-group">
    <div class="col-md-6 mt-5">
      <b-form @submit="onSubmit">
        <div v-if="isLoading">
          <b-spinner>Cargando...</b-spinner>
        </div>
        <b-alert :show="!!error" dismissible fade variant="danger">
          <p>{{ error }}</p>
        </b-alert>
        <b-row>
          <b-col cols="4">
            <b-form-group id="input-group-1" label="Nombre:" label-for="input-1">
              <b-form-input id="input-1" v-model=name type="text" placeholder="Introduzca su nombre" required>
              </b-form-input>
            </b-form-group>
          </b-col>
          <b-col cols="8">
            <b-form-group id="input-group-3" label="Dirección:" label-for="input-3">
              <b-form-input id="input-3" v-model="address" type="text" placeholder="Introduzca su dirección">
              </b-form-input>
            </b-form-group>
          </b-col>
        </b-row>
        <b-row rows="3">
          <b-col cols="4">
            <b-form-group id="input-group-2" label="Apellidos:" label-for="input-2">
              <b-form-input id="input-2" v-model="surname" type="text" placeholder="Introduzca sus apellidos" required>
              </b-form-input>
            </b-form-group>
            <b-form-group id="input-group-3" label="Correo electrónico:" label-for="input-3">
              <b-form-input id="input-3" v-model="email" type="email" placeholder="Introduzca su correo" required>
              </b-form-input>
            </b-form-group>
            <b-form-group id="input-group-4" label="NIF:" label-for="input-4">
              <b-form-input id="input-4" v-model="nif" type="text" placeholder="Introduzca su NIF"></b-form-input>
            </b-form-group>
            <b-form-group id="input-group-5" label="Contraseña:" label-for="input-5">
              <b-form-input id="input-5" v-model="password" type="password" placeholder="Introduzca su contraseña">
              </b-form-input>
            </b-form-group>
            <b-form-group id="input-group-6" label="Confirmar contraseña:" label-for="input-6">
              <b-form-input id="input-6" v-model="repassword" type="password" placeholder="Confirme su contraseña">
              </b-form-input>
            </b-form-group>
            <p></p>
            <b-button type="submit" class="mr-1" variant="primary">Guardar</b-button>
            <b-button type="reset" class="mr-1" @click="goHome" variant="secondary">Cancelar</b-button>
          </b-col>
          <b-col cols="8">
            <div v-if="gettingLocation">
              <i>Getting your location...</i>
            </div>
            <div border-color=white style="height: 380px; width: 100%">
              <p></p>
              <l-map v-if="showMap" :zoom="zoom" :center="center" :options="mapOptions" style="height: 80%"
                @update:center="centerUpdate" @update:zoom="zoomUpdate">
                <l-tile-layer :url="url" :attribution="attribution" />
                <l-marker :lat-lng="markerLatLng">
                </l-marker>
              </l-map>
              <br>
              <p align="right">
                <b-button class="mr-1 aling-right" variant="secondary" @click="getStreet">Obtener localización
                </b-button>
              </p>
            </div>
          </b-col>
        </b-row>
      </b-form>
    </div>
  </div>
</template>

<script>
  //const nominatim = require('nominatim');
  import {
    latLng
  } from "leaflet";
  import {
    Icon
  } from "leaflet";
  import {
    LMap,
    LTileLayer,
    LMarker,

  } from "vue2-leaflet";

  delete Icon.Default.prototype._getIconUrl;
  Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
  });
  export default {
    components: {
      LMap,
      LTileLayer,
      LMarker
    },
    data() {
      return {
        isLoading: false,
        error: null,
        name: null,
        surname: null,
        email: null,
        nif: null,
        address: null,
        isAdmin: null,
        status: null,
        password: null,
        repassword: null,
        latitude: null,
        longitude: null,
        zoom: 0,
        center: latLng(0, 0),
        url: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
        markerLatLng: latLng(47.41322, -1.219482),
        withTooltip: latLng(47.41422, -1.250482),
        currentZoom: 11.5,
        currentCenter: latLng(47.41322, -1.219482),
        showParagraph: false,
        mapOptions: {
          zoomSnap: 0.5
        },
        showMap: true,
        webLocation: null,
        gettingLocation: false
      }
    },
    computed: {
      isLoggedIn() {
        return this.$store.getters.isAuthenticated;
      },
    },
    created() {
      if (this.$store.getters.isAuthenticated) {
        this.loadUser();
      } else {
        const redirectUrl = '/' + (this.$route.query.redirect || 'login');
        this.$router.replace(redirectUrl);
      }
    },
    methods: {
      goHome() {
        const redirectUrl = '/';
        this.$router.replace(redirectUrl);
      },
      zoomUpdate(zoom) {
        this.currentZoom = zoom;
      },
      centerUpdate(latitude, longitude) {
        this.zoom = 16;
        this.center = latLng(latitude, longitude)
      },
      async getCoordinates() {
        this.showMap = false;
        if (typeof this.address != "undefined") {
          try {
            await this.$store.dispatch('user/getUserLocation', {
              address: this.address
            });
          } catch (error) {
            this.error = error.message || 'Something went wrong!';
          }
          let user = this.$store.getters['user/getUser'];
          console.log(user.latitude);
          console.log(user.longitude);
          this.markerLatLng = latLng(user.latitude, user.longitude);
          this.centerUpdate(user.latitude, user.longitude)
          this.showMap = true;
        }
      },
      async getStreet() {
        //do we support geolocation
        if (!("geolocation" in navigator)) {
          this.errorStr = 'Geolocation is not available.';
          return;
        }
        this.showMap = false;
        this.gettingLocation = true;
        // get position
        const pos = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject);
        });
        this.gettingLocation = false;

        if (pos) {
          this.location = pos;
          this.latitude = this.location.coords.latitude;
          this.longitude = this.location.coords.longitude;
          this.markerLatLng = latLng(this.location.coords.latitude, this.location.coords.longitude);
          this.centerUpdate(this.location.coords.latitude, this.location.coords.longitude)
          try {
            await this.$store.dispatch('user/getLocationAddress', {
              latitude: this.latitude,
              longitude: this.longitude
            });
          } catch (error) {
            this.error = error.message || 'Something went wrong!';
            this.showMap = true;
          }
          this.gettingLocation = false;
          let user = this.$store.getters['user/getUser'];
          this.address = user.address;
          this.showMap = true;
        }
      },
      onSubmit(event) {
        event.preventDefault()
        alert(JSON.stringify(this.form))
      },
      async loadUser(refresh = false) {
        this.isLoading = true;
        try {
          await this.$store.dispatch('user/loadUser', {
            forceRefresh: refresh,
          });
        } catch (error) {
          this.error = error.message || 'Something went wrong!';
        }
        this.isLoading = false;
        let user = this.$store.getters['user/getUser'];
        this.name = user.name;
        this.surname = user.surname;
        this.email = user.email;
        this.password = user.password;
        this.repassword = user.password;
        this.address = user.address;
        this.nif = user.nif;
        this.isAdmin = user.isAdmin;
        this.status = user.status;
        this.getCoordinates();
      },
      handleError() {
        this.error = null;
      },
    }
  }
</script>