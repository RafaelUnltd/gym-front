<template>
  <div>
    <c-navbar />
    <b-form
      @submit.prevent="onSubmit"
      @reset.prevent="onReset"
    >
      <b-container class="py-5">
        <h3 class="mb-5">Registrar exame médico</h3>
        <b-alert
          :variant="alert.variant"
          :show="alert.isOpen"
        >
          {{ alert.text }}
        </b-alert>
        <b-form-select
          class="mb-3"
          v-model="form.selectedUser"
          :options="users"
        />
        <b-row class="mb-3">
          <b-col>
            <b-form-input
              type="number"
              v-model="form.weight"
              placeholder="Peso do paciente em Kg"
              required
            />
          </b-col>
          <b-col>
            <b-form-input
              type="number"
              v-model="form.height"
              placeholder="Altura do paciente em cm"
              required
            />
          </b-col>
          <b-col>
            <b-form-input
              v-model="form.bloodPressure"
              placeholder="Pressão arterial do paciente"
              required
            />
          </b-col>
        </b-row>
        <b-row class="mb-5">
          <b-col>
            <b-form-input
              type="number"
              v-model="form.fat"
              placeholder="Porcentagem de gordura"
              required
            />
          </b-col>
          <b-col>
            <b-form-input
              type="number"
              v-model="form.muscle"
              placeholder="Porcentagem de massa muscular"
              required
            />
          </b-col>
          <b-col>
            <b-form-input
              type="number"
              :value="imc"
              placeholder="IMC"
              disabled
              required
            />
          </b-col>
        </b-row>

        <b-row class="mb-5">
          <b-col>
            <b-form-checkbox
              id="checkbox-1"
              v-model="form.isAble"
              name="checkbox-1"
              :value="true"
              :unchecked-value="false"
            >
              O usuário está apto a realizar as atividades propostas
            </b-form-checkbox>
          </b-col>
        </b-row>
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
            Enviar exame
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
  name: 'MedicalExam',
  components: {
    CNavbar
  },
  data: () => ({
    users: [
      { value: null, text: 'Selecione um usuário' }
    ],
    form: {
      selectedUser: null,
      weight: null,
      height: null,
      bloodPressure: null,
      fat: null,
      muscle: null,
      imc: null,
      isAble: false
    },
    alert: {
      isOpen: false,
      text: '',
      variant: 'success'
    }
  }),
  computed: {
    imc () {
      if (!this.form.weight || !this.form.height) {
        return null
      }

      return this.form.weight / ((this.form.height / 100) ^ 2)
    }
  },
  mounted () {
    const token = localStorage.getItem('token')
    const profile = localStorage.getItem('profile')

    if (!token || profile !== 'doctor') {
      this.$router.push('/login')
    }

    this.loadUsers()
  },
  methods: {
    async loadUsers() {
      const { data } = await axios.get('http://localhost:9000/users/profile/client')

      const userOptions = data.map(user => ({
        value: user._id,
        text: user.name
      }))

      this.users = [
        { value: null, text: 'Selecione um usuário' },
        ...userOptions
      ]
    },
    async onSubmit () {
      const payload = {
        user: this.form.selectedUser,
        weight: parseInt(this.form.weight),
        height: parseInt(this.form.height),
        bloodPressure: parseFloat(this.form.bloodPressure),
        fatPercentage: parseInt(this.form.fat),
        massPercentage: parseInt(this.form.muscle),
        imc: parseFloat(this.imc),
        isAble: this.form.isAble
      }
      
      try {
        await axios.post('http://localhost:9000/medical-exam/insert', payload)
  
        this.alert = {
          isOpen: true,
          text: 'Exame cadastrado com sucesso',
          variant: 'success'
        }

        this.onReset()
      } catch (_) {
        this.alert = {
          isOpen: true,
          text: 'Falha ao cadastrar exame',
          variant: 'success'
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
        selectedUser: null,
        weight: null,
        height: null,
        fat: null,
        muscle: null,
        imc: null,
        isAble: false
      }
    }
  }
}
</script>
