<template>
  <div>
    <c-navbar />
    <b-form
      @submit.prevent="onSubmit"
      @reset.prevent="onReset"
    >
      <b-container class="py-5">
        <h3 class="mb-5">Registrar usuário</h3>
        <b-alert
          :variant="alert.variant"
          :show="alert.isOpen"
        >
          {{ alert.text }}
        </b-alert>
        <b-form-input
          class="mb-2"
          v-model="form.name"
          placeholder="Nome Completo"
        />
        <b-form-input
          class="mb-2"
          v-model="form.username"
          placeholder="Nome de usuário"
        />
        <b-form-input
          class="mb-2"
          type="password"
          v-model="form.password"
          placeholder="Senha de acesso"
        />
        <b-form-input
          class="mb-2"
          v-model="form.cpf"
          placeholder="CPF"
        />
        <b-form-input
          class="mb-2"
          v-model="form.identity"
          placeholder="Identidade"
        />
        <b-form-input
          class="mb-2"
          type="date"
          v-model="form.dob"
          placeholder="Data de nascimento"
        />
        <div class="d-flex flex-row justify-content-end mt-5">
          <b-button
            type="reset"
            variant="outline-danger"
          >
            Limpar formulário
          </b-button>
          <b-button
            class="ml-2"
            type="submit"
            variant="primary"
          >
            Registrar usuário
          </b-button>
        </div>
      </b-container>
    </b-form>
  </div>
</template>

<script>
import axios from 'axios'

import CNavbar from '../components/c-navbar'

export default {
  name: 'RegisterUser',
  components: {
    CNavbar
  },
  data: () => ({
    form: {
      name: null,
      username: null,
      password: null,
      cpf: null,
      identity: null,
      dob: null,
    },
    alert: {
      isOpen: false,
      text: '',
      variant: 'success'
    }
  }),
  mounted () {
    const token = localStorage.getItem('token')
    const profile = localStorage.getItem('profile')

    if (!token || profile !== 'secretary') {
      this.$router.push('/login')
    }
  },
  methods: {
    async onSubmit () {
      const payload = { ...this.form }

      try {
        await axios.post('http://localhost:9000/users', payload)

        this.alert = {
          isOpen: true,
          text: 'Usuário registrado com sucesso. O aluno está liberado para o exame médico.',
          variant: 'success'
        }

        this.onReset()
      } catch (_) {
        this.alert = {
          isOpen: true,
          text: 'Erro ao registrar usuário',
          variant: 'danger'
        }
      }

      setTimeout(this.resetAlert, 5000)
    },
    resetAlert () {
      this.alert = {
        isOpen: false,
        text: '',
        variant: 'success'
      }
    },
    onReset () {
      this.form = {
        name: null,
        username: null,
        password: null,
        cpf: null,
        identity: null,
        dob: null,
      }
    }
  }
}
</script>

<style>

</style>