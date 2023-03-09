<template>
	<view class="status_bar"></view>
	<view class="full" v-if="!store.hasLogin">
		<button size="mini" class="login" type="primary" @click="login">请先登录</button>
	</view>
	<view v-else>
		<view v-if="cartStore.cartData.length">
			<main-cart></main-cart>
			<cart-bottom></cart-bottom>
		</view>
		<view v-else><uni-load-more status="noMore"></uni-load-more></view>
	</view>
</template>

<script setup>
import { store } from '@/uni_modules/uni-id-pages/common/store.js'
import mainCart from './mainCart/mainCart.vue'
import cartBottom from './bottom/cartBottom.vue'
import { useCartStore } from '@/stores/cart.js'
const cartStore = useCartStore()
const { getCartData } = cartStore
if (store.hasLogin) {
	;(async function() {
		await getCartData()
	})()
}
function login() {
	uni.navigateTo({
		url: '/uni_modules/uni-id-pages/pages/login/login-withpwd'
	})
}
</script>
<script>
import { useCartStore } from '@/stores/cart.js'
import { store } from '@/uni_modules/uni-id-pages/common/store.js'
const cartStore = useCartStore()
const { getCartData } = cartStore
export default {
	onPullDownRefresh() {
		if (!store.hasLogin) {
			uni.stopPullDownRefresh()
			return
		}
		setTimeout(async () => {
			await getCartData()
			uni.stopPullDownRefresh()
		}, 0)
	}
}
</script>
<style lang="less" scoped>
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
</style>
