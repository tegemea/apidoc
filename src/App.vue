<template>
  <div id="app" class="container-fluid">
    <Header />
    <router-view></router-view>
    <Footer />
  </div>
</template>

<script>
import { mapActions } from 'vuex';

import Header from '@/components/UI/Header';
import Footer from '@/components/UI/Footer';

export default {
  name: 'App',
  components: {
    Header, Footer
  },
  computed: {
    ...mapActions([
        'setApplications', 'setModules', 'setHttpCodes', 'setTables',
        'setTableFields', 'setTerminals', 'setTerminalCodes',
        'setTerminalParameters'
      ]
    ),
  },
  mounted() {
    this.setApplications; this.setModules; this.setHttpCodes; this.setTables;
    this.setTableFields; this.setTerminals; this.setTerminalCodes;
    this.setTerminalParameters;
  }
}
</script>

<style>
.mw-5 {
  width: 5%;
}
.mw-10 {
  width: 10%;
}
</style>
