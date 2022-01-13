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
          <th class="text-center">Required?</th>
          <th>Description</th>
          <th>Edit</th>
          <th>Delete</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(parameter, i) in terminalParameters" :key="parameter.id">
          <td>{{ parameter.name }}</td>
          <td>{{ parameter.terminal.name }}</td>
          <td class="text-center">{{ parameter.required ? 'Yes' : '' }}</td>
          <td>{{ parameter.description }}</td>
          <td><a @click.prevent="loadTerminalParameter(i)" href="#">Edit</a></td>
          <td><a @click.prevent="removeTerminalParameter(i)" href="#">Delete</a></td>
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
              <div class="row">
                <div class="col-lg-4 form-group">
                  <label for="application_id">Select Application</label>
                  <select name="application_id" v-model="terminalParameter.applicationID" id="application_id" class="form-control">
                    <option value="" selected disabled>--- Select Application ---</option>
                    <option v-for="application in applications" :value="application.id" :key="application.id">
                      {{ application.name }}
                    </option>
                  </select>
                </div>
                <div class="col-lg-4 form-group">
                  <label for="module_id">Select Module</label>
                  <select name="module_id" v-model="terminalParameter.moduleID" id="module_id" class="form-control">
                    <option value="" selected disabled>--- Select Module ---</option>
                    <option v-for="module in (!edit ? applicationModules : modules)" 
                      :value="module.id" :key="module.id"
                    >{{ module.name }}</option>
                  </select>
                </div>
                <div class="col-lg-4 form-group">
                  <label for="terminal_id">Select Terminal</label>
                  <select name="terminal_id" v-model="terminalParameter.terminalID" id="terminal_id" class="form-control">
                    <option value="" selected disabled>--- Select Terminal ---</option>
                    <option v-for="terminal in (!edit ? moduleTerminals : terminals)" 
                      :value="terminal.id" :key="terminal.id"
                    >{{ terminal.name }}</option>
                  </select>
                </div>
              </div>
              <div class="form-group">
                <label for="name">Terminal Parameter Name</label>
                <input type="text" name="name" v-model="terminalParameter.name" id="name" class="form-control">
              </div>
              <div class="form-group">
                <label>
                  <input type="checkbox" name="required" v-model="terminalParameter.required" id="required"> 
                  Please mark this if the terminal parameter is a must, leave un-checked if optional
                </label>
              </div>
              <div class="form-group">
                <label for="description">Terminal Parameter Description</label>
                <textarea name="description" 
                  v-model="terminalParameter.description" id="description" cols="30" rows="4" class="form-control"
                ></textarea>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button @click.prevent="clearTerminalParameterForm()" type="button" class="btn btn-outline-secondary">Clear</button>
            <button @click.prevent="validateData" type="button" class="btn btn-primary">
              {{ !edit ? 'Add Terminal Parameter' : 'Save Changes' }}
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
      terminalParameter: { id:'', name:'', applicationID:'', moduleID:'', terminalID:'', required:false, description:'' },
      terminalParameters: [], applications: [], modules: [], terminals: [], applicationModules: [], moduleTerminals:[],
      apiURL: this.$apiURL, edit: false
    }
  },
  mounted() {
    this.getTerminalParameters();
    this.getApplications();
    this.getTerminals();
    this.getModules();
  },
  computed: {
    applicationID: function() {
      return this.terminalParameter.applicationID
    },
    moduleID: function() {
      return this.terminalParameter.moduleID
    }
  },
  watch: {
    applicationID: function(id) {
      if(id) this.getApplicationModules(id)
    },
    moduleID: function(id) {
      if(id) this.getModuleTerminals(id)
    }
  },
  methods: {
    validateData() {
      this.sendData();
    },
    sendData() {
      let vm = this;
      if(vm.edit) {
        // edit data
        let formData = new FormData(this.$refs.terminalParameterForm)
        formData.append('_method', 'PUT')
        vm.$axios.post(`${vm.apiURL}/terminalParameters/${vm.terminalParameter.id}`, formData)
          .then(res => { // console.log(res)
             if(res.status === 200) {
               this.$jquery('#terminalParameterModal').modal('hide');
               this.$swal('Parameter Saved Successfully','Parameter details were updated','success')
                .then(this.clearTerminalParameterForm());
             }
           })
          .catch(err => console.log(err))
      } else {
        // add data
        let formData = new FormData(this.$refs.terminalParameterForm)
        vm.$axios.post(`${vm.apiURL}/terminalParameters`, formData)
          .then(res => { // console.log(res)
             if(res.status === 201) {
               this.$jquery('#terminalParameterModal').modal('hide');
               this.$swal('Parameter Added Successfully','New Parameter was added','success')
                .then(this.clearTerminalParameterForm());
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
    getTerminalParameters() {
      this.$axios.get(`${this.apiURL}/terminalParameters`)
        .then(res => this.terminalParameters = res.data.data)
        .catch(err => console.log(err))
    },
    getApplications() {
      this.$axios.get(`${this.apiURL}/applications`)
        .then(res => this.applications = res.data.data)
        .catch(err => console.log(err))
    },
    getApplicationModules(id) {
      this.$axios.get(`${this.apiURL}/applications/${id}/modules`)
        .then(res => this.applicationModules = res.data.data)
        .catch(err => this.$swal('No Modules added yet',`Were expecting chosen Application Modules, ${err.response.data.message}`,'info'))
    },
    getModuleTerminals(id) {
      this.$axios.get(`${this.apiURL}/modules/${id}/terminals`)
        .then(res => this.moduleTerminals = res.data.data)
        .catch(err => {
          this.$swal('No Terminals added yet',`Were expecting chosen Module Terminals, ${err.response.data.message}`,'info');
          this.moduleTerminals = [];
        })
    },
    loadTerminalParameter(i) {
      this.edit = true; this.$jquery('#terminalParameterModal').modal('show')
      this.terminalParameter.id = this.terminalParameters[i].id;
      this.terminalParameter.name = this.terminalParameters[i].name;
      this.terminalParameter.required = this.terminalParameters[i].required
      this.terminalParameter.description = this.terminalParameters[i].description;
      this.terminalParameter.terminalID = this.terminalParameters[i].terminal.id;

      // retrieve module ID, then applicationID
      this.$axios.get(`${this.apiURL}/terminals/${this.terminalParameter.terminalID}`)
        .then(res => { // console.log(res.data.data.module.id)
          this.terminalParameter.moduleID = res.data.data.module.id;
          this.$axios.get(`${this.apiURL}/modules/${this.terminalParameter.moduleID}`)
            .then(res => this.terminalParameter.applicationID = res.data.data.application.id);
        }
      );
    },
    removeTerminalParameter(i) {
      let id = this.terminalParameters[i].id;
      this.$swal.fire({
        title: 'Are you sure you want to delete this Terminal Parameter?',
        text:'This process is irreversible, you can\'t recover the parameter after confirmation',
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: 'Yes, Delete',
        denyButtonText: `No, don't delete`,
      }).then((res) => {
        if (res.isConfirmed) {
          this.$axios.delete(`${this.apiURL}/terminalParameters/${id}`)
            .then(res => {
              if(res.status === 200) {
                this.terminalParameters.splice(i, 1);
                this.$swal.fire('Parameter Deleted Successfully', ``, 'success');
              }
            })
            .catch(err => console.log(err))
        } else if (res.isDenied) {
          this.$swal.fire('Parameter was not deleted..!', '', 'info');
        }
      })
    },
    clearTerminalParameterForm() {
      this.terminalParameter.id = ''; this.terminalParameter.name = ''; this.terminalParameter.applicationID = '';
      this.terminalParameter.moduleID = ''; this.terminalParameter.terminalID = ''; this.terminalParameter.required = '';
      this.terminalParameter.description = ''; this.applicationModules = []; this.moduleTerminals = [];
      this.edit = false; document.querySelector('#terminalParameterForm').reset();
    }
  }
}
</script>