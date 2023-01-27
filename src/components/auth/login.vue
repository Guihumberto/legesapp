<template>
  <div>
    <q-banner class="bg-blue-1">
      <template v-slot:avatar>
        <q-icon name="account_circle" color="primary" />
      </template>
    Insira seu e-mail e senha se já for cadastrado.
    </q-banner>
    <q-form
      @submit.prevent="login()"
      class="q-mt-md">
      <q-input
        label="E-mail"
        outlined
        placeholder="Informe seu e-mail"
        type="email"
        :rules="[ val => isValidEmail(val) || 'Digite um endereço de e-mail válido']"
        lazy-rules
        stack-label
        v-model="user.email"
        @keydown.esc="user.email = ''"
      />
      <q-input
        label="Senha"
        outlined
        placeholder="Crie uma senha"
        type="password"
        v-model="user.password"
        :rules="[ val => val.length >= 6 || 'Insira 6 ou mais caracteres']"
        lazy-rules
        class="q-my-sm"
        @keydown.esc="user.password = ''"
      />
      <div>
        <q-btn
          label="entrar"
          color="primary"
          class="full-width"
          type="submit"
        />
        <q-btn
          v-if="false"
          label="entrar com a conta do gmail"
          color="red-4"
          icon="mail"
          class="full-width q-mt-sm"
          @click="auth.loginGmail()"
        />
        <q-btn
          label="Criar conta"
          color="red-4"
          flat
          no-caps
          class="full-width q-mt-sm q-pb-none"
          @click="$emit('register')"
        />
        <q-btn
          label="Esqueceu sua senha?"
          color="red-4"
          flat
          no-caps
          class="full-width q-pt-none"
        />
      </div>
    </q-form>
  </div>
</template>

<script>
  import { useAuthStore } from '../../stores/AuthStore'
  const auth = useAuthStore()

  export default {
    props:['tab'],
    data(){
      return{
        auth,
        user:{
          name: '',
          email: '',
          password: ''
        }
      }
    },
    methods:{
      isValidEmail(email){
        return String(email)
          .toLowerCase()
          .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
      },
      login(){
        auth.loginUser(this.user)
        this.$router.push('/').catch(err => {})
      }
    }
  }
</script>

<style lang="scss" scoped>

</style>
