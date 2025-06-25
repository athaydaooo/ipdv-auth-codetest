<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-card-title>
            {{ isEditing ? 'Editar Usuário' : 'Novo Usuário' }}
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
               <v-switch
                v-model="user.isActive"
                label="Ativo"
                :true-value="true"
                :false-value="false"
              ></v-switch>
              <v-text-field
                v-model="user.name"
                label="Nome"
                required
                :rules="[v => !!v || 'Nome é obrigatório']"
              ></v-text-field>
              <v-text-field
                v-model="user.email"
                label="E-mail"
                type="email"
                required
                :rules="[v => !!v || 'E-mail é obrigatório']"
              ></v-text-field>
              <v-select
                v-model="user.roles"
                :items="roleLabels"
                label="Cargo"
                multiple
              ></v-select>
              <v-text-field
                v-model="password"
                label="Senha"
                type="password"
                :required="!isEditing"
                autocomplete="new-password"
              ></v-text-field>
              <v-btn
                type="submit"
                color="primary"
              >
                {{ isEditing ? 'Salvar' : 'Adicionar' }}
              </v-btn>
              <v-btn text @click="$router.push('/users')">Cancelar</v-btn>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import usersService from '@/services/users'
import rolesService from '@/services/roles'

export default {
  data() {
    return {
      user: {
        id: null,
        name: '',
        email: '',
        roles: [],
        isActive: true
      },
      password: '',
      roles: [],
      roleLabels: [],
      isEditing: false,
      errorMessage: ''
    }
  },
  async created() {
    await this.fetchRoles()
    if (this.$route.params.id) {
      this.isEditing = true
      await this.fetchUser(this.$route.params.id)
    }
  },
  methods: {
    async fetchRoles() {
      try {
        const response = await rolesService.getRoles()
        this.roles = response.data.roles
        this.roleLabels = this.roles.map(role => role.name)
      } catch (error) {
        this.errorMessage = 'Erro ao carregar cargos. Tente novamente mais tarde.'
        console.error('Erro ao carregar cargos:', error)
      }
    },
    async fetchUser(id) {
      try {
        const response = await usersService.getUser(id)
        const user = response.data.user
        this.user = {
          id: user.id,
          name: user.name,
          email: user.email,
          roles: user.roles || [],
          isActive: user.isActive !== undefined ? user.isActive : true
        }
      } catch (error) {
        this.errorMessage = 'Erro ao carregar usuário. Tente novamente mais tarde.'
        console.error('Erro ao carregar usuário:', error)
      }
    },
    async save() {
      const form = this.$refs.form
      if (form && !(await form.validate())) return

      try {
        const payload = {
          name: this.user.name,
          email: this.user.email,
          roles: this.user.roles,
          isActive: this.user.isActive
        }

        const roleIds = this.roles
            .filter(role => this.user.roles.includes(role.name))
            .map(role => role.id)

        if (this.isEditing) {
          await usersService.putUser({ id: this.user.id, ...payload, roleIds })
          if (this.password) {
            await usersService.putUserPassword({
              id: this.user.id,
              newPassword: this.password
            })
          }
          await usersService.putUserRoles({
            id: this.user.id,
            roleIds
          })
        } else {
          await usersService.postUser({
            ...payload,
            roleIds,
            password: this.password
          })
        }
        this.$router.push('/users')
      } catch (error) {
        let msg = 'Erro ao salvar usuário'
        this.errorMessage = msg
        console.error('Erro ao salvar usuário:', error)
      }
    }
  }
}
</script>