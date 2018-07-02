<template>
	<div class="my-investment-order">
		<head-top headTitle='定投订单' class="head-top" id="head_top" ref="topHead">
			<img slot='head_goback' src='../../images/back.png' class="head_goback" @click="goback()">
		</head-top>
		<!--主要内容区域-->
		<section class="order-area" ref="orderArea" v-infinite-scroll="loadMore" infinite-scroll-disabled="loading" infinite-scroll-distance="100">
            <div class="investPerOrder" v-for="(item, value, index) in regularList" @click="goToDetail(item.id)">
                <!--定投订单第一层内容-->
            	<div class="investment-order-top">
            		<h3>{{item.productName}}</h3>
                    <!-- 状态有0执行中、1已完成、2已终止 -->
                    <span>{{item.status==0?'执行中':((item.status==1)?'已完成':'已终止')}}</span>
            	</div>
            	<!--定投订单第二层内容-->
                <div class="investment-order-middle">
                    <div class="investment-order-middle-left">
                        <p class="p1 p1-sp1">{{item.status==1||item.status==2?'— —':item.regularAmount | regularAmount_3 }}</p>
                        <p class="p2 p2-sp1">下次存入<span>{{item.budgetAmount?'金额(元)':'克重(克)'}}</span></p>
                    </div>
                    <div class="investment-order-middle-middle">
                        <p class="p1">{{item.status==1||item.status==2?'— —':item.nextDate}}</p>
                        <p class="p2 p2-sp2">下次存入日期</p>
                    </div>
                    <div class="investment-order-middle-right">
                        <img src="../../images/right_jian.png">
                    </div>
                </div>
            	<!--定投订单第三层内容-->
            	<div class="investment-order-bottom">
            		<div class="progress">
            			<div class="orangeLine" :style="{width:item.progress+'%'}">
            				<span class="percent">{{item.progress}}%</span>
            			</div>
            		</div>
            	</div>
            </div>
		</section>
		<!--转定投按钮-->
		<section  v-if="!hasInvest" class="addNewInvest" @click="goToInvest"><img src="../../images/add3.png" style="width:.36rem;height:.36rem;margin-right:.2rem;position: relative;top:.05rem;">创建新计划</section>
        <!--没有订单时-->
        <div class="noInvestOrder" v-if="hasInvest">
            <img src="../../images/noExtract.png">
            <p>您还没有定投计划,试试定投计划吧!</p>
            <span @click="$router.push('/buyInvestment')">添加定投</span>
        </div>
    </div>
	</div>
</template>

<script>
	import headTop from '../../components/header/head.vue';
    import { queryPageRegular } from '@/service/getData.js';
    import { InfiniteScroll,Indicator } from 'mint-ui';
    import {mapState} from 'vuex'
	export default {
		data(){
			return {
				regularList: [],
                 pageParmas: {
                        pageNum: 1,
                        pageSize: 5,
                    },
                    loading: false,//false表示可以出触发无限加载，true不可以
                  hasInvest: null,//true表示没有订单，false表示有订单
			}
		},
		created(){
		},
		mounted() {
			var hgt=window.innerHeight;
			document.querySelector('.my-investment-order').style.height=hgt+'px';
		},
		computed:{
			...mapState([
                'token',
			]),
		},
        filters:{
            regularAmount_3:function(val){
                return (val=='— —')?'— —':Math.ceil(parseInt(val*1000))/1000
            }
        },
        watch:{
            token(){
                if(this.token){
                    this.loadMore()
                }
            }
        },
		methods:{
            //创建新计划
			goToInvest(){
				this.$router.push({
			 		path:'/buyInvestment'
			 	})
			},
            //进入详情页
			goToDetail(val){
				this.$router.push({
					path:'/investmentOrderDetail',
                    query:{
                        id:val
                    }
				})
			},
            //加载更多
            async loadMore(){
                if(!this.token) return
                this.loading = false;
                const res=await queryPageRegular(this.pageParmas.pageNum++,this.pageParmas.pageSize);
                //返回正确
                if(res.code==100){
                    //返回值的定投订单不为空
                    if(res.content.list){
                         this.hasInvest=false
                        if(res.content.list.length!=0){
                            this.regularList=this.regularList.concat(res.content.list)
                            if(this.regularList.length>=5){
                                this.$refs.orderArea.style.paddingBottom=1+"rem";
                            }
                        }else{
                            this.loading = true
                        }
                    //定投订单为空
                    }else{
                        this.hasInvest = true
                        this.loading = true
                    }
                }
            },
            //返回上一页
            goback(){
                window.toApp();
                this.$router.push('/mine');
            }
		},
		components:{
			headTop
		}
	}
