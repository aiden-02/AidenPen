<template>
	<uni-card padding="0" spacing="0" v-if="store.hasLogin" :is-shadow="false">
		<uni-list>
			<uni-list-item
				clickable
				:show-extra-icon="true"
				:extra-icon="{ color: '#fab0ff', size: '22', type: 'clear' }"
				title="退出登录"
				showArrow
				@click="logout"
			></uni-list-item>
		</uni-list>
	</uni-card>
</template>

<script setup>
import { computed } from 'vue'
import { store, mutations } from '@/uni_modules/uni-id-pages/common/store.js'
//点击退出登录
function logout() {
	uni.showModal({
		content: '确定要退出登录嘛',
		success(res) {
			if (res.confirm) {
				mutations.logout()
			}
		}
	})
}
</script>

<style lang="less" scoped></style>
