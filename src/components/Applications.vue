<template>
  <div>
    <div v-if="!applications.length && showLoading" class="loading">
      <h1>Loading...</h1>
      <p class="text-black-50">Please wait for content</p>
      <button @click="showLoading = false" class="btn btn-sm btn-outline-secondary">
        Taking too long? Cancel
      </button>
    </div>
    <div class="row">
      <div class="col-12">
        <h1 class="mb-3">
          Applications
          <button class="btn btn-outline-primary float-right" 
            data-toggle="modal" 
            data-target="#applicationModal"
          >Add New Application</button>
        </h1>
      </div>
      <div class="col-12">
        <h3 v-if="!applications.length" class="text-danger">Sorry, No Applications</h3>
        <table v-else class="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Version</th>
              <th>Format</th>
              <th>Scheme</th>
              <th>Base URL</th>
              <th class="text-center">Modules</th>
              <th class="mw-10">Edit</th>
              <th class="mw-10">Delete</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(application, i) in applications" :key="application.id">
              <td>{{ application.name }}</td>
              <td>{{ application.version }}</td>
              <td>{{ application.format }}</td>
              <td>{{ application.scheme }}</td>
              <td>{{ application.base_url }}</td>
              <td class="text-center">
                <button href="#" :title="`View ${application.name} modules`"
                  v-if="application.modules.length"
                  data-toggle="modal" data-target="#modulesListingModal"
                  class="btn btn-secondary badge badge-pill badge-secondary"
                  @click.prevent="loadApplicationModules(i)">
                  {{ application.modules.length }}
                </button>
              </td>
              <td><a @click.prevent="loadApplicaton(i)" href="#">Edit</a></td>
              <td><a @click.prevent="removeApplication(i)" href="#">Delete</a></td>
            </tr>
          </tbody>
        </table>

        <!-- Application Modal -->
        <div class="modal fade" id="applicationModal" data-backdrop="static" data-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
          <div class="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="staticBackdropLabel">{{ !edit ? 'Add Application' : 'Edit Application' }}</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div class="modal-body">
                <form ref="applicationForm" id="applicationForm">
                  <div class="form-group">
                    <label for="name">Name</label>
                    <input type="text" name="name" v-model="application.name" id="name" class="form-control">
                  </div>
                  <div class="row">
                    <div class="col-lg-4 form-group">
                      <label for="version">Version</label>
                      <input type="text" name="version" v-model="application.version" id="version" class="form-control">
                    </div>
                    <div class="col-lg-4 form-group">
                      <label for="format">Format</label>
                      <input type="text" name="format" v-model="application.format" id="format" class="form-control">
                    </div>
                    <div class="col-lg-4 form-group">
                      <label for="scheme">Scheme</label>
                      <input type="text" name="scheme" v-model="application.scheme" id="scheme" class="form-control">
                    </div>
                  </div>
                  <div class="form-group">
                    <label for="base_url">Base URL</label>
                    <input type="text" name="base_url" v-model="application.baseURL" id="base_url" class="form-control">
                  </div>
                  <div class="form-group">
                    <label for="description">Description</label>
                    <textarea name="description" 
                      v-model="application.description" 
                      id="description" cols="30" rows="6" class="form-control"
                    ></textarea>
                  </div>
                </form>
              </div>
              <div class="modal-footer">
                <button @click.prevent="clearApplicationForm" type="button" class="btn btn-outline-secondary">Clear</button>
                <button @click.prevent="validateData" type="button" class="btn btn-primary">{{ !edit ? 'Add Application' : 'Save Changes' }}</button>
              </div>
            </div>
          </div>
        </div>

        <!-- Modules Listing Modal -->
        <div class="modal fade" id="modulesListingModal" data-backdrop="static" data-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
          <div class="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="staticBackdropLabel">Modules</h5>
                <button @click="applicationModules = []" type="button" class="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div class="modal-body pt-0">
                <table class="table">
                  <thead>
                    <tr>
                      <th>Module Name</th>
                      <th>Related?</th>
                      <th>Relationships</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="module in applicationModules" :key="module.id">
                      <td>{{ module.name }}</td>
                      <td>{{ module.related ? 'Yes' : '' }}</td>
                      <td>{{ module.relationships }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div class="modal-footer">
                <button @click="applicationModules = []" type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
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
      application: { id: '', name: '', description:'', version:'', format:'', scheme:'', baseURL:'' },
      applications: [], applicationModules: [], showLoading: true,
      baseServerURL: this.$baseServerURL,
      apiURL: this.$apiURL,
      edit: false,
    }
  },
  mounted() {
    this.getApplications()
  },
  methods: {
    validateData() {
      this.sendData();
    },
    sendData() {
      let vm = this;
      if(vm.edit) {
        // edit data
        let formData = new FormData(vm.$refs.applicationForm)
        formData.append('_method', 'PUT');

        vm.$axios.post(`${vm.apiURL}/applications/${vm.application.id}`, formData)
           .then(res => {
             if(res.data.status === true) {
               this.$jquery('#applicationModal').modal('hide');
               this.$swal('Application Saved Successfully','API Doc details were updated','success')
                .then(this.clearApplicationForm());
             }
           })
           .catch(err => console.log(err))
      } else {
        // add data
        let formData = new FormData(vm.$refs.applicationForm)
        vm.$axios.post(`${vm.apiURL}/applications/`, formData)
          .then(res => {
             if(res.status === 201) {
                this.$jquery('#applicationModal').modal('hide');
            
              this.applications.push({ 
                id: res.data.data.id, name: res.data.data.name, description: res.data.data.description, 
                version: res.data.data.version, format: res.data.data.format, scheme: res.data.data.scheme, 
                baseURL: res.data.data.base_url, modules: res.data.data.modules
              });

              this.$swal('Application Added Successfully','','success')
                .then(this.clearApplicationForm());

             }
           })
           .catch(err => console.log(err))
      }
    },
    getApplications() {
      this.$axios.get(`${this.apiURL}/applications`)
        .then(res => this.applications = res.data.data)
        .catch(err => console.log(err))
    },
    loadApplicaton(i) {
      this.edit = true; this.$jquery('#applicationModal').modal('show');
      
      this.application.id = this.applications[i].id;
      this.application.name = this.applications[i].name;
      this.application.description = this.applications[i].description;
      this.application.version = this.applications[i].version;
      this.application.format = this.applications[i].format;
      this.application.scheme = this.applications[i].scheme;
      this.application.baseURL = this.applications[i].base_url;
    },
    loadApplicationModules(i) {
      this.applicationModules = this.applications[i].modules;
    },
    removeApplication(i) {
      let id = this.applications[i].id;
      this.$swal.fire({
        title: 'Are you sure you want to delete this Application?',
        text:'This process is irreversible, you can\'t recover the application after confirmation',
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: 'Yes, Delete',
        denyButtonText: `No, don't delete`,
      }).then((res) => {
        if (res.isConfirmed) {
          this.$axios.delete(`${this.apiURL}/applications/${id}`)
            .then(res => {
              if(res.status === 200) {
                this.applications.splice(i, 1);
                this.$swal.fire('Application Deleted Successfully', ``, 'success');
              }
            })
            .catch(err => console.log(err))
        } else if (res.isDenied) {
          this.$swal.fire('Application was not deleted..!', '', 'info')
        }
      })
    },
    clearApplicationForm() {
      this.application.id = '', this.application.name = ''; this.application.description = ''; 
      this.application.version = ''; this.application.format = ''; this.application.scheme = '';
      this.application.baseURL = ''; document.querySelector('#applicationForm').reset()
      this.edit = false;
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