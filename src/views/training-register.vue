<template>
  <div>
    <c-navbar />
    <b-container class="py-5">
      <h3 class="mb-5">Registrar um treino</h3>
      <b-alert
        :variant="alert.variant"
        :show="alert.isOpen"
      >
        {{ alert.text }}
      </b-alert>
      <div class="d-flex flex-row justify-content-end mb-3">
        <b-button
          class="ml-2"
          type="submit"
          variant="outline-primary"
          @click="isAddModalOpen = true"
        >
          Adicionar um novo exercício
        </b-button>
      </div>
      <b-form-select
        class="mb-3"
        v-model="form.selectedUser"
        :options="users"
      />
      <b-row v-if="form.exercises.length > 0" class="mb-5">
        <b-col>
          <b-list-group>
            <b-list-group-item
              v-for="(exercise, index) in form.exercises"
              :key="`exercise-${index}`"
              class="d-flex justify-content-between align-items-center"
            >
              <span><b>{{ exercise.name }}</b> ({{ exercise.muscle }})</span>
              <b-badge variant="primary" pill>{{ exercise.repetitions }}</b-badge>
            </b-list-group-item>
          </b-list-group>
        </b-col>
      </b-row>
      <p v-else class="text-center pb-3 my-3">Nenhum exercício adicionado até o momento</p>
      <div class="d-flex flex-row justify-content-end">
        <b-button
          class="ml-2"
          type="submit"
          variant="primary"
          @click="registerTraining"
        >
          Registrar treino
        </b-button>
      </div>
    </b-container>
    <b-modal
      v-model="isAddModalOpen"
      ref="my-modal"
      hide-footer
      title="Adicionar novo exercício"
    >
      <div>
        <b-form-input
          class="mb-2"
          type="text"
          v-model="form.name"
          placeholder="Nome do exercício"
        />
        <b-form-input
          class="mb-2"
          type="text"
          v-model="form.muscle"
          placeholder="Músculo trabalhado"
        />
        <b-form-input
          type="number"
          v-model="form.repetitions"
          placeholder="Número de repetições"
        />
      </div>
      <div class="d-flex flex-row justify-content-end pt-3">
        <b-button
          variant="outline-danger"
          @click="isAddModalOpen = false"
        >
          Cancelar
        </b-button>
        <b-button
          class="ml-2"
          type="submit"
          variant="primary"
          @click="addExercise"
        >
          Adicionar
        </b-button>
      </div>
    </b-modal>
  </div>
</template>

<script>
import axios from 'axios'
import CNavbar from '../components/c-navbar'

export default {
  components: {
    CNavbar
  },
  name: 'TrainingRegister',
  data: () => ({
    isAddModalOpen: false,
    users: [
      { value: null, text: 'Selecione um usuário' },
    ],
    form: {
      selectedUser: null,
      name: null,
      muscle: null,
      repetitions: null,
      exercises: []
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

    if (!token || profile !== 'professor') {
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
    addExercise () {
      this.form.exercises = [
        ...this.form.exercises,
        {
          name: this.form.name,
          muscle: this.form.muscle,
          repetitions: parseInt(this.form.repetitions)
        }
      ]

      this.form.name = null
      this.form.muscle = null
      this.form.repetitions = null

      this.isAddModalOpen = false
    },
    async registerTraining () {
      const payload = {
        user: this.form.selectedUser,
        exercises: this.form.exercises
      }

      try {
        await axios.post('http://localhost:9000/training/insert', payload)

        this.alert = {
          isOpen: true,
          text: 'Treinamento registrado com sucesso',
          variant: 'success'
        }

        this.onReset()
      } catch (_) {
        this.alert = {
          isOpen: true,
          text: 'Erro ao registrar treinamento',
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
        name: null,
        muscle: null,
        repetitions: null,
        exercises: []
      }
    }
  }
}
</script>

<style>

</style>
