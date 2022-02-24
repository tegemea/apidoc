<template>
  <div>
    <div v-if="!terminalExamples.length && showLoading" class="loading">
      <h1>Loading...</h1>
      <p class="text-black-50">Please wait for content</p>
      <button @click="showLoading = false" class="btn btn-sm btn-outline-secondary">
        Taking too long? Cancel
      </button>
    </div>
    <div class="row">
      <div class="col-12">
        <h1>
          Terminal Examples
          <button class="btn btn-outline-primary float-right" data-toggle="modal" data-target="#terminalExampleModal">Add New Terminal Example</button>
        </h1>
      </div>
      <div class="col-12">
        <h3 v-if="!terminalExamples.length" class="text-danger">Sorry, No Terminal Examples</h3>
        <table v-else class="table">
          <thead>
            <tr>
              <th>Terminal</th>
              <th>Description/Example</th>
              <th class="mw-10">Edit</th>
              <th class="mw-10">Delete</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(terminalExample, i) in terminalExamples" :key="terminalExample.id">
              <td>{{ terminalExample.terminal.name }}</td>
              <td>{{ terminalExample.description }}</td>
              <td><a @click.prevent="loadTerminalExample(i)" href="#">Edit</a></td>
              <td><a @click.prevent="removeTerminalExample(i)" href="#">Delete</a></td>
            </tr>
          </tbody>
        </table>

        <div class="modal fade" id="terminalExampleModal" data-backdrop="static" data-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
          <div class="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="staticBackdropLabel">{{ !edit ? 'Add New Terminal Example' : 'Edit Terminal Example' }}</h5>
                <button @click="clearTerminalExampleForm()" type="button" class="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div class="modal-body">
                <form ref="terminalExampleForm" id="terminalExampleForm">
                  <div class="row">
                    <div class="form-group col-lg-4">
                      <label for="application_id">Select Application</label>
                      <select name="application_id" v-model="terminalExample.applicationID" id="application_id" class="form-control">
                        <option value="" selected disabled>--- Select Application ---</option>
                        <option v-for="application in applications" :value="application.id" :key="application.id">
                          {{ application.name }}
                        </option>
                      </select>
                    </div>
                    <div class="col-lg-4 form-group">
                      <label for="module_id">Select Module</label>
                      <select name="module_id" v-model="terminalExample.moduleID" id="module_id" class="form-control">
                        <option value="" selected disabled>--- Select Module ---</option>
                        <option v-for="module in (!edit ? applicationModules : modules)" 
                          :value="module.id" :key="module.id"
                        >
                          {{ module.name }}
                        </option>
                      </select>
                    </div>
                    <div class="col-lg-4 form-group">
                      <label for="terminal_id">Select Terminal</label>
                      <select name="terminal_id" v-model="terminalExample.terminalID" id="terminal_id" class="form-control">
                        <option value="" selected disabled>--- Select Terminal ---</option>
                        <option v-for="terminal in (!edit ? moduleTerminals : terminals)" 
                          :value="terminal.id" :key="terminal.id"
                        >
                          {{ terminal.name }}
                        </option>
                      </select>
                    </div>
                  </div>
                  <div class="form-group">
                    <label for="description">Example / Description</label>
                    <!-- <input type="text" name="description" v-model="terminalExample.description" id="description" class="form-control"> -->
                    <textarea name="description" v-model="terminalExample.description" id="description" cols="30" rows="6" class="form-control"></textarea>
                  </div>
                </form>
              </div>
              <div class="modal-footer">
                <button @click.prevent="clearTerminalExampleForm()" type="button" class="btn btn-outline-secondary">Clear</button>
                <button @click.prevent="validateData" type="button" class="btn btn-primary">
                  {{ !edit ? 'Add new Terminal Example' : 'Save Changes' }}
                </button>
              </div>
            </div>
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
      terminalExample: { id:'', terminalID:'', applicationID:'', moduleID:'', description:'' },
      terminalExamples: [], terminals: [], applications: [],
      modules: [], applicationModules: [], moduleTerminals: [],
      apiURL: this.$apiURL, edit: false, showLoading: true
    }
  },
  mounted() {
    this.getModules();
    this.getTerminals();
    this.getApplications();
    this.getTerminalExamples();
  },
  computed: {
    applicationID() { return this.terminalExample.applicationID },
    moduleID() { return this.terminalExample.moduleID }
  },
  watch: {
    applicationID: function(id) { if(id) this.applicationModules = this.applications.find(a => a.id === id).modules },
    moduleID: function(id) { if(id) this.moduleTerminals = this.modules.find(m => m.id === id).terminals }
  },
  methods: {
    validateData() {
      this.sendData()
    },
    sendData() {
      let vm = this;
      if(vm.edit) {
        // edit data
        let formData = new FormData(vm.$refs.terminalExampleForm)
        formData.append('_method', 'PUT')
        vm.$axios.post(`${vm.apiURL}/terminalExamples/${vm.terminalExample.id}`, formData)
          .then(res => { // console.log(res)
             if(res.status === 200) {
               this.$jquery('#terminalExampleModal').modal('hide');
               this.$swal('Terminal Example Saved Successfully','Terminal Example details were updated','success')
                .then(this.clearTerminalExampleForm());
             }
           })
          .catch(err => console.log(err))
      } else {
        // add data
        let formData = new FormData(vm.$refs.terminalExampleForm)
        vm.$axios.post(`${vm.apiURL}/terminalExamples`, formData)
          .then(res => { // console.log(res)
             if(res.status === 201) {
               this.$jquery('#terminalExampleModal').modal('hide');
               this.$swal('Terminal Example Saved Successfully','Terminal Example details were updated','success')
                .then(this.clearTerminalExampleForm());
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
    getTerminalExamples() {
      this.$axios.get(`${this.apiURL}/terminalExamples`)
        .then(res => this.terminalExamples = res.data.data)
        .catch(err => console.log(err))
    },
    getModules() {
      this.$axios.get(`${this.apiURL}/modules`)
        .then(res => this.modules = res.data.data)
        .catch(err => console.log(err))
    },
    getApplications() {
      this.$axios.get(`${this.apiURL}/applications`)
        .then(res => this.applications = res.data.data)
        .catch(err => console.log(err))
    },
    loadTerminalExample(i) {
      this.edit = true; this.$jquery('#terminalExampleModal').modal('show');
      this.terminalExample.id = this.terminalExamples[i].id;
      this.terminalExample.terminalID = this.terminalExamples[i].terminal.id;
      this.terminalExample.description = this.terminalExamples[i].description;

      // retrive moduleID & applicationID from existing terminalID
      this.$axios.get(`${this.apiURL}/terminals/${this.terminalExample.terminalID}`)
        .then(res => {
          this.terminalExample.moduleID = res.data.data[0].module.id
          this.$axios.get(`${this.apiURL}/modules/${this.terminalExample.moduleID}`)
            .then(res => this.terminalExample.applicationID = res.data.data.application.id)
        })
    },
    removeTerminalExample(i) {
      let id = this.terminalExamples[i].id;
      this.$swal.fire({
        title: 'Are you sure you want to delete this Terminal Example?',
        text:'This process is irreversible, you can\'t recover the example after confirmation',
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: 'Yes, Delete',
        denyButtonText: `No, don't delete`,
      }).then((res) => {
        if (res.isConfirmed) {
          this.$axios.delete(`${this.apiURL}/terminalExamples/${id}`)
            .then(res => {
              if(res.status === 200) {
                this.terminalExamples.splice(i, 1);
                this.$swal.fire('Terminal Example Deleted Successfully', ``, 'success');
              }
            })
            .catch(err => console.log(err))
        } else if (res.isDenied) {
          this.$swal.fire('Terminal Example was not deleted..!', '', 'info');
        }
      })
    },
    clearTerminalExampleForm() {
      this.terminalExample.id = ''; this.terminalExample.terminalID = ''; this.terminalExample.applicationID = '';
      this.terminalExample.moduleID = ''; this.terminalExample.description = ''; this.applicationModules = []; 
      this.moduleTerminals = []; this.edit = false; document.querySelector('#terminalExampleForm').reset();
    }
  }
}
</script>

<style scoped>
.loading {
  position: absolute;
  background: rgba(255,255,255,.95);
  top: 0; left: 0;
  width: 100%;
  height: 100%;
  z-index: 3;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
</style>