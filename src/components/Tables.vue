<template>
  <div>
    <div v-if="!tables.length && showLoading" class="loading">
      <h1>Loading...</h1>
      <p class="text-black-50">Please wait for content</p>
      <button @click="showLoading = false" class="btn btn-sm btn-outline-secondary">
        Taking too long? Cancel
      </button>
    </div>
    <div class="row">
      <div class="col-12">
        <h1 class="mb-3">
          Tables
          <button class="btn btn-outline-primary float-right" data-toggle="modal" data-target="#tableModal">Add New Table</button>
        </h1>
      </div>
      <div class="col-12">
        <h3 v-if="!tables.length" class="text-danger">Sorry, No Tables</h3>
        <table v-else class="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Module</th>
              <th>Description</th>
              <th class="mw-10">Edit</th>
              <th class="mw-10">Delete</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(table, i) in tables" :key="table.id">
              <td>{{ table.name }}</td>
              <td>{{ table.module.name }}</td>
              <td>{{ table.description }}</td>
              <td><a @click.prevent="loadTable(i)" href="#">Edit</a></td>
              <td><a @click.prevent="removeTable(i)" href="#">Delete</a></td>
            </tr>
          </tbody>
        </table>

        <div class="modal fade" id="tableModal" data-backdrop="static" data-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
          <div class="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="staticBackdropLabel">{{ !edit ? 'Add New Table' : 'Edit Table' }}</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div class="modal-body">
                <form ref="tableForm" id="tableForm">
                  <div class="row">
                    <div class="col-lg-6 form-group">
                      <label for="application_id">Select Application</label>
                      <select name="application_id" v-model="table.applicationID" id="application_id" class="form-control">
                        <option value="" selected disabled>--- Select Application ---</option>
                        <option v-for="application in applications" 
                          :value="application.id" :key="application.id"
                        >{{ application.name }}</option>
                      </select>
                    </div>
                    <div class="col-lg-6 form-group">
                      <label for="module_id">Select Module</label>
                      <select name="module_id" v-model="table.moduleID" id="module_id" class="form-control">
                        <option value="" selected disabled>--- Select Module ---</option>
                        <option v-for="module in applicationModules" 
                          :value="module.id" :key="module.id"
                        >{{ module.name }}</option>
                      </select>
                    </div>
                  </div>
                  <div class="col-lg-12 form-group">
                    <label for="name">Table Name</label>
                    <input type="text" name="name" v-model="table.name" id="name" class="form-control">
                  </div>
                  <div class="col-lg-12 form-group">
                    <label for="description">Table Description</label>
                    <textarea name="description" v-model="table.description"
                      id="description" cols="30" rows="4" class="form-control"
                    ></textarea>
                  </div>
                </form>
              </div>
              <div class="modal-footer">
                <button @click.prevent="clearTableForm" type="button" class="btn btn-outline-secondary">Clear</button>
                <button @click.prevent="validateData" type="button" class="btn btn-primary">
                  {{ !edit ? 'Add new Table' : 'Save Changes' }}
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
      table: { id:'', name:'', moduleID:'', applicationID:'', description:'' },
      tables: [], applications: [], applicationModules: [], modules: [],
      apiURL: this.$apiURL, showLoading: true,
      edit: false
    }
  },
  mounted() {
    this.getTables();
    this.getModules();
    this.getApplications();
  },
  computed: {
    applicationID: function() { return this.table.applicationID },
    moduleID: function() { return this.table.moduleID }
  },
  watch: {
    // watching applicationID
    applicationID: function(id) {
      if(id) {
        this.$axios.get(`${this.apiURL}/applications/${id}/modules`)
        .then(res => this.applicationModules = res.data.data)
        .catch(err => console.log(err))
      } else {
        this.applicationModules = [];
      }
    }
  },
  methods: {
    validateData() {
      this.sendData()
    },
    sendData() {
      let vm = this;
      if(vm.edit) {
        // edit data
        let formData = new FormData(vm.$refs.tableForm)
        formData.append('_method', 'PUT')
        vm.$axios.post(`${vm.apiURL}/tables/${vm.table.id}`, formData)
          .then(res => {
             if(res.status === 200) {
               this.$jquery('#tableModal').modal('hide');
               this.$swal('Table Updated Successfully','Table details were updated','success')
                .then(this.clearTableForm());
             }
           })
           .catch(err => console.log(err))
      } else {
        // add data
        let formData = new FormData(vm.$refs.tableForm)
        vm.$axios.post(`${vm.apiURL}/tables`, formData)
          .then(res => {
             if(res.status === 201) {
               this.$jquery('#tableModal').modal('hide');
               this.$swal('Table Added Successfully','New Table have been added/created','success')
                .then(this.clearTableForm());
             }
           })
           .catch(err => console.log(err))
      }
    },
    getTables() {
      this.$axios.get(`${this.apiURL}/tables`)
      .then(res => this.tables = res.data.data)
      .catch(err => console.log(err))
    },
    getApplications() {
      this.$axios.get(`${this.apiURL}/applications`)
        .then(res => this.applications = res.data.data)
        .catch(err => console.log(err))
    },
    getModules() {
      this.$axios.get(`${this.apiURL}/modules`)
        .then(res => this.modules = res.data.data)
        .catch(err => console.log(err))
    },
    loadTable(i) {
      this.edit = true; this.$jquery('#tableModal').modal('show');
      this.table.id = this.tables[i].id;
      this.table.name = this.tables[i].name;
      this.table.description = this.tables[i].description;
      this.table.moduleID = this.tables[i].module.id;
      this.table.applicationID = this.tables[i].module.application_id;
    },
    removeTable(i) {
      let id = this.tables[i].id;
      this.$swal.fire({
        title: 'Are you sure you want to delete this Table?',
        text:'This process is irreversible, you can\'t recover the table after confirmation',
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: 'Yes, Delete',
        denyButtonText: `No, don't delete`,
      }).then((res) => {
        if (res.isConfirmed) {
          this.$axios.delete(`${this.apiURL}/tables/${id}`)
            .then(res => {
              if(res.status === 200) {
                this.tables.splice(i, 1);
                this.$swal.fire('Table Deleted Successfully', ``, 'success');
              }
            })
            .catch(err => console.log(err))
        } else if (res.isDenied) {
          this.$swal.fire('Table was not deleted..!', '', 'info')
        }
      })
    },
    clearTableForm() {
      this.table.id = ''; this.table.name = ''; this.table.moduleID = '';
      this.table.applicationID = ''; this.table.description = '';
      this.edit = false; document.querySelector('#tableForm').reset();
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