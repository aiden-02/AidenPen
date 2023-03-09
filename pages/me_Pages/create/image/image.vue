<template>
	<uni-card padding="0" style="padding-bottom: 10px;">
		<uni-section class="imageSelect" title="商品图片" type="line">
			<uni-file-picker
				v-model="imageSelectValue"
				ref="files"
				title="请选择图片"
				limit="9"
				file-mediatype="image"
				mode="grid"
				:auto-upload="false"
				:disable-preview="true"
				:image-styles="imageStyles"
				@select="fileSelect"
				@success="uploadSuccess"
			></uni-file-picker>
		</uni-section>
	</uni-card>
</template>

<script setup>
import { ref } from 'vue'
import { useCreateStore } from '@/stores/create.js'
import { storeToRefs } from 'pinia'
const store = useCreateStore()
const { imageSelectValue, imageSuccessPaths } = storeToRefs(store)
const imageStyles = {
	border: {
		color: '#ffffff', // 边框颜色
		width: '2px', // 边框宽度
		style: 'none', // 边框样式
		radius: '10px' // 边框圆角，支持百分比
	}
}

function fileSelect({ tempFiles }) {
	imageSelectValue.value = tempFiles
}
function uploadSuccess({ tempFilePaths }) {
	imageSuccessPaths.value = tempFilePaths
}
const files = ref()
defineExpose({
	files
})
</script>

<style lang="less" scoped></style>
