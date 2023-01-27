<template>
  <div>
    <q-banner class="bg-green-1">
      <template v-slot:avatar>
        <q-icon name="account_circle" color="green" />
      </template>
     Crie sua conta para acessar todas as funcionalidades. É grátis!!
    </q-banner>
    <q-form
      @submit.prevent="register()"
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
          label="Criar Conta"
          color="green"
          class="full-width"
          type="submit"
        />
      </div>
    </q-form>
  </div>
</template>

<script>
  import { useAuthStore } from '../../stores/AuthStore'
  const auth = useAuthStore()

  export default {
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
      register(){
        auth.registerUser(this.user)
      }
    }
  }
</script>

<style lang="scss" scoped>

</style>