</script>

<style scoped>
    .my-investment-order{
   	    width:100%;
   	    background-color: #F5F5F5;
   	    overflow-y: scroll;
    }
    .my-investment-order .order-area{
   	    background-color: #fff;
   	    margin-top:.88rem;
   	    padding-left:.3rem;
   	    padding-right:.3rem;
    }
    .my-investment-order .order-area .investPerOrder{
    	border-bottom:1px solid #F2F2F2;
        padding-top:.36rem;
        height: 2.72rem;
    }
    .investPerOrder .investment-order-top{
    	display: flex;
        display: -webkit-flex;
        display: -moz-flex;
        display: -o-flex;
    }
    .investPerOrder .investment-order-top h3{
    	font-size:.3rem;
    	flex:5;
        -webkit-flex:5;
        -moz-flex:5;
        -o-flex:5;
        font-weight: bold;
    }
    .investPerOrder .investment-order-top span{
    	font-size:.28rem;
    	color:#EFB24D;
    	flex:1;
        -webkit-flex:1;
        -moz-flex:1;
        -o-flex:1;
    	text-align: right;
    	line-height: .4rem;
    }
    .investPerOrder .investment-order-middle{
    	margin-top:.4rem;
    	display: flex;
        display: -webkit-flex;
        display: -moz-flex;
        display: -o-flex;
    }
    .investPerOrder .investment-order-middle .investment-order-middle-left{
    	flex:1;
        -webkit-flex:1;
        -moz-flex:1;
        -o-flex:1;
    }
    .investment-order-middle .p1{
    	font-size:.24rem;
    	height:.42rem;
    }
    .investment-order-middle-left .p1-sp1{
    	color:#FF8258;
    }
    .investment-order-middle .p2{
    	font-size:.26rem;
    	color:#AAAAAA;
    	height:.3rem;
    }
    .investPerOrder .investment-order-middle .investment-order-middle-middle{
        flex:1;
        -webkit-flex:1;
        -moz-flex:1;
        -o-flex:1;
        text-align: center;
    }
    .investPerOrder .investment-order-middle .investment-order-middle-right{
    	flex:1;
        -webkit-flex:1;
        -moz-flex:1;
        -o-flex:1;
    	text-align: right;
    	padding-top:.23rem;
    }
    .investment-order-middle .investment-order-middle-right img{
    	width:.13rem;
    	height:.24rem;
    }
    .investPerOrder .investment-order-bottom{
    	margin-top:.3rem;
        margin-bottom:.42rem;
    }
    .investment-order-bottom .progress{
    	width:97%;
    	height:.06rem;
    	background-color: #EAEAEA;
    	position: relative;
    }
    .investment-order-bottom .progress .orangeLine{
    	height:.06rem;
    	background-color: #EDA835;
    	position: absolute;
    }
    .progress .orangeLine .percent{
    	position: absolute;
    	font-size:.2rem;
        font-weight: bold;
    	color:#EDA835;
    	right:-.38rem;
    	top:.15rem;
    }
    .my-investment-order .addNewInvest{
    	position: fixed;
    	width:100%;
    	height:1rem;
    	background-color:#F2B643;
    	text-align: center;
    	line-height: 1rem;
    	color:#fff;
    	font-size:.38rem;
    	bottom:0;
    }
.noInvestOrder{
    text-align: center;
    padding-top: 2.24rem;
    background-color: #F5F5F5;
}
.noInvestOrder img{
    width: 3.11rem;
    height: 2.39rem;
}
.noInvestOrder p{
    padding-top: .5rem;
    font-size: .32rem;
    color: #666666;
}
.noInvestOrder span{
    display: inline-block;
    width: 2.22rem;
    height: .72rem;
    line-height: .72rem;
    background-color: #F2B643;
    text-align: center;
    font-size: .28rem;
    color: #fff;
    margin-top: .4rem;
    border-radius: 3px;
}
</style>
