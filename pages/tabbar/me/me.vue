<template>
	<view class="me">
		<view class="status_bar"></view>
		<head-vue></head-vue>
		<body-vue></body-vue>
		<logout-vue></logout-vue>
		<publish-vue></publish-vue>
	</view>
</template>

<script setup>
import logoutVue from './logout/logout.vue'
import headVue from './head/head.vue'
import bodyVue from './body/body.vue'
import publishVue from './publish/publish.vue'
</script>

<style lang="less" scoped>
.me {
	width: 100%;
	height: 100%;
	overflow-x: hidden;
	overflow-y: auto;
}
</style>
