import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const dynamicModules = {}
const files = require.context('.', true, /\.js$/)

const dynamicImportModules = (modules, file, splits, index = 0) => {
    if (index == 0 && splits[0] == 'modules') {
        ++index
    }
    if (splits.length == index + 1) {
        if ('index' == splits[index]) {
            modules[splits[index - 1]] = files(file).default
        } else {
            modules.modules[splits[index]] = files(file).default
        }
    } else {
        let tmpModules = {}
        if ('index' == splits[index + 1]) {
            tmpModules = modules
        } else {
            modules[splits[index]] = modules[splits[index]] ? modules[splits[index]] : {namespaced: true, modules: {}}
            tmpModules = modules[splits[index]]
        }
        dynamicImportModules(tmpModules, file, splits, ++index)
    }
}

files.keys().filter(file => file != './index.js').forEach(file => {
    let splits = file.replace(/(\.\/|\.js)/g, '').split('\/');
    dynamicImportModules(dynamicModules, file, splits)
})

export default new Vuex.Store({
    modules: dynamicModules,
    strict: process.env.NODE_ENV !== 'production'
})

