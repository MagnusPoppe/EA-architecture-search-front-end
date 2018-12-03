<template>
    <sui-grid-column :width="width" centered>
        <sui-grid-row>
            <h4>{{value}}</h4>  
        </sui-grid-row>
        <sui-grid-row>
            <p>{{property}}</p>
        </sui-grid-row>
    </sui-grid-column>
</template>

<script>
export default {
  props: ['property', 'value', 'width']
}
</script>

<style>
p {
  opacity: 0.57;
}
</style>

