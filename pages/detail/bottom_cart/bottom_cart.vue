<template>
	<view class="goods-carts">
		<uni-goods-nav
			:options="options"
			:fill="true"
			:button-group="buttonGroup"
			@click="onClick"
			@buttonClick="buttonClick"
		/>
	</view>
</template>

<script setup>
import { db } from '@/utils/db.js'
import { useOrderStore } from '@/stores/order.js'
const orderStore = useOrderStore()
const { addOrderOL, getOrderOL } = orderStore

const props = defineProps({
	goodId: {
		type: String,
		required: true
	},
	price: {
		type: Number,
		required: true
	}
})
const options = [
	{
		icon: 'cart',
		text: '购物车'
	}
]
const buttonGroup = [
	{
		text: '加入购物车',
		backgroundColor: 'linear-gradient(90deg, #FFCD1E, #FF8A18)',
		color: '#fff'
	},
	{
		text: '立即购买',
		backgroundColor: 'linear-gradient(90deg, #FE6035, #EF1224)',
		color: '#fff'
	}
]
function onClick() {
	uni.switchTab({
		url: '/pages/tabbar/cart/cart'
	})
}

async function buttonClick(e) {
	if (e.index === 0) {
		try {
			const { id } = await db.collection('cart').add({
				goods_id: props.goodId
			})
			id &&
				uni.showToast({
					icon: 'success',
					title: '加入成功'
				})
		} catch (e) {
			uni.showToast({
				icon: 'error',
				title: '不可重复加入'
			})
		}
	} else {
		const res = await addOrderOL(props.price, [props.goodId])
		res &&
			uni.showToast({
				icon: 'success',
				title: '购买成功'
			}) &&
			uni.switchTab({
				url: '/pages/tabbar/order/order',
				async success() {
					await getOrderOL()
				}
			})
	}
}
</script>

<style lang="less" scoped>
.goods-carts {
	/* #ifndef APP-NVUE */
	display: flex;
	/* #endif */
	flex-direction: column;
	position: fixed;
	left: 0;
	right: 0;
	/* #ifdef H5 */
	left: var(--window-left);
	right: var(--window-right);
	/* #endif */
	bottom: 0;
}
</style>
