<template>
  <div>
    <c-navbar />
    <b-form
      @submit.prevent="onSubmit"
      @reset.prevent="onReset"
    >
      <b-container class="py-5">
        <h3 class="mb-5">Matricular um aluno</h3>
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
        <b-form-select
          class="mb-3"
          v-model="form.selectedModality"
          :options="modalities"
        />
        <b-form-select
          class="mb-3"
          v-model="form.paymentPeriod"
          :options="['Mensal', 'Semestral', 'Anual']"
        />
        <b-form-select
          class="mb-5"
          v-model="form.daysQuantity"
          :options="daysOptions"
          :disabled="!form.selectedModality"
        />
        <h5 class="mb-3 float-right">
          Valor total: {{ totalValue }}
        </h5>
        <div v-if="form.selectedModality && form.selectedModality.classes && form.daysQuantity && form.selectedModality.classes.length > 0">
          <h5 class="mt-5 mb-3">Selecione os dias de atividade</h5>
          <b-form-checkbox
            v-for="(schedule, index) in classesOptions"
            :key="`schedule-${index}`"
            :value="true"
            :unchecked-value="undefined"
            @input="selectSchedule(schedule._id)"
          >
            {{ schedule.dayOfWeek }} - {{ schedule.startTime }}
          </b-form-checkbox>
        </div>

        <h5 class="mt-5 mb-3">Informações de cobrança</h5>
        <b-form-input
          class="mb-2"
          v-model="form.cardNumber"
          placeholder="Número do cartão"
        />
        <b-form-input
          class="mb-2"
          v-model="form.cardholderName"
          placeholder="Nome escrito no cartão"
        />
        <b-form-input
          class="mb-5"
          v-model="form.brand"
          placeholder="Bandeira do cartão"
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
            Matricular aluno
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
      { value: null, text: 'Selecione um aluno' }
    ],
    modalities: [
      { value: null, text: 'Selecione uma modalidade' }
    ],
    form: {
      selectedUser: null,
      selectedModality: null,
      daysQuantity: null,
      cardNumber: '',
      cardholderName: '',
      brand: '',
      selectedClasses: [],
      paymentPeriod: 'Mensal'
    },
    alert: {
      isOpen: false,
      text: '',
      variant: 'success'
    }
  }),
  computed: {
    totalValue () {
      if (this.form.selectedModality && this.form.daysQuantity) {
        if (this.form.paymentPeriod === 'Mensal') {
          return 'R$ ' + this.form.selectedModality.monthlyValues[this.form.daysQuantity].toFixed(2) || 'Valor inválido'
        } else if (this.form.paymentPeriod === 'Semestral') {
          return 'R$ ' + this.form.selectedModality.semiannualValues[this.form.daysQuantity].toFixed(2) || 'Valor inválido'
        } else if (this.form.paymentPeriod === 'Anual') {
          return 'R$ ' + this.form.selectedModality.yearlyValues[this.form.daysQuantity].toFixed(2) || 'Valor inválido'
        } 
      } else {
        return 'R$ 0.00'
      }
    },
    daysOptions () {
      if (this.form.selectedModality) {
        return [
          { value: null, text: 'Selecione uma quantidade de dias na semana' },
          ...this.form.selectedModality.dayOptions.map(option => ({ value: option, text: option }))
        ]
      } else {
        return [
          { value: null, text: 'Selecione uma quantidade de dias na semana' }
        ]
      }
    },
    classesOptions () {
      if (this.form.selectedModality && this.form.selectedModality.classes) {
        return this.form.selectedModality.classes.filter((schedule) => schedule.enrolledClients < schedule.maxClients)
      } else {
        return []
      }
    }
  },
  mounted () {
    const token = localStorage.getItem('token')
    const profile = localStorage.getItem('profile')

    if (!token || profile !== 'secretary') {
      this.$router.push('/login')
    }

    this.loadData()
  },
  methods: {
    async loadData() {
      const users = await axios.get('http://localhost:9000/users/profile/client')
      const modalities = await axios.get('http://localhost:9000/modalities')

      const userOptions = users.data.map(user => ({
        value: user._id,
        text: user.name
      }))

      const modalityOptions = modalities.data.map(modality => ({
        value: modality,
        text: modality.name
      }))

      this.users = [
        { value: null, text: 'Selecione um aluno' },
        ...userOptions
      ]

      this.modalities = [
        { value: null, text: 'Selecione uma modalidade' },
        ...modalityOptions
      ]
    },
    selectSchedule (id) {
      if (this.form.selectedClasses.includes(id)) {
        this.form.selectedClasses = this.form.selectedClasses.filter(selectedClass => selectedClass !== id)
      } else {
        this.form.selectedClasses = [
          ...this.form.selectedClasses,
          id
        ]
      }
    },
    async onSubmit () {
      const userId = this.form.selectedUser
      const payload = {
        modality: this.form.selectedModality,
        classes: this.form.selectedClasses,
        creditCard: {
          cardNumber: this.form.cardNumber,
          cardholderName: this.form.cardholderName,
          brand: this.form.brand,
        }
      }

      try {
        await axios.put('http://localhost:9000/users/enroll/' + userId, payload)

        this.alert = {
          isOpen: true,
          text: 'Aluno matriculado com sucesso',
          variant: 'success'
        }

        this.onReset()
        await this.loadData()
      } catch (_) {
        this.alert = {
          isOpen: true,
          text: 'Falha ao matricular aluno',
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
        selectedUser: null,
        selectedModality: null,
        daysQuantity: null,
        cardNumber: '',
        cardholderName: '',
        brand: '',
        selectedClasses: [],
        paymentPeriod: 'Mensal'
      }
    }
  }
}
</script>
