import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';

Vue.use(Vuex);

export const store = new Vuex.Store({
  state: {
    baseURL:'http://192.168.1.2',
    apiURL:'http://192.168.1.2/api_doc',
    applications: [],
    modules: [],
    httpCodes: [],
    tables: [],
    tableFields: [],
    terminals: [],
    terminalCodes:[],
    terminalParameters: [],
  },
  getters: {
    apiURL(state) { return state.apiURL },
    baseURL(state) { return state.baseURL },
    applications(state) { return state.applications; },
    modules(state) { return state.modules },
    httpCodes(state) { return state.httpCodes },
    tables(state) { return state.tables },
    tableFields(state) { return state.tableFields },
    terminals(state) { return state.terminals },
    terminalCodes(state) { return state.terminalCodes },
    terminalParameters(state) { return state.terminalParameters }
  },
  mutations: {
    storeApplications(state, applications) { state.applications = applications },
    storeModules(state, modules) { state.modules = modules },
    storeHttpCodes(state, httpCodes) { state.httpCodes = httpCodes },
    storeTables(state, tables) { state.tables = tables },
    storeTableFields(state, tableFields) { state.tableFields = tableFields },
    storeTerminals(state, terminals) { state.terminals = terminals },
    storeTerminalCodes(state, terminalCodes) { state.terminalCodes = terminalCodes },
    storeTerminalParameters(state, parameters) { state.terminalParameters = parameters }
  },
  actions: {
    async setApplications({ state, commit }) {
      const { data: { data } } = await axios.get(`${state.apiURL}/applications`)
      // .then(() => console.log('we have terminal parameters'))
      .catch(err => console.log(err.response.data.message));
      if(data) commit('storeApplications', data);
    },
    async setModules({ state, commit }) {
      const { data: { data } } = await axios.get(`${state.apiURL}/modules`)
      // .then(() => console.log('we have modules'))
      .catch(err => console.log(err.response.data.message));
      if(data) commit('storeModules', data);
    },
    async setHttpCodes({ state,commit }) {
      const { data: { data } } = await axios.get(`${state.apiURL}/httpCodes`)
      // .then(() => console.log('we have http codes'))
      .catch(err => console.log(err.response.data.message));
      if(data) commit('storeHttpCodes', data);
    },
    async setTables({ state, commit }) {
      const { data: { data } } = await axios.get(`${state.apiURL}/tables`)
      // .then(() => console.log('we have tables'))
      .catch(err => console.log(err.response.data.message));
      if(data) commit('storeTables', data);
    },
    async setTableFields({ state, commit }) {
      const { data: { data } } = await axios.get(`${state.apiURL}/tablesFields`)
      // .then(() => console.log('we have table fields'))
      .catch(err => console.log(err.response.data.message));
      if(data) commit('storeTableFields', data);
    },
    async setTerminals({ state, commit }) {
      const { data: { data } } = await axios.get(`${state.apiURL}/terminals`)
      // .then(() => console.log('we have terminals'))
      .catch(err => console.log(err.response.data.message));
      if(data) commit('storeTerminals', data);
    },
    async setTerminalCodes({ state, commit }) {
      const { data: { data } } = await axios.get(`${state.apiURL}/terminalCodes`)
      // .then(() => console.log('we have terminal codes'))
      .catch(err => console.log(err.response.data.message));
      if(data) commit('storeTerminalCodes', data);
    },
    async setTerminalParameters({ state, commit }) {
      const { data: { data } } = await axios.get(`${state.apiURL}/terminalParameters`)
      // .then(() => console.log('we have terminal parameters'))
      .catch(err => console.log(err.response.data.message));
      if(data) commit('storeTerminalParameters', data);
    }
  }
})