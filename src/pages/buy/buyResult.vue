<template>
	<div class="infomationBox">
		<head-top :headTitle="pageMsg.type==1 ? '买金成功' : '挂单买入'" class="head-top">
			<img slot='head_goback' src='../../images/back.png' class="head_goback" @click="goBack">
		</head-top>
		<!--买入成功失败标志--><!--2挂单 1买入-->
		<div class="buySuccess" v-show="pageMsg.type==1">
			<div class="symbol">
				<div class="imageLogo"></div>
				<p class="desc">黄金买入成功</p>
			</div>
			<div class="buiedInfomation">
				<p><span class="infoLeft">成交金价</span><span class="infoRight">{{pageMsg.price | formatPrice}}元</span></p>
				<p><span class="infoLeft">成交克重</span><span class="infoRight">{{pageMsg.weight | formatWeight}}克</span></p>
                <p><span class="infoLeft">支付金额</span><span class="infoRight">{{pageMsg.amount | formatPrice}}元</span></p>
                <p><span class="infoLeft">计息日</span><span class="infoRight">{{pageMsg.incomeDate | formatIncome}}</span></p>
				<p v-show="pageMsg.couponsPayAmount"><span class="infoLeft">优惠券</span><span class="infoRight">-{{pageMsg.couponsPayAmount}}元</span></p>
				<p><span class="infoLeft">成交时间</span><span class="infoRight">{{pageMsg.createTime | formatTime}}</span></p>
			</div>
			<a class="goldAssets" id="click_btn" @click="$router.push('/myGold')">查看黄金资产</a>
		</div>
        <!--挂单成功-->
        <div class="buySuccess" v-show="pageMsg.type==2">
			<div class="symbol">
				<div class="imageLogo guadan"></div>
				<p class="desc">挂单申请成功</p>
			</div>
			<div class="buiedInfomation">
				<p><span class="infoLeft">挂单金价</span><span class="infoRight">{{pageMsg.acceptMaxBuyPrice | formatPrice}}元/克</span></p>
                <!--挂单金额或挂单克重-->
                <p v-if="buyMethod"><span class="infoLeft">挂单金额</span><span class="infoRight">{{pageMsg.amount | formatPrice}}元</span></p>
                <p v-if="!buyMethod"><span class="infoLeft">挂单克重</span><span class="infoRight">{{pageMsg.weight | formatWeight}}克</span></p>
                <p><span class="infoLeft">有效期限</span><span class="infoRight">{{pageMsg.term ? '当天有效' : '永久有效'}}</span></p>
				<p><span class="infoLeft">挂单时间</span><span class="infoRight">{{pageMsg.createTime}}</span></p>
			</div>
            <a class="goldAssets" id="click_btn" @click="$router.replace('/myPutUp')">我的挂单</a>
		</div>
        <!--遮罩区域-->
        <div class="mask" v-show="receive"></div>
        <!--买金成功获得金卡-->
        <div class="receiveCard" v-show="receive">
            <p class="suprise">恭喜,获得"{{cardName}}"金卡</p>
            <p class="desc">集西游人物,领黄金大礼</p>
            <img :src="src">
            <p class="moreCards" @click="$router.push('/receiveCard')">查看我的卡片</p>
            <div class="closeCard" @click="receive=false"></div>
        </div>
        <!-- <div class="buyError"  style="display:none;">
            <div class="symbol">
                <div class="imageLogo"></div>
                <p class="desc">黄金买入失败</p>
            </div>
            <div class="errorExplain">交易失败,尚未生成订单</div>
        </div> -->
	</div>
