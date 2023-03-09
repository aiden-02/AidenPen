<template>
	<uni-card padding="0">
		<uni-section class="tag" title="商品标签" type="circle">
			<view class="tag-view" v-for="(value, key) in tags" :key="key">
				<uni-section :title="key"></uni-section>
				<uni-data-checkbox
					@change="tagValueChange(value.model.value)"
					mode="tag"
					v-model="value.model.value"
					:localdata="value.data.value"
				></uni-data-checkbox>
			</view>
		</uni-section>
	</uni-card>

	<uni-drawer :width="200" ref="showRight" mode="right" :mask-click="true">
		<view class="up">
			<uni-search-bar
				placeholder="search"
				class="search"
				v-model.trim="searchString"
				cancelButton="none"
			></uni-search-bar>
			<button class="add" type="default" @click="addTags(searchString)">添加</button>
		</view>
		<scroll-view style="height: calc(100% - 56px);" scroll-y="true">
			<uni-swipe-action>
				<uni-swipe-action-item v-for="item in searchedArr" :key="item.text">
					<view class="content-box" @click="tagBtnClick(item)">
						<text class="content-text">{{ item.text }}</text>
					</view>
					<template #right>
						<view class="update-button" @click="updateTag(item)"><text class="slot-button-text">更新</text></view>
						<view class="slot-button" @click="deleteTag(item)"><text class="slot-button-text">删除</text></view>
					</template>
				</uni-swipe-action-item>
			</uni-swipe-action>
		</scroll-view>
	</uni-drawer>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useCreateStore } from '@/stores/create.js'
const store = useCreateStore()
const { getTag, addTag, deleteTagOL, updateTagOL } = store
getTag()
const {
	radioCate,
	radioBrand,
	ori_category,
	category,
	ori_brand,
	brand,
	drawState,
	searchString,
	addVerify,
	search
} = storeToRefs(store)

const tags = {
	'类别:': {
		data: category,
		model: radioCate
	},
	'品牌:': {
		data: brand,
		model: radioBrand
	}
}
function tagValueChange(value) {
	if (value === 9999) {
		compos(ori_category, 0)
	}
	if (value === 9998) {
		compos(ori_brand, 1)
	}
}
function compos(arr, index) {
	searchString.value = ''
	searchedArr = search.value(arr.value)
	addRes = addVerify.value(arr.value)
	drawState.value = index
	showRight.value.open()
}

const showRight = ref()
//搜索结果数组
let searchedArr = null
let addRes = null

function addTags(tagString) {
	if (!tagString) {
		searchString.value = ''
		uni.showToast({
			title: '不能为空~~',
			icon: 'error'
		})
		return
	}
	if (!addRes.value) {
		searchString.value = ''
		uni.showToast({
			title: '不能为重复标签',
			icon: 'error'
		})
		return
	}
	if (drawState.value === 0) {
		addTag(tagString, 0)
		ori_category.value.unshift({ text: tagString, value: ori_category.value.length })
	} else {
		addTag(tagString, 1)
		ori_brand.value.unshift({ text: tagString, value: ori_brand.value.length })
	}
}

function tagBtnClick(item) {
	if (drawState.value === 0) {
		radioCate.value = item.value
		showRight.value.close()
	} else {
		radioBrand.value = item.value
		showRight.value.close()
	}
}

function deleteTag(item) {
	uni.showModal({
		content: '确定要删除吗',
		async success(e) {
			e.confirm && drawState.value === 0 ? deleteCompo(ori_category, item) : deleteCompo(ori_brand, item)
		}
	})
}
async function deleteCompo(arr, item) {
	const res = await deleteTagOL(item.text, drawState.value)
	!!res &&
		uni.showToast({
			title: '删除标签成功',
			mask: true,
			icon: 'success',
			duration: 500
		})
	searchString.value = ''
	arr.value.splice(arr.value.indexOf(item), 1)
}

function updateTag(item) {
	uni.showModal({
		title: '请输入标签名',
		content: item.text,
		editable: true,
		async success(e) {
			e.confirm && e.content && drawState.value === 0
				? updateCompo(ori_category, item, e.content)
				: updateCompo(ori_brand, item, e.content)
		}
	})
}
async function updateCompo(arr, item, content) {
	const res = await updateTagOL(item.text, drawState.value, content)
	!!res &&
		uni.showToast({
			title: '更新标签成功',
			mask: true,
			icon: 'success',
			duration: 500
		})
	searchString.value = ''
	arr.value[arr.value.indexOf(item)].text = content
}
</script>

<style lang="less" scoped>
.tag-view {
	display: flex;
	width: 100%;
	margin-bottom: 5px;
	align-items: center;
}

uni-button::after {
	border: 0px solid #fff;
}

uni-button {
	font-size: 14px;
	padding-left: 7px;
	padding-right: 7px;
}

.up {
	display: flex;
	justify-content: flex-start;
	height: 40px;

	.search {
		flex: 1;
	}
}

.uni-searchbar {
	padding: 0;
}

.content-box {
	flex: 1;
	/* #ifdef APP-NVUE */
	justify-content: center;
	/* #endif */
	height: 38px;
	line-height: 38px;
	text-align: center;
	padding: 0 15px;
	position: relative;
	background-color: transparent;
	border-bottom-color: #f0f0f0;
	border-bottom-width: 1px;
	border-bottom-style: solid;
}

.content-text {
	font-size: 15px;
}

.slot-button {
	/* #ifndef APP-NVUE */
	display: flex;
	height: 100%;
	/* #endif */
	flex: 1;
	flex-direction: row;
	justify-content: center;
	align-items: center;
	padding: 0 10px;
	background-color: #ff5a5f;
}

.update-button {
	/* #ifndef APP-NVUE */
	display: flex;
	height: 100%;
	/* #endif */
	flex: 1;
	flex-direction: row;
	justify-content: center;
	align-items: center;
	padding: 0 10px;
	background-color: #5871ff;
}

.slot-button-text {
	color: #ffffff;
	font-size: 14px;
}
</style>
