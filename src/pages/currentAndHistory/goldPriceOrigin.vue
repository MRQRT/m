<template>
	<div class="price-gold-origin">
		<head-top headTitle='金价来历'>
			<img slot='head_goback' src='../../images/back.png' class="head_goback" @click="$router.go(-1)">
		</head-top>

        <div class="mainMess">
        	<section class="origin">
        		<h3>金价来源
        		<div class="orangeLine"></div>
        		</h3>
        		<div class="mess">
        			<p>上海黄金交易所交易时间段内,黄金管家金价实时参照上海黄金交易所最新成交价;</p>
        			<p>上海黄金交易所休盘期间,黄金管家金价实时参照国际最新成交价;</p>
        			<p>每周末全球黄金交易所闭盘时，黄金管家金价参照本周国际金价收盘价,金价不发生波动.</p>
        		</div>
        	</section>

        	<section class="trageTime">
        		<h3>交易所交易时间
        		<div class="orangeLine"></div></h3>
        		<div class="mess">
        			<p>1.上海交易所交易时间:每周一至周五20:00至次日2:30,9:00-11:30,13:30-15:30;</p>
        			<p>2.全球黄金交易所闭盘时间:每周六早6:00至周一早8:00(夏令时),每周六早7:00至周一早7:00(冬令时);</p>
        			<p>3.法定节假日及交易所公告的休市日,交易所的交易时间可能会有所调整.</p>
        		</div>
        	</section>
        </div>
		
	</div>
</template>

<script>
	import headTop from '../../components/header/head.vue';
	export default {
		data(){
			return {
			}
		},
		mounted() {
			
		},
		computed:{
			
		},
		methods:{
			
		},
		components:{
			headTop
		}
	}
</script>

<style scoped>
    *{
    	box-sizing: border-box;
        margin:0;
        padding:0;
    }
    .mainMess{
    	margin-top:0.88rem;
    	padding:0 .32rem;
    	padding-top:.4rem;
        background-color: #fff;
    }
    .mainMess .origin h3,.mainMess .trageTime h3{
     	height:.96rem;
     	text-align: center;
     	font-size:.42rem;
     	font-weight: normal;
     	position: relative;
     }
     .origin h3 .orangeLine,.trageTime h3 .orangeLine{
     	position: absolute;
     	width:.46rem;
     	height:.05rem;
     	bottom:.05rem;
     	left:50%;
     	margin-left:-.23rem;
     	background-color: #EDA835;
     }
     .mainMess .origin .mess,.mainMess .trageTime .mess{
     	height:3.94rem;
     	padding-top:0.5rem;
     }
     .mainMess p{
     	line-height:.5rem;
     	font-size:.26rem;
     	color:#818181;
     }
</style>