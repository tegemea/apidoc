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
              <td>{{ module.related ? 'Yes' : '---' }}</td>
              <td>{{ module.relationships }}</td>
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
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      module: { id:'', applicationID:'', name:'', description:'', related: false, relationships:'', },
      modules: [], applications: [],
      baseServerURL: this.$baseServerURL,
      apiURL: this.$apiURL,
      edit: false
    }
  },
  mounted() {
    this.getModules();
    this.getApplications();
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
          .then(res => { // console.log(res)
             if(res.data.status === true) {
               this.$jquery('#moduleModal').modal('hide');
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
          .then(res => { console.log(res)
             if(res.data.status === true) {
               this.$jquery('#moduleModal').modal('hide');
               this.$swal('Module Added Successfully','New module with details was added','success')
                .then(this.clearModuleForm());
             }
           })
          .catch(err => console.log(err))
      }
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