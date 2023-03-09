import {
	defineStore
} from 'pinia'
import {
	computed
} from 'vue'
import {
	db
} from '../utils/db.js'
export const useCreateStore = defineStore('create', {
	state: () => ({
		content: '',
		imageSelectValue: [],
		//上传成功后返回的在线图片地址数组
		imageSuccessPaths: [],
		radioCate: 0,
		radioBrand: 0,
		ori_category: [],
		//原始数组
		ori_brand: [],
		searchString: '',
		//展示数组
		drawState: 0, // 0 代表打开的是category 1代表brand
		price: 0
	}),
	getters: {
		category: (state) => {
			const temp = state.ori_category.slice(0, 5)
			temp.push({
				text: '更多类别 >',
				value: 9999
			})
			return temp
		},
		brand: (state) => {
			const temp = state.ori_brand.slice(0, 5)
			temp.push({
				text: '更多品牌 >',
				value: 9998
			})
			return temp
		},
		addVerify: state =>
			searchArr =>
			computed(() => {
				return searchArr.findIndex((value, index) =>
					value.text === state.searchString
				) === -1
			}),
		search: state =>
			searchArr =>
			computed(() => {
				return searchArr.filter(item => item.text.includes(state.searchString))
			}),
		getImagesOnline(state) {
			return state.imageSuccessPaths
		}
	},
	actions: {
		async getTag() {
			const {
				data
			} = await db.collection('categories').field('name,type').get()

			function handle(type = 0) {
				let index = 0
				return data.filter(value => value.type === type).map(value => ({
					text: value.name,
					value: index++
				}))
			}
			this.ori_category = handle()
			this.ori_brand = handle(1)
		},
		async addTag(name, type) {
			const tagsData = await db.collection('categories').add({
				name,
				type
			})
		},
		async publishOnline(goods_desc, goods_banner_imgs, category_info, price) {
			const {
				id
			} = await db.collection('goods').add({
				goods_desc,
				goods_thumb: goods_banner_imgs[0],
				goods_banner_imgs,
				category_info,
				price
			})
			return id
		},
		async deleteTagOL(name, type) {
			const {
				deleted
			} = await db.collection('categories').where({
				name,
				type
			}).remove()
			return deleted
		},
		async updateTagOL(name, type, content) {
			const {
				updated
			} = await db.collection('categories').where({
				name,
				type
			}).update({
				name: content
			})
			return updated
		},
		clear() {
			this.content = ''
			this.imageSelectValue = []
			this.imageSuccessPaths = []
			this.radioCate = 0
			this.radioBrand = 0
			this.ori_category = []
			this.ori_brand = []
			this.searchString = ''
			this.drawState = 0
			this.price = 0
		}
	}
});
