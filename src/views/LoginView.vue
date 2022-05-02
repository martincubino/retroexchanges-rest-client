<template>
    <main class="form-signin">
        <div class="card">
            <div class="card-body m-4 p-4">
                <form >
                    <h2 class="h3 mb-3 fw-normal text-center">Iniciar sesión</h2>
                    <div class="form-group">
                        <label>Dirección de correo</label>
                        <input type="email" class="form-control form-control-lg" placeholder="email" />
                    </div>
                    <div class="form-group">
                        <label>Contraseña</label>
                        <input type="password" class="form-control form-control-lg" placeholder="contraseña" />
                    </div>
                    <b-row>
                        <b-col>
                            <router-link class="w-100 btn btn-lg btn-primary" type="submit" to="/profile">Iniciar sesión
                            </router-link>
                        </b-col>
                        <b-col>
                            <router-link class="w-100 btn btn-lg btn-secondary" type="submit" to="/home">Cancelar
                            </router-link>
                        </b-col>

                    </b-row>
                </form>
            </div>
        </div>
    </main>
</template>

<script>
    export default {
        data() {
            return {}
        },
        methods: {

        }
    }
</script>

<style lang="css">
    body {

        align-items: center;
        background-color: #f6f6f6;
    }

    .form-signin {
        width: 100%;
        max-width: 450px;
        margin: auto;
    }

    label {
        font-weight: 600;
    }
</style>