<template>
    <div class="container">
        <h1 class="text-center"> Listado de categorías </h1>
        <table class="table table-striped">
            <thead>
                <th> Id </th>
                <th> Nombre</th>
                <th> Descripcion </th>
                <th> Logo </th>

            </thead>
            <tbody>
                <tr v-for="c in categories " v-bind:key="c.categoryId">
                    <td> {{c.categoryId}} </td>
                    <td> {{c.name}} </td>
                    <td> {{c.description}} </td>
                    <td> <img :src="`data:image/png;base64,${c.image}`" /></td>
                </tr>
            </tbody>
        </table>
        <div id="app" class="p-3">
            <b-form-select v-model="selected" v-on:change="getSelectedItem">
                <option :value="null" >-- Todas las categorías --</option>
                <option v-for="c in categories" :value="c" v-bind:key="c.categoryId">
                  <img :src="`data:image/png;base64,${c.image}`" />
                  {{c.name}}
                </option>
            </b-form-select>
            
             {{ category}}
        </div>
    </div>
</template>

<script>
    import CategoryService from '@/services/CategoryService'

    export default {
        name: 'CategoryItems',
        data() {
            return {
                categories: [],
                selected: null,
                category: null
            }
        },
        methods: {
            getSelectedItem(id){
                console.log(id);
                let categoryId = JSON.parse(id).categoryId;
                CategoryService.getCategory(categoryId).then((response) => {
                    this.category = response.data;
                });
            },
            getCategories() {
                CategoryService.getCategories().then((response) => {
                    this.categories = response.data;
                });
            }
        },
        created() {
            this.getCategories()
        }
    }
</script>