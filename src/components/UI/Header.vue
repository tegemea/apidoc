<template>
  <div class="container-fluid">
    <ul class="list-unstyled">
      <li><router-link to="/dashboard">Dashboard</router-link></li>
      <li><router-link to="/applications">Applications</router-link></li>
      <li><router-link to="/groups">Groups</router-link></li>
      <li><router-link to="/modules">Modules</router-link></li>
      <li><router-link to="/terminals">Terminals</router-link></li>
      <li><router-link to="/terminal-parameters">Terminal Parameters</router-link></li>
      <li><router-link to="/http-codes">Http Codes</router-link></li>
      <li><router-link to="/terminal-examples">Terminal Examples</router-link></li>
      <li><router-link to="/tables">Tables</router-link></li>
      <li><router-link to="/table-fields">Table Fields</router-link></li>
    </ul>
  </div>
</template>


<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Oswald&display=swap');

ul {
  display: flex;
}
ul li {
  display: block;
  margin: 12px 24px;
  font-family: 'Oswald', sans-serif;
}

ul li a {
  color: royalblue;
  text-decoration: none;
}

ul li a:hover {
  color: red;
}

ul li a.router-link-active,
ul li a.router-link-exact-active {
  border-bottom: 2px solid indianred;
  color: indianred;
  cursor: default;
}
</style>