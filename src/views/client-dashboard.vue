<template>
  <div>
    <c-navbar />
    <b-container class="py-5">
      <!-- Exams -->
      <h3 class="mb-5">
        Resultados do seu exame
      </h3>
      <b-form-select
        class="mb-4"
        v-if="user.exams.length > 0"
        v-model="selectedExam"
        :options="examsOptions"
        required
      />
      <b-row
        v-if="user.exams.length > 0"
        class="mb-3"
      >
        <b-col>
          <h6>Peso</h6>
          <p>{{ selectedExam.weight }} kg</p>
        </b-col>
        <b-col>
          <h6>Altura</h6>
          <p>{{ selectedExam.height }} cm</p>
        </b-col>
        <b-col>
          <h6>Pressão Arterial</h6>
          <p>{{ selectedExam.bloodPressure }}</p>
        </b-col>
      </b-row>
      <b-row
        v-if="user.exams.length > 0"
        class="mb-5"
      >
        <b-col>
          <h6>Porcentagem de gordura</h6>
          <p>{{ selectedExam.fatPercentage }}%</p>
        </b-col>
        <b-col>
          <h6>Porcentagem de massa muscular</h6>
          <p>{{ selectedExam.massPercentage }}%</p>
        </b-col>
        <b-col>
          <h6>IMC*</h6>
          <p>{{ selectedExam.imc }}</p>
        </b-col>
      </b-row>
      <b-row class="mb-5" v-else>
        <b-col>Não existem exames registrados em seu nome</b-col>
      </b-row>

      <!-- Trainings -->
      <h3 class="mb-3">
        Sua lista de exercícios
      </h3>
      <b-form-select
        class="mb-4"
        v-if="user.trainings.length > 0"
        v-model="selectedTraining"
        :options="trainingsOptions"
        required
      />
      <b-row
        v-if="user.trainings.length > 0"
        class="mb-5"
      >
        <b-col>
          <b-list-group>
            <b-list-group-item
              v-for="(exercise, index) in selectedTraining.exercises"
              :key="`exercise-${index}`"
              class="d-flex justify-content-between align-items-center"
            >
              <span><b>{{ exercise.name }}</b> ({{ exercise.muscle }})</span>
              <b-badge variant="primary" pill>{{ exercise.repetitions }}</b-badge>
            </b-list-group-item>
          </b-list-group>
        </b-col>
      </b-row>
      <b-row class="mb-5" v-else>
        <b-col>Não existem treinamentos registrados para você</b-col>
      </b-row>
      <h6 class="mb-3">
        *Em caso de dúvidas sobre seu IMC, consulte a tabela abaixo
      </h6>
      <b-row>
        <b-col>
          <table class="table table-dark">
            <thead>
              <tr>
                <th scope="col">Faixa de IMC</th>
                <th scope="col">Situação</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Abaixo de 14,9</td>
                <td>Extremamente abaixo do peso</td>
              </tr>
              <tr>
                <td>Entre 15 e 15,9</td>
                <td>Gravemente abaixo do peso</td>
              </tr>
              <tr>
                <td>Entre 16 e 18,5</td>
                <td>Abaixo do peso ideal</td>
              </tr>
              <tr>
                <td>Entre 18,6 e 24,9</td>
                <td>Faixa de peso ideal</td>
              </tr>
              <tr>
                <td>Entre 25 e 29,9</td>
                <td>Sobrepeso</td>
              </tr>
              <tr>
                <td>Entre 30 e 34,9</td>
                <td>Obesidade grau I</td>
              </tr>
              <tr>
                <td>Entre 35 e 39,9</td>
                <td>Obesidade grau II (grave)</td>
              </tr>
              <tr>
                <td>Acima ou igual a 40</td>
                <td>Obesidade grau III (mórbida)</td>
              </tr>
            </tbody>
          </table>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import axios from 'axios'
import jwtDecode from 'jwt-decode'

import CNavbar from '../components/c-navbar'

export default {
  name: "ClientDashboard",
  components: {
    CNavbar
  },
  data: () => ({
    user: {
      exams: [],
      trainings: []
    },
    selectedExam: {},
    selectedTraining: {}
  }),
  computed: {
    examsOptions () {
      return this.user.exams.reverse().map(exam => {
        const date = new Date(exam.createdAt)
        const formattedDate = `${date.getDate()}/${date.getMonth()}/${date.getFullYear()} - ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`

        return {
          value: exam,
          text: exam._id + ' - ' + formattedDate
        }
      })
    },
    trainingsOptions () {
      return this.user.trainings.reverse().map(training => {
        const date = new Date(training.createdAt)
        const formattedDate = `${date.getDate()}/${date.getMonth()}/${date.getFullYear()} - ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`

        return {
          value: training,
          text: training._id + ' - ' + formattedDate
        }
      })
    }
  },
  mounted () {
    const token = localStorage.getItem('token')
    const profile = localStorage.getItem('profile')

    if (!token || profile !== 'client') {
      this.$router.push('/login')
    }

    this.loadUser(token)
  },
  methods: {
    async loadUser (token) {
      const decodedToken = jwtDecode(token)

      const { data } = await axios.get('http://localhost:9000/users/' + decodedToken._doc._id)

      if (data.exams.length > 0) {
        this.selectedExam = data.exams.reverse()[0]
      }

      if (data.trainings.length > 0) {
        this.selectedTraining = data.trainings.reverse()[0]
      }

      this.user = data
    }
  }
};
</script>
