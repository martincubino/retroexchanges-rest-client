<template>
    <div class="form-group">
        <div class="ml-5 ">
            <b-form @submit="onSubmit">
                <div v-if="isLoading">
                    <b-spinner>Cargando...</b-spinner>
                </div>
                <b-alert :show="!!error" dismissible fade variant="danger">
                    <p>{{ error }}</p>
                </b-alert>
                <b-alert :show="!formIsValid" dismissible fade variant="danger">
                    <p>{{formFormatWarning}}</p>
                </b-alert>

                <b-alert :show="dismissCountDown" dismissible variant="success" @dismissed="dismissCountDown=0"
                    @dismiss-count-down="countDownChanged">
                    <p>Los datos se guardaron correctamente</p>
                    <b-progress variant="success" :max="dismissSecs" :value="dismissCountDown" height="4px">
                    </b-progress>
                </b-alert>
                <template v-if="this.requestType=='compra'">
                <h5> {{request.buyer.name}} {{request.buyer.surname}} ({{request.buyer.email}})</h5>
                <h5> por la compra de </h5>
                <br>
                <p> {{product.description}}</p>
                <h6>Al precio de {{request.price+'€'}}</h6>
                <br>
                </template>
                <template v-if="this.requestType=='venta'">
                <h5> {{request.seller.name}} {{request.seller.surname}} ({{request.seller.email}})</h5>
                <h5> por la venta de </h5>
                <br>
                <p> {{product.description}}</p>
                <h6>Al precio de {{request.price+'€'}}</h6>
                <br>
                </template>
                <template>
                    <div>
                        <p class="mt-2">Valoración: {{ rating }}</p>
                        <b-form-rating size="lg" icon-empty="hand-thumbs-up" icon-full="hand-thumbs-up-fill"
                             show-clear show-value color="blue" v-model="rating">
                        </b-form-rating>
                    </div>
                </template>
                <div slot="modal-footer" class="w-100">
                    <br>
                    <p class="float-left"></p>
                    <b-button size="mt-2 md mr-2" class="float-right" variant="primary" @click="onSubmit">
                        Votar
                    </b-button>
                </div>

            </b-form>
        </div>
    </div>
</template>

<script>
    export default {
        props: {
            request: Object,
            requestType: String
        },
        components: {},
        data() {
            return {
                isLoading: false,
                dismissSecs: 3,
                dismissCountDown: 0,
                showDismissibleAlert: false,
                formFormatWarning: null,
                error: null,
                formIsValid: true,
                product: this.request.product,
                rating:null
            }
        },
        computed: {
            isLoggedIn() {
                return this.$store.getters.isAuthenticated;
            },
        },
        created() {
            this.price = this.product.price;
            this.email = this.$store.getters.email;
            if (this.$store.getters.isAuthenticated) {
                this.categories = this.$store.getters['category/getCategories'];
                this.owner = this.$store.getters.email;
                if (this.new == false) {
                    this.loadProduct();
                }
            } else {
                const redirectUrl = '/' + (this.$route.query.redirect || 'login');
                this.$router.replace(redirectUrl);
            }
        },
        methods: {
            countDownChanged(dismissCountDown) {
                this.dismissCountDown = dismissCountDown
                if(this.dismissCountDown==0){
                    this.$root.$emit('bv::hide::modal','modalRating');
                }
            },
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
            showAlert() {
                this.dismissCountDown = this.dismissSecs
            },
            goHome() {
                const redirectUrl = '/';
                this.$router.replace(redirectUrl);
            },
            async onSubmit() {
                this.handleError();

                let rating = {};
                if (this.requestType == "compra") {
                    rating = {
                        userRated: this.request.buyer.email,
                        userWhoRate: this.request.seller.email,
                        buyRequestId: this.request.requestId,
                        rating: this.rating
                    }
                }
                if (this.requestType == "venta") {
                    rating = {
                        userRated: this.request.seller.email,
                        userWhoRate: this.request.buyer.email,
                        buyRequestId: this.request.requestId,
                        rating: this.rating
                    }
                }

                try {
                    await this.$store.dispatch('rating/createRating', rating);
                    this.showAlert();
                } catch (error) {
                    this.error = error.message || 'No se pudo actualizar la información de la product';
                }

            },
            async loadProduct() {
                this.isLoading = true;
                try {
                    await this.$store.dispatch('product/loadProduct', this.id);
                } catch (error) {
                    this.error = error.message || 'No se pudo recuperar la información del videojuego';
                }
                this.isLoading = false;
                let product = this.$store.getters['product/getProduct'];
                this.name = product.name;
                this.description = product.description;
                this.createAt = product.createAt;
                this.updatedAt = product.updatedAt;
                this.productId = product.productId;
                this.owner = product.owner;
                this.price = product.price;
                this.category = product.category;
                this.categoryId = this.category.categoryId;
                this.status = product.status;
                this.pictureList = product.pictureList;
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