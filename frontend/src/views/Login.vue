<template>
  <v-container class="fill-height" fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="4">
        <v-card class="elevation-12">
          <v-toolbar color="primary" dark flat centered>
            <v-toolbar-title>Login</v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <v-form @submit.prevent="handleLogin">
              <v-text-field
                v-model="credentials.email"
                label="E-mail"
                type="email"
                required
              />
              <v-text-field
                v-model="credentials.password"
                label="Senha"
                type="password"
                required
              />
              <v-alert
                v-if="error"
                type="error"
                dense
                class="mb-4"
              >
                {{ error }}
              </v-alert>
              <v-btn
                type="submit"
                color="primary"
                block
                :loading="isLoading"
              >
                Entrar
              </v-btn>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      credentials: {
        email: '',
        password: ''
      },
      isLoading: false,
      error: null
    }
  },
  computed: {
    isAuthenticated() {
      return this.$store.getters.isAuthenticated
    }
  },
  methods: {
    async handleLogin() {
      this.isLoading = true
      this.error = null

      try {
        await this.$store.dispatch('login', this.credentials)

        // Evita erro se já estiver na rota
        if (this.$route.path !== '/users') {
          this.$router.push('/users')
        }
      } catch (error) {
        this.error = error.response?.data?.message || 'Falha no login. Verifique suas credenciais.'
        console.error('Erro ao fazer login:', error)
      } finally {
        this.isLoading = false
      }
    }
  },
  created() {
    if (this.isAuthenticated && this.$route.path !== '/users') {
      this.$router.replace('/users')
    }
  }
}
</script>
