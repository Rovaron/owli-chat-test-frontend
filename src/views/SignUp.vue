<template>
  <v-row align="center" justify="center">
    <v-col cols="12" sm="8" md="4">
      <v-card class="elevation-12 signup-bg d-flex flex-column justify-space-between pa-3">
        <v-card-title class="headline">
          <h1 class="display-1 font-weight-bold ml-0 mb-0 grey--text text--darken-2">Crie sua conta</h1>
        </v-card-title>

        <v-card-text>
          <v-form v-model="steps[0].valid" v-show="registrationStep === 0" ref="step0">
            <v-text-field
              label="Nome ou apelido"
              filled
              :rules="[rules.required]"
              v-model="user.name"
              hint="Nome ou apelido que será exibido para outros usuários"
              required
            ></v-text-field>

            <v-text-field
              label="Email"
              filled
              :rules="[rules.required, rules.email]"
              type="email"
              v-model="user.email"
              required
            ></v-text-field>

            <v-text-field
              v-model="user.password"
              filled
              :append-icon="showPass ? 'mdi-eye' : 'mdi-eye-off'"
              :type="showPass ? 'text' : 'password'"
              :rules="[rules.password, rules.required]"
              name="input-10-1"
              label="Senha"
              hint="Mínimo de 8 caracteres"
              counter
              @click:append="showPass = !showPass"
            ></v-text-field>

            <v-text-field
              v-model="confirmPassword"
              filled
              :append-icon="showPass ? 'mdi-eye' : 'mdi-eye-off'"
              :type="showPass ? 'text' : 'password'"
              :rules="[rules.confirmPassword, rules.required]"
              name="input-10-1"
              label="Confirmar senha"
              hint="Digite novamente a sua senha"
              counter
              @click:append="showPass = !showPass"
            ></v-text-field>
          </v-form>

          <v-form v-model="steps[1].valid" v-show="registrationStep === 1" ref="step1">
            <v-text-field
              label="Telefone"
              filled
              type="tel"
              v-model="user.phone"
              v-mask="masks.phone"
              :rules="[rules.required]"
              hint="Telefone para contato com o DDD"
              required
            ></v-text-field>

            <v-row>
              <v-col cols="12" md="4" xs="12">
                <v-text-field
                  label="CEP"
                  filled
                  v-mask="masks.cep"
                  :rules="[rules.required, rules.cep]"
                  v-model="user.address.cep"
                  required
                  @input="getAddressByCEP"
                  :loading="isLoadingCep"
                  :disabled="isLoadingCep"
                  maxlength="9"
                  ref="cep"
                ></v-text-field>
              </v-col>

              <v-col cols="12" md="3" xs="12">
                <v-text-field
                  label="Número"
                  filled
                  :rules="[rules.required]"
                  v-model="user.address.number"
                  required
                ></v-text-field>
              </v-col>

              <v-col cols="12" md="5" xs="12">
                <v-text-field
                  label="Complemento"
                  filled
                  v-model="user.address.complement"
                ></v-text-field>
              </v-col>

            </v-row>

            <v-text-field
              label="Endereço"
              filled
              :rules="[rules.required]"
              v-model="user.address.street"
              required
            ></v-text-field>

            <v-text-field
              label="Bairro"
              filled
              :rules="[rules.required]"
              v-model="user.address.neighborhood"
              required
            ></v-text-field>

            <v-row>
              <v-col cols="12" md="6" xs="12">
                <v-text-field
                  label="Cidade"
                  filled
                  :rules="[rules.required]"
                  v-model="user.address.city"
                  required
                ></v-text-field>
              </v-col>

              <v-col cols="12" md="6" xs="12">
                <v-text-field
                  label="UF"
                  filled
                  :rules="[rules.required]"
                  v-model="user.address.state"
                  required
                ></v-text-field>
              </v-col>
            </v-row>
          </v-form>

        </v-card-text>
        <v-card-actions>
          <v-btn text large class="px-6" to="/">Cancelar</v-btn>
          <v-spacer/>

          <v-btn
            color="white"
            rounded large class="px-6"
            v-show="registrationStep > 0"
            @click="registrationStep -= 1"
          >
            Voltar
          </v-btn>

          <v-btn
            color="primary"
            rounded large class="px-6"
            v-if="registrationStep < 1"
            @click="nextStep()"
          >
            Avançar
          </v-btn>
          <v-btn
            color="primary"
            rounded large class="px-6"
            v-else
            @click="signUp"
          >
            cadastrar-se
          </v-btn>

        </v-card-actions>
      </v-card>
    </v-col>
    <v-dialog v-model="dialog" persistent max-width="290">
      <v-card>
        <v-card-title class="headline" v-if="signupSuccess">Cadastro realizado<br>com sucesso!</v-card-title>
        <v-card-title class="headline" v-else>Não foi possivel completar seu cadastro</v-card-title>
        <v-card-text v-if="signupSuccess">Agora você já pode entrar em nosso chat e conversar com seus colegas de trabalho.</v-card-text>
        <v-card-text v-else>Esse email ja foi cadastrado em nosso sistema.</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary px-3" @click="goToLogin" rounded v-if="signupSuccess">fazer login</v-btn>
          <v-btn color="primary px-3" text @click="dialog = false" rounded v-else>Tentar Novamente</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
