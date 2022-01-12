<template>
  <div>
    <div class="row">
      <div class="col-12">
        <h1 class="mb-3">
          Http Codes
          <button class="btn btn-outline-primary float-right" 
            data-toggle="modal" 
            data-target="#httpCodeModal"
          >Add New Http Code</button>
        </h1>
      </div>
      <div class="col-12">
        <table class="table">
          <thead>
            <tr>
              <th>Code</th>
              <th>Description</th>
              <th class="mw-10">Edit</th>
              <th class="mw-10">Delete</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(httpCode, i) in httpCodes" :key="httpCode.id">
              <td>{{ httpCode.code }}</td>
              <td>{{ httpCode.description }}</td>
              <td><a @click.prevent="loadHttpCode(i)" href="#">Edit</a></td>
              <td><a @click.prevent="removeHttpCode(i)" href="#">Delete</a></td>
            </tr>
          </tbody>
        </table>

        <div class="modal fade" id="httpCodeModal" data-backdrop="static" data-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
          <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="staticBackdropLabel">{{ !edit ? 'Add Http Code' : 'Edit Http Code' }}</h5>
                <button @click="clearHttpCodeForm()" type="button" class="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div class="modal-body">
                <form ref="httpCodeForm" id="httpCodeForm">
                  <div class="form-group">
                    <label for="code">Code</label>
                    <input type="text" name="code" v-model="httpCode.code" id="code" class="form-control">
                  </div>
                  <div class="form-group">
                    <label for="description">Description</label>
                    <textarea name="description" v-model="httpCode.description" 
                      id="description" cols="30" rows="6" class="form-control"
                    ></textarea>
                  </div>
                </form>
              </div>
              <div class="modal-footer">
                <button @click.prevent="clearHttpCodeForm()" type="button" class="btn btn-outline-secondary">Clear</button>
                <button @click.prevent="validateData" type="button" class="btn btn-primary">
                  {{ !edit ? 'Add Http Code' : 'Save Changes' }}
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
      httpCode: { id:'', code:'', description:'' },
      httpCodes: [], apiURL: this.$apiURL, edit: false
    }
  },
  mounted() {
    this.getHttpCodes();
  },
  methods: {
    validateData() {
      this.sendData()
    },
    sendData() {
      let vm = this;
      if(vm.edit) {
        // edit data
        let formData = new FormData(vm.$refs.httpCodeForm)
        formData.append('_method', 'PUT')
        vm.$axios.post(`${this.apiURL}/httpCodes/${vm.httpCode.id}`, formData)
          .then(res => {
             if(res.status === 200) {
               this.$jquery('#httpCodeModal').modal('hide');
               this.$swal('Http Code Saved Successfully','Http Code details were updated','success')
                .then(this.clearHttpCodeForm());
             }
           })
          .catch(err => console.log(err))
      } else {
        // add data
        let formData = new FormData(vm.$refs.httpCodeForm)
        vm.$axios.post(`${this.apiURL}/httpCodes`, formData)
          .then(res => {
             if(res.status === 201) {
               this.$jquery('#httpCodeModal').modal('hide');
               this.$swal('Http Code Added Successfully','new Http Code was added','success')
                .then(this.clearHttpCodeForm());
             }
           })
          .catch(err => console.log(err))
      }
    },
    getHttpCodes() {
      this.$axios.get(`${this.apiURL}/httpCodes`)
        .then(res => this.httpCodes = res.data.data)
        .catch(err => console.log(err))
    },
    loadHttpCode(i) {
      this.edit = true; this.$jquery('#httpCodeModal').modal('show');
      this.httpCode.id = this.httpCodes[i].id;
      this.httpCode.code = this.httpCodes[i].code;
      this.httpCode.description = this.httpCodes[i].description;
    },
    removeHttpCode(i) {
      let id = this.httpCodes[i].id;
      this.$swal.fire({
        title: 'Are you sure you want to delete this Http Code?',
        text:'This process is irreversible, you can\'t recover the code after confirmation',
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: 'Yes, Delete',
        denyButtonText: `No, don't delete`,
      }).then((res) => {
        if (res.isConfirmed) {
          this.$axios.delete(`${this.apiURL}/httpCodes/${id}`)
            .then(res => {
              if(res.status === 200) {
                this.httpCodes.splice(i, 1);
                this.$swal.fire('Http Code Deleted Successfully', ``, 'success');
              }
            })
            .catch(err => console.log(err))
        } else if (res.isDenied) {
          this.$swal.fire('Http Code was not deleted..!', '', 'info')
        }
      })
    },
    clearHttpCodeForm() {
      this.httpCode.id = ''; this.httpCode.code = ''; this.httpCode.description = '';
      this.edit = false; document.querySelector('#httpCodeForm').reset();
    }
  }
}
</script>