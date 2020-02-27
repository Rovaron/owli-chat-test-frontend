<template>
  <v-row id="messages-wrapper" ref="messagesWrapper">
    <v-col cols="12" sm="12" class="float-none" v-for="(message, index) in messageList" :key="index">
      <v-alert
        :border="message.from === $store.state.user._id ? 'right' : 'left'"
        color="indigo"
        dark
        :class="{ 'float-right': message.from === $store.state.user._id }"
        class="chat-bubble mb-0"
      >
       {{message.message}}
      </v-alert>
    </v-col>

    <v-footer
      :padless="true"
      :inset="true"
      absolute
      min-height="80"
      color="#3949AB"
      class="d-flex justify-center align-center pa-3"
      >
      <v-row class="pa-0 ma-0">
        <v-col cols="11" sm="11" xs="11" class="pa-0 ma-0">
          <v-textarea
            v-model="message"
            auto-grow
            clearable
            rounded
            rows="1"
            class="message-input"
            hide-details
            @keyup.enter.prevent="sendMessage"
          ></v-textarea>
        </v-col>
        <v-col cols="1" sm="1" xs="1" class="pa-0 ma-0">
            <v-icon left size="42" color="#FFF" @click="sendMessage" class="mt-1 float-right">send</v-icon>
        </v-col>
      </v-row>
    </v-footer>
  </v-row>
</template>

<script>
export default {
  data () {
    return {
      message: '',
      messageList: []
    }
  },
  sockets: {
    privateMessage (message) {
      if (message.from === this.$route.params._id && message.to === this.$store.state.user._id) {
        this.messageList.push(message)
        this.$nextTick(() => {
          this.scrollToEnd()
        })
      }
      if (message.from === this.$store.state.user._id && message.to === this.$route.params._id) {
        this.messageList.push(message)
        this.$nextTick(() => {
          this.scrollToEnd()
        })
      }
    },
    loadMessages (messageList) {
      console.log('mensagens:', messageList)
      this.messageList = messageList
    }
  },
  methods: {
    sendMessage () {
      const message = {
        from: this.$store.state.user._id,
        to: this.$route.params._id,
        message: this.message
      }
      this.$socket.emit('privateMessage', message)
      this.message = ''
    },
    scrollToEnd () {
      var container = this.$refs.messagesWrapper
      container.scrollTop = container.scrollHeight + 200
    }
  },
  watch: {
    '$route.params._id' () {
      console.log('mudou de rota')
      this.$socket.emit('requestMessages', { owner_id: this.$store.state.user._id, target_id: this.$route.params._id })
    }
  },
  mounted () {
    this.$socket.emit('requestMessages', { owner_id: this.$store.state.user._id, target_id: this.$route.params._id })
    console.log(this.$vuetify.breakpoint)
  }
}
</script>

<style scoped>
.chat-bubble {
  display: inline-block;
}
.message-input{
  background-color: #fff;
}
#messages-wrapper{
  height: calc(100vh - 168px);
  box-sizing: border-box;
  margin-bottom: 80px;
  overflow-y: auto;
}
</style>
