import api from './api'

export default {
  getRoles() {
    return api.get('/roles')
  },
  getRole(id) {
    return api.get(`/roles/${id}`)
  },
  postRole({name, description}) {
    return api.post(`/roles`, { name, description })
  },
  putRole({id, name, description}) {
    return api.put(`/roles/${id}`, { name, description })
  },
}
