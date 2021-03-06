<template>
  <div class="form-group">
    <div class="mt-5">
      <b-alert :show="!!error" dismissible fade variant="danger">
        <p>{{ error }}</p>
      </b-alert>
      <div>
        <b-container fluid>
          <b-table striped hover :items="listItems" :fields="fields" :current-page="currentPage" :per-page="5">
            <template v-slot:cell(action)="data">
              <b-button variant="primary" size="sm" class="mr-1" @click="editProduct(data)"> Editar </b-button>
            </template>
            <template v-slot:cell(pictureList)="data">
              <img v-if="hasPicture(data)" :src="`data:image/png;base64,${data.item.pictureList[0].picture}`"
                width="auto" height="100" />
              <img v-else :src="`data:image/png;base64,${noimage}`" width="auto" height="70" />

            </template>
            <template v-slot:cell(category)="data">
              <span><small>{{ getCategoryName(data)}}</small></span>
            </template>
            <template v-slot:cell(name)="data">
              <span><small>{{ data.item.name }}</small></span>
            </template>
            <template v-slot:cell(description)="data">
              <span><small>{{ data.item.description }}</small></span>
            </template>
            <template v-slot:cell(updatedAt)="data">
              <span><small>{{ new Date(data.item.updatedAt).toLocaleString() }}</small></span>
            </template>
            <template v-slot:cell(price)="data">
              <span><small>{{data.item.price+'€'}}</small></span>
            </template>
            <template v-slot:cell(status)="data">
              <b-badge v-if="data.item.status=='AVAILABLE'" variant="success">{{getStatusLabel(data.item.status)}}
              </b-badge>
              <b-badge v-if="data.item.status=='RESERVED'" variant="warning">{{getStatusLabel(data.item.status)}}
              </b-badge>
              <b-badge v-if="data.item.status=='SOLD'" variant="secondary">{{getStatusLabel(data.item.status)}}
              </b-badge>
            </template>

          </b-table>
        </b-container>
        <b-pagination v-model="currentPage" :total-rows="totalPages" :per-page="recordsPerPage">
        </b-pagination>
      </div>
      <br>
      <p align="left">
        <b-button class="aling-left" variant="outline-primary" @click="newProduct(data)">Nuevo videojuego</b-button>
      </p>
      <b-modal size="lg" @hide="loadProducts" centered id="modalProduct" v-bind:title=this.modalTitle hide-footer>
        <ProductView :id="this.productId" :new="(this.modalTitle=='Nuevo videojuego')" />
      </b-modal>
    </div>
  </div>
</template>

<script>
  import ProductView from '@/views/ProductView.vue'
  export default {
    components: {
      ProductView
    },
    data() {
      return {
        email: '',
        isLoading: false,
        error: null,
        listItems: [],
        currentPage: 1,
        totalPages: 0,
        recordsPerPage: 5,
        noimage: "iVBORw0KGgoAAAANSUhEUgAAAEYAAAAnCAYAAACyhj57AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsEAAA7BAbiRa+0AAAAiSURBVGhD7cExAQAAAMKg9U9tDB8gAAAAAAAAAAAAAHipASrPAAFA2GUnAAAAAElFTkSuQmCC",
        fields: [{
            key: "pictureList",
            label: "",
            sortable: false,
            image: true,
            class: "text-center",
            tdClass: "align-middle"
          },
          {
            key: "category",
            label: "Categoría",
            class: "text-left",
            sortable: true,
            sortDirection: "desc",
            tdClass: "align-middle"
          },
          {
            key: "name",
            label: "Nombre",
            sortable: true,
            class: "text-left",
            tdClass: "align-middle"
          },
          {
            key: "description",
            label: "Descripción",
            class: "text-left",
            sortable: true,
            tdClass: "align-middle"
          },
          {
            key: "price",
            label: "Precio",
            class: "text-left",
            sortable: true,
            tdClass: "align-middle"
          },
          {
            key: "status",
            label: "Estado",
            class: "text-left",
            sortable: true,
            tdClass: "align-middle"
          },

          {
            key: "updatedAt",
            label: "Actualizado",
            class: "text-left",
            sortable: false,
            tdClass: "align-middle"
          },
          {
            key: "action",
            label: "",
            tdClass: "align-middle"
          },
        ],
        params: "",
        productId: null,
        modalTitle: "Nuevo videojuego",
      }
    },
    computed: {
      getProductId() {
        return this.productId;
      },
      isLoggedIn() {
        return this.$store.getters.isAuthenticated;
      },
    },
    created() {
      if (this.isLoggedIn) {
        this.email = this.$store.getters.email;
        this.loadCategories();
        this.loadProducts();
      }
    },
    watch: {
      currentPage: {
        handler: function (value) {
          this.params = `page=${value}&size=${this.recordsPerPage}`;
          this.loadProducts();
        },
      },
    },
    methods: {
      getStatusLabel(data) {
        if (data == "AVAILABLE") {
          return "Disponible";
        }
        if (data == "RESERVED") {
          return "Reservado";
        }
        if (data == "SOLD") {
          return "Vendido";
        }
        return "";
      },
      async loadCategories() {
        this.isLoading = true;
        try {
          await this.$store.dispatch('category/loadCategories');
          this.isLoading = false;
        } catch (error) {
          this.error = error.message || 'No se pudo cargar el listado de categorias';
          this.isLoading = false;
        }
      },
      async loadProducts() {
        this.isLoading = true;
        this.params = `page=${this.currentPage}&size=${this.recordsPerPage}`;
        try {
          await this.$store.dispatch('product/loadProducts', {
            type: 'user',
            value: this.email
          });
          this.listItems = this.$store.getters['product/getProducts'];
          if (typeof this.listItems != "undefined") {
            this.totalPages = this.listItems.length;
          }
          this.isLoading = false;
        } catch (error) {
          this.error = error.message || 'No se pudo cargar el listado de productos';
          this.isLoading = false;
        }
      },
      editProduct(data) {
        this.productId = data.item.productId;
        this.modalTitle = "Editar videojuego";
        this.$bvModal.show('modalProduct');
      },
      newProduct() {
        this.productId = 0;
        this.modalTitle = "Nuevo videojuego";
        this.$bvModal.show('modalProduct');
      },
      getCategoryName(data) {
        if (typeof data.item.category != "undefined") {
          return data.item.category.name;
        }
      },
      hasPicture(data) {
        if (typeof data.item.pictureList != "undefined") {
          return true;
        }
        return false;
      },
      handleError() {
        this.error = null;
      }
    }
  }
</script>