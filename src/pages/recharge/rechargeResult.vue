<template>
	<div class="infomationBox">
		<head-top headTitle='充值结果' class="head-top">
			<img slot='head_goback' src='../../images/back.png' class="head_goback" @click="$router.push('/buyGold')">
		</head-top>
		<!--成功失败标志-->
		<div class="buySuccess">
			<div class="symbol">
				<div class="imageLogo"><img :src="resultImg"></div>
				<p class="desc">{{result}}</p>
			</div>
			<div class="buiedInfomation">
				<p><span class="infoLeft">充值金额</span><span class="infoRight">{{pageMsg.amount}}元</span></p>
				<p><span class="infoLeft">支付方式</span><span class="infoRight">银行卡</span></p>
				<p><span class="infoLeft">充值时间</span><span class="infoRight">{{pageMsg.createTime}}</span></p>
			</div>
			<my-button class="goldAssets"  @click.native="$router.push('/buy')" buttonText="马上去买金"></my-button>
		</div>
	</div>
</template>
<script>
	import headTop from '@/components/header/head.vue';
	import myButton from '@/components/myButton/myButton.vue';
    import suc from '@/images/buySuccess.png';
    import err from '@/images/buyError.png';
	export default {
		data(){
			return {
                receive:false,
				pageMsg:{},
                results:null,
              	resultImg:'',
			}
		},
        created(){
            this.pageMsg=this.$route.query.msg;
        },
		mounted() {
            //发送请求,若返回有金卡的结果，则：
			this.receive=true;
            this.img()
		},
		computed:{
			result: function(){
                if(this.pageMsg.status==1){
                    return "充值成功"
                }else if(this.pageMsg.status==0){
                    return "充值失败"
                }else{
                    return this.pageMsg.remark.split(':')[1]
                }
            }
		},
		methods:{
			img(){
                if(this.pageMsg.status==1){
                    this.resultImg=suc
                }else if(this.pageMsg.status==0){
                    this.resultImg=err
                }else{
                    this.resultImg=err
                }
            }
		},
		components:{
			headTop,
			myButton
		}
	}
</script>

<style scoped>
    .infomationBox{
    	padding-top:0.88rem;
    	padding-left:0.3rem;
    	padding-right:0.26rem;
        background-color:#fff;
    }
    .buySuccess .symbol,.buyError .symbol{
    	height:3.3rem;
    	padding-top:.76rem;
    }
    .buySuccess .symbol .imageLogo{
        text-align: center;
    	height:1.08rem;
    }
    .buySuccess .symbol .imageLogo img{
        display: inline-block;
        width: 1.06rem;
    }
    .buySuccess .symbol .desc,.buyError .symbol .desc{
    	margin-top:0.4rem;
    	text-align: center;
    	font-size:0.36rem;
    	margin-bottom: 0;
        font-weight: bold;
    }
    .buiedInfomation p{
    	height:0.7rem;
        font-size:0.3rem;
        color:#6C6C6C;
    }
    .buiedInfomation .infoLeft{
    	float:left;
    }
    .buiedInfomation .infoRight{
    	float:right;
    }
    .goldAssets{
    	height:0.88rem;
    	background-color: #F2B643;
    	line-height: 0.88rem;
    	text-align: center;
    	color:#fff;
    	font-size: 0.34rem;
		-webkit-border-radius: 2px;
		-o-border-radius: 2px;
		-moz-border-radius: 2px;
        border-radius: 2px;
		position: fixed;
		width:92%;
		bottom:.3rem;
    }
</style>