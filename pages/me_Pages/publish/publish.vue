<template>
	<unicloud-db
		ref="udb"
		v-slot:default="{ data, pagination, loading, hasMore, error, options }"
		orderby="last_modify_date asc, add_date asc"
		collection="goods"
		field="goods_desc,goods_thumb,category_info,price,comment_count,add_date,last_modify_date"
		where="user_id==$cloudEnv_uid"
		:getone="false"
	>
		<view v-if="error">数据库查询错误</view>
		<view v-else-if="loading"><uni-load-more status="loading"></uni-load-more></view>
		<view v-else>
			<uni-list :border="false">
				<uni-list-item #body v-for="good in data" :key="good._id">
					<uni-card isFull spacing="0" @click="onClick(good._id)">
						<image mode="aspectFill" slot="cover" style="width: 100%;" :src="good.goods_thumb"></image>
						<view class="mid">
							<view>
								<template v-for="item in good.category_info" :key="item.name">
									<uni-tag
										class="mr-10"
										:text="item.type === 0 ? `类别：${item.name}` : `品牌：${item.name}`"
										:type="item.type === 0 ? 'primary' : 'error'"
										:inverted="true"
										:mark="true"
										size="mini"
									></uni-tag>
								</template>
							</view>
							<view class="mid-right">
								<text class="price">￥{{ good.price }}</text>
								<text class="more" @click.capture.stop="more(good._id)">■■■</text>
							</view>
						</view>
						<view class="desc">
							<text class="descText">{{ good.goods_desc }}</text>
						</view>
						<view class="bottom">
							<view class="left">
								<text>发布于</text>
								<uni-dateformat format="yyyy年M月dd日 hh:mm" :date="good.add_date"></uni-dateformat>
							</view>
							<view class="right">
								<text>{{ good.comment_count }}条评论</text>
							</view>
						</view>
					</uni-card>
				</uni-list-item>
			</uni-list>
			<uni-load-more v-if="!loading" :status="hasMore ? 'more' : 'noMore'"></uni-load-more>
		</view>
	</unicloud-db>
	<uni-popup ref="popup" type="bottom">
		<view><button @click="deleteGood">删除</button></view>
	</uni-popup>
</template>

<script setup>
import { ref } from 'vue'
import { db } from '@/utils/db.js'
import { useCommonStore } from '@/stores/common.js'
const commonStore = useCommonStore()
function onClick(id) {
	commonStore.goodId = id
	uni.navigateTo({
		url: '/pages/detail/detail'
	})
}

let goodsId = ''
const popup = ref()
function more(id) {
	goodsId = id
	popup.value.open()
}
const udb = ref()
function deleteGood() {
	uni.showModal({
		title: '是否要删除',
		async success(e) {
			if (e.confirm) {
				popup.value.close()
				const { deleted } = await db
					.collection('goods')
					.doc(goodsId)
					.remove()
				deleted && udb.value.refresh()
			}
		}
	})
}
</script>
<script>
export default {
	onPullDownRefresh() {
		this.$refs.udb.loadData(
			{
				clear: true
			},
			() => {
				uni.stopPullDownRefresh()
			}
		)
	},
	onReachBottom() {
		//滚动到底翻页
		this.$refs.udb.loadMore()
	}
}
</script>

<style lang="less" scoped>
.mr-10 {
	margin-right: 10px;
}

.mid {
	display: flex;
	justify-content: space-between;
	.price {
		color: #ff9f3e;
		font-size: 16px;
		margin-right: 3px;
	}
}
.mid-right {
	display: flex;
	align-items: center;
	justify-content: space-evenly;
	.more {
		padding-left: 5px;
		padding-right: 2px;
		color: #ff42d3;
		font-size: 12px;
	}
}
.desc {
	margin: 5px 0 3px 0;
	font-weight: 600;
	.descText {
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
		overflow: hidden;
		text-overflow: -o-ellipsis-lastline;
	}
}

.bottom {
	display: flex;
	justify-content: space-between;
	font-weight: 200;
	font-size: 12px;
	color: #888;
}
</style>
