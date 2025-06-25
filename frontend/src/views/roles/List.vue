<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-card-title>
            Cargos
            <v-spacer></v-spacer>
            <v-btn color="primary" to="/roles/edit">Adicionar Cargo</v-btn>
          </v-card-title>
          
          <v-data-table
            :headers="headers"
            :items="roles"
            :items-per-page="10"
            :loading="loading"
            class="elevation-1"
          >
            <template v-slot:item.actions="{ item }">
              <v-icon small class="mr-2" @click="editRole(item.id)">
                mdi-pencil
              </v-icon>
            </template>
          </v-data-table>
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
      headers: [
        { text: 'Nome', value: 'name' },
        { text: 'Descrição', value: 'description' },
        { text: 'Ações', value: 'actions', sortable: false }
      ],
      roles: [],
      loading: false
    }
  },
  async created() {
    await this.fetchRoles()
  },
  methods: {
    async fetchRoles() {
      this.loading = true
      try {
        const response = await rolesService.getRoles()
        this.roles = response.data.roles
      } catch (error) {
        console.error('Erro ao carregar cargos:', error)
      } finally {
        this.loading = false
      }
    },
    editRole(id) {
      this.$router.push(`/roles/edit/${id}`)
    }
  }
}
</script>
