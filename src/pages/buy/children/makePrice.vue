<template>
	<div class="price-making-container">
		<head-top headTitle='价格设置' class="head-top">
			<img slot='head_goback' src='../../../images/back.png' class="head_goback" @click="$router.go(-1)">
		</head-top>
		<div class="priceMake">
		<!--计算公式部分-->
			<div class="calculation">
				<span class="desc">最高买入价:</span>
				<span class="formula">{{currentPrice}}(实时金价)+<span style="color:#eda835;">{{buyMargin}}0元</span></span>
			</div>
			<!--价格设置部分-->
			<div class="makePriceContainer">
				<span class="decrease" @click="decrease()"><img src="../../../images/minus.png" style="width:.24rem;height:.02rem;"></span>
				<span class="price">{{currentMaxBuy}}</span>
				<span class="increase" @click="increase()"><img src="../../../images/addBg.png" style="width:.36rem;height:.36rem;"></span>
			</div>
			<!--警告部分-->
			<p class="notice" v-show="isShow">不得小于实时金价</p>
			<div class="explaination" :class="{'marginTop':!isShow}">
				<p>由于黄金价格实时波动,您可以设置最高买入价格,在购买时:</p>
				<p>1.若行情小于{{currentMaxBuy}}元/克,则立即成交。</p>
				<p>2.若行情大于{{currentMaxBuy}}元/克,则立即失败。</p>
			</div>
		</div>
	</div>
</template>

<script>
	import {mapState,mapMutations} from 'vuex';
	import headTop from '../../../components/header/head.vue';
	export default {
		data(){
			return {
				isShow:false,//设置的价格不得小于当前金价

			}
		},
		mounted() {
			
		},
		computed:{
			...mapState([
                'currentPrice',//实时金价
                'buyMargin',//设置的价格浮动范围
            ]),
            currentMaxBuy(){
            	return (this.currentPrice*1+this.buyMargin*1).toFixed(2);
            },
		},
		methods:{
			...mapMutations([
                'RECORD_BUYMARGIN',
            ]),
            /*实时金价*/
            currentPrice(val){
            	return val
            },
			decrease(){
				if(this.buyMargin==0){
					this.isShow=true;return;
				}
				
				var margin=(this.buyMargin-0.1)*1;
				this.RECORD_BUYMARGIN(margin.toFixed(1));
			},
			increase(){
				this.isShow=false;
				
				var margin=this.buyMargin*1+0.1;
				this.RECORD_BUYMARGIN(margin.toFixed(1));
			}
		},
		components:{
			headTop
		},
	}
</script>

<style scoped>
    .price-making-container{
		background-color:#fff;
		position: absolute;
        top: 0;
        z-index: 50;
        min-height:100vh;
        width:100%;
    }
	.priceMake{
		padding:0 .3rem;
		margin-top:0.88rem;
	}
	.priceMake .calculation{
		height:1.86rem;
		display: flex;
		display: -webkit-flex;
		display: -moz-flex;
		display: -o-flex;
		display: -ms-flex;
	}
	.calculation .desc{
		line-height: 1.86rem;
		font-size:.36rem;
		margin-right:.1rem;
	}
	.calculation .formula{
		line-height: 1.86rem;
		font-size:.28rem;
		color:#A8A8A8;
	}
	.priceMake .makePriceContainer{
		background-color: #F5F5F5;
        display: flex;
        display: -webkit-flex;
		display: -moz-flex;
		display: -o-flex;
		display: -ms-flex;
        height:.9rem;
	}
	span.decrease,span.increase{
        flex:1;
        -webkit-flex:1;
        -moz-flex:1;
        -o-flex:1;
        -ms-flex:1;
        text-align: center;
	}
	span.decrease{
		padding-top:.18rem;
	}
	span.increase{
		padding-top:.26rem;
	}
	span.price{
		width:5rem;
		line-height:.9rem;
        text-align: center;
        color:#000;
        font-size:.36rem; 
        font-weight: bold;
	}
	.priceMake .notice{
		height:.8rem;
		padding-top:.14rem;
		color:#ff6d39;
		font-size:.24rem;
		position: relative;
		padding-left:.35rem;
	}
	.priceMake .notice:before{
		content:'';
		width:.25rem;
		height:.25rem;
		background:url(../../../images/gantanhao.png) no-repeat;
		background-size:100%;
		position:absolute;
		left:-.04rem;
		top:0.16rem;
	}
	.explaination{
		padding-bottom:7rem;
	}
	.explaination p{
		height:.4rem;
		font-size:.26rem;
		color:#A0A0A0;
	}
	.marginTop{
		margin-top:.44rem;
	}
</style>