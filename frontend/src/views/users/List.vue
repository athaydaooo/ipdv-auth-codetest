<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-card-title>
            Usuários
            <v-spacer></v-spacer>
            <v-btn color="primary" to="/users/edit">Adicionar Usuário</v-btn>
          </v-card-title>
          
          <v-data-table
            :headers="headers"
            :items="users"
            :items-per-page="10"
            class="elevation-1"
          >
            <template v-slot:item.active="{ item }">
              <v-icon :color="item.isActive ? 'green' : 'grey'">
                {{ item.isActive ? 'mdi-check-circle' : 'mdi-cancel' }}
              </v-icon>
            </template>
            <template v-slot:item.role="{ item }">
              <span v-if="Array.isArray(item.role)">
                {{ item.role.join(', ') }}
              </span>
              <span v-else>
                {{ item.role }}
              </span>
            </template>
            <template v-slot:item.actions="{ item }">
              <v-icon small class="mr-2" @click="editUser(item.id)">
                mdi-pencil
              </v-icon>
              <v-icon small @click="openDeleteDialog(item)">
                mdi-delete
              </v-icon>
            </template>
          </v-data-table>
        </v-card>
      </v-col>
    </v-row>

    <!-- Modal de confirmação -->
    <v-dialog v-model="deleteDialog" max-width="400">
      <v-card>
        <v-card-title class="headline">Confirmar</v-card-title>
        <v-card-text>
          Tem certeza que deseja dasabilitar o usuário <strong>{{ userToDelete?.name }}</strong>?
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="deleteDialog = false">Cancelar</v-btn>
          <v-btn color="red" text @click="confirmDelete">Excluir</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import usersService from '@/services/users'

export default {
  data() {
    return {
      headers: [
        { text: 'Ativo', value: 'active' },
        { text: 'Nome', value: 'name' },
        { text: 'E-mail', value: 'email' },
        { text: 'Cargo', value: 'roles' },
        { text: 'Ações', value: 'actions', sortable: false }
      ],
      users: [],
      loading: false,
      deleteDialog: false,
      userToDelete: null
    }
  },
  async created() {
    await this.fetchUsers()
  },
  methods: {
    async fetchUsers() {
      this.loading = true
      try {
        const response = await usersService.getUsers()
        this.users = response.data.users
      } catch (error) {
        console.error('Erro ao carregar usuários:', error)
      } finally {
        this.loading = false
      }
    },
    editUser(id) {
      this.$router.push(`/users/edit/${id}`)
    },
    openDeleteDialog(user) {
      this.userToDelete = user
      this.deleteDialog = true
    },
    async confirmDelete() {
      await usersService.deleteUser(this.userToDelete.id)
      await this.fetchUsers()
      this.deleteDialog = false
      this.userToDelete = null
    }
  }
}
</script>