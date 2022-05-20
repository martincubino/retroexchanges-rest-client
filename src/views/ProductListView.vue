<template>
  <div class="mt-5">
    <b-alert :show="!!error" dismissible fade variant="danger">
      <p>{{ error }}</p>
    </b-alert>
    <div>
      <b-table striped hover :items="listItems" :fields="fields" :current-page="currentPage" :per-page="5">
        <template v-slot:cell(action)="data">
          <b-button variant="primary" class="mr-1" @click="editProduct(data)"> Editar </b-button>
        </template>
        <template v-slot:cell(image)="data">
          <img v-if="data.item.image" :src="`data:image/png;base64,${data.item.image}`" />
        </template>
        <template v-slot:cell(createAt)="data">
          <span>{{ new Date(data.item.createAt).toLocaleString() }}</span>
        </template>
        <template v-slot:cell(updatedAt)="data">
          <span>{{ new Date(data.item.updatedAt).toLocaleString() }}</span>
        </template>
      </b-table>
      <b-pagination v-model="currentPage" :total-rows="totalPages" :per-page="recordsPerPage">
      </b-pagination>
    </div>
    <br>
    <p align="left">
      <b-button class="aling-left" variant="outline-primary" @click="newProduct(data)">Nuevo videojuego</b-button>
    </p>
    <b-modal size="lg" @hide="loadProducts" centered ref="modalProduct" v-bind:title=this.modalTitle hide-footer>
      <ProductView :id="this.productId" :new="(this.modalTitle=='Nuevo videojuego')"/>
    </b-modal>
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
        isLoading: false,
        error: null,
        listItems: [],
        currentPage: 1,
        totalPages: 0,
        recordsPerPage: 5,
        fields: [
          {
            key: "image",
            label: "",
            sortable: false,
            image: true
          },
          {
            key: "productId",
            label: "Id",
            class: "text-left",
            sortable: true,
            sortDirection: "desc",
          },
          
          {
            key: "name",
            label: "Nombre",
            sortable: true,
            class: "text-left",
          },
          {
            key: "description",
            label: "Descripción",
            class: "text-left",
            sortable: true,
          },
          {
            key: "createAt",
            label: "Creado",
            class: "text-left",
            sortable: false,
          },
          {
            key: "updatedAt",
            label: "Actualizado",
            class: "text-left",
            sortable: false,
          },
          {
            key: "action",
            label: "",
          },
        ],
        params: "",
        productId: null,
        modalTitle: "Nuevo videojuego"
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
      if (this.isLoggedIn){
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
      async loadProducts() {
        this.isLoading = true;
        this.params = `page=${this.currentPage}&size=${this.recordsPerPage}`;
        try {
          await this.$store.dispatch('product/loadProducts');
          this.listItems = this.$store.getters['product/getProducts'];
          this.totalPages = this.listItems.length;
          this.isLoading = false;
        } catch (error) {
          this.error = error.message || 'No se pudo cargar el listado de productos';
          this.isLoading = false;
        }
      },
      editProduct(data) {
        this.productId = data.item.productId;
        this.modalTitle="Editar videojuego";
        this.$refs.modalProduct.show();
      },
      newProduct() {
        this.productId = 0;
        this.modalTitle="Nuevo videojuego";
        this.$refs.modalProduct.show();
      },
      handleError() {
        this.error = null;
      }
    }
  }
</script>