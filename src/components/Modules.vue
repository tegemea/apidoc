<template>
  <div>
    <div class="row">
      <div class="col-12">
        <h1 class="mb-3">
          Modules
          <button class="btn btn-outline-primary float-right" data-toggle="modal" data-target="#moduleModal">Add New Module</button>
        </h1>
        <table class="table">
          <thead>
            <tr>
              <th>Module Name</th>
              <th>Application</th>
              <th>Related?</th>
              <th>Relationships</th>
              <th class="text-center">Terminals</th>
              <th class="text-center">Tables</th>
              <th>Edit</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(module, i) in modules" :key="module.id">
              <td>{{ module.name }}</td>
              <td>{{ module.application.name }}</td>
              <td>{{ module.related ? 'Yes' : '---' }}</td>
              <td>{{ module.relationships }}</td>
              <td class="text-center">
                <a v-if="module.terminals.length"
                  :title="`View ${module.name} terminals`"
                  @click.prevent="loadModuleTerminals(i)"
                  data-toggle="modal" data-target="#moduleTerminalsModal"
                  href="#" class="btn btn-secondary badge badge-pill badge-secondary">
                  {{ module.terminals.length }}
                </a>
              </td>
              <td class="text-center">
                <a v-if="module.tables.length"
                  :title="`View ${module.name} tables`"
                  @click.prevent="loadModuleTables(i)"
                  data-toggle="modal" data-target="#moduleTablesModal"
                  href="#" class="btn btn-secondary badge badge-pill badge-secondary">
                  {{ module.tables.length }}
                </a>
              </td>
              <td><a @click.prevent="loadModule(i)" href="#">Edit</a></td>
              <td><a @click.prevent="removeModule(i)" href="#">Delete</a></td>
            </tr>
          </tbody>
        </table>

        <div class="modal fade" id="moduleModal" data-backdrop="static" data-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
          <div class="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="staticBackdropLabel">{{ !edit ? 'Add Module' : 'Edit Module' }}</h5>
                <button @click="clearModuleForm()" type="button" class="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div class="modal-body">
                <form ref="moduleForm" id="moduleForm">
                  <div class="row">
                    <div class="col-lg-4 form-group">
                      <label for="application_id">Select Application</label>
                      <select name="application_id" v-model="module.applicationID" id="application_id" class="form-control">
                        <option value="" selected disabled>--- Select Application ---</option>
                        <option v-for="application in applications" 
                          :value="application.id" 
                          :key="application.id"
                        >{{ application.name }}</option>
                      </select>
                    </div>
                    <div class="col-lg-8 form-group">
                      <label for="name">Module Name</label>
                      <input type="text" name="name" v-model="module.name" id="name" class="form-control">
                    </div>
                  </div>
                  <div class="form-group">
                    <label>
                      <input type="checkbox" v-model="module.related" id="related">
                      Please mark here if this module is related to other modules in anyway
                    </label>
                  </div>
                  <div v-if="module.related" class="form-group">
                    <label for="relationships">Elaborate Relationships</label>
                    <textarea name="relationships" 
                      v-model="module.relationships" id="relationship"
                      cols="30" rows="3" class="form-control"
                      placeholder="This module can have several one other modules"
                    ></textarea>
                  </div>
                  <div class="form-group">
                    <label for="description">Module Description</label>
                    <textarea name="description" v-model="module.description" 
                      id="description" cols="30" rows="5" class="form-control"
                    ></textarea>
                  </div>
                </form>
              </div>
              <div class="modal-footer">
                <button @click.prevent="clearModuleForm()" type="button" class="btn btn-outline-secondary">Clear</button>
                <button @click.prevent="validateData" type="button" class="btn btn-primary">
                  {{ !edit ? 'Add Module' : 'Save Changes' }}
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Module Terminals Modal -->
        <div class="modal fade" id="moduleTerminalsModal" data-backdrop="static" data-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
          <div class="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="staticBackdropLabel">Module Terminals</h5>
                <button @click="moduleTerminals = []" type="button" class="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div class="modal-body pt-0">
                <table class="table">
                  <thead>
                    <tr>
                      <th>Terminal Name</th>
                      <th>Method</th>
                      <th>Path</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="terminal in moduleTerminals" :key="terminal.id">
                      <td>{{ terminal.name }}</td>
                      <td>{{ terminal.method }}</td>
                      <td>{{ terminal.path }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div class="modal-footer">
                <button @click="moduleTerminals = []" type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                <!-- <button type="button" class="btn btn-primary">Understood</button> -->
              </div>
            </div>
          </div>
        </div>

        <!-- Module Tables Modal -->
        <div class="modal fade" id="moduleTablesModal" data-backdrop="static" data-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
          <div class="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="staticBackdropLabel">Module Tables</h5>
                <button @click="moduleTables = []" type="button" class="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div class="modal-body pt-0">
                <table class="table">
                  <thead>
                    <tr>
                      <th>Table Name</th>
                      <th>Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="table in moduleTables" :key="table.id">
                      <td>{{ table.name }}</td>
                      <td>{{ table.description }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div class="modal-footer">
                <button @click="moduleTables = []" type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
  data() {
    return {
      module: { id:'', applicationID:'', name:'', description:'', related: false, relationships:'', },
      // modules: [], 
      moduleTerminals: [], 
      // applications: [], 
      moduleTables: [],
      // baseServerURL: this.$baseServerURL,
      // apiURL: this.$apiURL,
      edit: false
    }
  },
  computed: {
    ...mapGetters(['applications', 'modules', 'apiURL', 'baseURL']),
    ...mapActions(['setApplications','setModules'])
  },
  mounted() {
    // 
  },
  methods: {
    validateData() {
      this.sendData();
    },
    sendData() {
      let vm = this;
      if(vm.edit) {
        // edit data
        let formData = new FormData(vm.$refs.moduleForm);
        formData.append('_method', 'PUT');
        formData.append('related', vm.module.related ? 1 : 0);

        vm.$axios.post(`${vm.apiURL}/modules/${vm.module.applicationID}/${vm.module.id}`, formData)
          .then(res => { //console.log(res)
             if(res.status === 200) {
               this.$jquery('#moduleModal').modal('hide');

              // update the UI
              const theModule = this.modules.find(m => m.id === this.module.id);

              theModule.name = res.data.data.name; theModule.description = res.data.data.description;
              theModule.application = res.data.data.application; theModule.related = res.data.data.related;
              theModule.relationships = res.data.data.relationships; theModule.terminals = res.data.data.terminals;
              theModule.tables = res.data.data.tables;

              this.$swal('Module Saved Successfully','Module details were updated','success')
                .then(this.clearModuleForm());
             }
           })
           .catch(err => console.log(err))
      } else {
        // add data
        let formData = new FormData(vm.$refs.moduleForm);
        formData.append('related', vm.module.related ? 1 : 0);
       
        vm.$axios.post(`${vm.apiURL}/modules/`, formData)
          .then(res => { //console.log(res.data.data)
            if(res.status === 201) {
              this.$jquery('#moduleModal').modal('hide');

              // add new module into the list
              this.modules.push({ 
                  id: res.data.data.id, application: res.data.data.application, 
                  name:res.data.data.name, description:res.data.data.description, 
                  related: res.data.data.related, relationships: res.data.data.relationships,
                  terminals: res.data.data.terminals, tables: res.data.data.tables
                })

              this.$swal('Module Added Successfully','New module with details was added','success')
                .then(this.clearModuleForm());
             }
           })
          .catch(err => console.log(err))
      }
    },
    // getModules() {
    //   this.$axios.get(`${this.apiURL}/modules`)
    //     .then(res => this.modules = res.data.data)
    //     .catch(err => console.log(err))
    // },
    // getApplications() {
    //   this.$axios.get(`${this.apiURL}/applications`)
    //     .then(res => this.applications = res.data.data)
    //     .catch(err => console.log(err))
    // },
    loadModule(i) {
      this.edit = true; this.$jquery('#moduleModal').modal('show');
      this.module.id = this.modules[i].id;
      this.module.name = this.modules[i].name;
      this.module.application = this.modules[i].application;
      this.module.applicationID = this.modules[i].application.id;
      this.module.description = this.modules[i].description;
      this.module.relationships = this.modules[i].relationships;
      this.module.related = this.modules[i].related;
    },
    loadModuleTerminals(i) {
      this.moduleTerminals = this.modules[i].terminals;
    },
    loadModuleTables(i) {
      this.moduleTables = this.modules[i].tables;
    },
    removeModule(i) {
      let id = this.modules[i].id;
      this.$swal.fire({
        title: 'Are you sure you want to delete this Module?',
        text:'This process is irreversible, you can\'t recover the module after confirmation',
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: 'Yes, Delete',
        denyButtonText: `No, don't delete`,
      }).then((res) => {
        if (res.isConfirmed) {
          this.$axios.delete(`${this.apiURL}/modules/${id}`)
            .then(res => {
              if(res.status === 200) {
                this.modules.splice(i, 1);
                this.$swal.fire('Module Deleted Successfully', ``, 'success');
              }
            })
            .catch(err => console.log(err))
        } else if (res.isDenied) {
          this.$swal.fire('Module was not deleted..!', '', 'info');
        }
      })
    },
    clearModuleForm() {
      this.module.id = ''; this.module.applicationID = ''; this.module.name = ''; this.module.application = '';
      this.module.description = ''; this.module.related = ''; this.module. relationships = '';
      this.edit = false; document.querySelector('#moduleForm').reset();
    }
  }
}
</script>