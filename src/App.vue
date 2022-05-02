<template>
  <div id="app">
    <b-navbar toggleable="sm" type="dark" variant="info">
      <b-navbar-brand :to="{name:'home'}" exact>
        <img src="@/assets/images/logo.png" alt="RetroExchanges">
      </b-navbar-brand>
      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
      <b-collapse id="nav-collapse" is-nav>
        <!--<b-navbar-nav>
          <b-nav-item :to="{name:'home'}" exact>Inicio</b-nav-item>
          <b-nav-item :to="{name:'about'}">Acerca de...</b-nav-item>
        </b-navbar-nav>-->
        <b-navbar-nav class="md-auto">
            <b-input-group class="shadow-lg">
              <b-input-group-prepend is-text>
                <b-icon icon="search"></b-icon>
              </b-input-group-prepend>
              <b-form-input type="search" placeholder="¿Qué estas buscando?"></b-form-input>
            </b-input-group>
        </b-navbar-nav>
        <b-navbar-nav small class="ml-auto">
          <b-nav-form>
            <b-nav-item class="text-center" :to="{name:'login'}" exact>
              <p></p><b-icon icon="person"></b-icon><p>Iniciar sesion</p>
            </b-nav-item>
          </b-nav-form>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>

    <router-view />
  </div>
</template>