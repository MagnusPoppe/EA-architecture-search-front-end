import firebase from 'firebase'
import 'firebase/firestore'
import firebaseConfig from './firebaseConfig'
const firebaseApp = firebase.initializeApp(firebaseConfig)
const db = firebaseApp.firestore()
const settings = {
  timestampsInSnapshots: true
}
var storage = firebaseApp.storage()
db.settings(settings)
export {
  db,
  storage
}
