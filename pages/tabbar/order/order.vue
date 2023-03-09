<template>
	<view class="status_bar"></view>
	<view class="full" v-if="!store.hasLogin">
		<button size="mini" class="login" type="primary" @click="login">请先登录</button>
	</view>
	<view v-else>
		<view v-if="orderStore.orderData.length"><main-order></main-order></view>
		<view v-else><uni-load-more status="noMore"></uni-load-more></view>
	</view>
</template>

<script setup>
import { store } from '@/uni_modules/uni-id-pages/common/store.js'
import mainOrder from './mainOrder/mainOrder.vue'
import { useOrderStore } from '@/stores/order.js'
const orderStore = useOrderStore()
const { getOrderOL } = orderStore

if (store.hasLogin) {
	;(async function() {
		await getOrderOL()
	})()
}

function login() {
	uni.navigateTo({
		url: '/uni_modules/uni-id-pages/pages/login/login-withpwd'
	})
}
</script>
<script>
import { store } from '@/uni_modules/uni-id-pages/common/store.js'
import { useOrderStore } from '@/stores/order.js'
const orderStore = useOrderStore()
const { getOrderOL } = orderStore
export default {
	onPullDownRefresh() {
		if (!store.hasLogin) {
			uni.stopPullDownRefresh()
			return
		}
		setTimeout(async () => {
			await getOrderOL()
			uni.stopPullDownRefresh()
		}, 0)
	}
}
</script>
<style lang="less" scoped>
// #ifdef H5
uni-page-body {
	height: 100%;
	.full {
		position: relative;
		height: 100%;
		.login {
			position: absolute;
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%);
		}
	}
}
// #endif
</style>
