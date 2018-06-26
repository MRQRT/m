<template>
	<div class="extractGoldList">
		<head-top headTitle='全部商品' class="head-top">
			<img slot='head_goback' src='../../images/back.png' class="head_goback" @click="goBack">
			<span slot="custom" class="custom"  @click="goToMyOrder">我的提金</span>
		</head-top>
		<!--提金列表-->
		<section class="product-list">
				<ul>
					<router-link :to="{'path':'/productDetail',query:{
					  'id':item.id
					}}" v-for="item in goods" tag="li" :key='item.id' :style="{backgroundImage: 'url(' + item.imageUrl + ')'}">
					    <span>{{item.name}}</span>
					</router-link>
				</ul>
		</section>
	</div>
</template>

<script>
	import headTop from '../../components/header/head.vue';
	import {queryGoods} from '@/service/getData'
	export default {
		data(){
			return {
				goods:[]  //商品列表
			}
		},
		created(){
			this.queryGoodList();
		},
		mounted() {
			
		},
		computed:{
			
		},
		methods:{
			//点击返回
			goBack(){
				window.toApp();
				this.$router.push('/buyGold');
			},
			goToMyOrder(){
				this.$router.push({
					path:'/myExtractOrder',
				})
			},
			//获取产品列表
			async queryGoodList(){
				var res=await queryGoods();
				if(res.code==100){
				this.goods=res.content;
			  }
			}
		},
		components:{
			headTop
		}
	}
</script>

<style scoped>
    .extractGoldList .product-list{
    	margin-top:.88rem;
    }
    .extractGoldList .product-list ul{
    	list-style: none;
    }
    .extractGoldList .product-list li{
    	width:50%;
    	height:3.74rem;
    	float:left;
    	text-align: center;
    	padding-top:3.05rem;
    	background-size: 100%;
    }
    .extractGoldList .product-list li span{
    	font-size: .28rem;
    	color:#333333;
    }
    .product-list ul li:nth-child(odd){
    	border-bottom:1px solid #EEEEEE;
    	border-right:1px solid #EEEEEE;
    }
    .product-list ul li:nth-child(even){
    	border-bottom:1px solid #EEEEEE;
    }
</style>