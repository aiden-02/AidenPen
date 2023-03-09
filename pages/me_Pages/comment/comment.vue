<template>
	<unicloud-db
		ref="udb"
		v-slot:default="{ data, loading, hasMore, error, options }"
		orderby="create_date asc"
		:collection="colList"
		:getone="false"
	>
		<view v-if="error">数据库查询错误</view>
		<view v-else-if="loading"><uni-load-more status="loading"></uni-load-more></view>
		<view v-else>
			<uni-list>
				<template v-for="item in data" :key="item._id">
					<uni-list-chat
						:note="item?.goods_id[0]?.goods_desc"
						:avatar="item?.goods_id[0]?.goods_thumb"
						:title="item.content"
						:time="new Date(item.create_date).toLocaleDateString()"
						link="navigateTo"
						clickable
						:to="clickTo(item?.goods_id[0]?._id)"
					></uni-list-chat>
				</template>
			</uni-list>
			<uni-load-more v-if="!loading" :status="hasMore ? 'more' : 'noMore'"></uni-load-more>
		</view>
	</unicloud-db>
</template>

<script setup>
import { useCommonStore } from '@/stores/common.js'
import { db } from '@/utils/db.js'
const commonStore = useCommonStore()
const colList = [
	db
		.collection('comments')
		.where('user_id == $cloudEnv_uid')
		.field('create_date,content,goods_id')
		.getTemp(),
	db
		.collection('goods')
		.field('_id,goods_desc,goods_thumb,user_id')
		.getTemp()
]
function clickTo(goodId) {
	commonStore.goodId = goodId
	return '/pages/detail/detail'
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
<style></style>
