<template>
    <!--
    <sui-grid-column :class="{'main-div': clickable}" :width="width" @click="openPanel()">
        <sui-grid-row v-if=module.img class="fitted" centered>
            <img class="fitted" :src="module.img">
        </sui-grid-row>
        <sui-grid-row centered>
            <sui-container class="margins">
            <h3>{{ module.id }}</h3>
            <br>
            <sui-grid centered>
                <sui-grid-row>
                    <sui-grid-column :width="6" centered class="padded">
                        <h4>{{ module.fitness | rounded }} </h4>                        
                        <p>Accuracy</p>
                    </sui-grid-column>
                    <sui-grid-column :width="6" centered class="padded">
                        <h4>{{ module.numberOfOperations }}</h4>
                        <p>Operations</p>
                    </sui-grid-column>
                    <sui-grid-column :width="6" centered class="padded" v-if="module.predecessor">
                        <h4>{{ module.fitness - module.predecessor.fitness | rounded }}</h4>
                        <p>Improvement</p>
                    </sui-grid-column>
                    <sui-grid-column :width="6" centered class="padded" v-if="module.predecessor">
                        <h4>{{ module.predecessor.id }}</h4>
                        <p>Evolved from</p>
                    </sui-grid-column>
                </sui-grid-row>
            </sui-grid>
            </sui-container>
        </sui-grid-row>
    </sui-grid-column>
    -->
    <sui-card @click="openPanel()" :class="{'main-div': clickable}">
      <sui-image v-if="module.img" class="fitted" :src="module.img" size="small" centered/>
      <sui-card-header>{{module.id}}</sui-card-header>
      <sui-card-meta v-if="module.predecessor">
        Mutated from: {{module.predecessor.id}}
      </sui-card-meta>
      <br v-else/>
      <sui-card-content extra style="background: lightblue">
        <span style="text-align: left">
          {{ module.fitness[module.fitness.length-1] | rounded }} accuracy
          </span>
        <span slot="right" v-if="module.predecessor">
          {{ module.fitness[module.fitness.length-1] - module.predecessor.fitness[module.predecessor.fitness.length-1] | rounded }} improved
        </span>
      </sui-card-content>
      <sui-card-content extra style="background: lightblue">
        <span style="text-align: left">{{module.numberOfOperations}} Operations</span>
        <span slot="right">{{module.epochs}} Epochs trained</span>
      </sui-card-content>
    </sui-card>
</template>

<script>
export default {
  props: ['module', 'storage', 'width', 'clickable'],
  data() {
    return {}
  },
  filters: {
    rounded: num => {
      if (num == 0) {
        return 'NaN'
      } else {
        return `${Math.round(num * 100000) / 1000} %`
      }
    }
  },
  mounted() {
    return this.setImage(this.module)
  },
  methods: {
    openPanel() {
      if (this.clickable) this.$emit('open', this.module)
    },
    setImage(module) {
      var pathReference = this.storage.ref(module.modelImageFileName)
      return pathReference
        .getDownloadURL()
        .then(url => {
          this.module.img = url
          this.$forceUpdate()
          return url
        })
        .catch(console.error)
    }
  }
}
</script>

<style scoped>
.margins {
  margin-top: 50px;
}
.padded {
  padding-top: 20px;
}

h4,
p {
  margin: 0;
  padding: 0;
  text-align: center;
}

.main-div {
  box-sizing: border-box;
  -moz-box-sizing: border-box;
  -webkit-box-sizing: border-box;
  border: none;
  cursor: pointer;
}

.main-div:hover {
  border: 0.5px solid lightblue;
}

.fitted {
  height: 450px !important;
}
</style>
