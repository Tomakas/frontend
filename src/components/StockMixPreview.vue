<template>
    <div class="e-card e-rounding shadow-sm">
        <h1 class="h3">{{ $t('preview.stockmix') }}</h1>
        <Loader v-if="loading" />
        {{ $t('preview.stockmix.info') }}
        <p></p>
        <div v-if="!loading">
        <div v-for="item in items" v-bind:key="item.mcode">
          <div style="height: 20px"></div>
          <b>M{{item.mcode}} {{item.itemName}}</b>
          <table class="table table-hover e-table--responsive">
            <thead>
            <tr>
              <th style="width: 150px;overflow: hidden;">{{ $t('stock.table.sku') }}</th>
              <th>{{ $t('stock.table.name') }}</th>
              <th>{{ $t('stock.change') }}</th>
              <th>{{ $t('form.unit') }}</th>
            </tr>
            </thead>
            <tbody>
          <tr v-for="record in item.records" v-bind:key="record.sku">
            <td :data-title="$t('stock.table.sku')">{{record.sku}}</td>
            <td :data-title="$t('stock.table.name')"> {{record.itemName}}</td>
            <td :data-title="$t('stock.change')"> {{record.stockChangeStr}} </td>
            <td :data-title="$t('form.unit')">{{record.unitStr}}</td>
            </tr>
            </tbody>
          </table>
        </div>
        </div>

    </div>
</template>

<script>
    import Loader from "@/components/Loader"

    export default {
        name: 'StockMixPreview',
        components: { Loader },

        data: function () {
            return {
                items: [],
                loading: false
            }
        },

        mounted: function () {
          this.refresh();
        },

        methods: {
            refresh: function () {
                const vm = this;
                vm.loading = true;
                this.$http.post('/item/get-all-stock-mix-records')
                    .then(function (response) {
                        vm.items = response.data.items;
                        vm.loading = false;
                    });
            }
        }
    }
</script>

