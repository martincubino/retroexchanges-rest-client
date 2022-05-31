<template>
    <div class="form-group">
        <div class="ml-5 ">
            <b-form>
                <div v-if="isLoading">
                    <b-spinner>Cargando...</b-spinner>
                </div>
                <div v-if="this.request">
                    <b-col cols=10>
                        <h4> Comprador </h4>
                        <h6>{{buyer.name}} {{buyer.surname}} ({{buyer.email}})</h6>

                        <h4> Vendedor</h4>
                        <h6> - {{seller.name}} {{seller.surname}} ({{seller.email}})</h6>
                        <br>
                    </b-col>
                    <br>
                    <b-col cols=10>
                        <h4>Videojuego/Consola</h4>
                        <h6> - {{this.request.product.description}}</h6>
                        <br>
                        <h6>Precio del vendedor {{this.request.product.price+'€'}} - Vendido por
                            {{this.request.price+'€'}}</h6>
                    </b-col>
                </div>
                <div slot="modal-footer" class="w-100">
                    <br>
                    <p class="float-left"></p>
                    <b-button size="mt-2 md mr-2" class="float-right" variant="primary" @click="onClose">
                        Cerrar
                    </b-button>
                </div>

            </b-form>
        </div>
    </div>
</template>

<script>
    export default {
        props: {
            buyrequest: Number
        },
        components: {},
        data() {
            return {
                isLoading: false,
                error: null,
                request: null,
                buyer: null,
                seller: null,
                name: ''
            }
        },
        computed: {
            isLoggedIn() {
                return this.$store.getters.isAuthenticated;
            },
        },
        created() {
            if (this.$store.getters.isAuthenticated) {
                this.loadBuyRequest();
            } else {
                const redirectUrl = '/' + (this.$route.query.redirect || 'login');
                this.$router.replace(redirectUrl);
            }
        },
        methods: {
            onClose() {
                this.$root.$emit('bv::hide::modal', 'modalBuyRequestDetail');
            },
            goHome() {
                const redirectUrl = '/';
                this.$router.replace(redirectUrl);
            },
            async loadBuyRequest() {
                this.isLoading = true;
                try {
                    await this.$store.dispatch('buyrequest/loadBuyRequest', this.buyrequest);
                } catch (error) {
                    this.error = error.message || 'No se pudo recuperar la información del videojuego';
                }
                this.isLoading = false;
                this.request = this.$store.getters['buyrequest/getBuyRequest'];
                this.seller = this.request.seller;
                this.buyer = this.request.buyer;
            },
            handleError() {
                this.error = null;
            },
        }
    }
</script>
<style scoped>
    @media (min-width: 500) {
        .modal .modal-huge {
            max-width: 90% !important;
            width: 90% !important;
            ;
        }
    }

    .hidden_header {
        display: none;
    }
</style>