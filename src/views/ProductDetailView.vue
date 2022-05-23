<template>
    <div>
        <b-col>
            <b-container class="carrousel">
                <b-carousel style="text-shadow: 1px 1px 2px #333;" v-model="slide" id="carousel" :no-wrap="false"
                    :controls="true" :interval="5000" :indicators=true>

                    <b-carousel-slide v-for="item in pictureList" :key="item.picture" :caption="category.name"
                        class=".img_slide" :img-src="`data:image/png;base64,${item.picture}`">
                    </b-carousel-slide>
                </b-carousel>

            </b-container>
        </b-col>
        <b-container>
            <div v-if="isLoading">
                <b-spinner>Cargando...</b-spinner>
            </div>
            <br><br><br><br><br><br><br>

            <b-card class="md">
                <b-col cols=4>
                    <b-form-checkbox @input="setFavorite" v-model="favorite" switch size="lg">
                        <p v-if="favorite" style="color:red">
                            <font-awesome-icon icon="fa-solid fa-heart" />
                            En mis favoritos
                        </p>
                        <p v-else style="color:gray">
                            <font-awesome-icon icon="fa-solid fa-heart" />
                        </p>
                    </b-form-checkbox>

                    <h5>{{price+'€'}}</h5>
                    <h6> {{name}}</h6>
                    <p> {{description}}</p>
                    <b-badge v-if="status=='AVAILABLE'" variant="success">
                        Disponible
                    </b-badge>
                    <b-badge v-if="status=='RESERVED'" variant="warning">
                        Reservado
                    </b-badge>
                    <b-badge v-if="status=='SOLD'" variant="secondary">
                        Vendido
                    </b-badge>
                    <b-badge v-if="owner == email " variant="warning">
                        Eres el propietario
                    </b-badge>
                </b-col>
            </b-card>
        </b-container>
    </div>
</template>

<script>
    export default {
        components: {},
        data() {
            return {
                fields: [{
                        key: "picture",
                        label: "",
                        sortable: false,
                        image: true,
                        class: "text-center",
                        tdClass: "align-middle"
                    },
                    {
                        key: "action",
                        label: "",
                        class: "text-center",
                        tdClass: "align-middle"
                    },
                ],
                isLoading: false,
                dismissSecs: 5,
                dismissCountDown: 0,
                showDismissibleAlert: false,
                formFormatWarning: null,
                categories: [],
                error: null,
                name: null,
                description: null,
                price: null,
                owner: null,
                image: null,
                category: null,
                categoryName: null,
                categoryId: null,
                imageUploaded: null,
                formIsValid: true,
                files: [],
                pictureList: [],
                slide: 0,
                sliding: null,
                file1: null,
                status: null,
                favorite: false,
                email: null

            }
        },
        computed: {
            isLoggedIn() {
                return this.$store.getters.isAuthenticated;
            },
        },
        created() {
            this.id = this.$route.query.product;
            this.categories = this.$store.getters['category/getCategories'];
            this.email = this.$store.getters.email;
            this.loadProduct();
        },
        methods: {
            countDownChanged(dismissCountDown) {
                this.dismissCountDown = dismissCountDown
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
                let product = {
                    name: this.name,
                    description: this.description,
                    owner: this.owner,
                    price: this.price,
                    category: this.categories.find(x => x.categoryId === this.categoryId),
                    pictureList: this.pictureList,
                    status: this.status
                }
                if (this.new == false) {
                    try {
                        product.productId = this.productId;
                        await this.$store.dispatch('product/updateProduct', product);
                        //event.preventDefault()
                        this.showAlert();
                    } catch (error) {
                        this.error = error.message || 'No se pudo actualizar la información de la product';
                    }
                } else {
                    product.status = "AVAILABLE";
                    try {
                        await this.$store.dispatch('product/createProduct', product);
                        //event.preventDefault()
                        this.showAlert();
                    } catch (error) {
                        this.error = error.message || 'No se pudo recuperar la información de la categoria';
                    }
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
                this.categoryId = product.category.categoryId;
                this.categoyName = product.category.name;
                this.status = product.status;
                this.pictureList = product.pictureList;
                console.log(this.pictureList);
                this.loadFavorite();

            },
            async loadFavorite() {
                this.isLoading = true;
                let favorite;
                let fav = {
                            productId : this.productId,
                            email : this.email
                        }
                try {
                    await this.$store.dispatch('favorite/loadFavorite', fav);
                     favorite = this.$store.getters['favorite/getFavorite'];
                } catch (error) {
                    console.log("No es favorito de "+this.email);
                }
                try {
                    await this.$store.dispatch('favorite/loadFavorites', fav);
                } catch (error) {
                    console.log("No es favorito de "+this.email);
                }
                this.isLoading = false;
                console.log(favorite);
                if (typeof favorite !="undefined"){
                    this.favorite=true;
                }else{
                    this.favorite = false;
                }

            },
            async setFavorite(state) {
                console.log(state);
                let favorite = {
                            productId : this.productId,
                            email : this.email
                        }
                if (state==true){
                  try {
                        await this.$store.dispatch('favorite/createFavorite', favorite);
                    } catch (error) {
                        console.log(error);
                    }   
                }else{
                    try {
                        await this.$store.dispatch('favorite/deleteFavorite', favorite);
                    } catch (error) {
                        console.log(error);
                    }
                }
            },
            handleError() {
                this.error = null;
            }
        }
    }
</script>
<style>
    .carousel-inner>.item>img {
        width: 640px;
        height: 360px;
    }

    .carousel {
        width: 640px;
        height: 360px;
    }
</style>