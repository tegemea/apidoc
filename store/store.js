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
    terminalParameters(state) { return state.terminalParameters }
  },
  mutations: {
    // setting new entries to store
    storeApplications(state, applications) { state.applications = applications },
    storeModules(state, modules) { state.modules = modules },
    storeHttpCodes(state, httpCodes) { state.httpCodes = httpCodes },
    storeTables(state, tables) { state.tables = tables },
    storeTableFields(state, tableFields) { state.tableFields = tableFields },
    storeTerminals(state, terminals) { state.terminals = terminals },
    storeTerminalParameters(state, parameters) { state.terminalParameters = parameters },

    // adding data to existing store data
    addApplication(state, application) { state.applications.push(application) },
    addModule(state, module) { state.modules.push(module) },
    addHttpCode(state, code) { state.httpCodes.push(code) },
    addTables(state, table) { state.tables.push(table) },
    addTableField(state, field) { state.tableFields.push(field) },
    addTerminal(state, terminal) { state.terminals.push(terminal) },
    addTerminalParameter(state, parameter) { state.terminalParameters.push(parameter) },

    // updating existing store data
    updateApplication(state, application) { 
      let applicationToUpdate = state.applications.find(a => a.id === application.id);
      Object.assign(applicationToUpdate, application);
    },
    updateModule(state, module) { 
      let moduleToUpdate = state.modules.find(m => m.id === module.id);
      Object.assign(moduleToUpdate, module);
    },
    updateHttpCode(state, code) { 
      let codeToUpdate = state.httpCodes.find(c => c.id === code.id);
      Object.assign(codeToUpdate, code);
    },
    updateTable(state, table) { 
      let tableToUpdate = state.tables.find(t => t.id === table.id);
      Object.assign(tableToUpdate, table);
    },
    updateTableField(state, field) { 
      let fieldToUpdate = state.tableFields.find(f => f.id === field.id);
      Object.assign(fieldToUpdate, field);
    },
    updateTerminal(state, terminal) {
      let terminalToUpdate = state.terminals.find(t => t.id === terminal.id);
      Object.assign(terminalToUpdate, terminal);
    },
    updateTerminalParameter(state, parameter) { 
      let parameterToUpdate = state.terminalParameters.find(p => p.id === parameter.id);
      Object.assign(parameterToUpdate, parameter);
    }
    
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
      .catch(err => console.log(err.response.data.message));
      if(data) commit('storeTerminals', data);
    },
    async setTerminalParameters({ state, commit }) {
      const { data: { data } } = await axios.get(`${state.apiURL}/terminalParameters`)
      // .then(() => console.log('we have terminal parameters'))
      .catch(err => console.log(err.response.data.message));
      if(data) commit('storeTerminalParameters', data);
    }
  }
})