<template>
  <div class="container-fluid">
    <ul class="list-unstyled">
      <li><router-link to="/dashboard">Dashboard</router-link></li>
      <li><router-link to="/applications">Applications</router-link></li>
      <li><router-link to="/modules">Modules</router-link></li>
      <li><router-link to="/terminals">Terminals</router-link></li>
      <li><router-link to="/terminal-parameters">Terminal Parameters</router-link></li>
      <li><router-link to="/http-codes">Http Codes</router-link></li>
      <li><router-link to="/terminal-examples">Terminal Examples</router-link></li>
      <li><router-link to="/tables">Tables</router-link></li>
    </ul>
  </div>
</template>


<style scoped>
ul {
  display: flex;
}
ul li {
  display: block;
  margin: 12px 24px;
}
</style>