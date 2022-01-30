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
          <th class="text-center">Method</th>
          <th class="text-center">Http Codes</th>
          <th>Path</th>
          <th>Edit</th>
          <th>Delete</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(terminal, i) in terminals" :key="terminal.id">
          <td>{{ terminal.name }}</td>
          <td>{{ terminal.module.name }}</td>
          <td class="text-center">{{ terminal.method }}</td>
          <td class="text-center">
            <button 
              @click.prevent="loadTerminalCodes(i)"
              v-if="terminal.codes.length" class="btn btn-secondary badge badge-pill">
              {{ terminal.codes.length }}
            </button>
          </td>
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
                <div class="col-lg-4 form-group">
                  <label for="application_id">Select Application</label>
                  <select name="application_id" v-model="terminal.applicationID" id="application_id" class="form-control">
                    <option value="" selected disabled>--- Select Application ---</option>
                    <option v-for="application in applications" :value="application.id" :key="application.id">
                      {{ application.name }}
                    </option>
                  </select>
                </div>
                <div class="col-lg-4 form-group">
                  <label for="module_id">Select Module</label>
                  <select name="module_id" v-model="terminal.moduleID" id="module_id" class="form-control">
                    <option value="" selected disabled>--- Select Module ---</option>
                    <option v-for="module in applicationModules" :value="module.id" :key="module.id">{{ module.name }}</option>
                  </select>
                </div>
                <div class="col-lg-4 form-group">
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
                <div class="card">
                  <div class="card-header">Choose Http Codes for this terminal</div>
                  <div class="card-body">
                    <div class="row">
                      <div v-for="code in (!edit ? httpCodes : terminal.codes)" class="col-lg-4" :key="code.id">
                        <label>
                          <input type="checkbox" v-model="code.checked">
                            {{ code.code }} {{ code.name }}
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="form-group">
                <label for="description">Description</label>
                <textarea name="description" v-model="terminal.description" 
                  id="description" cols="30" rows="4" class="form-control"
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

    <!-- Terminals Codes Modal -->
    <div class="modal fade" id="terminalCodesModal" data-backdrop="static" data-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="staticBackdropLabel">Terminal Codes</h5>
            <button @click="terminal.codes = []" type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body pt-0">
            <table class="table">
              <thead>
                <tr>
                  <th class="text-center">Code</th>
                  <th>Name</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="code in terminal.codes" :key="code.id">
                  <td class="text-center">{{ code.code }}</td>
                  <td>{{ code.name }}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="modal-footer">
            <button @click="terminal.codes = []" type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
import { mapGetters, mapMutations } from 'vuex';

export default {
  data() {
    return {
      terminal: { id:'', name:'', description:'', method:'', path:'', applicationID:'', moduleID:'', codes: [] },
      applicationModules: [],
      edit: false
    }
  },
  computed: {
    ...mapGetters(['baseURL', 'apiURL', 'applications', 'modules', 'httpCodes', 'terminals']),
    applicationID: function() {
      return this.terminal.applicationID;
    }
  },
  watch: {
    applicationID: function(applicationID) {
      if(applicationID) {
        this.applicationModules = this.applications.find(a => a.id === applicationID).modules;
      } else {
        this.applicationModules = [];
      }
    }
  },
  mounted() {
    this.httpCodes.forEach(c => c.checked = false);
  },
  methods: {
    ...mapMutations(['updateTerminal']),
    validateData() {
      this.sendData();
    },
    sendData() {
      let vm = this;
      if(vm.edit) {
        // edit data
        let formData = new FormData(vm.$refs.terminalForm)
        formData.append('_method', 'PUT');
        for(let i in this.terminal.codes) {
          if(this.terminal.codes[i].checked) {
            formData.append(`codes[${i}]`, this.terminal.codes[i].id);
          }
        }

        // for(var pair of formData.entries()) {
        //   console.log(pair[0]+ ', '+ pair[1]);
        // }
        
        this.$axios.post(`${vm.apiURL}/terminals/${vm.terminal.id}`, formData)
          .then(res => {
             if(res.status === 200) {

               const data = {
                 id: res.data.data.id, name: res.data.data.name, description: res.data.data.description, 
                 path: res.data.data.path, method: res.data.data.method, codes: res.data.data.codes, 
                 module: res.data.data.module
               }

               this.updateTerminal(data);

               this.$jquery('#terminalModal').modal('hide');
               this.$swal('Terminal Saved Successfully','Terminal details were updated','success')
                .then(this.clearTerminalForm());
             }
           })
          .catch(err => console.log(err))
      } else {
        // add data
        let formData = new FormData(vm.$refs.terminalForm)
        for(let i in this.httpCodes) {
          if(this.httpCodes[i].checked) {
            formData.append(`codes[${i}]`, this.httpCodes[i].id);
          }
        }
        this.$axios.post(`${vm.apiURL}/terminals`, formData)
          .then(res => {
             if(res.data.status === true) {
               this.$jquery('#terminalModal').modal('hide');
               this.$swal('Terminal Added Successfully','New terminal with details was added','success')
                .then(this.clearTerminalForm());
             }
           })
          .catch(err => console.log(err))
      }
    },
    loadTerminalCodes(i) {
      this.$jquery('#terminalCodesModal').modal('show');
      this.terminal.codes = this.terminals[i].codes;
    },
    loadTerminal(i) {
      this.edit = true; this.$jquery('#terminalModal').modal('show');
      this.terminal.id = this.terminals[i].id;
      this.terminal.name = this.terminals[i].name;
      this.terminal.description = this.terminals[i].description;
      this.terminal.method = this.terminals[i].method;
      this.terminal.path = this.terminals[i].path;
      this.terminal.moduleID = this.terminals[i].module.id;
      this.terminal.applicationID = this.modules.find(m => m.id === this.terminal.moduleID).application.id;
            
      // add checked into each terminal code for checked codes
      if(this.terminals[i].codes.length) {
        let terminalCodes = this.terminals[i].codes;
        terminalCodes.forEach(tCode => tCode.checked = true)
        let allHttpCodes = this.httpCodes;
        allHttpCodes.forEach(hCode => hCode.checked = false)
        
        // use lodash (_.unionBy) to join two array of objects with no duplicates
        this.terminal.codes = this.$_.unionBy(terminalCodes, allHttpCodes, 'id'); 
      } else {
        this.terminal.codes = this.httpCodes;
        this.terminal.codes.forEach(c => c.checked = false);
      }
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
      this.terminal.applicationID = ''; this.applicationModules = [];
      this.terminal.codes.forEach(c => c.checked = false); this.edit = false;
      document.querySelector('#terminalForm').reset();
    }
  }
}
</script>