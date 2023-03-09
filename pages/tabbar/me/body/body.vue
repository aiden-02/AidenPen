<template>
	<uni-card padding="0" spacing="0" :is-shadow="false">
		<template v-for="(value, key, index) in lists" :key="key">
			<uni-list>
				<uni-list-item
					clickable
					:show-extra-icon="true"
					:extra-icon="value"
					:title="key"
					showArrow
					:to="pages(value.name)"
				></uni-list-item>
			</uni-list>
		</template>
	</uni-card>
</template>

<script setup>
const pages = pageName => {
	return `/pages/me_Pages/${pageName}/${pageName}`
}

const lists = {
	我发布的: { name: 'publish', color: '#7961ff', size: '22', type: 'list' },
	评论过的: { name: 'comment', color: '#ff5053', size: '22', type: 'chat-filled' }
}
</script>

<style></style>
