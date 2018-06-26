<template>
	<div class="infodetail" ref="infodetail">
		<head-top headTitle='消息详情' class="subHeader">
			<img slot='head_goback' src='../../images/back.png' class="head_goback" @click="$router.go(-1)">
		</head-top>
		<div class="detail">
			<p class="detTitle">{{dataObj.title}}</p>
			<p class="detTime">{{dataObj.createTime | formatTime}}</p>
			<p class="detContent"><span class="middLine"></span><p v-html="dataObj.content"></p></p>
		</div>
	</div>
</template>
<script>
import headTop from '../../components/header/head.vue';
import { queryMsgDetail } from '@/service/getData'

	export default {
		data() {
			return {
				dataObj:{},
				id:null,//消息唯一标识
			}
		},
		created() {
			this.id=this.$route.query.id;
		},
		mounted() {
			this.queryMsgDetail();
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
          }
        },
		methods:{
			async queryMsgDetail(){
				var res=await queryMsgDetail(this.id);
				if(res.code==100){
					this.dataObj=res.content;
				}
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
		padding:0 .3rem;
		margin-top:0.88rem;
	}
	.detTitle{
		padding-top:.42rem;
		font-size:.42rem;
		color:#000000;
	}
	.detTime{
		height:1.1rem;
		line-height:1.1rem;
		padding-left:.36rem;
		position:relative;
		font-size:.2rem;
		color:#999999;
	}
	.detTime:before{
		content:'';
		width:0.24rem;
		height:0.24rem;
		background:url('../../images/timeIco.png');
		background-size:100% 100%; 
		position:absolute; 
		left:0;
		top:0.4rem;
	}
	.detContent{
		text-indent: .5rem;
	    line-height:.5rem;
		font-size:.28rem;
		color:#666666;
		padding-top:.42rem;
		position:relative;
	}
	.middLine{
		position:absolute;
		width:.44rem;
		height:.04rem;
		background-color:#EDA835;
		top:0;
		left:50%;
		margin-left:-.22rem;
	}
</style>