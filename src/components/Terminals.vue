<template>
  <div>
    <h1 class="mb-3">
      Terminals / End-points
      <button class="btn btn-outline-primary float-right" data-toggle="modal" data-target="#terminalModal">Add New Terminal</button>
    </h1>
    <table class="table">
      <thead>
        <tr>
          <th>Name</th>
          <th>Module</th>
          <th>Method</th>
          <th>Path</th>
          <th>Edit</th>
          <th>Delete</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(terminal, i) in terminals" :key="terminal.id">
          <td>{{ terminal.name }}</td>
          <td>{{ terminal.module.name }}</td>
          <td>{{ terminal.method }}</td>
          <td>{{ terminal.path }}</td>
          <td><a @click.prevent="loadTerminal(i)" href="#">Edit</a></td>
          <td><a @click.prevent="removeTerminal(i)" href="#">Delete</a></td>
        </tr>
      </tbody>
    </table>

    <!-- Terminal Modal -->
    <div class="modal fade" id="terminalModal" data-backdrop="static" data-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
      <div class="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="staticBackdropLabel">{{ !edit ? 'Add Terminal' : 'Edit Terminal' }}</h5>
            <button @click="clearTerminalForm" type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <form ref="terminalForm" id="terminalForm">
              <div class="row">
                <div class="col-lg-6 form-group">
                  <label for="module_id">Select Module</label>
                  <select name="module_id" v-model="terminal.moduleID" id="module_id" class="form-control">
                    <option value="" selected disabled>--- Select Module ---</option>
                    <option v-for="module in modules" :value="module.id" :key="module.id">{{ module.name }}</option>
                  </select>
                </div>
                <div class="col-lg-6 form-group">
                  <label for="method">Http Method</label>
                  <select name="method" v-model="terminal.method" id="method" class="form-control">
                    <option value="" selected disabled>--- Select Http Method ---</option>
                    <option value="GET">GET</option>
                    <option value="POST">POST</option>
                    <option value="PUT">PUT</option>
                    <option value="PATCH">PATCH</option>
                    <option value="DELETE">DELETE</option>
                  </select>
                </div>
              </div>
              <div class="form-group">
                <label for="name">Terminal Name</label>
                <input type="text" name="name" v-model="terminal.name" id="name" class="form-control">
              </div>
              <div class="form-group">
                <label for="path">Path</label>
                <input type="text" name="path" v-model="terminal.path" id="path" class="form-control">
              </div>
              <div class="form-group">
                <label for="description">Description</label>
                <textarea name="description" v-model="terminal.description" 
                  id="description" cols="30" rows="6" class="form-control"
                ></textarea>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button @click.prevent="clearTerminalForm()" type="button" class="btn btn-outline-secondary">Clear</button>
            <button @click.prevent="validateData" type="button" class="btn btn-primary">
              {{ !edit ? 'Add Terminal' : 'Save Changes' }}
            </button>
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
      terminal: { id:'', name:'', description:'', method:'', path:'', moduleID:'' },
      terminals: [], modules: [],
      baseServerURL: this.$baseServerURL,
      apiURL: this.$apiURL,
      edit: true
    }
  },
  mounted() {
    this.getModules();
    this.getTerminals();
  },
  methods: {
    validateData() {
      this.sendData();
    },
    sendData() {
      let vm = this;
      if(vm.edit) {
        // edit data
        let formData = new FormData(vm.$refs.terminalForm)
        formData.append('_method', 'PUT');
        this.$axios.post(`${vm.apiURL}/terminals/${vm.terminal.id}`, formData)
          .then(res => { // console.log(res)
             if(res.status === 200) {
               this.$jquery('#terminalModal').modal('hide');
               this.$swal('Terminal Saved Successfully','Terminal details were updated','success')
                .then(this.clearTerminalForm());
             }
           })
          .catch(err => console.log(err))
      } else {
        // add data
        let formData = new FormData(vm.$refs.terminalForm)
        this.$axios.post(`${vm.apiURL}/terminals`, formData)
          .then(res => { console.log(res)
             if(res.data.status === true) {
               this.$jquery('#terminalModal').modal('hide');
               this.$swal('Terminal Added Successfully','New terminal with details was added','success')
                .then(this.clearTerminalForm());
             }
           })
          .catch(err => console.log(err))
      }
    },
    getTerminals() {
      this.$axios.get(`${this.apiURL}/terminals`)
        .then(res => this.terminals = res.data.data)
        .catch(err => console.log(err))
    },
    getModules() {
      this.$axios.get(`${this.apiURL}/modules`)
        .then(res => this.modules = res.data.data)
        .catch(err => console.log(err))
    },
    loadTerminal(i) {
      this.edit = true; this.$jquery('#terminalModal').modal('show');
      this.terminal.id = this.terminals[i].id;
      this.terminal.name = this.terminals[i].name;
      this.terminal.description = this.terminals[i].description;
      this.terminal.method = this.terminals[i].method;
      this.terminal.path = this.terminals[i].path;
      this.terminal.moduleID = this.terminals[i].module.id;
    },
    removeTerminal(i) {
      let id = this.terminals[i].id;
      this.$swal.fire({
        title: 'Are you sure you want to delete this Terminal?',
        text:'This process is irreversible, you can\'t recover the terminal after confirmation',
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: 'Yes, Delete',
        denyButtonText: `No, don't delete`,
      }).then((res) => {
        if (res.isConfirmed) {
          this.$axios.delete(`${this.apiURL}/terminals/${id}`)
            .then(res => {
              if(res.status === 200) {
                this.terminals.splice(i, 1);
                this.$swal.fire('Terminal Deleted Successfully', ``, 'success');
              }
            })
            .catch(err => console.log(err))
        } else if (res.isDenied) {
          this.$swal.fire('Terminal was not deleted..!', '', 'info');
        }
      })
    },
    clearTerminalForm() {
      this.terminal.id = ''; this.terminal.name = ''; this.terminal.description = ''; 
      this.terminal.method = ''; this.terminal.path = ''; this.terminal.moduleID = '';
      this.edit = false; document.querySelector('#terminalForm').reset();
    }
  }
}
</script>