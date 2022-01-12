<template>
  <div>
    <div class="row">
      <div class="col-12">
        <h1 class="mb-3">
          Tables
          <button class="btn btn-outline-primary float-right">Add New Table</button>
        </h1>
      </div>
      <div class="col-12">
        <table class="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Terminal</th>
              <th>Description</th>
              <th>Edit</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      table: { id:'', terminalID:'', description:'' },
      tables: [],
    }
  }
}
</script>