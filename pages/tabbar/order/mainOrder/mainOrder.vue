<template>
	<uni-list>
		<template v-for="(item, index) in orderData" :key="item._id">
			<uni-list-item
				showBadge
				:badgeText="`￥${item.total_fee}`"
				:badge-style="{
					background: '#d64a1f',
					fontSize: '14px'
				}"
				:title="`您的第${index + 1}个订单`"
				:note="`订单编号:${item._id}`"
				:rightText="new Date(item.create_time).toLocaleString()"
			/>
		</template>
	</uni-list>
</template>

<script setup>
import { useOrderStore } from '@/stores/order.js'
import { storeToRefs } from 'pinia'
const orderStore = useOrderStore()
const { getOrderOL } = orderStore
const { orderData } = storeToRefs(orderStore)

;(async function() {
	await getOrderOL()
})()
</script>

<style lang="less" scoped></style>
