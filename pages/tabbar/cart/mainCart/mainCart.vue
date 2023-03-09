<template>
	<checkbox-group @change.="checkboxChange">
		<label class="uni-list-cell" v-for="(item, index) in cartData" :key="item._id">
			<checkbox :value="index.toString()" :checked="item.check" />
			<uni-swipe-action style="width: 100%;">
				<uni-swipe-action-item :right-options="options" @click="e => deleteClick(e, item._id)">
					<view class="box">
						<uni-card
							isFull
							:title="userData[index]?.nickname"
							:thumbnail="userData[index]?.avatar_file.url"
							:extra="'￥' + goodsData[index]?.price"
						>
							<view class="content">{{ goodsData[index]?.goods_desc }}</view>
						</uni-card>
					</view>
				</uni-swipe-action-item>
			</uni-swipe-action>
		</label>
	</checkbox-group>
</template>

<script setup>
import { useCartStore } from '@/stores/cart.js'
import { storeToRefs } from 'pinia'
import { computed } from 'vue'
const cartStore = useCartStore()
const { cartData, userData, selectData, goodsData } = storeToRefs(cartStore)
const { getCartData, deleteCartOL } = cartStore
function checkboxChange(e) {
	selectData.value = e.detail.value
}

async function deleteClick(e, cartId) {
	const res = await deleteCartOL(cartId)
	res &&
		uni.showToast({
			title: '删除成功',
			icon: 'success',
			async success() {
				await getCartData()
			}
		})
}
const options = [
	{
		text: '删除',
		style: {
			backgroundColor: '#dd524d'
		}
	}
]
</script>

<style lang="less" scoped>
.uni-list-cell {
	display: flex;
	justify-content: flex-start;
	align-items: center;
	.box {
		flex: 1;
		margin-bottom: 10px;
		.content {
			overflow: hidden;
			text-overflow: ellipsis;
			display: -webkit-box;
			-webkit-line-clamp: 2;
			-webkit-box-orient: vertical;
		}
		.count {
			margin-top: 10px;
		}
	}
}

:deep(.uni-card__header-extra-text) {
	font-size: 15px !important;
	color: #ff4346 !important;
}
</style>
