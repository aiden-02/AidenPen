import {
	defineStore
} from 'pinia'
import {
	db
} from '@/utils/db.js'
export const useCartStore = defineStore('cart', {
	state: () => ({
		cartData: [],
		userData: [],
		selectData: [],
	}),
	getters: {
		goodsData: (state) => {
			return state.cartData.map(item => item?.goods_id[0])
		},
		totalPrice: function(state) {
			const goods = this.goodsData
			return state.selectData.reduce((prev, cur) => {
				return goods[cur].price + prev
			}, 0)
		},
		selectGoods: function(state) {
			const goods = this.goodsData
			return state.selectData.reduce((prev, cur) => {
				prev.push(goods[cur]._id)
				return prev
			}, [])
		}
	},
	actions: {
		async getCartData() {
			const cart = db.collection('cart').where('user_id==$cloudEnv_uid').getTemp()
			const good = db.collection('goods').field('_id,user_id,goods_desc,goods_thumb,price')
				.getTemp()
			const {
				data
			} = await db.collection(cart, good).get()
			this.cartData = data
			if (this.cartData.length) {
				await this.getUserAvatar()
			}
		},
		async getUserAvatar() {
			const users = this.goodsData.map(item => item?.user_id)
			const reqArr = []
			for (let id of users) {
				reqArr.push(db.collection('uni-id-users').doc(id).field('nickname,avatar_file.url')
					.getTemp())
			}
			const {
				dataList
			} = await db.multiSend(...reqArr)
			this.userData = dataList.map(item => item?.data[0])
		},
		async deleteCartOL(id) {
			const {
				deleted
			} = await db.collection('cart').doc(id).remove()
			return deleted
		},
		async clear() {
			const arr = []
			for (let id of this.selectGoods) {
				arr.push(db.collection('cart').where({
					goods_id: id
				}).remove())
			}
			await Promise.all(arr)
			this.cartData = []
			this.userData = []
			this.selectData = []
			await this.getCartData()
			return true
		}
	}
})
