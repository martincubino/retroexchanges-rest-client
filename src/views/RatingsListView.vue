<template>
<b-container fluid>
  <div class="mt-5">
    <b-tabs>
      <b-tab>
        <template #title>
          <div class="text-center" tdClass="align-middle">
            <h5>Recibidas</h5>
          </div>
        </template>
          <div class="form-group">
          <b-alert :show="!!error" dismissible fade variant="danger">
            <p>{{ error }}</p>
          </b-alert>
          <div>
            <b-table striped hover :items="listItemsReceived" :fields="fieldsReceived"
              :current-page="currentPageReceived" :per-page="5">
              <template v-slot:cell(action)="data">
                <b-button  variant="primary"
                  size="sm" class="mr-1" @click="showBuyRequest(data)"> Ver transaccion</b-button>
              </template>
              <template v-slot:cell(userWhoRate)="data">
                <p><small>{{ data.item.userWhoRate}} </small></p>
                <p><small>{{ data.item.userWhoRateName}}{{ data.item.userWhoRateSurname}}</small></p>
              </template>
              <template v-slot:cell(rating)="data">
                <small>
                <b-form-rating size="sm" readonly icon-empty="hand-thumbs-up" icon-full="hand-thumbs-up-fill"
                             show-clear show-value color="blue" v-model="data.item.rating">
                        </b-form-rating>
                 </small>

              </template>

              <template v-slot:cell(createAt)="data">
                <span><small>{{ new Date(data.item.createAt).toLocaleString()}}</small></span>
              </template>
            </b-table>
            <b-pagination v-model="currentPageReceived" :total-rows="totalPagesReceived"
              :per-page="recordsPerPageReceived">
            </b-pagination>
          </div>
          <br>
        </div>
      </b-tab>
      <b-tab>
        <template #title>
          <div class="text-center" tdClass="align-middle">
            <h5>Emitidas</h5>
          </div>
        </template>
        <div class="form-group">
          <b-alert :show="!!error" dismissible fade variant="danger">
            <p>{{ error }}</p>
          </b-alert>
          <div>
                   <b-table striped hover :items="listItemsSent" :fields="fieldsSent"
              :current-page="currentPageSent" :per-page="5">
              <template v-slot:cell(action)="data">
                <b-button  variant="primary"
                  size="sm" class="mr-1" @click="showBuyRequest(data)"> Ver transaccion</b-button>
              </template>
              <template v-slot:cell(userRated)="data">
                <p><small>{{ data.item.userRated}}</small> </p>
                <p><small>{{ data.item.userRatedName}}{{ data.item.userRatedSurname}}</small> </p>
              </template>
              <template v-slot:cell(rating)="data">
                <small>
                <b-form-rating size="sm" readonly icon-empty="hand-thumbs-up" icon-full="hand-thumbs-up-fill"
                             show-clear show-value color="blue" v-model="data.item.rating">
                        </b-form-rating>
                 </small>

              </template>

              <template v-slot:cell(createAt)="data">
                <span><small>{{ new Date(data.item.createAt).toLocaleString()}}</small></span>
              </template>
            </b-table>
            <b-pagination v-model="currentPageSent" :total-rows="totalPagesSent" :per-page="recordsPerPageSent">
            </b-pagination>
          <br>
          </div>
        </div>
      </b-tab>
    </b-tabs>
</div>
<b-modal size="lg" centered id="modalBuyRequestDetail" v-bind:title=this.modalTitle hide-footer>
            <BuyRequestDetail :buyrequest="this.buyrequest" />
        </b-modal>
  </b-container>

</template>

<script>
  import BuyRequestDetail from '@/views/BuyRequestDetail.vue'
  export default {
    components: {
      BuyRequestDetail
    },
    data() {
      return {
        email: '',
        isLoading: false,
        error: null,
        listItemsReceived: [],
        listItemsSent: [],
        currentPageReceived: 1,
        currentPageSent: 1,
        totalPagesReceived: 0,
        recordsPerPageReceived: 5,
        totalPagesSent: 0,
        recordsPerPageSent: 5,
        fieldsReceived: [
          {
            key: "createAt",
            label: "Fecha y hora",
            class: "text-left",
            sortable: false,
            tdClass: "align-middle"
          },
          {
            key: "userWhoRate",
            label: "Valorado por",
            sortable: true,
            class: "text-left",
            tdClass: "align-middle"
          },
          {
            key: "rating",
            label: "Valoración",
            class: "text-left",
            sortable: true,
            tdClass: "align-middle"
          },
          {
            key: "action",
            label: "",
            class: "text-center",
            tdClass: "align-middle"
          }
        ],
        fieldsSent: [
          {
            key: "createAt",
            label: "Fecha y hora",
            class: "text-left",
            sortable: false,
            tdClass: "align-middle"
          },
          {
            key: "userRated",
            label: "Usuario valorado",
            sortable: true,
            class: "text-left",
            tdClass: "align-middle"
          },
          {
            key: "rating",
            label: "Valoración",
            class: "text-left",
            sortable: true,
            tdClass: "align-middle"
          },
          {
            key: "action",
            label: "",
            class: "text-center",
            tdClass: "align-middle"
          }
        ],
        params: "",
        buyrequest: null,
        modalTitle: "Detalle de la transacción",
      }
    },
    computed: {
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
          this.loadReceivedRatings();
          this.loadSentRatings();
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
          this.loadReceivedRatings();
          this.loadSentRatings();
        }
      },
      async loadReceivedRatings() {
        this.isLoading = true;
        this.paramsReceived = `page=${this.currentPageReceived}&size=${this.recordsPerPageReceived}`;
        try {
          await this.$store.dispatch('rating/loadRatings', {
            type: 'received',
            value: this.email
          });
          this.listItemsReceived = this.$store.getters['rating/getRatingsReceived'];
          if (typeof this.listItemsReceived != "undefined") {
            this.totalPagesReceived = this.listItemsReceived.length;
          }
          this.isLoading = false;
        } catch (error) {
          this.error = error.message || 'No se pudo cargar el listado de valoraciones';
          this.isLoading = false;
        }
      },
      async loadSentRatings() {
        this.isLoading = true;
        this.paramsSent = `page=${this.currentPageSent}&size=${this.recordsPerPageSent}`;
        try {
          await this.$store.dispatch('rating/loadRatings', {
            type: 'sent',
            value: this.email
          });
          this.listItemsSent = this.$store.getters['rating/getRatingsSent'];
          if (typeof this.listItemsSent != "undefined") {
            this.totalPagesSent = this.listItemsSent.length;
          }
          this.isLoading = false;
        } catch (error) {
          this.error = error.message || 'No se pudo cargar el listado de valoraciones';
          this.isLoading = false;
        }
      },
      showBuyRequest(data){
        this.buyrequest = data.item.buyRequest;
        this.$bvModal.show('modalBuyRequestDetail');
      },
      handleError() {
        this.error = null;
      }
    }
  }
</script>