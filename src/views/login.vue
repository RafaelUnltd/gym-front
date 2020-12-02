<template>
  <div class="screen-size">
    <h1 class="logo mb-4">
      GYM
    </h1>
    <b-card class="col-lg-4 col-md-6 col-sm-9">
      <b-form
        @submit.prevent="onSubmit"
        @reset.prevent="onReset"
      >
        <b-form-group
          id="input-group-user"
          label="Usuário:"
          label-for="user"
        >
          <b-form-input
            id="user"
            required
            type="text"
            placeholder="Digite aqui seu nome de usuário"
            v-model="form.user"
          ></b-form-input>
        </b-form-group>

        <b-form-group
          id="input-group-password"
          label="Senha:"
          label-for="password"
        >
          <b-form-input
            id="password"
            required
            type='password'
            placeholder="Digite sua senha"
            v-model="form.password"
          ></b-form-input>
        </b-form-group>

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
            Realizar login
          </b-button>
        </div>
      </b-form>
    </b-card>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'Login',
  data: () => ({
    form: {
      user: '',
      password: '',
      selectedProfile: 'Cliente',
    }
  }),
  computed: {
    profiles () {
      return [
        'Cliente',
        'Funcionário'
      ]
    },
  },
  mounted () {
    const token = localStorage.getItem('token')

    if (token) {
      const profile = localStorage.getItem('profile')
      this.redirectToCorrectProfile()
    }
  },
  methods: {
    async onSubmit () {
      const payload = {
        username: this.form.user,
        password: this.form.password
      }

      const { data } = await axios.post('http://localhost:9000/login', payload)

      localStorage.setItem('token', data.token)
      localStorage.setItem('profile', data.profile)

      this.redirectToCorrectProfile(data.profile)
    },
    onReset () {
      this.form.user = '',
      this.form.password = '',
      this.form.selectedProfile = 'Cliente'
    },
    redirectToCorrectProfile (profile) {
      switch(profile) {
        case 'client':
          this.$router.push('/app/client-dashboard')
          break
        case 'secretary':
          this.$router.push('/app/register-user')
          break
        case 'professor':
          this.$router.push('/app/training-register')
          break
        case 'doctor':
          this.$router.push('/app/medical-exam')
          break
      }
    }
  }
}
</script>

<style scoped>
div.screen-size {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100vw;
  background-size: cover;
  background-image: url("../assets/background.jpg");
}

.logo {
  font-size: 6rem;
  color: white;
  font-weight: 800;
}
</style>