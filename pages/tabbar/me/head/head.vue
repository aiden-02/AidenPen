<template>
	<uni-card
		@click="click"
		:is-shadow="false"
		spacing="20"
		:title="hasLogin ? userInfo.nickname || userInfo.username || userInfo.mobile : '未登录'"
		:thumbnail="
			hasLogin ? (userInfo.avatar_file && userInfo.avatar_file.url) || '/static/default.png' : '/static/default.png'
		"
	>
		<text>{{ showQuote() }}</text>
	</uni-card>
</template>

<script setup>
import { computed } from 'vue'
import { store } from '@/uni_modules/uni-id-pages/common/store.js'

const hasLogin = computed(() => store.hasLogin)
const userInfo = computed(() => store.userInfo)
function click() {
	uni.navigateTo({
		url: '/uni_modules/uni-id-pages/pages/userinfo/userinfo'
	})
}
const quotes = [
	'人需要真理，就像瞎子需要明快的引路人一样。——高尔基',

	'人的美德的荣誉比他的财富的荣誉不知大多少倍。——达·芬奇',

	'时间最不偏私，给任何人都是二十四小时；时间也最偏私，给任何人都不是二十四小时。——赫胥黎',

	'人的天职在勇于探索真理。——哥白尼',

	'恨不得挂长绳于青天，糸此西飞之白日。——李白',

	'世界上最快而又最慢，最长而又最短，最平凡而又最珍贵，最易被忽视而又最令人后悔的就是时间。——高尔基',

	'真正的敏捷是一件很有价值的事。因为时间是衡量事业的标准，如金钱是衡量货物的标准。——弗·培根',

	'选择机会，就是节省时间。——培根',

	'时间是我的财产，我的田亩是时间。——歌德',

	'白日去如箭，达者惜今阳。——朱敦儒',

	'明日复明日，明日何其多！日日待明日，万事成蹉跎。世人皆被明日累，明日无穷老将至。晨昏滚滚水东流。今古悠悠日西坠。百年明日能几何？请君听我《明日歌》。——文嘉',

	'黄河走东溟，白日落西海，逝川与流光，飘忽不相待。——李白',

	'生活的情况越艰难，我越感到自己更坚强，甚而也更聪明。——高尔基',

	'世有伯乐，然后有千里马。——韩愈',

	'任何问题都有解决的办法，无法可想的事是没有的。——爱迪生',

	'世界上最可宝贵的就是“今”，最容易丧失的也是“今”因为他最容易丧失，所以更觉得他宝贵。——李大钊',

	'浪费时间是所有支出中最奢侈及最昂贵的。——富兰克林'
]
const showQuote = () => quotes[Math.floor(Math.random() * (quotes.length + 1))]
</script>

<style lang="less" scoped></style>
