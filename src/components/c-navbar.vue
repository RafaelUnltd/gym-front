<template>
  <b-navbar toggleable type="dark" variant="dark">
    <b-navbar-brand href="#">GYM</b-navbar-brand>

    <b-navbar-toggle target="navbar-toggle-collapse">
      <template #default="{ expanded }">
        <b-icon v-if="expanded" icon="chevron-bar-up"></b-icon>
        <b-icon v-else icon="chevron-bar-down"></b-icon>
      </template>
    </b-navbar-toggle>

    <b-collapse id="navbar-toggle-collapse" is-nav>
      <b-navbar-nav class="mr-auto">
        <b-nav-item
          v-for="(option, index) in options"
          :key="`navbar-option-${index}`"
          @click="redirectTo(option.url)"
        >
          {{ option.text }}
        </b-nav-item>
        <b-nav-item @click="logout">
          Sair
        </b-nav-item>
      </b-navbar-nav>
    </b-collapse>
  </b-navbar>
</template>

<script>
export default {
  name: 'CNavbar',
  data: () => ({
    profile: 'client'
  }),
  computed: {
    options () {
      const secretaryOptions = [
        { text: 'Cadastar aluno', url: '/app/register-user' },
        { text: 'Cadastar funcionário', url: '/app/register-employee' },
        { text: 'Matricular aluno', url: '/app/enroll-user' },
      ]

      return this.profile === 'secretary' ? secretaryOptions : []
    }
  },
  mounted () {
    this.profile = localStorage.getItem('profile')
  },
  methods: {
    redirectTo (url) {
      this.$router.push(url)
    },
    logout () {
      localStorage.removeItem('token')
      localStorage.removeItem('profile')
      this.$router.push('/login')
    }
  }
}
</script>
