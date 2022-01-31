<template>
  <div id="app" class="container-fluid">
    <Header />
    <router-view></router-view>
    <Footer />
  </div>
</template>

<script>

import Header from '@/components/UI/Header';
import Footer from '@/components/UI/Footer';

export default {
  name: 'App',
  components: {
    Header, Footer
  },
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
