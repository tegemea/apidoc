<template>
  <div>
    <div class="row">
      <div class="col-lg-12">
        <h1 class="mb-3">
          Table Fields
          <button class="btn btn-outline-primary float-right" data-toggle="modal" data-target="#tableFieldModal">
            Add New Table Field
          </button>
        </h1>
      </div>
      <div class="col-lg-12">
        <table class="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Table</th>
              <th>Type</th>
              <th>Description</th>
              <th>Edit</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(field, i) in tableFields" :key="field.id">
              <td>{{ field.name }}</td>
              <td>{{ field.table.name }}</td>
              <td>{{ field.type }}</td>
              <td>{{ field.description }}</td>
              <td><a @click.prevent="loadTableField(i)" href="#">Edit</a></td>
              <td><a @click.prevent="removeTableField(i)" href="#">Delete</a></td>
            </tr>
          </tbody>
        </table>

        <div class="modal fade" id="tableFieldModal" data-backdrop="static" data-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
          <div class="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="staticBackdropLabel">{{ !edit ? 'Add New Table Field' : 'Edit Table Field' }}</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div class="modal-body">
                <form ref="tableFieldsForm" id="tableFieldsForm">
                  <div class="row">
                    <div class="col-lg-4 form-group">
                      <label for="application_id">Select Application</label>
                      <select name="application_id" v-model="tableField.applicationID" id="application_id" class="form-control">
                        <option value="" selected disabled>--- Select Application ---</option>
                        <option v-for="application in applications" :value="application.id" :key="application.id">
                          {{ application.name }}
                        </option>
                      </select>
                    </div>
                    <div class="col-lg-4 form-group">
                      <label for="module_id">Select Module</label>
                      <select name="module_id" v-model="tableField.moduleID" id="module_id" class="form-control">
                        <option value="" selected disabled>--- Select Module ---</option>
                        <option v-for="module in applicationModules" :value="module.id" :key="module.id">
                          {{ module.name }}
                        </option>
                      </select>
                    </div>
                    <div class="col-lg-4 form-group">
                      <label for="table_id">Select Table</label>
                      <select name="table_id" v-model="tableField.tableID" id="table_id" class="form-control">
                        <option value="" selected disabled>--- Select Table ---</option>
                        <option v-for="table in moduleTables" :value="table.id" :key="table.id">
                          {{ table.name }}
                        </option>
                      </select>
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-lg-6 form-group">
                      <label for="name">Field Name</label>
                      <input type="text" name="name" v-model="tableField.name" id="name" class="form-control">
                    </div>
                    <div class="col-lg-6 form-group">
                      <label for="type">Field Type</label>
                      <input type="text" name="type" v-model="tableField.type" id="type" class="form-control">
                    </div>
                  </div>
                  <div class="form-group">
                    <label for="description">Field Description</label>
                    <textarea name="description" v-model="tableField.description" 
                      id="description" cols="30" rows="4" class="form-control"
                    ></textarea>
                  </div>
                </form>
              </div>
              <div class="modal-footer">
                <button @click.prevent="clearTableFieldsForm()" type="button" class="btn btn-outline-secondary">Clear</button>
                <button @click.prevent="validateData" type="button" class="btn btn-primary">
                  {{ !edit ? 'Add Table Field' : 'Save Changes' }}
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
      tableField: { id:'', name:'', applicationID: '', moduleID: '', tableID:'', type:'', description:'' },
      applications: [], applicationModules: [], modules: [], moduleTables: [], tables: [], tableFields: [], 
      apiURL: this.$apiURL,
      edit: false,
    }
  },
  mounted() {
    this.getTables();
    this.getModules();
    this.getTableFields();
    this.getApplications();
  },
  computed: {
    applicationID() { return this.tableField.applicationID },
    moduleID() { return this.tableField.moduleID },
  },
  watch: {
    applicationID: function(id) {
        if(id) { 
          this.applicationModules = this.applications.find(a => a.id === id).modules 
        } else {
          this.applicationModules = [];
        }
      },
    moduleID: function(id) {
      if(id) { 
        this.moduleTables = this.modules.find(m => m.id === id).tables 
      } else {
        this.moduleTables = [];
      }
    },
  },
  methods: {
    validateData() {
      this.sendData();
      console.log('validating...')
    },
    sendData() {
      let vm = this;
      if(vm.edit) {
        // edit data
        let formData = new FormData(vm.$refs.tableFieldsForm)
        formData.append('_method', 'PUT')
        vm.$axios.post(`${vm.apiURL}/tablesFields/${vm.tableField.id}`, formData)
          .then(res => {
             if(res.status === 200) {
               this.$jquery('#tableFieldModal').modal('hide');
               this.$swal('Table Field Updated Successfully','table field details updated','success')
                .then(this.clearTableFieldsForm());
             }
           })
          .catch(err => console.log(err))
      } else {
        // add data
        let formData = new FormData(vm.$refs.tableFieldsForm)
        vm.$axios.post(`${vm.apiURL}/tablesFields`, formData)
          .then(res => { console.log('editing...')
             if(res.status === 201) {
               this.$jquery('#tableFieldModal').modal('hide');
               this.$swal('Table Field Added Successfully','New Table Field added','success')
                .then(this.clearTableFieldsForm());
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
    getModules() {
      this.$axios.get(`${this.apiURL}/modules`)
        .then(res => this.modules = res.data.data)
        .catch(err => console.log(err))
    },
    getTables() {
      this.$axios.get(`${this.apiURL}/tables`)
        .then(res => this.tables = res.data.data)
        .catch(err => console.log(err))
    },
    getTableFields() {
      this.$axios.get(`${this.apiURL}/tablesFields`)
        .then(res => this.tableFields = res.data.data)
        .catch(err => console.log(err))
    },
    loadTableField(i) {
      this.edit = true; this.$jquery('#tableFieldModal').modal('show');
      this.tableField.id = this.tableFields[i].id;
      this.tableField.name = this.tableFields[i].name;
      this.tableField.type = this.tableFields[i].type;
      this.tableField.description = this.tableFields[i].description;
      this.tableField.tableID = this.tableFields[i].table.id;

      // Retrieve Module from tableID & application from moduleID
      this.$axios.get(`${this.apiURL}/tables/${this.tableField.tableID}`)
      .then(res => {
        this.tableField.moduleID = res.data.data.module.id;
        this.$axios.get(`${this.apiURL}/modules/${this.tableField.moduleID}`)
          .then(res => this.tableField.applicationID = res.data.data.application.id)
      })
    },
    removeTableField(i) {
      let id = this.tableFields[i].id;
      this.$swal.fire({
        title: 'Are you sure you want to delete this Table Field?',
        text:'This process is irreversible, you can\'t recover the table field after confirmation',
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: 'Yes, Delete',
        denyButtonText: `No, don't delete`,
      }).then((res) => {
        if (res.isConfirmed) {
          this.$axios.delete(`${this.apiURL}/tablesFields/${id}`)
            .then(res => {
              if(res.status === 200) {
                this.tableFields.splice(i, 1);
                this.$swal.fire('Table Field Deleted Successfully', ``, 'success');
              }
            })
            .catch(err => console.log(err))
        } else if (res.isDenied) {
          this.$swal.fire('Table Field was not deleted..!', '', 'info')
        }
      })
    },
    clearTableFieldsForm() {
       this.tableField.id = ''; this.tableField.name = ''; this.tableField.applicationID = ''; this.tableField.type = '';
       this.tableField.moduleID = ''; this.tableField.tableID = ''; this.tableField.description = '';
       this.edit = false; document.querySelector('#tableFieldsForm').reset();
    }
  }
}
</script>