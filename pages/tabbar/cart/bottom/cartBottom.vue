<template>
	<view class="goods-carts">
		<view class="totalPrice">总价：￥{{ totalPrice }}</view>
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
import { useOrderStore } from '@/stores/order.js'
import { useCartStore } from '@/stores/cart.js'
import { storeToRefs } from 'pinia'

const cartStore = useCartStore()
const orderStore = useOrderStore()
const { totalPrice, selectGoods } = storeToRefs(cartStore)
const { clear } = cartStore
const { addOrderOL, getOrderOL } = orderStore
const options = [
	{
		icon: 'bars',
		text: '订单'
	}
]
const buttonGroup = [
	{
		text: '立即购买',
		backgroundColor: 'linear-gradient(90deg, #FE6035, #EF1224)',
		color: '#fff'
	}
]
function onClick() {
	uni.switchTab({
		url: '/pages/tabbar/order/order',
		async success() {
			await getOrderOL()
		}
	})
}

async function buttonClick() {
	await addOrderOL(totalPrice.value, selectGoods.value)
	const res = await clear()
	res &&
		uni.showToast({
			title: '购买成功',
			icon: 'success'
		}) &&
		uni.switchTab({
			url: '/pages/tabbar/order/order',
			async success() {
				await getOrderOL()
			}
		})
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
	bottom: 50px;
	.totalPrice {
		color: red;
		align-self: flex-end;
		padding: 5px;
	}
}
</style>
