<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-card-title>
            {{ isEditing ? 'Editar Cargo' : 'Novo Cargo' }}
          </v-card-title>
          <v-card-text>
            <v-alert
              v-if="errorMessage"
              type="error"
              dismissible
              class="mb-4"
              @input="errorMessage = ''"
            >
              {{ errorMessage }}
            </v-alert>
            <v-form ref="form" @submit.prevent="save">
              <v-text-field
                v-model="role.name"
                label="Nome"
                required
                :rules="[v => !!v || 'Nome é obrigatório']"
              ></v-text-field>
              <v-text-field
                v-model="role.description"
                label="Descrição"
                required
                :rules="[v => !!v || 'Descrição é obrigatória']"
              ></v-text-field>
              <v-btn type="submit" color="primary">
                {{ isEditing ? 'Salvar' : 'Adicionar' }}
              </v-btn>
              <v-btn text @click="$router.push('/roles')">Cancelar</v-btn>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import rolesService from '@/services/roles'

export default {
  data() {
    return {
      role: {
        id: null,
        name: '',
        description: '',
      },
      isEditing: false,
      errorMessage: ''
    }
  },
  async created() {
    if (this.$route.params.id) {
      this.isEditing = true
      await this.fetchRole(this.$route.params.id)
    }
  },
  methods: {
    async fetchRole(id) {
      try {
        const response = await rolesService.getRole(id)
        this.role = response.data.role
      } catch (error) {
        this.errorMessage = 'Erro ao carregar cargo. Tente novamente mais tarde.'
        console.error('Erro ao carregar cargo:', error)
      }
    },
    async save() {
      const form = this.$refs.form
      if (form && !(await form.validate())) return

      try {
        if (this.isEditing) {
          await rolesService.putRole(this.role)
        } else {
          await rolesService.postRole(this.role)
        }
        this.$router.push('/roles')
      } catch (error) {
        this.errorMessage = 'Erro ao salvar cargo'
        console.error('Erro ao salvar cargo:', error)
      }
    }
  }
}
</script>