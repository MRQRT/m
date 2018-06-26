<template>
	<div class="infodetail" ref="infodetail">
		<head-top headTitle='资讯详情' class="subHeader">
			<img slot='head_goback' src='../../../images/back.png' class="head_goback" @click="$router.go(-1)">
			<!-- <img src="../../../images/share.png" slot="custom" class="custom" style="width:.36rem;height:.36rem;" @click="shareNews"> -->
		</head-top>
		<div class="detail">
			<p class="detTitle">{{dataTitle}}</p>
			<p class="detTime">{{detailObj.createTime | formatTime}}</p>
			<div class="detContent"><span class="middLine"></span><p v-html="detailObj.content"></p></div>
		</div>
	</div>
</template>
<script>
import headTop from '../../../components/header/head.vue';
import { queryNewsDetail } from '@/service/getData'

	export default {
		data() {
			return {
				dataTitle:'',
				detailObj:{} //资讯详情
			}
		},
		created() {
		},
		mounted() {
			this.dataTitle=this.$route.query.title;
			this.queryNewsDetail();
		},
		filters:{
           formatTime(val){
             if(!val) return;
             var arr=val.split(':');
             arr.pop();
             arr=arr.join(':');
             arr=arr.split('-');
             arr.shift();
             arr=arr.join('-');
             return arr;
           },
        },
		methods:{
			async queryNewsDetail(){
				var id=this.$route.query.id;
				if(!id) return;
				var res=await queryNewsDetail(id);
				if(res.code==100){
					this.detailObj=res.content;
				}
			},
			shareNews(){
				// content=this.detailObj.content.replace(/<[^>]+>/g,"")
				var path='http://192.168.1.127:8080'+this.$route.fullPath,
				    title=this.dataTitle,
				    content="要分享的内容哈哈哈~";
				window.share(title,content,path)
			}
		},
		components: {
			headTop
		}
	}
</script>
<style scoped>
	.infodetail{
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		background-color:#fff;
	}
	.detail{
		padding:0 .32rem;
		margin-top:0.88rem;
	}
	.detTitle{
		padding-top:.42rem;
		font-size:.44rem;
	}
	.detTime{
		height:1.1rem;
		line-height:1.1rem;
		padding-left:.36rem;
		position:relative;
		font-size:.26rem;
	}
	.detTime:before{
		content:'';
		width:0.24rem;
		height:0.24rem;
		background:url('../../../images/timeIco.png');
		background-size:100% 100%; 
		position:absolute; 
		left:0;
		top:0.4rem;
	}
	.detContent{
		line-height:.5rem;
		color:#666666;
		padding-top:.52rem;
		position:relative;
		margin-bottom:.5rem;
	}
	.detContent p{
		font-size:.3rem;
		text-indent: .5rem;
	}
	.middLine{
		position:absolute;
		width:.48rem;
		height:.06rem;
		background-color:#EDA835;
		top:0;
		left:50%;
		margin-left:-.23rem;
	}
</style>