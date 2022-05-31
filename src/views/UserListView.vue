<template>
  <b-container fluid>
    <div class="mt-5">
      <b-alert :show="!!error" dismissible fade variant="danger">
        <p>{{ error }}</p>
      </b-alert>
      <div>
        <b-container fluid>
          <b-table striped hover :items="listItems" :fields="fields"
            :current-page="currentPage" :per-page="4">
            <template v-slot:cell(action)="data">
              <div v-if="data.item.email!=email">
                <b-button v-if="data.item.status=='ACTIVE'" size="sm" class="mr-1" @click="blockUser(data.item)">
                  Bloquear
                </b-button>
                <b-button v-if="data.item.status=='INACTIVE'" size="sm" class="mr-1" @click="activateUser(data.item)">
                  Activar
                </b-button>
              </div>
            </template>
            <template v-slot:cell(email)="data">
              <p><small>{{data.item.name}} {{data.item.surname}}</small></p>
              <p><small>{{data.item.email}}</small></p>
            </template>
            <template v-slot:cell(address)="data">
              <p><small>{{data.item.address}}</small></p>
            </template>
            <template v-slot:cell(rating)="data">
              <p>
                <font-awesome-icon style="color:blue" icon="fa-solid fa-thumbs-up" />
                &nbsp;{{valueToFixed(data.item.rating)}}</p>
            </template>
            <template v-slot:cell(status)="data">
              <b-badge v-if="data.item.status=='ACTIVE'" variant="success"> Activo </b-badge>
              <b-badge v-if="data.item.status=='INACTIVE'" variant="danger"> Bloqueado </b-badge>
            </template>
            <template v-slot:cell(isAdmin)="data">
              <b-badge v-if="data.item.isAdmin==true" variant="info"> Administrador </b-badge>
              <b-badge v-if="data.item.isAdmin==false" variant="primary"> Usuario </b-badge>
            </template>

          </b-table>
          <b-pagination v-model="currentPage" :total-rows="totalPages" :per-page="recordsPerPage">
          </b-pagination>
        </b-container>
      </div>
    </div>
  </b-container>
</template>


<script>
  export default {
    components: {},
    data() {
      return {
        isLoading: false,
        email: '',
        error: null,
        listItems: [],
        currentPage: 1,
        totalPages: 0,
        recordsPerPage: 4,
        fields: [{
            key: "email",
            label: "Usuario",
            class: "text-left",
            sortable: true,
            sortDirection: "desc",
            tdClass: "align-middle"
          },
          {
            key: "rating",
            label: "Reputación",
            sortable: true,
            class: "text-center",
            tdClass: "align-middle"
          },
          {
            key: "isAdmin",
            label: "Tipo",
            class: "text-center",
            sortable: true,
            image: true,
            tdClass: "align-middle"
          },
          {
            key: "status",
            label: "Estado",
            class: "text-center",
            sortable: true,
            image: true,
            tdClass: "align-middle"
          },
          {
            key: "address",
            label: "Dirección",
            class: "text-left",
            sortable: true,
            tdClass: "align-middle"
          },
          {
            key: "action",
            class: "text-center",
            label: "",
            tdClass: "align-middle"
          },
        ],
        params: "",
      }
    },
    computed: {
      isLoggedIn() {

        return this.$store.getters.isAuthenticated;
      },
    },
    created() {
      this.email = this.$store.getters.email;
      if (this.$store.getters.isAdmin) {
        this.loadUsers();
      } else {
        const redirectUrl = '/' + (this.$route.query.redirect || 'login');
        this.$router.replace(redirectUrl);
      }
    },
    watch: {
      currentPage: {
        handler: function (value) {
          this.params = `page=${value}&size=${this.recordsPerPage}`;
          this.loadUsers();
        },
      },
    },
    methods: {
      async loadUsers() {
        this.isLoading = true;
        this.params = `page=${this.currentPage}&size=${this.recordsPerPage}`;
        try {
          await this.$store.dispatch('user/loadUsers');
          this.listItems = this.$store.getters['user/getUsers'];
          this.totalPages = this.listItems.length;
          this.isLoading = false;
        } catch (error) {
          this.error = error.message || 'No se pudo cargar el listado de usuarios';
          this.isLoading = false;
        }
      },
      async activateUser(data) {
        let user = {
          name: data.name,
          surname: data.surname,
          email: data.email,
          address: data.address,
          password: '',
          status: 'ACTIVE',
          nif: data.nif == null ? '' : data.nif
        }
        try {
          await this.$store.dispatch('user/updateUser', user);
          this.loadUsers();
        } catch (error) {
          this.error = error.message || 'No se pudo recuperar la información del usuario';
        }
      },
      async blockUser(data) {
        let user = {
          name: data.name,
          surname: data.surname,
          email: data.email,
          address: data.address,
          password: '',
          status: 'INACTIVE',
          nif: data.nif == null ? '' : data.nif
        }
        try {
          await this.$store.dispatch('user/updateUser', user);
          this.loadUsers();
        } catch (error) {
          this.error = error.message || 'No se pudo recuperar la información del usuario';
        }
      },
      valueToFixed(data) {
        let fixedValue = 0;
        try {
          if (!isNaN(data)) {
            fixedValue = data.toFixed(1);
          }
        } catch (e) {
          console.log(e);
        }
        return fixedValue;
      },
      handleError() {
        this.error = null;
      },
    }
  }
</script>