import { mask } from 'vue-the-mask'
import { masks, unmask } from '@/utils/maskUtils'
import cep from 'cep-promise'

export default {
  directives: { mask },

  data () {
    return {
      registrationStep: 0,
      cepFound: true,
      isLoadingCep: false,
      dialog: false,
      signupSuccess: false,
      steps: [
        { valid: false },
        { valid: false }
      ],
      masks,
      rules: {
        required: value => !!value || 'Campo obrigatório.',
        email: value => /.+@.+/.test(value) || 'E-mail inválido.',
        password: value => value.length >= 8 || 'A senha precisa ter no mínimo 8 caracteres.',
        confirmPassword: value => value === this.user.password || 'Senhas não conferem.',
        cep: value => this.cepFound === true || 'CEP não existe.'
      },
      showPass: false,
      confirmPassword: '',
      user: {
        name: '',
        email: '',
        password: '',
        phone: '',
        address: {
          cep: '',
          street: '',
          number: '',
          complement: '',
          neighborhood: '',
          city: '',
          state: '',
          country: ''
        }
      }
    }
  },

  methods: {
    nextStep () {
      const form = this.$refs['step' + this.registrationStep]
      form.validate()
      if (this.steps[this.registrationStep].valid) this.registrationStep += 1
    },
    getAddressByCEP () {
      const cepMasked = this.user.address.cep
      let cepUnmasked = ''
      if (cepMasked.length >= 9) {
        this.isLoadingCep = true
        this.cepFound = true
        cepUnmasked = unmask(cepMasked, this.masks.cep)
        cep(cepUnmasked)
          .then((address) => {
            Object.assign(this.user.address, {
              street: address.street,
              neighborhood: address.neighborhood,
              city: address.city,
              state: address.state
            })
            this.isLoadingCep = false
          })
          .catch((error) => {
            if (error) {
              this.cepFound = false
              this.isLoadingCep = false
              this.$nextTick(() => {
                this.$refs.cep.validate()
              })
            }
          })
      }
    },
    signUp () {
      // unmasking values because 'vue-the-mask' module don't provide raw values usign directives
      this.user.phone = unmask(this.user.phone, masks.phone)
      this.user.address.cep = unmask(this.user.address.cep, masks.cep)

      this.axios.post('/users', this.user)
        .then((response) => {
          if (response.status === 201) {
            this.signupSuccess = true
            this.dialog = true
          }
        })
        .catch((error) => {
          if (error.response.status === 409) {
            this.signupSuccess = false
            this.dialog = true
          }
        })
    },
    goToLogin () {
      this.$router.push('/login')
    }
  }

}
</script>

<style scoped>
.signup-bg{
  min-height: 550px;
  background-size: cover;
  background-position: 100% 100%;
}
.btn-login{
  margin: 10px 0 !important;
  color: #184897 !important;
}
.signup-stepper{
  box-shadow: none !important;
}
</style>
