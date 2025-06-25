import api from './api'

export default {
  getUsers() {
    return api.get('/users')
  },
  getUser(id) {
    return api.get(`/users/${id}`)
  },
  postUser({name, email, password, roleIds}) {
    return api.post('/users',{ name, email, password, roleIds }) 
  },
  putUser({id, name, email, isActive, roleIds}) {
    return api.put(`/users/${id}`, { name, email, isActive, roleIds })
  },
  putUserPassword({id, newPassword}) {
    return api.put(`/users/${id}/password`, { newPassword })
  },
  putUserRoles({id, roleIds}) {
    return api.put(`/users/${id}/roles`, { roleIds })
  },
  deleteUser(id) {
    return api.delete(`/users/${id}`)
  }
}
