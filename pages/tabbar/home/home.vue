<template>
	<view class="list">
		<view class="tips" :class="{ 'tips-ani': tipShow }">已更新</view>
		<unicloud-db
			ref="udb"
			v-slot:default="{ data, loading, error, options }"
			:options="formData"
			collection="goods"
			field="goods_thumb,goods_desc,category_info,price,comment_count"
			:where="where"
			@load="load"
		>
			<uni-list class="uni-list--waterfall">
				<uni-list-item
					clickable
					:border="false"
					class="uni-list-item--waterfall"
					title="商品列表"
					v-for="item in data"
					:key="item._id"
					@click="clickTo(item._id)"
				>
					<!-- 通过header插槽定义列表左侧图片 -->
					<template v-slot:header>
						<view class="shop-picture-column"><image :src="item.goods_thumb" mode="aspectFill"></image></view>
					</template>
					<!-- 通过body插槽定义商品布局 -->
					<template v-slot:body>
						<view class="shop">
							<view>
								<view class="uni-title">
									<text class="uni-ellipsis-2">{{ item.goods_desc }}</text>
								</view>
								<view class="hot-tag">
									<uni-tag
										v-for="tag in item.category_info"
										:key="tag.name"
										:text="tag.name"
										:type="tag.type === 0 ? 'primary' : 'error'"
										:inverted="true"
										:circle="true"
										size="small"
										style="margin-right: 5px;"
									></uni-tag>
								</view>
							</view>
							<view class="bottom">
								<view class="shop-price">
									<text>¥</text>
									<text class="shop-price-text">{{ item.price.toString().split('.')[0] }}</text>
									<text>.{{ item.price.toString().split('.')[1] || '0' }}</text>
								</view>
								<view class="uni-note">{{ item.comment_count }}条评论</view>
							</view>
						</view>
					</template>
				</uni-list-item>
			</uni-list>
			<uni-load-more v-if="loading || options.status === 'noMore'" :status="options.status" />
		</unicloud-db>
	</view>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useCommonStore } from '@/stores/common.js'
import { store } from '@/uni_modules/uni-id-pages/common/store.js'
const commonStore = useCommonStore()
const where = computed(() => {
	return store.hasLogin ? 'user_id != $cloudEnv_uid' : ''
})

function clickTo(goodId) {
	commonStore.goodId = goodId
	uni.navigateTo({
		url: '/pages/detail/detail'
	})
}
</script>
<script>
import { store } from '@/uni_modules/uni-id-pages/common/store.js'
export default {
	data() {
		return {
			formData: {
				status: 'loading' // 加载状态
			},
			tipShow: false // 是否显示顶部提示框
		}
	},
	onLoad() {},
	methods: {
		load(data, ended) {
			if (ended) {
				this.formData.status = 'noMore'
			}
		}
	},
	/**
	 * 下拉刷新回调函数
	 */
	onPullDownRefresh() {
		this.formData.status = 'more'
		this.$refs.udb.loadData(
			{
				clear: true
			},
			() => {
				this.tipShow = true
				clearTimeout(this.timer)
				this.timer = setTimeout(() => {
					this.tipShow = false
				}, 1000)
				uni.stopPullDownRefresh()
			}
		)
	},
	/**
	 * 上拉加载回调函数
	 */
	onReachBottom() {
		this.$refs.udb.loadMore()
	}
}
</script>

<style lang="scss" scoped>
page {
	display: flex;
	flex-direction: column;
	box-sizing: border-box;
	background-color: #efeff4;
	min-height: 100%;
	height: auto;
}

.tips {
	color: #67c23a;
	font-size: 14px;
	line-height: 40px;
	text-align: center;
	background-color: #f0f9eb;
	height: 0;
	opacity: 0;
	transform: translateY(-100%);
	transition: all 0.3s;
}

.tips-ani {
	transform: translateY(0);
	height: 40px;
	opacity: 1;
}

.shop {
	flex: 1;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
}

.shop-picture-column {
	overflow: hidden;
	border-radius: 10px;
	border: 1px solid #fff;
	width: 100%;
	height: 50%;
}

.bottom {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-top: 5px;
}

.shop-price {
	font-size: 12px;
	color: #ff5a5f;
}

.shop-price-text {
	font-size: 16px;
}
.uni-note {
	font-size: 13px;
	color: #888;
}
.hot-tag {
	margin-top: 5px;
}

.button-box {
	height: 30px;
	line-height: 30px;
	font-size: 12px;
	background: #007aff;
	color: #fff;
}
.uni-title {
	font-size: 13px;
	font-weight: 600;
}
.uni-ellipsis-2 {
	overflow: hidden;
	text-overflow: ellipsis;
	display: -webkit-box;
	-webkit-line-clamp: 1;
	-webkit-box-orient: vertical;
}

// 默认加入 scoped ，所以外面加一层提升权重
.list {
	width: 100%;
	height: 100%;
	overflow-x: hidden;
	overflow-y: auto;

	.uni-list--waterfall {
		/* #ifndef H5 || APP-VUE */
		// 小程序 编译后会多一层标签，而其他平台没有，所以需要特殊处理一下
		:deep(.uni-list) {
			/* #endif */
			display: flex;
			flex-direction: row;
			flex-wrap: wrap;
			padding: 5px;
			box-sizing: border-box;

			/* #ifdef H5 || APP-VUE */
			// h5 和 app-vue 使用深度选择器，因为默认使用了 scoped ，所以样式会无法穿透
			// :deep(.uni-list-item--waterfall)
			/* #endif */
			:deep(.uni-list-item--waterfall) {
				width: 50%;
				box-sizing: border-box;
				.uni-list-item__container {
					display: flex;
					padding: 5px;
					flex-direction: column;
				}
			}

			/* #ifndef H5 || APP-VUE */
		}
		/* #endif */
	}
}
</style>
