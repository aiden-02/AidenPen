<template>
	<view class="status_bar"></view>
	<uni-notice-bar single text="描述&图片&标签&价格都不能为空哦~~" showClose showIcon></uni-notice-bar>
	<describe></describe>
	<uploadImages ref="images"></uploadImages>
	<tags></tags>
	<prices></prices>
	<button :type="btnType" @click="publish">发布</button>
</template>

<script setup>
import { ref, watchEffect } from 'vue'
import { useCreateStore } from '@/stores/create.js'
import { useCommonStore } from '@/stores/common.js'
import { storeToRefs } from 'pinia'
import describe from './decribe/describe.vue'
import uploadImages from './image/image.vue'
import tags from './tag/tag.vue'
import prices from './price/price.vue'
const store = useCreateStore()
const commonStore = useCommonStore()
const {
	imageSelectValue,
	getImagesOnline,
	content,
	price,
	ori_category,
	ori_brand,
	radioCate,
	radioBrand
} = storeToRefs(store)
const { publishOnline, clear } = store

//发布按钮类型
const btnType = ref('default')
//图片模板
const images = ref()
//发布按钮条件监听
watchEffect(() => {
	if (
		imageSelectValue.value.length &&
		content.value &&
		price.value &&
		radioCate.value !== -1 &&
		radioCate.value !== 9999 &&
		radioBrand.value !== 9998 &&
		radioBrand.value !== -1
	) {
		btnType.value = 'primary'
	} else {
		btnType.value = 'default'
	}
})

//上传图片
async function publish() {
	if (btnType.value === 'default') {
		return uni.showToast({
			duration: 2000,
			title: '[描述]&[图片]&[标签]&[价格]都不能为空哦~',
			icon: 'none'
		})
	}
	await images.value.files.upload()
	const cateIndex = ori_category.value.findIndex(item => item.value === radioCate.value)
	const brandIndex = ori_brand.value.findIndex(item => item.value === radioBrand.value)
	const category_info = [
		{ name: ori_category.value[cateIndex]['text'], type: 0 },
		{ name: ori_brand.value[brandIndex]['text'], type: 1 }
	]
	const imageArr = getImagesOnline.value
	const res = await publishOnline(content.value, imageArr, category_info, price.value)
	if (res) {
		commonStore.goodId = res
		uni.redirectTo({
			url: '/pages/detail/detail'
		})
		clear()
	}
}
</script>

<style lang="less" scoped></style>
