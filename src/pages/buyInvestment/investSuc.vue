<template>
	<div class="infomationBox">
		<head-top headTitle='设置成功' class="head-top">
			<img slot='head_goback' src='../../images/back.png' class="head_goback" @click="switchRoute">
		</head-top>
		<!--成功失败标志-->
		<div class="investSuccess">
			<div class="symbol">
				<div class="imageLogo"></div>
				<p class="desc">定投设置成功</p>
			</div>
			<div class="buiedInfomation">
				<p v-if="weightOrAmount"><span class="infoLeft">定投总克重</span><span class="infoRight">{{pageMsg.budgetWeight}}克</span></p>
                <p v-else><span class="infoLeft">定投总额</span><span class="infoRight">{{pageMsg.budgetAmount}}元</span></p>
				<p><span class="infoLeft">定投期限</span><span class="infoRight">{{monthLength}}个月</span></p>
				<p v-if="weightOrAmount"><span class="infoLeft">每期定投</span><span class="infoRight">{{pageMsg.regularAmount | regularAmount_3 }}克</span></p>
                <p v-else><span class="infoLeft">每期定投</span><span class="infoRight">{{pageMsg.regularAmount | regularAmount_3 }}元</span></p>
                <p v-if="weekOrMonth"><span class="infoLeft">定投日</span><span class="infoRight">每周{{weeken}}</span></p>
				<p v-else><span class="infoLeft">定投日</span><span class="infoRight">每月{{pageMsg.regularDay}}日</span></p>
				<p><span class="infoLeft">设置时间</span><span class="infoRight">{{pageMsg.createTime}}</span></p>
			</div>
			<div class="goldAssets" @click="goToInvestOrder">查看我的定投</div>
			<!-- <div class="liking">
				<div class="likingTile">
					<span class="likeLeft">猜你喜欢</span>
					<span class="likeRight"><img src="../../images/right_jian.png"></span>
				</div>
				<div class="likingPicture">
					<img src="../../images/liking.png">
				</div>
				<div class="likingName">
					<p class="likingNameP1">结婚脱单基金</p>
					<p class="likingNameP2">黄金定投 为最爱的人存最真的金</p>
				</div>
			</div> -->
		</div>
        <div class="buyError"  style="display:none;">
            <div class="symbol">
                <div class="imageLogo"></div>
                <p class="desc">定投设置失败</p>
            </div>
            <div class="errorExplain">交易失败,尚未生成订单</div>
        </div>

        <!--定投设置完成后判断余额可支付下次投入与否-->
        <!--遮罩-->
        <section class="cash-noenough-mask" v-show="moneyEnough"></section>
        <!--余额不足弹窗-->
        <section class="money-no-enough" v-show="moneyEnough">
            <h4>提示</h4>
            <p class="tip-p1">您的现金余额不够下次扣款金额,请先充值</p>
            <div class="tip-btns">
                <p class="tip-btns-cancel"><span  @click="moneyEnough=false">取消</span></p>
                <p><span @click="$router.push('/recharge')">充值</span></p>
            </div>
        </section>
	</div>
</template>
<script>
	import headTop from '../../components/header/head.vue';
    import { MessageBox } from 'mint-ui'
	export default {
		data(){
			return {
                moneyEnough: false,
                    pageMsg: {},
             weightOrAmount: '',
                weekOrMonth: '',//true表示按周的定投，false表示按月定投
                       week: ['一','二','三','四','五'],
                     weeken: '',
			}
		},
		mounted() {
			this.pageMsg=this.$route.query.result;
            if(this.$route.query.result.budgetAmount){
                this.weightOrAmount=false
            }else{
                this.weightOrAmount=true
            }
            if(this.$route.query.result.regularInterval==7){
                this.weekOrMonth=true
                for(var i=1;i<this.week.length+1;i++){
                    if(this.$route.query.result.regularDay==i){
                        this.weeken=this.week[i-1]
                    }
                }
            }else{
                this.weekOrMonth=false
            }
            /*如果返回值存在code并且等于10002，充值提示框出现*/
            if(this.pageMsg.hasOwnProperty('code') && this.pageMsg.code==10002){
                this.moneyEnough=true
            }
		},
		computed:{
			monthLength(){
                return (this.pageMsg.term)/30
            }
		},
        filters:{
            regularAmount_3:function(val){
                return Math.ceil(parseInt(val*1000))/1000
            }
        },
		methods:{
			switchRoute(){
                this.$router.push("/buyInvestment")
            },
            goToInvestOrder(){
                this.$router.push({
                    path:'/investmentOrder'
                })
            }
		},
		components:{
			headTop
		}
	}
