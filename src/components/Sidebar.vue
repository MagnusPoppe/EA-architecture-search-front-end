<template>
<sui-sidebar class="backdrop very wide" 
            animation="overlay" 
            direction="right" 
            :visible="module != null">
    <sui-container fluid  v-if="module">
        <sui-grid centered class="margins">
        <sui-image v-if="module.img"
                   :src="module.img"
                   class="fitted"
                   centered
        />
        </sui-grid>
        <sui-container>
            <h3> Training History </h3>
            <vue-plotly 
                    :data="plotData.fitness" 
                    :layout="zeroOnePlotLayout" 
                    :options="plotOptions"
            />
            <vue-plotly 
                    :data="plotData.loss" 
                    :layout="plotLayout" 
                    :options="plotOptions"
            />
            <h3> Mutations </h3>
            <sui-list bulleted 
                      :items="module.logs" 
                      style="text-align: left; margin: 30px 5px"
            />
        </sui-container>
        <sui-button secondary 
                    @click="module = null" 
                    negative
        >
        Close
        </sui-button>
    </sui-container>
</sui-sidebar>    
</template>

<script>
import VuePlotly from '@statnett/vue-plotly'
import ModuleView from './ModuleView'

const legend = {
  x: 0,
  y: 1,
  traceorder: 'normal',
  font: {
    family: 'sans-serif',
    size: 12,
    color: '#000'
  },
  bgcolor: '#E2E2E2',
  bordercolor: '#FFFFFF',
  borderwidth: 2
}

export default {
  props: ['module', 'storage'],
  components: {
    VuePlotly,
    ModuleView: ModuleView
  },
  data() {
    return {
      plotLayout: {
        showlegend: true,
        legend: legend,
        yaxis: {
          title: 'Loss',
          rangemode: 'nonnegative'
        },
        xaxis: {
          title: 'Epochs',
          rangemode: 'nonnegative'
        }
      },
      zeroOnePlotLayout: {
        showlegend: true,
        legend: legend,
        yaxis: {
          tickformat: ',.0%',
          range: [0, 1],
          title: 'Accuracy'
        },
        xaxis: {
          title: 'Epochs',
          rangemode: 'tozero'
        }
      },
      plotOptions: {
        editable: false,
        displayModeBar: true,
        displaylogo: false,
        scrollZoom: false,
        modeBarButtonsToRemove: ['']
      }
    }
  },
  methods: {
    getTrace(data, title) {
      return {
        x: [...Array(data.length).keys()],
        y: data,
        mode: 'lines',
        type: 'scatter',
        name: title
      }
    }
  },
  computed: {
    plotData() {
      if (this.module) {
        let fitnessTraces = [
          this.getTrace(this.module.fitness, 'Training Accuracy'),
          this.getTrace(this.module.validationFitness, 'Validation Accuracy')
        ]
        let lossTraces = [
          this.getTrace(this.module.loss, 'Training Loss'),
          this.getTrace(this.module.validationLoss, 'Validation Loss')
        ]

        if (this.module.evaluation) {
          let evaluation = {
            x: [],
            y: [],
            type: 'scatter',
            name: 'Evaluation Accuracy'
          }
          Object.keys(this.module.evaluation).forEach(key => {
            evaluation.x.push(parseInt(key))
            evaluation.y.push(this.module.evaluation[key])
          })
          fitnessTraces.push(evaluation)
        }

        return { fitness: fitnessTraces, loss: lossTraces }
      } else {
        console.log('Empty plot...')
        return []
      }
    }
  }
}
</script>

<style>
.fitted {
  max-height: 600px;
  width: inherit;
  margin: 50px 0px;
}
</style>
