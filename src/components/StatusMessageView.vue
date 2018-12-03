<template>
    <sui-container v-if="messages.length > 0">
        <h3 v-if="latest.generation == generations" 
            style="color: green;">
          Last generation
        </h3>
        <h3 v-else>{{stage}}</h3>
        <sui-progress v-if="progress" 
                      state="active" 
                      size="tiny"
                      :percent="progress" 
                      :label="latest.msg" 
        />
        <p v-else>{{latest.msg}}</p>
    </sui-container>
    <sui-container v-else>
        <h3>Loading status</h3>
    </sui-container>
</template>
<script>
export default {
  props: ['runId', 'db', 'generations'],
  data() {
    return {
      messages: [],
      programOutputListener: null
    }
  },
  mounted() {
    this.programOutputListener = this.getProgramOutputListener(this.runId)
  },
  destroyed() {
    if (this.programOutputListener) this.programOutputListener()
  },
  computed: {
    latest() {
      return this.messages.length > 0
        ? this.messages[this.messages.length - 1]
        : { msg: 'Not started', time: 0, generation: -1 }
    },
    stage() {
      let gen = this.messages[this.messages.length - 1].generation
      if (gen > 0) {
        return `${gen}th generation`
      } else {
        return 'Initializing'
      }
    },
    progress() {
      if (this.latest.msg.includes('/')) {
        let numbers = this.latest.msg
          .split(' ')
          .filter(x => x.includes('/'))[0]
          .split('/')

        let x = parseInt(numbers[0])
        let y = parseInt(numbers[1])
        return (((x + 1) / y) * 100).toString()
      } else if (this.latest.msg.includes('Training new children')) {
        return '0'
      } else return undefined
    }
  },
  methods: {
    getProgramOutputListener(runId) {
      this.populationSubsription = this.db
        .collection(`runs/${runId}/programOutput`)
        .orderBy('time')
        .onSnapshot(
          querySnapshot => {
            querySnapshot.docChanges().forEach(change => {
              if (change.type === 'added') {
                this.messages.push(change.doc.data())
                console.log('Added to program output')
              }
              if (change.type === 'modified') {
                console.log('Program output was modified? Should not happen...')
              }
              if (change.type === 'removed') {
                console.log('Program output was removed? Should not happen...')
              }
            })
            const timestamp = x =>
              x.time.seconds + x.time.nanoseconds * Math.pow(10, -9)
            this.messages = this.messages.sort(
              (a, b) => timestamp(a) - timestamp(b)
            )
            return this.messages
          },
          error => {
            console.error(error)
          }
        )
    }
  }
}
</script>

<style scoped>
div {
  margin: 0;
  padding-top: 0;
  padding-bottom: 20px;
}
h3 {
  margin: 0;
  padding-top: 10;
  padding-bottom: 0;
}
p,
sui-progress {
  padding: 0;
  margin: 0;
  font-size: 0.9em;
  opacity: 0.57;
}
</style>
