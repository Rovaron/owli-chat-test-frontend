<template>
  <v-row align="center" justify="center">
    <v-col cols="12" sm="8" md="4">
      <v-card class="elevation-12 pa-6 login-bg d-flex flex-column align-center justify-space-between">
        <v-card-text class="text-center mt-12">
          <img src="@/assets/logo_owli.png" alt="owli logo">
          <h1 class="display-1 font-weight-bold">Chat Interno</h1>
        </v-card-text>
        <v-card-text>
          <v-form ref="loginForm">
            <v-text-field
              label="Email"
              prepend-icon="person"
              :rules="[rules.required, rules.email]"
              validate-on-blur
              type="email"
              v-model="email"
              @keyup.enter="login"
            />

            <v-text-field
              id="password"
              label="Senha"
              validate-on-blur
              :rules="[rules.required]"
              prepend-icon="lock"
              type="password"
              v-model="password"
              @keyup.enter="login"
            />
          </v-form>
          <v-alert type="error" v-if="errorMessage.length > 0">
            {{errorMessage}}
          </v-alert>
        </v-card-text>
        <v-card-actions>
          <v-spacer/>
          <v-btn color="primary" rounded large class="px-6" @click="login">Entrar</v-btn>
        </v-card-actions>
        <v-card-actions>
          <p class="text-center">Não tem uma conta?<v-btn text small color="primary" to="/registration">Cadastre-se</v-btn></p>
        </v-card-actions>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import jwtDecode from 'jwt-decode'
export default {
  data () {
    return {
      email: '',
      formValid: null,
      password: '',
      errorMessage: '',
      rules: {
        required: value => !!value || 'Campo obrigatório',
        email: value => /.+@.+/.test(value) || 'E-mail inválido.'
      }
    }
  },
  methods: {
    login () {
      this.formValid = this.$refs.loginForm.validate()
      this.errorMessage = ''
      if (this.formValid) {
        this.axios.post('/login', {
          email: this.email,
          password: this.password
        })
          .then((response) => {
            const token = response.data.token
            const decoded = jwtDecode(token)
            this.$store.commit('setUser', {
              _id: decoded.sub,
              role: decoded.role,
              name: decoded.name
            })
            this.axios.defaults.headers.common.Authorization = token
            this.$store.commit('setToken', token)
            this.$router.push('/chat')
          })
          .catch((error) => {
            this.errorMessage = error.response.data.message
          })
      }
    }
  }
}
</script>

<style scoped>
.login-bg{
  background:
    linear-gradient(
      rgba(255,255,255,0.9),
      rgba(255,255,255,1)
    ),
    url('../assets/home-bg.jpg');
  min-height: 550px;
  background-size: cover;
  background-position: 100% 100%;
}
.btn-login{
  margin: 10px 0 !important;
  color: #184897 !important;
}
</style>
