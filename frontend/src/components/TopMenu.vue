<template>
  <v-navigation-drawer app color="primary" dark :width="'auto'" rounded 
      :permanent="$vuetify.breakpoint.mdAndUp"
    :temporary="$vuetify.breakpoint.smAndDown" 
    :mobile-breakpoint="960" >
    <v-list dense class="primary">
      <!-- Logo -->
      <v-list-item class="px-4">
        <v-list-item-content>
          <v-list-item-title class="title white--text">
            <img src="@/assets/logo.png" alt="Logo" style="height: 64px;" />
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <template v-if="isAuthenticated">
        <!-- Grupo Auth -->
        <v-list-group 
          active-class="active-group"
          class="white--text"
        >
          <template v-slot:activator>
            <v-list-item-icon>
              <v-icon class="white--text">mdi-lock</v-icon>
            </v-list-item-icon>
            <v-list-item-title class="white--text">
              Usuários
            </v-list-item-title>
          </template>
          
          <v-list-item 
            to="/users" 
            link
            active-class="v-list-item--active"
            class="white--text"
          >
            <v-list-item-title class="white--text">Usuários</v-list-item-title>
          </v-list-item>
          
          <v-list-item 
            to="/roles" 
            link
            active-class="v-list-item--active"
            class="white--text"
          >
            <v-list-item-title class="white--text">Cargos</v-list-item-title>
          </v-list-item>
        </v-list-group>

        <v-list-item 
          to="/financeiro" 
          link 
          active-class="v-list-item--active"
          class="white--text"
        >
          <v-list-item-icon>
            <v-icon class="white--text">mdi-view-dashboard</v-icon>
          </v-list-item-icon>
          <v-list-item-title class="white--text">Financeiro</v-list-item-title>
        </v-list-item>

        <v-list-item 
          to="/logistica" 
          link 
          active-class="v-list-item--active"
          class="white--text"
        >
          <v-list-item-icon>
            <v-icon class="white--text">mdi-truck</v-icon>
          </v-list-item-icon>
          <v-list-item-title class="white--text">Logistica</v-list-item-title>
        </v-list-item>


        <!-- Botão Sair -->
        <v-list-item @click="handleLogout" link class="white--text">
          <v-list-item-icon>
            <v-icon class="white--text">mdi-logout</v-icon>
          </v-list-item-icon>
          <v-list-item-title class="white--text">Sair</v-list-item-title>
        </v-list-item>
      </template>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
export default {
  name: 'TopMenu',

  computed: {
    isAuthenticated() {
      // Acesso correto sem módulos Vuex
      return this.$store.getters.isAuthenticated
    }
  },

  methods: {
    async handleLogout() {
      try {
        await this.$store.dispatch('logout')
      } catch (error) {
        console.error('Erro durante logout:', error)
      } finally {
        // Garante que a navegação só ocorre se não já estiver em /login
        if (this.$route.path !== '/login') {
          this.$router.replace('/login')
        }
      }
    }
  }
}
</script>
