import '../strataProfile.js'
import API from '../../api'

Object.keys(API).map(key => window.global[key] = API[key]);
