<template>
  <v-app>
    <TopMenu />
    <v-main>
      <router-view></router-view>
    </v-main>
  </v-app>
</template>

<script>
import TopMenu from './components/TopMenu.vue'

export default {
  name: 'App',
  components: {
    TopMenu
  }
}
</script>