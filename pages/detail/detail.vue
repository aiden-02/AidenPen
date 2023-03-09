<template>
	<uni-load-more v-if="loading" status="loading"></uni-load-more>
	<view class="detail" v-else>
		<uni-card
			:border="false"
			:is-shadow="false"
			is-full
			:title="data.user_id[0].nickname"
			:sub-title="`发布于${new Date(data.add_date).toLocaleString()}`"
			:thumbnail="data.user_id[0].avatar_file.url"
		>
			<view class="shop-price">
				<text>¥</text>
				<text class="shop-price-text">{{ data.price.toString().split('.')[0] }}</text>
				<text>.{{ data.price.toString().split('.')[1] || '00' }}</text>
				<text>元</text>
			</view>
			<view class="text">{{ data.goods_desc }}</view>
			<uni-swiper-dot class="mb-10" :info="data.goods_banner_imgs" :current="current" mode="round">
				<swiper @change="change" circular easing-function="easeInOutCubic">
					<swiper-item v-for="item in data.goods_banner_imgs" :key="item">
						<image :src="item" mode="heightFix"></image>
					</swiper-item>
				</swiper>
			</uni-swiper-dot>

			<view class="comment">
				<uni-easyinput type="" v-model="comment" placeholder="输入您的评论" trim="all" all />
				<button size="mini" type="primary" @click="addComment(goodId, comment)">发表</button>
			</view>
			<uni-section :title="`${comments.length}条评论`" type="line"></uni-section>
			<uni-list>
				<template v-for="item in comments" :key="item._id">
					<uni-list-chat
						:title="item?.user_id[0]?.nickname"
						:avatar="item?.user_id[0]?.avatar_file.url"
						:note="item?.content"
					>
						<template #default>
							<text class="date">{{ new Date(item.create_date).toLocaleString() }}</text>
							<button
								v-if="item?.user_id[0]?._id === uniStore.userInfo?._id"
								size="mini"
								type="warn"
								@click="deleteComment(item._id)"
							>
								删除
							</button>
						</template>
					</uni-list-chat>
				</template>
				<view style="height: 50px;width: 100%;"></view>
			</uni-list>
		</uni-card>
		<bottom-cart
			v-if="data.user_id[0]?._id !== uniStore.userInfo?._id"
			:goodId="data._id"
			:price="data.price"
		></bottom-cart>
	</view>
</template>

<script setup>
import { ref } from 'vue'
import { useCommonStore } from '@/stores/common.js'
import { storeToRefs } from 'pinia'
import { store as uniStore } from '@/uni_modules/uni-id-pages/common/store.js'
import bottomCart from './bottom_cart/bottom_cart.vue'
const loading = ref(true)
const data = ref()
const store = useCommonStore()
const { goodId, comments } = storeToRefs(store)
const { getDetail, getCommentOl, addCommentOl, deleteCommentOl } = store
;(async function init() {
	const res = await getDetail()
	data.value = res
	await getCommentOl()
	loading.value = false
})()
const current = ref(0)
function change(e) {
	current.value = e.detail.current
}

const comment = ref('')

async function addComment(goodId, comment) {
	const res = await addCommentOl(goodId, comment)
	res &&
		uni.showToast({
			title: '发表成功',
			duration: 1000,
			async success() {
				await getCommentOl()
			}
		})
}

function deleteComment(goodId) {
	uni.showModal({
		title: '是否删除',
		async success(e) {
			if (e.confirm) {
				const res = await deleteCommentOl(goodId)
				res &&
					uni.showToast({
						title: '删除成功',
						duration: 1000,
						async success() {
							await getCommentOl()
						}
					})
			}
		}
	})
}
</script>
<style lang="less" scoped>
.detail {
	width: 100%;
	height: 100%;
	overflow-x: hidden;
	overflow-y: auto;
}
.mb-10 {
	margin-bottom: 10px;
}
.shop-price {
	font-size: 16px;
	color: #ff5a5f;
}

.shop-price-text {
	font-size: 18px;
}
.text {
	margin: 10px 0;
	font-weight: 600;
	font-size: 16px;
}
:deep(uni-swiper) {
	height: 240px;
}

.comment {
	display: flex;
	justify-content: space-evenly;
	align-items: center;
}
.date {
	font-size: 12px;
}
:deep(uni-button) {
	padding-left: 10px;
	padding-right: 10px;
}

:deep(.uni-easyinput__content-input) {
	height: 29px;
}

:deep(.uni-list-chat__container) {
	padding: 10px 0;
}
:deep(.uni-list-chat__content-note) {
	font-size: 15px;
}
</style>
