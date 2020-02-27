<template>
  <v-row align="center" justify="center">
    <v-col cols="12" sm="8" md="4">
      <v-card class="elevation-12 pa-6 landing-bg d-flex flex-column align-center justify-space-between">
        <v-card-text class="text-center mt-12">
          <img src="@/assets/logo_owli_branco.png" alt="owli logo">
          <h1 class="display-1 font-weight-bold white--text">Chat Interno</h1>
        </v-card-text>
        <v-card-actions class="d-flex flex-column">
          <v-btn rounded outlined color="white" min-width="200" to="/registration">Cadastrar-se</v-btn>
          <v-btn rounded color="white" min-width="200" class="btn-login" to="/login">Entrar</v-btn>
        </v-card-actions>
      </v-card>
    </v-col>
  </v-row>
</template>

<style scoped>
.landing-bg{
  background:
    linear-gradient(
      rgba(0,148,216,0.8),
      rgba(26,74,163,0.9)
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
