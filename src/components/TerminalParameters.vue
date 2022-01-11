<template>
  <div>
    <h1 class="mb-3">
      Terminal Parameters
      <button class="btn btn-outline-primary float-right" 
        data-toggle="modal" data-target="#terminalParameterModal"
      >Add New Terminal Parameter</button>
    </h1>
    <table class="table">
      <thead>
        <tr>
          <th>Name</th>
          <th>Terminal</th>
          <th>Required?</th>
          <th>Description</th>
          <th>Edit</th>
          <th>Delete</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="parameter in terminalParameters" :key="parameter.id">
          <td>{{ parameter.name }}</td>
          <td>{{ parameter.terminal.name }}</td>
          <td>{{ parameter.required }}</td>
          <td>{{ parameter.description }}</td>
          <td><a href="#">Edit</a></td>
          <td><a href="#">Delete</a></td>
        </tr>
      </tbody>
    </table>

    <div class="modal fade" id="terminalParameterModal" data-backdrop="static" data-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
      <div class="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="staticBackdropLabel">{{ !edit ? 'Add New Terminal Parameter' : 'Edit Terminal Parameter' }}</h5>
            <button @click="clearTerminalParameterForm()" type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <form ref="terminalParameterForm" id="terminalParameterForm">
              form goes here...
            </form>
          </div>
          <div class="modal-footer">
            <button @click.prevent="clearTerminalParameterForm()" type="button" class="btn btn-outline-secondary">Clear</button>
            <button type="button" class="btn btn-primary">{{ !edit ? 'Add Terminal Parameter' : 'Save Changes' }}</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      terminalParameter: { id:'', name:'', terminalID:'', required:'', description:'' },
      terminalParameters: [], terminals: [], apiURL: this.$apiURL, edit: false
    }
  },
  mounted() {
    //
  },
  methods: {
    validateData() {
      this.sendData();
    },
    sendData() {
      //
    },
    getTerminalParameters() {
      this.$axios.get(`${this.apiURL}/terminal-parameters`)
        .then(res => this.terminalParameters = res.data.data)
        .catch(err => console.log(err))
    },
    getTerminals() {
      this.$axios.get(`${this.apiURL}/terminals`)
        .then(res => this.terminals = res.data.data)
        .catch(err => console.log(err))
    },
    clearTerminalParameterForm() {
      //
    }
  }
}
</script>