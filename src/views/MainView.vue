<template>
    <div>
        <b-alert :show="!!error" dismissible fade variant="danger">
            <p>{{ error }}</p>
        </b-alert>
        <div>
            <b-container fluid>
                
                <b-form-select class="mt-2" id="input-1" v-model="categoryId" :options="categories" type="select"
                    text-field="name" value-field="categoryId" @change="filterProducts()" required></b-form-select>

                <b-table striped hover :items="listItems" :fields="fields" :current-page="currentPage" :per-page="2">
                    <template v-slot:cell(action)="data">
                        <b-button variant="info" class="mr-1" @click="showProduct(data)"> Mas información </b-button>
                    </template>

                    <template v-slot:cell(pictureList)="data">
                        <b-card img-height="250" img-width="320" class="text-center position-relative">
                            <b-img v-if="(data.item.pictureList.length>0)"
                                :src="`data:image/png;base64,${data.item.pictureList[0].picture}`" width="auto"
                                height="250" />
                            <b-img v-else :src="`data:image/png;base64,${noimage}`" width="120" height="auto" />
                        </b-card>
                    </template>
                    <template v-slot:cell(category)="data">
                        <p v-if="data.item.category">{{ data.item.category.name }}</p>
                    </template>
                    <template v-slot:cell(createAt)="data">
                        <span>{{ new Date(data.item.createAt).toLocaleString() }}</span>
                    </template>
                    <template v-slot:cell(updatedAt)="data">
                        <span>{{ new Date(data.item.updatedAt).toLocaleString() }}</span>
                    </template>
                    <template v-slot:cell(name)="data">
                        <h5>{{data.item.price+'€'}}</h5>
                        <h6> {{data.item.name}}</h6>
                        <p> {{data.item.description}}</p>
                        <b-badge v-if="data.item.status=='AVAILABLE'" variant="success">
                            {{getStatusLabel(data.item.status)}}
                        </b-badge>
                        <b-badge v-if="data.item.status=='RESERVED'" variant="warning">
                            {{getStatusLabel(data.item.status)}}
                        </b-badge>
                        <b-badge v-if="data.item.status=='SOLD'" variant="secondary">
                            {{getStatusLabel(data.item.status)}}
                        </b-badge>
                        <br>
                        <b-badge v-if="data.item.owner == email " variant="warning">
                            Eres el propietario
                        </b-badge>
                        <b-badge v-else>
                            Vendido por {{data.item.owner}}
                        </b-badge>
                        <br>

                    </template>
                </b-table>
                <b-pagination v-model="currentPage" :total-rows="totalPages" :per-page="recordsPerPage">
                </b-pagination>
            </b-container>
        </div>
        <b-modal size="xl" @hide="loadProducts" centered id="modalProduct" v-bind:title=this.modalTitle hide-footer>
            <ProductDetailView :id="this.productId" />
        </b-modal>

    </div>

</template>

<script>
    import ProductDetailView from '@/views/ProductDetailView.vue'
    export default {
        components: {
            ProductDetailView
        },
        data() {
            return {
                categoryId: null,
                email: '',
                isLoading: false,
                error: null,
                listItems: [],
                categories: [],
                currentPage: 1,
                totalPages: 0,
                recordsPerPage: 2,
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
                        label: "Categoria",
                        sortable: true,
                        class: "text-left",
                        tdClass: "align-middle"
                    },
                    {
                        key: "name",
                        label: "Información",
                        sortable: false,
                        class: "text-left",
                        tdClass: "align-middle"
                    },
                    {
                        key: "updatedAt",
                        label: "Ultima modificación",
                        sortable: true,
                        class: "text-left",
                        tdClass: "align-middle",
                        sortDesc: true
                    },

                    {
                        key: "action",
                        label: "",
                        tdClass: "align-middle"
                    },
                ],
                params: "",
                productId: null,
                modalTitle: "",
                slide: 0,
                isAdmin: false
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
                this.isAdmin = this.$store.getters;
            }
            this.loadCategories();

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
            async filterProducts(){
                this.handleError();
                if (this.categoryId!=null){
                let params = {
                    type: 'category',
                    value: this.categoryId
                }
                this.loadProducts(params);
                }else{
                    this.loadProducts();
                }
            },
            async loadCategories() {
                try {
                    await this.$store.dispatch('category/loadCategories');
                    this.categories = this.$store.getters['category/getCategories'];
                    let c = {
                        categoryId: null,
                        createAt: null,
                        description: null,
                        id: null,
                        image: 'null',
                        name: 'Todas las categorías',
                        updatedAt: null
                    }
                    this.categories.unshift(c);
                    this.loadProducts();
                } catch (error) {
                    console.log(error);
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
            async loadProducts(params) {
                this.isLoading = true;
                this.params = `page=${this.currentPage}&size=${this.recordsPerPage}`;

                try {
                    await this.$store.dispatch('product/loadProducts',params);
                    this.listItems = this.$store.getters['product/getProducts'];
                    this.totalPages = this.listItems.length;
                    this.isLoading = false;
                } catch (error) {
                    this.error = error.message || 'No se pudo cargar el listado de productos';
                    this.isLoading = false;
                }
            },
            showProduct(data) {
                let routeData = this.$router.resolve({
                    name: 'productDetail',
                    query: {
                        product: data.item.productId
                    }
                });
                window.open(routeData.href, '_blank');
            },
            handleError() {
                this.error = null;
            }
        }
    }
</script>
<style>
</style>