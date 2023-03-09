<template>
	<uni-card padding="0" spacing="0" v-if="store.hasLogin" is-shadow>
		<uni-list>
			<uni-list-item
				clickable
				:show-extra-icon="true"
				:extra-icon="{ color: '#ffc694', size: '22', type: 'plus-filled' }"
				title="发布自己的商品"
				showArrow
				to="/pages/me_Pages/create/create"
			></uni-list-item>
		</uni-list>
	</uni-card>
</template>

<script setup>
import { store } from '@/uni_modules/uni-id-pages/common/store.js'
</script>

<style lang="less" scoped></style>
