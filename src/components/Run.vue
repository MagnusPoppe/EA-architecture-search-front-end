<template>
  <sui-container fluid>
      <sui-container fluid class="colored">
        <h1 @click="$router.push('/')" 
            style="cursor: pointer;">
          EA NAS: MASTER THESIS
        </h1>
        <status-message-view v-if="run && run.status == 'Running'" 
                             :runId="run.id" 
                             :db="db" 
                             :generations="run.generations"/>
        <h3 v-else-if="run">{{run.status}}</h3>
        <sui-grid v-if="run" stackable>
            <text-widget :width="2" 
                         property="Epochs Per Operation" 
                         :value="run.epochsOfTraining"/>
            <text-widget :width="2" 
                         property="Batch Size" 
                         :value="run.batchSizeForTraining"/>
            <text-widget :width="2" 
                         property="Dataset" 
                         :value="run.dataset"/>
            <text-widget :width="2" 
                         property="Generations" 
                         :value="run.generations"/>
            <text-widget :width="2" 
                         property="Population" 
                         :value="run.populationSize"/>  
        </sui-grid>
      </sui-container>
    <sui-container fluid>
      <sidebar :module="sidepanelModule" :storage="storage"/>
      <sui-sidebar-pusher>
      <sui-container v-if="population" style="margin: 40px">
        <sui-card-group :items-per-row="4" stackable>
          <module-view v-for="individ in population"
                      :key="individ.id" 
                      :storage="storage"
                      :width="4"
                      :module="individ"
                      :clickable="true"
                      @open="showPanel($event)"
          />
        </sui-card-group>
      </sui-container>
      </sui-sidebar-pusher>
    </sui-container>
  </sui-container>
</template>

<script>
import { db, storage } from './firebaseInit'

import StatusMessageView from './StatusMessageView'
import ModuleView from './ModuleView'
import TextWidget from './TextWidget'
import Sidebar from './Sidebar'

export default {
  components: {
    StatusMessageView: StatusMessageView,
    ModuleView: ModuleView,
    TextWidget: TextWidget,
    Sidebar: Sidebar
  },
  name: 'main-page',
  data() {
    return {
      run: null,
      population: [],
      populationSubsription: null,
      db: db,
      storage: storage,
      sidepanelModule: null
    }
  },
  created() {
    return this.getRun().then(run => {
      this.run = run
      this.populationSubsription = this.getPopulationSubscription(run.id)
    })
  },
  destroyed() {
    if (this.populationSubsription) {
      this.populationSubsription()
    }
  },
  methods: {
    showPanel(module) {
      console.log('Opening panel for ', module)
      this.sidepanelModule = module
    },
    getRun() {
      return db
        .doc(`runs/${this.$route.params.id}`)
        .get()
        .then(doc => {
          let run = doc.data()
          run.id = doc.id
          return run
        })
    },
    getModule(documentPath) {
      return db
        .doc(documentPath)
        .get()
        .then(doc => {
          let individ = doc.data()
          individ.id = doc.id
          return individ
        })
    },
    getPopulationSubscription(runId) {
      return db.collection(`runs/${runId}/population`).onSnapshot(
        querySnapshot => {
          console.log(`recieved ${querySnapshot.docs.length} individs!`)
          querySnapshot.docChanges().forEach(change => {
            if (change.type === 'added')
              return this.addToPopulation(change.doc.data().module)
            if (change.type === 'modified')
              return this.modifyIndividInPopulation(change.doc.data().module)
            if (change.type === 'removed')
              return this.removeFromPopulation(change.doc.data().module)
          })
          // Sorting in reverse to get fittest first!
          this.population.sort((a, b) => b.fitness - a.fitness)
        },
        error => {
          console.error(error)
        }
      )
    },
    addToPopulation(ref) {
      this.getModule(ref).then(module => {
        if (!this.population.find(x => x.id === module.id)) {
          console.log('New individ: ', module.id)
          if (module.predecessor) {
            return this.getModule(module.predecessor).then(predecessor => {
              module.predecessor = predecessor
              this.population.push(module)
            })
          } else this.population.push(module)
        }
      })
    },
    modifyIndividInPopulation(ref) {
      this.getModule(ref).then(module => {
        console.log('Modified Individ')
        var res = this.population.find(x => x.id === module.id)
        if (res) {
          this.population = this.population.filter(x => x.id !== res.id)
          this.population.push(module)
        }
      })
    },
    removeFromPopulation(ref) {
      this.getModule(ref).then(module => {
        var searchResult = this.population.find(x => x.id === module.id)
        if (searchResult) {
          this.population = this.population.filter(x => x.id !== module.id)
          console.log('Removed from population: ', module.id)
        }
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1 {
  padding: 24px;
  margin: 0;
}

.colored {
  background: lightsalmon;
}

.center  {
  text-align: center;
}

.backdrop {
  background: white;
  border-right: 1px solid black;
}
</style>