</template>
<script>
	import headTop from '@/components/header/head.vue';
    import tang from '@/images/tang.png'
	export default {
		data(){
			return {
                cardName:'唐僧',
                src:tang,
                receive:false,
                pageMsg:{},
                regularProduct:{},
                buyMethod:true //购买方式(按金额)
			}
		},
        created(){
            this.pageMsg=this.$route.query.msg;
            if(this.$route.query.buyInMethod){
                this.buyMethod=true //按金额
            }else{
                this.buyMethod=false //按克重
            }
        },
		mounted() {
            //发送请求,若返回有金卡的结果，则：
			// this.receive=true;
		},
        filters:{
            formatIncome(val){
                if(!val) return '--';
                return val.split(' ')[0]
            },
            formatTime(value){   //过滤后台给的时间格式去掉秒
              if(!value) return '--';
              var arr=value.split(':');
              arr.pop()
              var newTime=arr.join(':');
              return newTime;
            },
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
            goBack(){
                window.toApp();
                this.$router.push('/buyGold')
            }
		},
		components:{
            headTop,
		}
	}
</script>

<style scoped>
    .infomationBox{
    	padding-top:0.88rem;
    	padding-left:0.3rem;
    	padding-right:0.26rem;
        background-color:#fff;
        height: 95vh;
    }
    .buySuccess .symbol,.buyError .symbol{
    	height:3.3rem;
    	padding-top:.76rem;
    }
    .buySuccess .symbol .imageLogo{
    	width:1.06rem;
    	height:1.08rem;
    	background:url(../../images/buySuccess.png) no-repeat;
    	margin:0 auto;
    	background-size: 100%;
    }
    .buySuccess .symbol .imageLogo.guadan{
        background:url(../../images/guadanlogo.png) no-repeat;
        background-size: 100% 100%;
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
    .buySuccess .symbol .desc,.buyError .symbol .desc{
    	margin-top:0.4rem;
    	text-align: center;
    	font-size:0.34rem;
    	margin-bottom: 0;
        font-weight: bold;
    }
    .buiedInfomation p{
    	height:0.7rem;
    }
    .buiedInfomation .infoLeft{
    	float:left;
        font-size:.28rem;
        color:#666666;
    }
    .buiedInfomation .infoRight{
    	float:right;
        font-size:.24rem;
        color:#333333;
    }
    .goldAssets{
        width:6.9rem;
    	height:0.88rem;
    	background-color: #F2B643;
    	line-height: 0.88rem;
    	text-align: center;
    	color:#fff;
    	font-size: 0.34rem;
        border-radius: 2px;
        margin-top:.37rem;
        position: fixed;
        bottom:0.3rem;
    }
    /*获取金卡*/
    .infomationBox .mask{
        position: fixed;
        width:100%;
        height:100%;
        top:0;
        left:0;
        z-index: 101;
        background-color: rgba(0,0,0,.5);
    }
    .infomationBox .receiveCard{
        position: fixed;
        top:2.3rem;
        left:50%;
        margin-left:-3rem;
        width:6rem;
        height:8rem;
        z-index: 102;
        background-color: #fff;
        border-radius: 10px;
        text-align: center;
        padding-top:.78rem;
    }
    .infomationBox .receiveCard .suprise{
        font-size:.36rem;
        font-weight:bold;
    }
    .infomationBox .receiveCard .desc{
        font-size:.28rem;
        color:#979797;
        height:.86rem;
    }
    .infomationBox .receiveCard .moreCards{
        color:#EDA835;
        font-size:.34rem;
        padding-bottom:.05rem;
        text-decoration: underline;
    }
    .infomationBox .receiveCard img{
        width:4.19rem;
        height:4.53rem;
    }
    .infomationBox .receiveCard .closeCard{
        width:22px;
        height:22px;
        border-radius: 50%;
        -webkit-border-radius: 50%;
        -moz-border-radius: 50%;
        -o-border-radius: 50%;
        background:url(../../images/cardClose.png);
        background-size: 100%;
        position: absolute;
        top:-.84rem;
        right:.75rem;
    }
    .infomationBox .receiveCard .closeCard:before{
        content:'';
        width:.02rem;
        height:.4rem;
        background-color: #fff;
        position: absolute;
        bottom:-.4rem;
        left:50%;
        margin-left:-.01rem;
    }
</style>