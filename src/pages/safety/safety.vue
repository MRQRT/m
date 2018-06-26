<template>
	<div class="safety-container">
		<head-top headTitle='安全保障' class="head-top" ref="topHead">
			<img slot='head_goback' src='../../images/back.png' class="head_goback" @click="goBack">
		</head-top>
		<!--内容部分-->
		<div class="swiper-container safety-swiper">
			<div class="swiper-wrapper" ref="swiperWrapper">
				<div class="swiper-slide swiper-slide1">
					<div class="swiper-slide-content">
						<img src="../../images/pointLineToPlane.png" class="pointLine">
						<img src="../../images/nine.png" class="nine">
						<div class="rotate"></div>
					</div>
					<img src="../../images/upSlider.png" class="upPic">
				</div>

				<div class="swiper-slide swiper-slide2">
					<h4 class="bc">"三管一保"模式</h4>
					<div class="centerPart" ref="centerPart" :class="{'animate':animate1}"></div>
					<div class="deposit" ref="deposit" :class="{'animate':animate2}">
						<h4>资产托管</h4>
						<p>中信信托托管</p>
					</div>
					<div class="supervise" :class="{'animate':animate3}">
						<h4>资产监管</h4>
						<p>中信信托监管</p>
					</div>
					<div class="support" :class="{'animate':animate4}">
						<h4>保险支持</h4>
						<p>华海保险、平安保险保障账户及物流安全</p>
					</div>
					<div class="keeping" :class="{'animate':animate5}">
						<h4>银行保管</h4>
						<p>实物黄金由中国民生银行保管</p>
					</div>
					<img src="../../images/upSlider.png" class="upPic">
				</div>

				<div class="swiper-slide swiper-slide3">
					<h4 class="bc">资金资产安全无忧</h4>
					<div class="centerPie" :class="{'animate':animate13}"></div>
					<span class="recharge-safe" :class="{'animate':animate14}">支付安全</span>
					<span class="account-safe" :class="{'animate':animate15}">账户安全</span>
					<span class="delivery-safe" :class="{'animate':animate16}">物流安全</span>
					<img src="../../images/moneyIcon.png" class="moneyIcon" :class="{'animate':animate19}">
					<img src="../../images/bankIcon.png" class="bankIcon" :class="{'animate':animate19}">
					<img src="../../images/fastDeliveyIcon.png" class="fastIcon" :class="{'animate':animate19}">
					<p class="left-p" :class="{'animate':animate17}">银联、微信支付、支付宝、京东支付等保障支付安全</p>
					<p class="middle-p" :class="{'animate':animate20}">同卡进出,专款专用银行监督</p>
					<p class="right-p" :class="{'animate':animate18}">顺丰速递,黄金寄送由华海公司全程保险,无条件赔付</p>
					<img src="../../images/upSlider.png" class="upPic">
				</div>

				<div class="swiper-slide swiper-slide4">
					<h4 class="bc">隐私保障</h4>
					<p class="privacy">与阿里云建构多重防火墙保护系统,客户信息严格加密处理,保护客户隐私.</p>
					<div  class="privacyPic">
					  <img src="../../images/privaty.png" class="privatyPic" :class="{'animate':animate6}" style="position: relative;left:-0.68rem;">
					  <img src="../../images/cloud1.png" class="cloudOne" :class="{'animate':animate10}">
					  <img src="../../images/cloud2.png" class="cloudTwo" :class="{'animate':animate11}">
					</div>
					<img src="../../images/upSlider.png" class="upPic">
				</div>

				<div class="swiper-slide swiper-slide5">
					<h4 class="bc">法律支持与保障</h4>
					<p class="law">黄金管家与国内顶级汉坤律师事务所合作,保证平台业务的合法合规性.</p>
					<div  class="lawPic">
					  <img src="../../images/lawLogo.png" class="lawLogo" :class="{'animate':animate7}">
					</div>
					<div class="bottomPic">
					  <img src="../../images/goldLogo.png" class="goldLogo" :class="{'animate':animate8}">
					  <img src="../../images/office.png" class="officeLogo" :class="{'animate':animate9}">
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import headTop from '../../components/header/head.vue';
	export default {
		data(){
			return {
				animate1:false,
				animate2:false,
				animate3:false,
				animate4:false,
				animate5:false,
				animate6:false,
				animate7:false,
				animate8:false,
				animate9:false,
				animate10:false,
				animate11:false,
				animate12:false,
				animate13:false,
				animate14:false,
				animate15:false,
				animate16:false,
				animate17:false,
				animate18:false,
				animate19:false,
				animate20:false,
			}
		},
		created(){
			
		},
		mounted() {
			var hgt=window.innerHeight;
			var that=this;
			var topHgt=this.$refs.topHead.$el.offsetHeight;
			this.$refs.swiperWrapper.style.height=hgt-topHgt+'px'
			var mySwiper = new Swiper('.safety-swiper', {
				direction : 'vertical',
				onSlideChangeStart(swiper){
					if(swiper.activeIndex==0){
                        that.animate1=false;
                        that.animate2=false;
                        that.animate3=false;
                        that.animate4=false;
                        that.animate5=false;
                        that.animate6=false;
                        that.animate7=false;
                        that.animate8=false;
                        that.animate9=false;
                        that.animate10=false;
                        that.animate11=false;
                        that.animate12=false;
                        that.animate13=false;
                        that.animate14=false;
                        that.animate15=false;
                        that.animate16=false;
                        that.animate17=false;
                        that.animate18=false;
                        that.animate19=false;
                        that.animate20=false;
                    }
                    if(swiper.activeIndex==1){
                        that.animate1=true;
                        that.animate2=true;
                        that.animate3=true;
                        that.animate4=true;
                        that.animate5=true;
                        that.animate6=false;
                        that.animate7=false;
                        that.animate8=false;
                        that.animate9=false;
                        that.animate10=false;
                        that.animate11=false;
                        that.animate12=true;
                        that.animate13=false;
                        that.animate14=false;
                        that.animate15=false;
                        that.animate16=false;
                        that.animate17=false;
                        that.animate18=false;
                        that.animate19=false;
                        that.animate20=false;
                    }
                    if(swiper.activeIndex==2){
                        that.animate1=false;
                        that.animate2=false;
                        that.animate3=false;
                        that.animate4=false;
                        that.animate5=false;
                        that.animate6=false;
                        that.animate7=false;
                        that.animate8=false;
                        that.animate9=false;
                        that.animate10=false;
                        that.animate11=false;
                        that.animate12=false;
                        that.animate13=true;
                        that.animate14=true;
                        that.animate15=true;
                        that.animate16=true;
                        that.animate17=true;
                        that.animate18=true;
                        that.animate19=true;
                        that.animate20=true;
                    }
                    if(swiper.activeIndex==3){
                        that.animate1=false;
                        that.animate2=false;
                        that.animate3=false;
                        that.animate4=false;
                        that.animate5=false;
                        that.animate6=true;
                        that.animate7=false;
                        that.animate8=false;
                        that.animate9=false;
                        that.animate10=true;
                        that.animate11=true;
                        that.animate12=false;
                        that.animate13=false;
                        that.animate14=false;
                        that.animate15=false;
                        that.animate16=false;
                        that.animate17=false;
                        that.animate18=false;
                        that.animate19=false;
                        that.animate20=false;
                    }
                    if(swiper.activeIndex==4){
                        that.animate1=false;
                        that.animate2=false;
                        that.animate3=false;
                        that.animate4=false;
                        that.animate5=false;
                        that.animate6=false;
                        that.animate7=true;
                        that.animate8=true;
                        that.animate9=true;
                        that.animate10=false;
                        that.animate11=false;
                        that.animate12=false;
                        that.animate13=false;
                        that.animate14=false;
                        that.animate15=false;
                        that.animate16=false;
                        that.animate17=false;
                        that.animate18=false;
                        that.animate19=false;
                        that.animate20=false;
                    }
				}
            })
		},
		computed:{
			
		},
		methods:{
			goBack(){
                window.toApp()
                this.$router.go(-1)
            }
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
    .safety-container{
        padding-top:.88rem;
    }
    .safety-container .swiper-slide{
    	height:100%;
    	overflow:hidden;
        background-color: #fff;
    }
    .safety-container .swiper-slide-content{
    	width:100%;
    	height:100%;
    	background:url('../../images/nineGuarantees.png') no-repeat;
    	background-size: 100% 100%;
    	text-align: center;
    	position: relative;
    }
    .safety-container .swiper-slide1 .pointLine{
    	width:6.23rem;
    	height:7.84rem;
    	margin-top:2.95rem;
    }
    .safety-container .swiper-slide1 .nine{
    	width:4.87rem;
    	height:7.28rem;
    	position: absolute;
    	left:50%;
    	margin-left:-2.44rem;
    	top:2.9rem;
    }
    .safety-container .swiper-slide1 .rotate{
    	width:2.15rem;
    	height:2.13rem;
    	position: absolute;
    	left:50%;
    	margin-left:-1.07rem;
    	top:4.3rem;
    	background:url(../../images/rotatePart1.png);
    	background-size: 100% 100%;
    	animation: myRotate 3s linear infinite; 
    }
    .swiper-slide1 .rotate:after{
    	content:'';
    	width:.34rem;
    	height:1.32rem;
    	background:url(../../images/rotatePart2.png);
    	background-size: 100% 100%;
    	position: absolute;
    	right:-.4rem;
    	top:.68rem;
    }
    .swiper-slide2,.swiper-slide3,.swiper-slide4,.swiper-slide5{
    	padding-top:.56rem;
    	position: relative;
    }
    .swiper-slide2 h4,.swiper-slide3 h4,.swiper-slide4 h4,.swiper-slide5 h4{
    	text-align: center;
    	font-size:.4rem;
    	position: relative;
    }
    .swiper-slide2 h4.bc:before,.swiper-slide2 h4.bc:after,.swiper-slide3 h4.bc:before,.swiper-slide3 h4.bc:after,.swiper-slide4 h4.bc:before,.swiper-slide4 h4.bc:after,.swiper-slide5 h4.bc:before,.swiper-slide5 h4.bc:after{
    	content:'';
    	width:.81rem;
    	height:.03rem;
    	position: absolute;
    }
    .swiper-slide2 h4.bc:before,.swiper-slide3 h4.bc:before,.swiper-slide4 h4.bc:before,.swiper-slide5 h4.bc:before{
    	background:url(../../images/gradientLeft.png);
    	background-size: 100%;
    	top:0.3rem;
    	left:1.2rem;
    }
    .swiper-slide3 h4.bc:before{
    	left:1rem;
    }
    .swiper-slide2 h4.bc:after,.swiper-slide3 h4.bc:after,.swiper-slide4 h4.bc:after,.swiper-slide5 h4.bc:after{
    	background:url(../../images/gradientRight.png);
    	background-size: 100%;
    	top:0.3rem;
    	right:1.2rem;
    }
    .swiper-slide3 h4.bc:after{
    	right:1rem;
    }
    .swiper-slide3 .centerPie{
    	width:4.62rem;
    	height:3.06rem;
    	margin:0 auto;
    	margin-top:.6rem;
    	background:url(../../images/dunpai.png);
    	background-size: 100%;
    }
    .centerPie.animate{
    	animation: myLine  steps(32) 2s forwards;
    }
    .safety-container .swiper-slide3 .top-left{
		width:1.63rem;
		height:2.04rem;
		position: absolute;
		left:0rem;
		top:2rem;
    }
    .safety-container .swiper-slide3 .top-middle{
		width:0.01rem;
		height:1.2rem;
    }
    .safety-container .swiper-slide3 .top-right{
		width:1.63rem;
		height:2.04rem;
    }
    .swiper-slide3 .recharge-safe,.swiper-slide3 .account-safe,.swiper-slide3 .delivery-safe{
    	position: absolute;
    	width:.32rem;
    	font-size:.32rem;
    	top:5rem;
    	color:#000;
    }
    .swiper-slide3 .recharge-safe:after,.swiper-slide3 .account-safe:after,.swiper-slide3 .delivery-safe:after{
        content:"";
        width:.02rem;
        height:.4rem;
        position: absolute;
        left:0.16rem;
        bottom:-.62rem;
        background-color: #F0B655;
    }
    .swiper-slide3 .account-safe:after{
        height:1.7rem;
        bottom:-1.94rem;
    }
    .safety-container .swiper-slide3 .recharge-safe{
    	left:1.3rem;
    }
    .safety-container .swiper-slide3 .recharge-safe.animate{
    	animation: rubberBand 1s;
    }
    .safety-container .swiper-slide3 .account-safe{
    	left:3.56rem;
    }
    .safety-container .swiper-slide3 .account-safe.animate{
    	animation: rubberBand 1s;
    }
    .safety-container .swiper-slide3 .delivery-safe{
    	right:1.3rem;
    }
    .safety-container .swiper-slide3 .delivery-safe.animate{
    	animation: rubberBand 1s;
    }
    .safety-container .swiper-slide3 .moneyIcon,.safety-container .swiper-slide3 .fastIcon,.safety-container .swiper-slide3 .bankIcon{
    	width:.6rem;
		height:.6rem;
		position: absolute;
    }
    .safety-container .swiper-slide3 .moneyIcon{
		left:1.16rem;
		top:7.6rem;
    }
    .safety-container .swiper-slide3 .moneyIcon.animate,.safety-container .swiper-slide3 .fastIcon.animate,.safety-container .swiper-slide3 .bankIcon.animate{
    	animation: myOpacity 2s;
    }
    .safety-container .swiper-slide3 .bankIcon{
		left:3.44rem;
		top:8.92rem;
    }
    .safety-container .swiper-slide3 .fastIcon{
    	right:1.16rem;
		top:7.6rem;
    }
    .safety-container .swiper-slide3 .left-p,.safety-container .swiper-slide3 .middle-p,.safety-container .swiper-slide3 .right-p{
    	font-size:.26rem;
    	color:#A7A7A7;
    	position: absolute;
    }
    .safety-container .swiper-slide3 .left-p{
    	width:2.04rem;
    	left:.42rem;
    	top:8.5rem;
    }
    .safety-container .swiper-slide3 .left-p.animate{
    	animation: rotateInDownLeft 1s;
    }
    .safety-container .swiper-slide3 .right-p{
    	width:2.04rem;
    	right:.42rem;
    	top:8.5rem;
    }
    .safety-container .swiper-slide3 .right-p.animate{
    	animation:  rotateInUpRight 1s;
    }
    .safety-container .swiper-slide3 .middle-p{
    	width:2rem;
    	left:2.76rem;
    	top:9.8rem;
    }
     .safety-container .swiper-slide3 .middle-p.animate{
     	animation:  rubberBand 1s;
     }
    .swiper-slide2 .centerPart{
        width:4.16rem;
        height:3.6rem;
        margin:3rem 1.84rem 0rem 1.52rem;
    	background: url(../../images/sanGuanYiBao.png) center center;
    	background-size: 100% 100%;
    }
    .centerPart.animate{
    	animation: litterToBig 1s ease-in-out;
    	animation-fill-mode:forwards;
    }
    .swiper-slide2 .deposit,.swiper-slide2 .supervise,.swiper-slide2 .support,.swiper-slide2 .keeping{
    	border:1px solid #EFB34F;
    	border-radius: 50%;
    	position: absolute;
    	padding-top:.56rem;
    }
    .swiper-slide2 .deposit{
    	width:2.02rem;
    	height:2.02rem;
    	top:1.9rem;
    	left:1.08rem;
    }
    .deposit.animate{
    	animation: lightSpeedIn 1s  linear;
    }
    .swiper-slide2 .supervise{
    	width:2.1rem;
    	height:2.12rem;
    	top:2.85rem;
    	right:.47rem;
    }
    .supervise.animate{
    	animation: lightSpeedIn 1s linear ;
    	animation-fill-mode:forwards;
    }
    .swiper-slide2 .support{
    	width:2.72rem;
    	height:2.72rem;
    	top:8.3rem;
    	left:.5rem;
    }
    .support.animate{
    	animation: lightSpeedIn 1s linear ;
    	animation-fill-mode:forwards;
    }
    .swiper-slide2 .keeping{
    	width:2.4rem;
    	height:2.42rem;
    	top:7.62rem;
    	right:.96rem;
    }
    .swiper-slide2 .keeping.animate{
    	animation: lightSpeedIn 1s;
    }
    .deposit h4,.supervise h4,.support h4,.keeping h4{
    	font-size:.34rem;
    }
    .deposit p,.supervise p{
    	font-size:.24rem;
    	color:#A0A0A0;
        text-align: center;
    }
    .support p,.keeping p{
        font-size:.24rem;
        color:#A0A0A0;
    	padding-left:.46rem;
    	padding-right:.46rem;
    }
    .keeping p{
        padding-left:.3rem;
        padding-right:.3rem;
    }
    .swiper-slide4 .privacy,.swiper-slide5 .law{
    	margin-top:.6rem;
    	font-size:.3rem;
    	padding-left:.5rem;
    	padding-right:.48rem;
    	color:#6D6D6D;
    }
    .privacyPic,.lawPic{
    	text-align: center;
    	position: relative;
    }
    .privacyPic{
        padding-top:.8rem;
    }
    .lawPic{
        padding-top:1.4rem;
    }
    .privacyPic .privatyPic{
    	width:4.44rem;
    	height:8.83rem;
    }
    .privatyPic.animate{
    	animation:myPrivaty 2s linear; 
    	animation-fill-mode:forwards;
    }
    .privacyPic .cloudOne{
    	width:1.08rem;
    	height:.57rem;
		position: absolute;
		top:1.8rem;
	    left:-4rem;
    }
    .cloudOne.animate{
        animation: myCloudOne  15s linear infinite;
    }
    .privacyPic .cloudTwo{
    	width:.52rem;
    	height:.27rem;
		position: absolute;
		top:1rem;
		left:.68rem;
    }
    .cloudTwo.animate{
        animation: myCloudTwo 10s linear infinite;
    }
    .lawPic .lawLogo{
    	width:5.6rem;
		height:4.21rem;
    }
    .lawLogo.animate{
    	animation:mylawOffice 1.5s linear; 
    	animation-fill-mode:forwards;
    }
    .bottomPic{
    	padding-top:.8rem;
    	padding-left:1.3rem;
    }
    .bottomPic .goldLogo{
		width:1.04rem;
    	height:1.25rem;
    	margin-right:1.1rem;
    }
    .goldLogo.animate{
        animation: myGoldLogo  2s linear;
        animation-fill-mode:forwards;
    }
    .bottomPic .officeLogo{
		width:2.45rem;
    	height:1.22rem;
    }
    .officeLogo.animate{
        animation: myOfficeLogo  2s linear;
        animation-fill-mode:forwards;
    }
    .upPic{
        width:.24rem;
        height:.24rem;
        position: absolute;
        left:50%;
        margin-left:-.12rem;
        bottom:1.2rem;
        animation: myArrow 1s linear infinite alternate;
    }
    @keyframes myRotate{
    	from{transform:rotate(0deg);}
    	to{transform:rotate(360deg);}
    }
    @keyframes litterToBig{
    	from{
             width:0rem;
    	     height:0rem;
    	    }
    	to{  
             width:4.16rem;
    	     height:3.6rem;
    	     }
    }
    @keyframes depositH{
    	0%{
    		width:0;
    	}
    	100%{
    		width:100%;
    	}
    }
    @keyframes supervise{
    	0%{
    		transform: rotateX(0deg);
    	}
    	100%{
    		transform: rotateX(360deg);
    	}
    }
    @keyframes support{
    	0%{
    		transform: rotateY(0deg);
    	}
    	100%{
    		transform: rotateY(360deg);
    	}
    }
    @keyframes myCloudOne{
    	from{
			left:-4rem;
    	}
    	to{
			left:8rem;
    	}
    }
    @keyframes myCloudTwo{
    	from{
			left:-2rem;
    	}
    	to{
			left:8rem;
    	}
    }
    @keyframes mylawOffice{
    	from{
			  margin-top:-2rem;
			  width:0;
			  height:0;
    	}
    	to{
			 margin-top:0;
			 width:5.6rem;
			 height:4.21rem;
    	}
    }
    @keyframes myGoldLogo{
    	from{
			  opacity:0;
    	}
    	to{
			 opacity:1;
    	}
    }
    @keyframes myOfficeLogo{
    	from{
			  opacity:0;
    	}
    	to{
			 opacity:1;
    	}
    }
    @keyframes myPrivaty{
    	from{
			  transform:  rotate(0deg);
			  width:0rem;
    	      height:0rem;
    	}
    	to{
			 transform: rotate(360deg);
			 width:4.44rem;
    	     height:8.83rem;
    	}
    }
    @keyframes myLine{
    	0% {
            background-position-y: 0;
            opacity: 0;
        }
        100%{
           background-position-y: -3200%;
           opacity: 1;
        }
    }
    @keyframes bounce {
    	from, 20%, 53%, 80%, to {
    		animation-timing-function: cubic-bezier(0.215, 0.610, 0.355, 1.000);
    		transform: translate3d(0,0,0);
    	}

    	40%, 43% {
    		animation-timing-function: cubic-bezier(0.755, 0.050, 0.855, 0.060);
    		transform: translate3d(0, -30px, 0);
    	}

    	70% {
    		animation-timing-function: cubic-bezier(0.755, 0.050, 0.855, 0.060);
    		transform: translate3d(0, -15px, 0);
    	}

    	90% {
    		transform: translate3d(0,-4px,0);
    	}
    }
    @keyframes rubberBand {
    	from {
    		transform: scale3d(1, 1, 1);
    	}

    	30% {
    		transform: scale3d(1.25, 0.75, 1);
    	}

    	40% {
    		transform: scale3d(0.75, 1.25, 1);
    	}

    	50% {
    		transform: scale3d(1.15, 0.85, 1);
    	}

    	65% {
    		transform: scale3d(.95, 1.05, 1);
    	}

    	75% {
    		transform: scale3d(1.05, .95, 1);
    	}

    	to {
    		transform: scale3d(1, 1, 1);
    	}
    }
    @keyframes rotateInDownLeft {
    	from {
    		transform-origin: left bottom;
    		transform: rotate3d(0, 0, 1, -45deg);
    		opacity: 0;
    	}

    	to {
    		transform-origin: left bottom;
    		transform: none;
    		opacity: 1;
    	}
    }
    @keyframes rotateInUpRight {
    	from {
    		transform-origin: right bottom;
    		transform: rotate3d(0, 0, 1, -90deg);
    		opacity: 0;
    	}

    	to {
    		transform-origin: right bottom;
    		transform: none;
    		opacity: 1;
    	}
    }
    @keyframes myOpacity{
    	from{opacity:0;}
    	to{opacity:1;}
    }
    @keyframes rubberBand {
    	from {
    		transform: scale3d(1, 1, 1);
    	}

    	30% {
    		transform: scale3d(1.25, 0.75, 1);
    	}

    	40% {
    		transform: scale3d(0.75, 1.25, 1);
    	}

    	50% {
    		transform: scale3d(1.15, 0.85, 1);
    	}

    	65% {
    		transform: scale3d(.95, 1.05, 1);
    	}

    	75% {
    		transform: scale3d(1.05, .95, 1);
    	}

    	to {
    		transform: scale3d(1, 1, 1);
    	}
    }
    @keyframes lightSpeedIn {
    	from {
    		transform: translate3d(100%, 0, 0) skewX(-30deg);
    		opacity: 0;
    	}

    	60% {
    		transform: skewX(20deg);
    		opacity: 1;
    	}

    	80% {
    		transform: skewX(-5deg);
    		opacity: 1;
    	}

    	to {
    		transform: none;
    		opacity: 1;
    	}
    }
    @keyframes myArrow{
    	from{
    		opacity:1;
    		bottom:1.2rem;
    	}
    	to{
    		opacity:.4;
    		bottom:.6rem;
    	}
    }
    @keyframes myBounce {  
        0% {          
           transform:translateY(-100%);        
           opacity: 0; 
        } 
        5% {       
          transform:translateY(-100%);     
          opacity: 0;
        }
        15% {  
          transform:translateY(0);  
        }  
        30% {  
          transform:translateY(-70%);  
        } 
        40% {      
          transform:translateY(0%);    
        }
        50% {  
         transform:translateY(-50%);  
        } 
        70% {  
            transform:translateY(0%);  
        }  
        80% {  
            transform:translateY(-30%);  
        }  
        90% {  
            transform:translateY(0%);  
        } 
        92% {  
            transform:translateY(-25%);  
        }  
        94% {  
            transform:translateY(0%);  
        }
        95% {  
            transform:translateY(-20%);  
        }  
        96% {  
            transform:translateY(0%);  
        }  
        97% {  
            transform:translateY(-10%);  
        }
        98% {  
            transform:translateY(0%);  
        }
        99% {  
            transform:translateY(-1%);  
        }  
        100% {  
            transform:translateY(0);  
            opacity: 1;  
        }  
}
</style>