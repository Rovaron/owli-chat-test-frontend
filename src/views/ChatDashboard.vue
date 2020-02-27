<template>
  <v-app id="inspire">
    <v-navigation-drawer
      :clipped="true"
      v-model="drawer"
      app
    >
      <v-list two-line dense>
        <template v-for="(user, index) in usersOnline">

          <v-list-item
            :to="{ name: 'chatUser', params: { _id: user._id }}"
            :key="user._id"
          >
            <v-list-item-avatar>
              <v-avatar color="red" size="40">
                <span class="white--text headline">{{ getNameInitials(user.name) }}</span>
              </v-avatar>
            </v-list-item-avatar>

            <v-list-item-content>
              <v-list-item-title>{{user.name}}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-divider
            :key="index"
          ></v-divider>

      </template>
    </v-list>
    </v-navigation-drawer>

    <v-app-bar
      app
      color="indigo"
      dark
      :clipped-left="true"
    >
      <v-app-bar-nav-icon @click="drawer = !drawer" v-if="smAndDown"></v-app-bar-nav-icon>
      <img :src="require('@/assets/logo_owli_branco.png')" alt="logo" class="app-logo">
      <v-spacer></v-spacer>
      <v-menu bottom left>
        <template v-slot:activator="{ on }">
          <v-btn
            dark
            icon
            v-on="on"
          >
            <v-icon>mdi-dots-vertical</v-icon>
          </v-btn>
        </template>

          <v-list>
            <v-list-item @click="logout">
              <v-list-item-title>Sair</v-list-item-title>
            </v-list-item>
            <v-list-item @click="deleteAccount">
              <v-list-item-title>Excluir minha conta</v-list-item-title>
            </v-list-item>
          </v-list>

      </v-menu>
    </v-app-bar>

    <v-content>
      <v-container
        class="fill-height align-start"
        fluid
      >
        <router-view></router-view>
      </v-container>
    </v-content>

  </v-app>
</template>

<script>
export default {
  props: {
    source: String
  },
  data () {
    return {
      usersOnline: [],
      drawer: true
    }
  },
  methods: {
    getNameInitials (name) {
      const splitedName = name.split(' ')
      let initials = splitedName[0].charAt(0)
      if (splitedName.length > 1) {
        initials += splitedName[splitedName.length - 1].charAt(0)
      }
      return initials.toUpperCase()
    },
    logout () {
      this.$store.dispatch('logout').then(() => {
        this.$router.push('/login')
      })
    },
    deleteAccount () {
      this.axios.delete('/users/' + this.$store.state.user._id)
        .then((response) => {
          if (response.status === 204) {
            this.logout()
          }
        })
        .catch((error) => {
          console.log(error.response)
        })
    }
  },
  sockets: {
    usersUpdated (usersOnline) {
      const indexToRemove = usersOnline.findIndex(user => user._id === this.$store.state.user._id)
      if (indexToRemove > -1) {
        usersOnline.splice(indexToRemove, 1)
      }
      this.usersOnline = usersOnline
    }
  },
  mounted () {
    console.log('montando')
    console.log(this.$store.state.user)
    this.$socket.emit('userLogin', this.$store.state.user)
    this.axios.defaults.headers.Authorization = `Bearer ${this.$store.state.token}`
  }

}
</script>

<style scoped>
.app-logo{
  width: 100px;
}
</style>
