<template>
  <div>
    <div v-if="!groups.length && showLoading" class="loading">
      <h1>Loading...</h1>
      <p class="text-black-50">Please wait for content</p>
      <button @click="showLoading = false" class="btn btn-sm btn-outline-secondary">
        Taking too long? Cancel
      </button>
    </div>
    <div class="row">
      <div class="col-12">
        <h1 class="mb-3">
          Groups
          <button class="btn btn-outline-primary float-right" data-toggle="modal" data-target="#groupModal">Add New Group</button>
        </h1>
      </div>
      <div class="col-12">
        <h3 v-if="!groups.length" class="text-danger">Sorry, No Groups</h3>
        <table v-else class="table">
          <thead>
            <tr>
              <th>Group Name</th>
              <th>Application</th>
              <th class="mw-10">Edit</th>
              <th class="mw-10">Delete</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(group, i) in groups" :key="group.id">
              <td>{{ group.name }}</td>
              <td>{{ group.application.name }} <span class="text-black-50">v{{ group.application.version }}</span></td>
              <td><a @click.prevent="loadGroup(i)" href="#">Edit</a></td>
              <td><a @click.prevent="removeGroup(i)" href="#">Delete</a></td>
            </tr>
          </tbody>
        </table>

        <div class="modal fade" id="groupModal" data-backdrop="static" data-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
          <div class="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="staticBackdropLabel">{{ !edit ? 'Add New Group' : 'Edit Group' }}</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div class="modal-body">
                <form ref="groupForm" id="groupForm">
                  <div class="form-group">
                    <label for="application_id">Select Application</label>
                    <select name="application_id" v-model="group.applicationID" id="application_id" class="form-control">
                      <option value="" selected disabled>--- Select Application ---</option>
                      <option v-for="application in applications" :value="application.id" :key="application.id">
                        {{ application.name }}
                      </option>
                    </select>
                  </div>
                  <div class="form-group">
                    <label for="name">Group Name</label>
                    <input type="text" name="name" v-model="group.name" id="name" class="form-control">
                  </div>
                </form>
              </div>
              <div class="modal-footer">
                <button @click.prevent="clearForm" type="button" class="btn btn-outline-secondary">Clear</button>
                <button @click.prevent="validateData" type="button" class="btn btn-primary">
                  {{ !edit ? 'Add new Group' : 'Save Changes' }}
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
import { mapGetters, mapActions } from 'vuex';

export default {
  data() {
    return {
      group: { id:'', name:'', applicationID:'' },
      showLoading: true,
      // groups: [], applications: [],
      apiURL: this.$apiURL,
      edit: false
    }
  },
  computed: {
    ...mapGetters(['groups', 'applications'])
  },
  mounted() {
    if(!this.groups.length) this.setGroups();
  },
  methods: {
    ...mapActions(['setGroups','setApplications']),
    validateData() {
      this.sendData()
    },
    sendData() {
      let vm = this;
      if(vm.edit) {
        // edit data
        let formData = new FormData(vm.$refs.groupForm)
        formData.append('_method', 'PUT')
        vm.$axios.post(`${vm.apiURL}/groups/${vm.group.id}`, formData)
          .then(res => {
             if(res.status === 200) {
               this.$jquery('#groupModal').modal('hide');
               this.$swal('Group Updated Successfully','Group details were updated','success')
                .then(this.clearForm());
             }
           })
           .catch(err => console.log(err))
      } else {
        // add data
        let formData = new FormData(vm.$refs.groupForm)
        vm.$axios.post(`${vm.apiURL}/groups`, formData)
          .then(res => {
             if(res.status === 201) {
               this.$jquery('#groupModal').modal('hide');
               this.$swal('Group Added Successfully','New Group have been added/created','success')
                .then(this.clearForm());
             }
           })
           .catch(err => console.log(err))
      }
    },
    // getGroups() {
    //   this.$axios.get(`${this.apiURL}/groups`)
    //     .then(res => this.groups = res.data.data)
    //     .catch(err => console.log(err))
    // },
    loadGroup(i) {
      this.edit = true; this.$jquery('#groupModal').modal('show');
      this.group.id = this.groups[i].id;
      this.group.name = this.groups[i].name;
      this.group.applicationID = this.groups[i].application.id;
    },
    removeGroup(i) {
      let id = this.groups[i].id;
      this.$swal.fire({
        title: 'Are you sure you want to delete this Group?',
        text:'This process is irreversible, you can\'t recover the group after confirmation',
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: 'Yes, Delete',
        denyButtonText: `No, don't delete`,
      }).then((res) => {
        if (res.isConfirmed) {
          this.$axios.delete(`${this.apiURL}/Groups/${id}`)
            .then(res => {
              if(res.status === 200) {
                this.groups.splice(i, 1);
                this.$swal.fire('Group Deleted Successfully', ``, 'success');
              }
            })
            .catch(err => console.log(err))
        } else if (res.isDenied) {
          this.$swal.fire('Group was not deleted..!', '', 'info')
        }
      })
    },
    clearForm() {
      this.group.id = ''; this.group.name = ''; this.group.applicationID = '';
      this.edit = false; document.querySelector('#groupForm').reset();
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