</script>

<style scoped>
    .infomationBox{
    	padding-top:0.88rem;
    	padding-left:0.3rem;
    	padding-right:0.26rem;
        background-color: #fff;
    }
    .investSuccess .symbol,.buyError .symbol{
    	height:3.34rem;
    	padding-top:.76rem;
    }
    .investSuccess .symbol .imageLogo{
    	width:1.06rem;
    	height:1.08rem;
    	background:url(../../images/buySuccess.png) no-repeat;
    	margin:0 auto;
    	background-size: 100%;
    }
    .buyError .symbol .imageLogo{
        width:1.06rem;
        height:1.08rem;
        background:url(../../images/buyError.png) no-repeat;
        margin:0 auto;
        background-size: 100%;
    }
    .errorExplain{
        height:1rem;
        line-height: 1rem;
        text-align: center;
        color:#BBBBBB;
        font-size:.32rem;
        margin-top:.42rem;
    }
    .investSuccess .symbol .desc,.buyError .symbol .desc{
    	margin-top:0.4rem;
    	text-align: center;
    	font-size:0.34rem;
    	margin-bottom: 0;
        font-weight: bold;
    }
    .buiedInfomation{
    	height:3.72rem;
    }
    .buiedInfomation p{
    	height:0.7rem;
    	font-size:0.3rem;
    	color:#6C6C6C;
    	margin:0;
    }
    .buiedInfomation .infoLeft{
    	float:left;
    }
    .buiedInfomation .infoRight{
    	float:right;
    }
    .goldAssets{
    	height:0.92rem;
    	background-color: #F2B643;
    	line-height: 0.92rem;
    	text-align: center;
    	color:#fff;
    	font-size: 0.4rem;
        border-radius:4px;
        -webkit-border-radius:4px;
        -moz-border-radius:4px;
        -o-border-radius:4px;
    }
    .liking{
    	padding-top:0.78rem;
    }
    .likingTile{
    	height:0.74rem;
    	font-size:0.32rem;
    	color:#000;
    }
    .likingTile .likeLeft{
    	float: left;
    	font-weight: bold;
    }
    .likingTile .likeRight{
    	float: right;
        color:#A1A1A1;
    }
    .likingTile .likeRight img{
        width:.13rem;
        height:.24rem;
    }
    .likingPicture img{
    	width:6.88rem;
    	height:2.3rem;
    	display: block;
    }
    .likingName{
    	margin:0;
    	height:1.42rem;
    	padding-top:0.3rem;
    }
    .likingNameP1{
    	height:0.48rem;
    	font-size:0.3rem;
    	color:#505050;
    }
    .likingName p{
    	margin:0;
    }
    .likingNameP2{
    	height:0.63rem;
    	font-size:0.24rem;
    	color:#AFB1B3;
    }

        .cash-noenough-mask{
        width:100%;
        height:100%;
        background-color: rgba(0,0,0,0.5);
        position: fixed;
        top:0;
        left:0;
        z-index: 200;
    }
    .money-no-enough{
        width:4.9rem;
        background-color: #fff;
        border-radius: 10px;
        -webkit-border-radius: 10px;
        -moz-border-radius: 10px;
        -o-border-radius: 10px;
        position: fixed;
        top:4.9rem;
        left:50%;
        margin-left:-2.45rem;
        z-index: 210;
        padding-top:.38rem;
    }
    .money-no-enough h4{
        font-size:.36rem;
        text-align: center;
        height:.54rem;
    }
    .money-no-enough .tip-p1{
        font-size:.26rem;
        color:#414141;
        padding-left:.3rem;
        padding-right:.3rem;
   }
    .money-no-enough .tip-btns{
        margin-top:.24rem;
        border-top:1px solid #F0F0F0;
        height:.9rem;
        display: flex;
        display: -webkit-flex;
        display: -moz-flex;
        display: -o-flex;
    }
    .money-no-enough .tip-btns p{
        flex:1;
        -webkit-flex:1;
        -moz-flex:1;
        -o-flex:1;
        text-align: center;
        line-height: .9rem;
        font-size:.32rem;
        color:#EDA835;
    }
    .tip-btns .tip-btns-cancel{
        border-right:1px solid #F0F0F0;
    }
</style>