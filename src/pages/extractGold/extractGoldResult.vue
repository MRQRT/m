<template>
	<div class="infomationBox">
		<head-top :headTitle='title' class="head-top">
			<img slot='head_goback' src='../../images/back.png' class="head_goback" @click="goBack">
		</head-top>
		<!--成功失败标志-->
		<div class="buySuccess">
			<div class="symbol">
				<div class="imageLogo"></div>
				<p class="desc">{{title}}</p>
			</div>
			<div class="buiedInfomation" v-if="orderObj">
				<p><span class="infoLeft">订单编号</span><span class="infoRight">{{orderObj.orderNo}}</span></p>
				<p><span class="infoLeft">产品名称</span><span class="infoRight">{{orderObj.productName}}</span></p>
				<p><span class="infoLeft">规格</span><span class="infoRight">{{orderObj.productWeight}}克</span></p>
				<p><span class="infoLeft">件数</span><span class="infoRight">{{orderObj.quantity}}件</span></p>
                <p><span class="infoLeft">总金额</span><span class="infoRight">{{orderObj.totalAmount}}元</span></p>
				<p  v-if="title=='兑换成功'" style="border-top:1px solid #EEEEEE;padding-top:.4rem;"><span class="infoLeft">兑换金价</span><span class="infoRight">{{orderObj.currentPrice | formatPrice}}元/克</span></p>
				<p  v-if="title=='兑换成功'"><span class="infoLeft">扣除总克重</span><span class="infoRight">{{orderObj.demandPayAmount | formatWeight}}克</span></p>
                <p  v-if="title=='兑换成功' && orderObj.additionalMoney"><span class="infoLeft">差价金额</span><span class="infoRight">{{orderObj.additionalMoney | formatPrice}}元</span></p>
                <p><span class="infoLeft">下单时间</span><span class="infoRight">{{orderObj.createTime}}</span></p>
			</div>
            <my-button class="goldAssets" @click.native="$router.push('/extractGoldList')" :buttonText="title=='兑换成功' ? '再次兑换' : '再买一个'"></my-button>
		</div>
	</div>
</template>
<script>
    import headTop from '../../components/header/head.vue';
    import myButton from '../../components/myButton/myButton.vue';
    import {queryPhysicalDetailByNo} from '@/service/getData'
	export default {
		data(){
			return {
                id:'',//订单编号
                orderObj:null, //订单详情
                title:'购买成功'  //兑换成功或是购买成功
			}
		},
		mounted() {
            var orderNo=this.$route.query.orderNo;
            if(this.$route.query.way=='weight'){
                this.title='兑换成功'
            }else{
                 this.title='购买成功'
            }
            this.id=orderNo;
            this.queryPhysicalDetail();
		},
		computed:{
			
		},
        filters: {
              formatWeight(val){
                if(!val) return '';
                return (val*1).toFixed(3)
              },
              formatPrice(val){
                if(!val) return '';
                return (val*1).toFixed(2)
              },
        },
		methods:{
            async queryPhysicalDetail(){
                var res=await queryPhysicalDetailByNo(this.id);
                if(res.code==100){
                    this.orderObj=res.content;
                }
            },
            goBack(){
                window.toApp()
                this.$router.push('/buyGold')
            }
		},
		components:{
            headTop,
            myButton
		}
	}
</script>

<style scoped lang="less">
@import '../../style/common.less';
    .infomationBox{
    	padding-top:0.88rem;
    	padding-left:0.3rem;
    	padding-right:0.26rem;
        background-color: #fff;
    }
    .buySuccess .symbol{
        padding-top:.8rem;
    	padding-bottom:.42rem;
    }
    .buySuccess .symbol .imageLogo{
    	width:1.06rem;
    	height:1.08rem;
    	background:url(../../images/buySuccess.png) no-repeat;
    	margin:0 auto;
    	background-size: 0.99rem 1rem;
    }
    .buySuccess .symbol .desc{
    	margin-top:0.4rem;
    	text-align: center;
    	font-size:0.34rem;
    	margin-bottom: 0;
        font-weight: bold;
    }
    .buiedInfomation p{
        padding-bottom:.3rem;
    }
    .buiedInfomation .infoLeft{
        font-size:.28rem;
        color:#666666;
        display: inline-block;
        width:33%;
    }
    .buiedInfomation .infoRight{
        font-size:.28rem;
        color:#333333;
        display: inline-block;
        width:67%;
        text-align: right;
        overflow: hidden;
        height:.32rem;
        line-height:.34rem;
    }
    .goldAssets{
        width:92%;
    	height:0.88rem;
    	background-color: #F2B643;
    	line-height: 0.88rem;
    	text-align: center;
    	color:#fff;
    	font-size: 0.34rem;
        .radius(2px);
        position: fixed;
        bottom:.3rem;
        left:.3rem;
    }
</style>