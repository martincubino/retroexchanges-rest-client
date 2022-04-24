<template>
    <div class = "container">
        <h1 class = "text-center"> Listado de usuarios </h1>
        <table class="table table-striped">
            <thead>
                <th> email </th>
                <th> Name </th>
                <th> Surname </th>
                <th> Address </th>
                <th> NIF </th>
                
            </thead>
            <tbody>
                <tr v-for = "user in users " v-bind:key = "user.email">
                    <td> {{user.email}} </td>
                    <td> {{user.name}} </td>
                    <td> {{user.surname}} </td>
                    <td> {{user.address}} </td>
                    <td> {{user.nif}} </td>
                    
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
import UserService from '../services/UserService'

export default{
    name: 'UsersItems',
    data(){
        return{
            users : []
        }
    },
    methods:{
        getUsers() {
            UserService.getUsers().then((response)=>{
                this.users = response.data;
            });
        }
    },
    created(){
        this.getUsers()
    }
}
</script>

