<template>
    <sui-container fluid>

      <sui-container fluid class="colored">
        <h1>EA NAS: MASTER THESIS</h1>
        <h2> Select Simulation </h2>
      </sui-container>
      <sui-container fluid>
        <sui-table selectable celled>
          <sui-table-header>
            <sui-table-row>
              <sui-table-header-cell>Status</sui-table-header-cell>
              <sui-table-header-cell>Unique ID</sui-table-header-cell>
              <sui-table-header-cell>Started</sui-table-header-cell>
              <sui-table-header-cell>Dataset</sui-table-header-cell>
              <sui-table-header-cell>Population Size</sui-table-header-cell>
              <sui-table-header-cell>Generations</sui-table-header-cell>
              <sui-table-header-cell>Epochs Per Operation</sui-table-header-cell>
              <sui-table-header-cell>Batch Size</sui-table-header-cell>
            </sui-table-row>
          </sui-table-header>

          <sui-table-body>
              <sui-table-row v-for="run in runs" 
                             :key="run.id"
                             @click="redirect(run)"
              >
                <sui-table-cell>
                  <span v-if="run.status != 'Running'">{{ run.status }}</span>
                  <sui-label ribbon v-else>{{ run.status }}</sui-label>
                </sui-table-cell>
                <sui-table-cell>{{ run.id }}</sui-table-cell>
                <sui-table-cell>{{ run.started | prettyDate }}</sui-table-cell>
                <sui-table-cell>{{ run.dataset }}</sui-table-cell>
                <sui-table-cell>{{ run.populationSize }}</sui-table-cell>
                <sui-table-cell>{{ run.generations }}</sui-table-cell>
                <sui-table-cell>{{ run.epochsOfTraining }}</sui-table-cell>
                <sui-table-cell>{{ run.batchSizeForTraining }}</sui-table-cell>
              </sui-table-row>
          </sui-table-body>
        </sui-table>
      </sui-container>
    </sui-container>
</template>

<script>
import { db, storage } from './firebaseInit'

export default {
  data() {
    return {
      runs: []
    }
  },
  filters: {
    prettyDate(time) {
      let secs = time.seconds + time.nanoseconds * Math.pow(10, -9)
      let t = new Date(1970, 0, 1) // Epoch
      t.setSeconds(secs)
      return t.toLocaleString()
    }
  },
  mounted() {
    return db
      .collection('runs')
      .orderBy('started', 'desc')
      .onSnapshot(querySnapshot => {
        let runs = []
        querySnapshot.forEach(doc => {
          let run = doc.data()
          run.id = doc.id
          if (!run.status) {
            run.status = '?'
          }
          this.runs.push(run)
        })
        this.runs.sort(a, b => {
          let aSecs =
            a.started.seconds + a.started.nanoseconds * Math.pow(10, -9)
          let bSecs =
            b.started.seconds + b.started.nanoseconds * Math.pow(10, -9)
          return aSecs - bSecs
        })
      })
  },
  methods: {
    redirect(run) {
      console.log(`Redirecting to /#/${run.id}`)
      this.$router.push(`/${run.id}`)
    }
  }
}
</script>

<style>
.colored {
  background: lightsalmon;
}

h1,
h2 {
  padding: 24px;
  margin: 0;
}
</style>

