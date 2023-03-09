import {
	defineStore
} from 'pinia'
import {
	db
} from '@/utils/db.js'
export const useCommonStore = defineStore('common', {
	state: () => ({
		goodId: '',
		comments: [],
		count: 0
	}),
	actions: {
		async getDetail() {
			const good = db.collection('goods')
				.where({
					_id: this.goodId
				})
				.getTemp()
			const user = db
				.collection('uni-id-users')
				.field('_id,avatar_file.url,nickname')
				.getTemp()
			const {
				data
			} = await db.collection(good, user).get()
			return data[0]
		},
		async getCommentOl() {
			const comment = db.collection('comments').where({
				goods_id: this.goodId
			}).getTemp()
			const user = db
				.collection('uni-id-users')
				.field('_id,avatar_file.url,nickname')
				.getTemp()
			const {
				count,
				data
			} = await db.collection(comment, user).get({
				getCount: true
			})
			db.collection('goods').doc(this.goodId).update({
				comment_count: count
			})
			this.comments = data
		},
		async addCommentOl(goods_id, content) {
			const {
				id
			} = await db.collection('comments').add({
				goods_id,
				content
			})
			return id
		},
		async deleteCommentOl(goods_id) {
			const {
				deleted
			} = await db.collection('comments').doc(goods_id).remove()
			return deleted
		},
	}
})
