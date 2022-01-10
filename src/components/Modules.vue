<template>
  <div>
    <div class="row">
      <div class="col-12">
        <h1 class="mb-3">
          Modules
          <button class="btn btn-outline-primary float-right">Add New Module</button>
        </h1>
        <table class="table">
          <thead>
            <tr>
              <th>Module Name</th>
              <th>Application</th>
              <th>related?</th>
              <th>Relationships</th>
              <th>Edit</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(module, i) in modules" :key="module.id">
              <td>{{ module.name }}</td>
              <td>Application</td>
              <td>{{ module.related }}</td>
              <td>{{ module.relationships }}</td>
              <td><a href="#">Edit</a></td>
              <td><a href="#">Delete</a></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      module: { id:'', applicationID:'', name:'', description:'', related: false, relationships:'', },
      modules: [],
      baseServerURL: this.$baseServerURL,
      apiURL: this.$apiURL
    }
  },
  mounted() {
    this.getModules();
  },
  methods: {
    getModules() {
      this.$axios.get(`${this.apiURL}/Modules`)
        .then(res => console.log(res))
        .catch(err => console.log(err))
    }
  }
}
</script>