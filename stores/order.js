import {
	defineStore
} from 'pinia'
import {
	db
} from '@/utils/db.js'

export const useOrderStore = defineStore('order', {
	state: () => ({
		orderData: []
	}),
	actions: {
		async getOrderOL() {
			const {
				data
			} = await db.collection('order').where('user_id==$cloudEnv_uid').get()
			this.orderData = data
		},
		async addOrderOL(total_fee, goods) {
			const {
				id
			} = await db.collection('order').add({
				total_fee,
				goods
			})
			return id
		}
	}
})
