<template>
	<uni-card padding="0">
		<uni-section class="price" title="商品价格" type="line">
			<template v-slot:right>
				<uni-number-box :max="10000" v-model="price" :step="0.1" />
			</template>
		</uni-section>
	</uni-card>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useCreateStore } from '@/stores/create.js'
import { storeToRefs } from 'pinia'
const store = useCreateStore()
const { price } = storeToRefs(store)
</script>

<style lang="less" scoped></style>
