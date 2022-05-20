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
                <b-row>
                    <b-col cols="11">
                        <b-form-group id="input-group-3" label="Imagen:" label-for="input-3">
                            <b-card>
                                <div v-if="image">
                                    <b-img center :src="`data:image/png;base64,${image}`" />
                                    <b-button size="sm" class="float-right" variant="secondary" @click="removeImage()">
                                        Borrar imagen</b-button>
                                </div>
                                <div v-else>
                                    <b-form-file size="sm" @change="onFileChange" browse-text="Buscar"
                                        accept="image/png" v-model="file1" :state="Boolean(file1)"
                                        placeholder="Seleccione un fichero de imagen (png) o arrastrelo aqui..."
                                        drop-placeholder="Arrastre el fichero aqui..."></b-form-file>
                                    <div v-if="!!file1" class="mt-3">Archivo seleccionado: {{ file1 ? file1.name : '' }}
                                    </div>
                                </div>
                            </b-card>
                            <br>
                        </b-form-group>
                    </b-col>
                    <b-col cols="11">
                        <b-form-group id="input-group-1" label="Nombre:" label-for="input-1">
                            <b-form-input id="input-1" v-model="name" type="text"
                                placeholder="Introduzca el nombre del videojuego o consola" required>
                            </b-form-input>
                        </b-form-group>
                        <b-form-group id="input-group-2" label="Descripción:" label-for="input-2">
                            <b-form-textarea rows="3" max-rows="5" id="input-2" v-model="description" type="text"
                                placeholder="Introduzca la descripción del videojuego o consola" required>
                            </b-form-textarea>
                        </b-form-group>
                        <div>
                            <b-form-select v-model="categoryId" :options="categories" text-field="name" value-field="categoryId" required ></b-form-select>
                            <div class="mt-3">Selected: <strong>{{ selected }}</strong></div>
                        </div>
                    </b-col>
                    <b-col cols="4">
                        <b-form-group id="input-group-4" label="Precio:" label-for="input-4">
                            <b-form-input id="input-4" v-model="price" type="number" placeholder="Introduzca el precio"
                                required>
                            </b-form-input>
                        </b-form-group>
                    </b-col>
                </b-row>
                <div slot="modal-footer" class="w-100">
                    <br>
                    <p class="float-left"></p>
                    <b-button size="mt-2 md mr-2" class="float-right" variant="primary" @click="onSubmit">
                        Guardar
                    </b-button>
                </div>

            </b-form>
        </div>
    </div>
</template>

<script>
    export default {
        props: {
            id: Number,
            new: Boolean
        },
        components: {},
        data() {
            return {
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
                categoryId: null,
                imageUploaded: null,
                prod: null,
                formIsValid: true,
                file1: null
            }
        },
        computed: {
            isLoggedIn() {
                return this.$store.getters.isAuthenticated;
            },
        },
        created() {
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
                    categoryId: this.categoryId,
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
                    product.status="AVAILABLE";
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
                this.categoryId = product.categoryId;
            },
            onFileChange(e) {
                var files = e.target.files || e.dataTransfer.files;
                if (!files.length)
                    return;
                this.file1 = files[0];
                this.createImage(files[0]);
            },
            createImage(file) {
                var reader = new FileReader();
                var vm = this;

                reader.onload = (e) => {
                    vm.image = e.target.result;
                    let imageURI = this.image.split(',');
                    vm.image = imageURI[1];

                };
                reader.readAsDataURL(file);
            },
            removeImage: function () {
                this.image = '';
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
</style>