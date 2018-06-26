<template>
	<div class="buyInvestement">
        <head-top headTitle='定投列表' class="head-top">
            <img slot='head_goback' src='../../images/back.png' class="head_goback" @click="goback()">
            <span slot="custom" class="custom" @click="goToMyInvestment">我的定投</span>
        </head-top>
        <!--定投列表-->
        <div class="investmentList">
            <section class="investItem" v-for="item in productLists" @click="goTo_set(item.id)">
                <img :src="item.thumbPath">
                <div class="investTitle">{{item.name}}</div>
                <div class="investDesc">{{item.description}}</div>
                <span class="buyAlready" v-if="item.isJoin==1">已加入</span>
            </section>
        </div>
    </div>
</template>
<script>
	import headTop from '../../components/header/head.vue';
    import { queryRegularProduct,queryRegularProductHasLogin } from '@/service/getData';
    import { mapState, mapMutations } from 'vuex'
	export default {
		data(){
			return {
                productLists:[]
			}
		},
    created(){
        this.token ? this.queryRegularProductHasLogin() : this.queryRegularProduct();
    },
		mounted() {
		},
		computed:{
        ...mapState([
            'token'
        ])
		},
		methods:{
            ...mapMutations([
                'RECORD_REGULARPRODUCTPARAMS','RECORD_REGULARPRODUCTS'
            ]),
           //查询定投产品(已登入)
            async queryRegularProductHasLogin(){
                var userId=this.token.split("_")[0]
                var res=await queryRegularProductHasLogin(userId);
                if(res.code==100){
                   this.productLists=res.content;
                   this.RECORD_REGULARPRODUCTS(this.productLists);
                }
           },
           //查询定投产品(未登入)
           async queryRegularProduct(){
                var res=await queryRegularProduct();
                if(res.code==100){
                   this.productLists=res.content;
                   this.RECORD_REGULARPRODUCTS(this.productLists);
               }
            },
            //跳转设置定投的开始页
            goTo_set(id){
                this.$router.push({
                    path:'/investmentDetail',
                    query:{
                        'productId':id
                    }
                })
            },
            //去我的定投页
		    goToMyInvestment(){
                this.$router.push({
                    path:'/investmentOrder'//带上对应的参数
                })
            },
            //返回
            goback(){
                window.toApp()
                this.$router.push({
                    path: '/buyGold'
                })
            }      
		},
		components:{
			headTop
		},
    
	}
</script>

<style scoped>
    .buyInvestement{
      padding-top:.88rem;
    }
    .investmentList{
    	padding-top:0.28rem;
    	padding-left:0.3rem;
    	padding-right:0.3rem;
      background-color: #fff;
    }
    .investItem{
    	position: relative;
      margin-bottom:.34rem;
    }
    .investmentList .investItem img{
      width:6.9rem;
      height:2.3rem;
      display: block;
    }
    .investItem .investTitle{
    	font-size:0.32rem;
    	height:0.48rem;
    	margin-top:0.28rem;
    	color:#333333;
      font-weight: bold;
    }
    .investItem .investDesc{
    	font-size:0.27rem;
    	color:#A7A7A7;
    }
    .investItem .buyAlready{
    	width:1.18rem;
    	height:0.44rem;
    	background:url("../../images/already.png") no-repeat;
    	background-size: 100%;
		  position: absolute; 
		  top:-0.08rem;
		  left:0rem;
		  font-size:0.24rem; 
		  color:#fff;
		  text-align: center;
		  line-height: 0.44rem;
    }
</style>