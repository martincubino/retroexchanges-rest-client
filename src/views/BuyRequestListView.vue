<template>
  <b-container fluid>
    <div class="mt-5">
      <b-tabs>
        <b-tab>
          <template #title>
            <div class="text-center" tdClass="align-middle">
              <h5>Recibidas</h5>
              <b-badge v-if="listItemsInbox.length>=0" variant="light">{{listItemsInbox.length}}</b-badge>
              <font-awesome-icon icon="fa-solid fa-arrow-right" />
              <font-awesome-icon icon="fa-solid fa-inbox" />
            </div>
          </template>
          <div class="form-group">
            <b-alert :show="!!error" dismissible fade variant="danger">
              <p>{{ error }}</p>
            </b-alert>
            <div>
              <b-table striped hover :items="listItemsInbox" :fields="fieldsInbox" :current-page="currentPageInbox"
                :per-page="5">
                <template v-slot:cell(action)="data">
                  <b-button v-if="data.item.status=='PENDING'" variant="primary" size="sm" class="mr-1"
                    @click="acceptRequest(data)"> Aceptar </b-button>
                  <b-button v-if="data.item.status=='PENDING'" variant="danger" size="sm" class="mr-1"
                    @click="dennyRequest(data)"> Rechazar </b-button>
                  <b-button v-if="data.item.status=='ACCEPTED'" variant="primary" size="sm" class="mr-1"
                    @click="endRequest(data)"> Finalizar</b-button>
                  <b-button v-if="data.item.status=='DENIED'" variant="danger" size="sm" class="mr-1"
                    @click="deleteRequest(data)"> Eliminar</b-button>
                  <b-button v-if="(data.item.status=='FINISHED')&&(isUserRating(data.item)==false)" variant="primary"
                    size="sm" class="mr-1" @click="voteBuyer(data)"> Valorar comprador</b-button>
                  <b-badge v-if="(data.item.status=='FINISHED')&&(isUserRating(data.item)==true)" variant="secondary">Ya
                    has votado
                  </b-badge>
                </template>
                <template v-slot:cell(pictureList)="data">
                  <img v-if="hasPicture(data)"
                    :src="`data:image/png;base64,${data.item.product.pictureList[0].picture}`" width="auto"
                    height="100" />
                  <img v-else :src="`data:image/png;base64,${noimage}`" width="auto" height="70" />

                </template>
                <template v-slot:cell(requestId)="data">
                  <p><small>{{ data.item.requestId}}</small> </p>
                </template>
                <template v-slot:cell(name)="data">
                  <p><small>{{ data.item.buyer.name}} {{ data.item.buyer.surname}}</small></p>
                  <p><small>{{ data.item.buyer.email}}</small></p>
                  <p>
                    <font-awesome-icon style="color:blue" icon="fa-solid fa-thumbs-up" />
                    &nbsp;<small>{{valueToFixed(data.item.buyer.rating)}}</small></p>
                </template>
                <template v-slot:cell(description)="data">
                  <p><small><b>{{ getCategoryName(data.item.product.category)}}</b></small></p>
                  <span><small>{{data.item.product.description }}</small></span>
                </template>

                <template v-slot:cell(updatedAt)="data">
                  <span><small>{{ new Date(data.item.updatedAt).toLocaleString()}}</small></span>
                </template>
                <template v-slot:cell(price)="data">
                  <span><small>{{data.item.product.price+'€'}}</small></span>
                </template>
                <template v-slot:cell(offers)="data">
                  <span><small>{{data.item.price+'€'}}</small></span>
                </template>
                <template v-slot:cell(status)="data">
                  <b-badge v-if="data.item.status=='PENDING'" variant="warning">{{getStatusLabel(data.item.status)}}
                  </b-badge>
                  <b-badge v-if="data.item.status=='ACCEPTED'" variant="success">{{getStatusLabel(data.item.status)}}
                  </b-badge>
                  <b-badge v-if="data.item.status=='DENIED'" variant="danger">{{getStatusLabel(data.item.status)}}
                  </b-badge>
                  <b-badge v-if="data.item.status=='FINISHED'" variant="info">{{getStatusLabel(data.item.status)}}
                  </b-badge>
                </template>
              </b-table>
              <b-pagination v-model="currentPageInbox" :total-rows="totalPagesInbox" :per-page="recordsPerPageInbox">
              </b-pagination>
            </div>
          </div>
        </b-tab>
        <b-tab>
          <template #title>
            <div class="text-center" tdClass="align-middle">
              <h5>Enviadas</h5>
              <b-badge v-if="listItemsOutbox.length>=0" variant="light">{{listItemsOutbox.length}}</b-badge>
              <font-awesome-icon icon="fa-solid fa-inbox" />
              <font-awesome-icon icon="fa-solid fa-arrow-right" />
            </div>
          </template>
          <div class="form-group">
            <b-alert :show="!!error" dismissible fade variant="danger">
              <p>{{ error }}</p>
            </b-alert>
            <div>
              <b-table striped hover :items="listItemsOutbox" :fields="fieldsOutbox" :current-page="currentPageOutbox" :per-page="5">
                <template v-slot:cell(action)="data">
                  <b-button v-if="data.item.status=='PENDING'" variant="danger" size="sm" class="mr-1"
                    @click="cancelRequest(data)">Cancelar</b-button>
                  <b-button v-if="(data.item.status=='FINISHED')&&(isUserRating(data.item)==false)" variant="primary"
                    size="sm" class="mr-1" @click="voteSeller(data)"> Valorar vendedor</b-button>
                  <b-badge v-if="(data.item.status=='FINISHED')&&(isUserRating(data.item)==true)" variant="secondary">Ya
                    has votado
                  </b-badge>
                </template>
                <template v-slot:cell(pictureList)="data">
                  <img v-if="hasPicture(data)"
                    :src="`data:image/png;base64,${data.item.product.pictureList[0].picture}`" width="auto"
                    height="100" />
                  <img v-else :src="`data:image/png;base64,${noimage}`" width="auto" height="70" />
                </template>
                <template v-slot:cell(requestId)="data">
                  <p><small>{{ data.item.requestId}}</small> </p>
                </template>
                <template v-slot:cell(name)="data">
                  <small v-if="data.item.seller">
                    <p>{{ data.item.seller.name}} {{ data.item.seller.surname}}</p>
                  </small>
                  <small v-if="data.item.seller">
                    <p>{{ data.item.seller.email}} </p>
                  </small>
                  <p>
                    <font-awesome-icon style="color:blue" icon="fa-solid fa-thumbs-up" />
                    &nbsp;<small>{{valueToFixed(data.item.seller.rating)}}</small></p>
                </template>
                <template v-slot:cell(description)="data">
                  <p><small><b>{{ getCategoryName(data.item.product.category) }}</b></small></p>
                  <small><span>{{data.item.product.description }}</span></small>
                </template>
                <template v-slot:cell(updatedAt)="data">
                  <small> <span>{{ new Date(data.item.updatedAt).toLocaleString() }}</span></small>
                </template>
                <template v-slot:cell(price)="data">
                  <small><span> {{data.item.product.price+'€'}}</span></small>
                </template>
                <template v-slot:cell(offers)="data">
                  <small><span> {{data.item.price+'€'}}</span></small>
                </template>
                <template v-slot:cell(status)="data">
                  <b-badge v-if="data.item.status=='PENDING'" variant="warning">{{getStatusLabel(data.item.status)}}
                  </b-badge>
                  <b-badge v-if="data.item.status=='ACCEPTED'" variant="success">{{getStatusLabel(data.item.status)}}
                  </b-badge>
                  <b-badge v-if="data.item.status=='DENIED'" variant="danger">{{getStatusLabel(data.item.status)}}
                  </b-badge>
                  <b-badge v-if="data.item.status=='FINISHED'" variant="info">{{getStatusLabel(data.item.status)}}
                  </b-badge>
                </template>
              </b-table>
              <b-pagination v-model="currentPageOutbox" :total-rows="totalPagesOutbox" :per-page="recordsPerPageOutbox">
              </b-pagination>
            </div>
            <br>
          </div>
        </b-tab>
      </b-tabs>
      <b-modal size="lg" @hide="loadData()" centered id="modalRating" v-bind:title=this.modalTitle hide-footer>
        <RatingView :requestType="this.requestType" :request="this.request" :seller="this.seller" :buyer="this.buyer" />
      </b-modal>
    </div>
  </b-container>



