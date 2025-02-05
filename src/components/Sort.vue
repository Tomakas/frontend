<template>
    <span class="sort-pointer" @click="sortChange()">
       <slot></slot>
      &nbsp;
      <i class="fas fa-sort-alpha-down sort-color" v-show="columnName === sortData.sortBy && numberType === false && sortData.sortType === 'asc'"></i>
      <i class="fas fa-sort-alpha-up-alt sort-color" v-show="columnName === sortData.sortBy && numberType === false && sortData.sortType === 'desc'"></i>
      <i class="fas fa-sort-amount-down-alt sort-color" v-show="columnName === sortData.sortBy && numberType === true && sortData.sortType === 'asc'"></i>
      <i class="fas fa-sort-amount-up sort-color" v-show="columnName === sortData.sortBy && numberType === true && sortData.sortType === 'desc'"></i>
    </span>
</template>

<script>
    export default {
      props: ['columnName','numberType','sortData'],

      methods: {
        sortChange: function () {
          let newSortType;
          if(this.columnName !== this.sortData.sortBy) {
            //new column for sorting
            newSortType = 'asc'
          } else {
            //change sorting type
            newSortType = this.sortData.sortType === 'asc' ? 'desc' : 'asc';
          }

          //emit change to the parent
          this.$emit('changeSort',{
            sortBy: this.columnName,
            sortType: newSortType
          });
        }
      }
    }
</script>

<style>
.sort-color {
  color: #19415b;
}
.sort-pointer {
  cursor: pointer;
}
</style>
