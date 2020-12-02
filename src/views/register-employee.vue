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
        <b-form-select
          id="profile"
          class="mb-2"
          v-model="form.selectedProfile"
          :options="profiles"
          required
        />
        <b-form-input
          class="mb-2"
          v-model="form.name"
          placeholder="Nome Completo"
          required
        />
        <b-form-input
          class="mb-2"
          v-model="form.username"
          placeholder="Nome de usuário"
          required
        />
        <b-form-input
          class="mb-5"
          type="password"
          v-model="form.password"
          placeholder="Senha de acesso"
          required
        />
        <div class="d-flex flex-row justify-content-end">
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
            Registrar funcionário
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
  name: 'RegisterEmployee',
  components: {
    CNavbar
  },
  data: () => ({
    form: {
      selectedProfile: null,
      name: '',
      username: '',
      password: ''
    },
    alert: {
      isOpen: false,
      text: '',
      variant: 'success'
    }
  }),
  computed: {
    profiles () {
      return [
        { value: null, text: 'Selecione um perfil' },
        { value: 'secretary', text: 'Secretário (a)' },
        { value: 'professor', text: 'Treinador (a)' },
        { value: 'doctor', text: 'Doutor (a)' },
      ]
    },
  },
  methods: {
    async onSubmit () {
      const payload = {
        profile: this.form.selectedProfile,
        name: this.form.name,
        username: this.form.username,
        password: this.form.password
      }

      try {
        await axios.post('http://localhost:9000/users', payload)

        this.alert = {
          isOpen: true,
          text: 'Usuário registrado com sucesso',
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
        selectedProfile: null,
        name: '',
        username: '',
        password: ''
      }
    }
  }
}
</script>