</template>

<script>
  import RatingView from '@/views/RatingView.vue'
  export default {
    components: {
      RatingView
    },
    data() {
      return {
        email: '',
        isLoading: false,
        error: null,
        listItemsInbox: [],
        listItemsOutbox: [],
        currentPageInbox: 1,
        currentPageOutbox: 1,
        totalPagesInbox: 0,
        recordsPerPageInbox: 5,
        totalPagesOutbox: 0,
        recordsPerPageOutbox: 5,
        noimage: "iVBORw0KGgoAAAANSUhEUgAAAEYAAAAnCAYAAACyhj57AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsEAAA7BAbiRa+0AAAAiSURBVGhD7cExAQAAAMKg9U9tDB8gAAAAAAAAAAAAAHipASrPAAFA2GUnAAAAAElFTkSuQmCC",
        fieldsInbox: [{
            key: "pictureList",
            label: "",
            sortable: false,
            image: true,
            class: "text-center",
            tdClass: "align-middle"
          },
          {
            key: "requestId",
            label: "Id",
            sortable: true,
            class: "text-left",
            tdClass: "align-middle"
          },
          {
            key: "name",
            label: "Comprador",
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
            key: "updatedAt",
            label: "Actualizado",
            class: "text-left",
            sortable: false,
            tdClass: "align-middle"
          },
          {
            key: "offers",
            label: "Oferta",
            class: "text-left",
            sortable: false,
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
            key: "action",
            label: "",
            class: "text-center",
            tdClass: "align-middle"
          },
        ],
        fieldsOutbox: [{
            key: "pictureList",
            label: "",
            sortable: false,
            image: true,
            class: "text-center",
            tdClass: "align-middle"
          },
          {
            key: "requestId",
            label: "Id",
            sortable: true,
            class: "text-left",
            tdClass: "align-middle"
          },
          {
            key: "name",
            label: "Vendedor",
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
            key: "updatedAt",
            label: "Actualizado",
            class: "text-left",
            sortable: false,
            tdClass: "align-middle"
          },
          {
            key: "offers",
            label: "Oferta",
            class: "text-left",
            sortable: false,
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
            key: "action",
            label: "",
            class: "text-center",
            tdClass: "align-middle"
          },
        ],
        params: "",
        productId: null,
        modalTitle: "Nuevo videojuego",
        seller: null,
        buyer: null,
        requestType: null,
        request: null


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
      this.loadData();
    },
    watch: {
      currentPage: {
        handler: function (value) {
          this.params = `page=${value}&size=${this.recordsPerPage}`;
          this.loadBuyInboxRequests();
          this.loadBuyOutboxRequests();
        },
      },
      updated() {
        console.log(this.$route)
      }
    },
    methods: {
      loadData() {
        if (this.isLoggedIn) {
          this.email = this.$store.getters.email;
          this.loadBuyInboxRequests();
          this.loadBuyOutboxRequests();
        }
      },
      getStatusLabel(data) {
        if (data == "PENDING") {
          return "Pendiente";
        }
        if (data == "ACCEPTED") {
          return "Aceptada";
        }
        if (data == "DENIED") {
          return "Denegada";
        }
        if (data == "FINISHED") {
          return "Finalizada";
        }
        return "";
      },
      async loadBuyInboxRequests() {
        this.isLoading = true;
        this.params = `page=${this.currentPage}&size=${this.recordsPerPage}`;
        try {
          await this.$store.dispatch('buyrequest/loadBuyRequests', {
            type: 'seller',
            value: this.email
          });
          this.listItemsInbox = this.$store.getters['buyrequest/getBuyRequestsInbox'];
          if (typeof this.listItemsInbox != "undefined") {
            this.totalPages = this.listItemsInbox.length;
          }
          this.isLoading = false;
        } catch (error) {
          this.error = error.message || 'No se pudo cargar el listado de solicitudes';
          this.isLoading = false;
        }
      },
      async loadBuyOutboxRequests() {
        this.isLoading = true;
        this.params = `page=${this.currentPageOutbox}&size=${this.recordsPerPageOutbox}`;
        try {
          await this.$store.dispatch('buyrequest/loadBuyRequests', {
            type: 'buyer',
            value: this.email
          });
          this.listItemsOutbox = this.$store.getters['buyrequest/getBuyRequestsOutbox'];
          if (typeof this.listItemsOutbox != "undefined") {
            this.totalPagesOutbox = this.listItemsOutbox.length;
          }
          this.isLoading = false;
        } catch (error) {
          this.error = error.message || 'No se pudo cargar el listado de solicitudes';
          this.isLoading = false;
        }
      },
      acceptRequest(data) {
        this.$bvModal
          .msgBoxConfirm("¿Desea ACEPTAR la solicitud " +
            "de " + data.item.price + "€ por el videojuego/consola " +
            data.item.product.name + "?", {
              title: "Aceptar oferta de " + data.item.buyer.email,
              size: "mm",
              buttonSize: "sm",
              okVariant: "success",
              okTitle: "Si",
              cancelTitle: "No",
              footerClass: "p-2",
              hideHeaderClose: false,
              centered: true,
            })
          .then((value) => {
            if (value) {
              this.updateRequest(data, "ACCEPTED");
            }
          });
      },
      endRequest(data) {
        this.$bvModal
          .msgBoxConfirm("¿Desea FINALIZAR la solicitud " +
            "de " + data.item.price + "€ por el videojuego/consola " +
            data.item.product.name + "?", {
              title: "Se marcará el videojuego como vendido",
              size: "mm",
              buttonSize: "sm",
              okVariant: "success",
              okTitle: "Si",
              cancelTitle: "No",
              footerClass: "p-2",
              hideHeaderClose: false,
              centered: true,
            })
          .then((value) => {
            if (value) {
              this.updateRequest(data, "FINISHED");
            }
          });
      },
      cancelRequest(data) {
        this.$bvModal
          .msgBoxConfirm("¿Desea CANCELAR la solicitud " +
            "de " + data.item.price + "€ por el videojuego/consola " +
            data.item.product.name + "?", {
              title: "Cancelar la oferta enviada a " + data.item.seller.email,
              size: "mm",
              buttonSize: "sm",
              okVariant: "danger",
              okTitle: "Si",
              cancelTitle: "No",
              footerClass: "p-2",
              hideHeaderClose: false,
              centered: true,
            })
          .then((value) => {
            if (value) {
              this.deleteBuyRequest(data);
            }
          });
      },
      deleteRequest(data) {
        this.$bvModal
          .msgBoxConfirm("¿Desea ELIMINAR la solicitud " +
            "de " + data.item.price + "€ por el videojuego/consola " +
            data.item.product.name + "?", {
              title: "Elminiar la oferta de " + data.item.buyer.email,
              size: "mm",
              buttonSize: "sm",
              okVariant: "danger",
              okTitle: "Si",
              cancelTitle: "No",
              footerClass: "p-2",
              hideHeaderClose: false,
              centered: true,
            })
          .then((value) => {
            if (value) {
              this.deleteBuyRequest(data);
            }
          });
      },
      isUserRating(data) {
        let nRatings = data.ratings.length;
        for (let i = 0; i < nRatings; i++) {
          if (data.ratings[i].userWhoRate == this.email) {
            return true;
          }
        }
        return false;
      },


      dennyRequest(data) {
        this.$bvModal
          .msgBoxConfirm("¿Desea RECHAZAR la solicitud " +
            "de " + data.item.price + "€ por el videojuego/consola " +
            data.item.product.name + "?", {
              title: "Rechazar oferta de " + data.item.buyer.email,
              size: "mm",
              buttonSize: "sm",
              okVariant: "danger",
              okTitle: "Si",
              cancelTitle: "No",
              footerClass: "p-2",
              hideHeaderClose: false,
              centered: true,
            })
          .then((value) => {
            if (value) {
              this.updateRequest(data, "DENIED");
            }
          });
      },
      async updateRequest(data, state) {
        this.isLoading = true;
        try {
          let request = {
            buyer: data.item.buyer.email,
            seller: data.item.seller.email,
            productId: data.item.product.productId,
            status: state,
            price: data.item.price,
            requestId: data.item.requestId
          }
          await this.$store.dispatch('buyrequest/updateBuyRequest', request);
          this.isLoading = false;
          this.loadBuyInboxRequests();
          this.loadBuyOutboxRequests();
          let product = data.item.product;
          if (state != "DENIED") {
            product.status = (state == "ACCEPTED") ? "RESERVED" : "SOLD";
            await this.$store.dispatch('product/updateProduct', product);
          }
        } catch (error) {
          this.error = error.message || 'No se pudo cargar el listado de solicitudes';
          this.isLoading = false;
        }
      },
      async deleteBuyRequest(data, state) {
        this.isLoading = true;
        try {
          let request = {
            buyer: data.item.buyer.email,
            seller: data.item.seller.email,
            productId: data.item.product.productId,
            status: state,
            price: data.item.price,
            requestId: data.item.requestId
          }
          await this.$store.dispatch('buyrequest/deleteBuyRequest', request);
          this.isLoading = false;
          this.loadBuyInboxRequests();
          this.loadBuyOutboxRequests();
        } catch (error) {
          this.error = error.message || 'No se pudo cargar el listado de solicitudes';
          this.isLoading = false;
        }
      },
      voteBuyer(data) {
        this.seller = data.item.seller;
        this.buyer = data.item.buyer;
        this.modalTitle = "Valora al comprador";
        this.request = data.item;
        this.requestType = "compra";
        this.$bvModal.show('modalRating');
      },
      voteSeller(data) {
        this.seller = data.item.seller;
        this.buyer = data.item.buyer;
        this.modalTitle = "Valora al vendedor";
        this.requestType = "venta";
        this.request = data.item;
        this.$bvModal.show('modalRating');
      },
      getCategoryName(data) {
        return data.name;
      },
      hasPicture(data) {
        if (typeof data.item.product.pictureList != "undefined") {
          return true;
        }
        return false;
      },
      valueToFixed(data) {
        let fixedValue = 0;
        try {
          if (!isNaN(data)) {
            fixedValue = data.toFixed(1);
          }
        } catch (e) {
          console.log(e.message)
        }
        return fixedValue;
      },
      handleError() {
        this.error = null;
      }
    }
  }
</script>