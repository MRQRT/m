<template>
	<div class="price-making-container">
		<head-top headTitle='价格设置' class="head-top">
			<img slot='head_goback' src='../../../images/back.png' class="head_goback" @click="$router.go(-1)">
		</head-top>
		<div class="priceMake">
		<!--计算公式部分-->
			<div class="calculation">
				<span class="desc">最低卖出价:</span>
				<span class="formula"><span>{{currentPrice}}(实时金价)</span>-<span  style="color:#eda835">{{depPart}}</span>元</span>
			</div>
			<!--价格设置部分-->
			<div class="makePriceContainer">
				<span class="decrease" @click="decrease(minSellPrice)"><img src="../../../images/minus.png" style="width:.48rem;height:.04rem;"></span>
				<span class="price">{{minSellPrice}}</span>
				<span class="increase" @click="increase(minSellPrice)"><img src="../../../images/plus.png" style="width:.5rem;"></span>
			</div>
			<!--警告部分-->
			<p class="notice" v-show="isShow">不得大于实时金价</p>
			<div class="explaination">
				<p>由于黄金价格实时波动,您可以设置最低卖出价格，在购买时：</p>
				<p>1.若行情大于{{minSellPrice}}元/克，则立即成交。</p>
				<p>2.若行情小于{{minSellPrice}}元/克，则立即失效。</p>
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
				isShow: false,
			}
		},
		mounted() {

		},
		computed:{
			...mapState([
                'currentPrice','depPart'
            ]),
            minSellPrice(){
            	return (+(this.currentPrice)-(+this.depPart)).toFixed(2)
            }
		},
		watch:{
			minSellPrice: function(val){
				return val<+this.currentPrice?this.isShow=false:this.isShow=true
			},
			/*实时金价*/
			currentPrice: function(val){
				return val
			}
		},
		methods:{
			...mapMutations([
                'RECORD_DEPPART'
            ]),
            //金价减设置
			decrease(val){
				if(this.depPart>=0){
					let de=(+this.depPart+0.1).toFixed(1)
					this.RECORD_DEPPART(de)
				}
			},
			//金价加设置
			increase(val){
				let count=(+val+0.1).toFixed(2)+'';
				if(this.depPart>0){
					let de=(+this.depPart-0.1).toFixed(1)
					this.RECORD_DEPPART(de)
				}
				if(+count>+this.currentPrice) {this.isShow=true;}
				else{this.isShow=false;}
			},
		},
		components:{
			headTop
		}
	}
</script>

<style scoped>
    *{
    	box-sizing: border-box;
    }
    .price-making-container{
    	height:12.95rem;
    	width: 100%;
		background-color:#fff;
		position: absolute;
		top: 0;
		z-index: 10;
    }
	.priceMake{
		padding:0 .3rem;
		margin-top:0.88rem;
	}
	.priceMake .calculation{
		height:1.9rem;
	}
	.calculation .desc{
		height:1.9rem;
		line-height: 1.9rem;
		display: inline-block;
		font-size:.33rem;
		width:1.9rem;
	}
	.calculation .formula{
		height:1.9rem;
		line-height: 1.9rem;
		display: inline-block;
		font-size:.24rem;
		color:#A8A8A8;
	}
	.priceMake .makePriceContainer{
		background-color: #F5F5F5;
        display: flex;
	    display: -webkit-flex;
	    display: -moz-flex;
	    display: -o-flex;
	}
	.makePriceContainer span{
		display:inline-block;
		height:.9rem;
	}
	span.decrease,
	 span.increase{
        width:.86rem;
        text-align: center;
	}
	span.decrease{
		padding-top:.15rem;
	}
	span.increase{
		padding-top:.17rem;
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
		height:.4rem;
		padding-top:.1rem;
		color:red;
		font-size:.2rem;
		position: relative;
		padding-left:.35rem;
		margin: 0;
	}
	.priceMake .notice:before{
		content:'';
		width:.25rem;
		height:.25rem;
		background:url(../../../images/gantanhao.png) no-repeat;
		background-size:100%;
		position:absolute;
		left:-.04rem;
		top:0.14rem;
	}
	.explaination{
		padding-bottom:6.5rem;
		padding-top: .2rem;
	}
	.explaination p{
		height:.5rem;
		line-height: .5rem;
		font-size:.25rem;
		color:#A0A0A0;
		padding:0;
		margin: 0;
	}
</style>
