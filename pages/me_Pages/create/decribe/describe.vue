<template>
	<uni-card padding="0">
		<uni-section class="content" title="商品描述" type="square">
			<uni-easyinput v-model="content" placeholder="买家都关心品牌型号, 入手渠道, 转手原因..." type="textarea" auto-height
				:maxlength="600" :inputBorder="false" />
		</uni-section>
	</uni-card>
</template>

<script setup>
	import {
		computed,
		ref
	} from 'vue'
	import {
		useCreateStore
	} from '@/stores/create.js'
	import {
		storeToRefs
	} from 'pinia'
	const store = useCreateStore()
	const {
		content
	} = storeToRefs(store)
</script>

<style lang="less" scoped>
</style>
