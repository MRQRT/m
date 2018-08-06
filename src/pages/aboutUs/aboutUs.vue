<template>
	<div class="aboutUs-container">
		<head-top headTitle='了解我们' class="head-top" ref="topHead">
			<img slot='head_goback' src='../../images/back.png' class="head_goback" @click="goBack">
		</head-top>
		<!--内容部分-->
		<div class="swiper-container about-us-swiper">
			<div class="swiper-wrapper" ref="swiperWrapper">
				<div class="swiper-slide swiper-slide1">
					<h4 class="bc">公司介绍</h4>
                    <div class="content">
                        <p class="content-p1">黄金管家成立于2015年，隶属北京盈吉通电子商务有限公司，总部位于北京，是拥有央企背景的互联网黄金基础设施服务商。</p>
                        <p class="content-p2" :class="{'animate1':animate1}">成立短短两年,就已获得中信信托(中信股票代码00267)、蓝驰创投、360金融旗下资本、远毅资本、众恒隆等机构数亿元注资。</p>
                        <p class="content-p3" :class="{'animate1':animate1}">黄金管家致力于以科技附能金融行业，成为最专业的互联网黄金全流程解决方案供应商。通过互联网黄金账户系统开发、互联网黄金交易平台代理运营、实物黄金基础设置解决方案，为所有需要上线互联网黄金业务的广大金融机构提供安全、稳定、可靠的精细化服务；通过互联网黄金市场推广服务、互联网黄金产品销售代理，帮助具备互联网黄金做市商资质的金融机构最大限度的占领市场。</p>
                    </div>
                    <!--左边线-->
                    <div class="leftLine" :class="{'animate2':animate2}">
                    </div>
                    <img src="../../images/upSlider.png" class="upPic">
				</div>

				<div class="swiper-slide swiper-slide2">
					<h4 class="bc">发展历程</h4>
                    <div class="content">
                        <div class="part1">
                            <p class="time">2015年6月18日</p>
                            <p class="event">黄金管家成立于北京</p>
                        </div>
                        <div class="part2" :class="{'animate3':animate3}">
                            <p class="time">2016年2月</p>
                            <p class="event">中信信托战略入资黄金管家</p>
                        </div>
                        <div class="part3" :class="{'animate3':animate3}">
                            <p class="time">2016年7月</p>
                            <p class="event">黄金管家成为京东线上黄金买卖积存业务供应商，并对京东黄金后台进行管理运营</p>
                        </div>
                        <div class="part4" :class="{'animate3':animate3}">
                            <p class="time">2016年12月</p>
                            <p class="event">黄金管家完成A轮融资，由知名基金蓝驰创投投资数千万人民币</p>
                        </div>
                        <div class="part5" :class="{'animate3':animate3}">
                            <p class="time">2017年8月</p>
                            <p class="event">黄金管家完成A+轮融资，由远毅资本领投、蓝驰创投跟投近亿元人民币</p>
                        </div>
                        <div class="part6" :class="{'animate3':animate3}">
                            <p class="time">2017年8月</p>
                            <p class="event">黄金管家与51信用卡达成业务合作</p>
                        </div>
                        <div class="part7" :class="{'animate3':animate3}">
                            <p class="time">2017年9月</p>
                            <p class="event">360战略投资黄金管家，注资数千万</p>
                        </div>
                        <div class="part8" :class="{'animate3':animate3}">
                            <p class="time">2018年5月</p>
                            <p class="event">黄金管家完成B+轮融资，由众恒隆实业投资数千万人民币</p>
                        </div>
                    </div>
                    <!--左边线-->
                    <div class="leftLine" :class="{'animate4':animate4}">
                    </div>
                    <img src="../../images/upSlider.png" class="upPic">
				</div>

				<div class="swiper-slide swiper-slide3">
					<h4 class="bc">核心团队</h4>
                    <div class="small-swiper-container">
                      <div class="swiper-wrapper small-swiper-wrapper">
                        <div class="swiper-slide">
                            <!--头像-->
                            <img src="../../images/person1.png" style="width:1.9rem;height:1.9rem;display: block;margin:0 auto;margin-top:.4rem;">
                            <p class="all-position">
                               <span class="name">孙吉光</span>
                               <span class="position">创始人兼CEO</span>
                            </p>
                            <p class="briefDesc">
                               国家注册黄金投资分析师。历任招金和信副总经理、多边金都金融投资事业部总经理、IDB《财富周刊》副主编。2007年，发起国内首支黄金私募基金；2010年，发起设计国内首支黄金生息产品，并积极推动“黄金积存”业务互联网化。
                            </p>
                        </div>
                        <div class="swiper-slide">
                           <!--头像-->
                            <img src="../../images/person2.png" style="width:1.5rem;height:1.5rem;display: block;margin:0 auto;margin-top:.2rem;">
                            <p class="all-position" style="margin-top:.1rem;">
                               <span class="name">张盈盈</span>
                               <span class="position">黄金管家 CRO</span>
                            </p>
                            <p class="briefDesc" style="margin-top:0;">
                               CFA（特许金融分析师）持证人，英国格拉斯大学国际金融学硕士，拥有上海黄金交易所交易员资格、期货从业资格和期货投资咨询资格。历任银河期货有限公司首席贵金属分析师、风控经理。2009年，荣获上海期货交易所优秀黄金分析师及《证券时报》全国最佳黄金期货分析师。在《中国外汇》、《中国黄金报》及《期货日报》等业内知名报刊杂志发表关于贵金属及外汇市场研究报告近百篇，长期担任CCTV、新华社及中央人民广播电台等业内主流媒体的特约嘉宾和评论员，曾参与编译《保守型投资者的期权交易策略》一书。
                            </p>
                        </div>
                        <div class="swiper-slide">
                            <!--头像-->
                            <img src="../../images/person4.png" style="width:1.5rem;height:1.5rem;display: block;margin:0 auto;margin-top:.4rem;">
                            <p class="all-position">
                               <span class="name">朱桐</span>
                               <span class="position">副总裁</span>
                            </p>
                            <p class="briefDesc">
                               国家注册黄金投资分析师，具备期货从业资格，上海黄金交易所交易员资格。曾任职瑞信 CreditSuisse IBD 部门，中钞国鼎首席分析师。2007年，发起国内首支黄金信托产品；2013年，创新实践国内首个黄金券业务，是国内首个黄金O2O全业务交易服务设计者。曾受上海黄金交易所邀请，撰写《黄金投资必读》。担任多家商业银行黄金金融顾问，CCTV财经频道特约评论员。
                            </p>
                        </div>
                      </div>
                      <div class="swiper-pagination"></div>
                    </div>
			   </div>
			</div>
		</div>
	</div>
</template>
<script type="text/javascript" src="@/plugins/swiper.min.js"></script>
<script>
	import headTop from '../../components/header/head.vue';
    import { getRem } from '@/config/mUtils'
    import '@/style/swiper.min.css'
	export default {
		data(){
			return {
                animate1:true,
                animate2:true,
                animate3:false,
                animate4:false,
			}
		},
		created(){

		},
		mounted() {
			var hgt=window.innerHeight;//window的窗口高度
			var that=this;
			var topHgt=this.$refs.topHead.$el.offsetHeight;
			this.$refs.swiperWrapper.style.height=hgt-topHgt+'px';
			var mySwiper = new Swiper('.about-us-swiper', {
				direction : 'vertical',
                onSlideChangeStart(swiper){ 
                    if(swiper.activeIndex==0){
                        that.animate1=true;
                        that.animate2=true;
                        that.animate3=false;
                        that.animate4=false;
                    }
                    if(swiper.activeIndex==1){
                        that.animate1=false;
                        that.animate2=false;
                        that.animate3=true;
                        that.animate4=true;
                    }
                    if(swiper.activeIndex==2){
                        that.animate1=false;
                        that.animate2=false;
                        that.animate3=false;
                        that.animate4=false;
                    }
                }
            });
            var mySwiper = new Swiper('.small-swiper-container', {
                direction : 'horizontal',
                pagination : '.swiper-pagination',
                slidesPerView: 1.24,
                centeredSlides:true,
                spaceBetween: 0.3*getRem()
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
    .aboutUs-container{
        padding-top:.88rem;
    }
    .aboutUs-container .swiper-slide{
    	height:100%;
    	overflow:hidden;
        background-color: #fff;
    }
    .aboutUs-container .swiper-slide1,.aboutUs-container .swiper-slide2,.aboutUs-container .swiper-slide3{
        padding-top:.1rem;
        position: relative;
    }
    .aboutUs-container .swiper-slide1 h4.bc,.aboutUs-container .swiper-slide2 h4.bc,.aboutUs-container .swiper-slide3 h4.bc{
        font-size:.34rem;
        height:.62rem;
        text-align: center;
        position: relative;
        font-weight: bold;
    }
   .swiper-slide1 h4.bc:before,.swiper-slide1 h4.bc:after, .swiper-slide2 h4.bc:before,.swiper-slide2 h4.bc:after,.swiper-slide3 h4.bc:before,.swiper-slide3 h4.bc:after{
        content:'';
        width:.81rem;
        height:.03rem;
        position: absolute;
    }
   .swiper-slide1 h4.bc:before,.swiper-slide2 h4.bc:before,.swiper-slide3 h4.bc:before{
        background:url(../../images/gradientLeft.png);
        background-size: 100%;
        top:0.3rem;
        left:1.3rem;
    }
    .swiper-slide1 h4.bc:after,.swiper-slide2 h4.bc:after,.swiper-slide3 h4.bc:after{
        background:url(../../images/gradientRight.png);
        background-size: 100%;
        top:0.3rem;
        right:1.3rem;
    }
    .swiper-slide3 .all-position{
        margin-top:.4rem;
        font-size:.3rem;
        text-align: center;
    }
    .swiper-slide3 .all-position .name{
        color:#EDA835;
        padding-right:.2rem;
        border-right:1px solid #E5E5E5;
    }
    .swiper-slide3 .all-position .position{
        color:#333333;
        padding-left:.2rem;
    }
    .swiper-slide3 .briefDesc{
        margin-top:.48rem;
        font-size:.26rem;
        color:#666666;
        line-height:.44rem;
    }
    .aboutUs-container .swiper-slide1 .content,.aboutUs-container .swiper-slide2 .content{
        padding-left:.92rem;
        padding-right:.48rem;
        font-size:.28rem;
    }
    .aboutUs-container .swiper-slide1 .content{
        color:#666666;
        line-height:.46rem;
    }
    .swiper-slide1 .content-p1,.swiper-slide1 .content-p2,.swiper-slide1 .content-p3{
        position: relative;
    }
    .swiper-slide1 .content-p2,.swiper-slide1 .content-p3{
        opacity: 1;
        margin-top:.4rem;
    }
    .swiper-slide1 .content-p2.animate1,.swiper-slide1 .content-p3.animate1{
        animation: myText 1s linear;
        animation-fill-mode:forwards;
    }
    .swiper-slide1 .content-p1:before{
        content:'';
        width:7px;
        height:7px;
        background-color: #F2B643;
        border-radius: 50%;
        position: absolute;
        top:0.14rem;
        left:-.38rem;
    }
    .swiper-slide1 .content-p2:before{
        content:'';
        width:7px;
        height:7px;
        background-color: #F2B643;
        border-radius: 50%;
        position: absolute;
        top:0.14rem;
        left:-.38rem;
    }
    .swiper-slide1 .content-p3:before{
        content:'';
        width:7px;
        height:7px;
        background-color: #F2B643;
        border-radius: 50%;
        position: absolute;
        top:0.14rem;
        left:-.38rem;
    }
    .swiper-slide1 .leftLine{
        height:7.8rem;
        width:.02rem;
        background-color: #F2B643;
        position: absolute;
        top:1rem;
        left:.6rem;
    }
    .leftLine.animate2{
        animation: myLine 1s linear;
        animation-fill-mode:forwards;
    }
    .time{
        color:#eda835;
        font-size:.24rem;
        height:.24rem;
        margin-bottom:.1rem;
    }
    .event{
        font-size:.28rem;
        color:#333333;
    }
    .swiper-slide2 .leftLine{
        height:10.12rem;
        width:.02rem;
        background-color: #F2B643;
        position: absolute;
        top:.85rem;
        left:.6rem;
    }
    .swiper-slide2 .leftLine.animate4{
        animation: mySliderLine 1s linear;
        animation-fill-mode:forwards;
    }
    .part1,.part2,.part3,.part4,.part5,.part6,.part7,.part8{
        position: relative;
    }
    .part2,.part3,.part4,.part5,.part6,.part7,.part8{
        opacity: 1;
        margin-top:.26rem;
    }
    .part2.animate3,.part3.animate3,.part4.animate3,.part5.animate3,.part6.animate3,.part7.animate3,.part8.animate3{
        /* animation: mySilder 1s linear; */
        animation-fill-mode:forwards;
    }
     .swiper-slide2 .part1:before,.swiper-slide2 .part2:before, .swiper-slide2 .part3:before,.swiper-slide2 .part4:before,.swiper-slide2 .part5:before,.swiper-slide2 .part6:before,.swiper-slide2 .part7:before,.swiper-slide2 .part8:before{
        content:'';
        width:7px;
        height:7px;
        background-color: #F2B643;
        border-radius: 50%;
        position: absolute;
        top:0.12rem;
        left:-.38rem;
    }
    .small-swiper-container .small-swiper-wrapper .swiper-slide{
        width:6.02rem!important;
        box-shadow: -2px 2px 7px 5px rgba(236, 233, 233, 0.5);
        padding-left:.54rem;
        padding-right:.5rem;
        height:8rem;
        background-color: #fff;
    }
    .upPic{
        width:.24rem;
        height:.24rem;
        position: absolute;
        left:50%;
        margin-left:-.12rem;
        bottom:2rem;
        animation: myArrow 1s linear infinite alternate;
    }
    @keyframes myText{
        from{
            opacity:0;
            margin-top:2rem;
        }
        to{
            opacity:1;
            margin-top:.4rem;
        }
    }
    @keyframes myLine{
        from{
            height:.5rem;
        }
        to{
           height:7rem;
        }
    }
    @keyframes mySliderLine{
        from{
            height:0;
        }
        to{
           height:8.5rem;
        }
    }
    @keyframes mySilder{
        from{
            opacity:0;
            margin-top:1rem;
        }
        to{
            opacity:1;
            margin-top:.26rem;
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
</style>
<style>
    .swiper-pagination-bullet{
        width:.12rem;
        height:.04rem;
        background-color:#E1E1E1;
    } 
    .swiper-pagination-bullet-active{
        background-color:#F2B643;
    }
    .swiper-pagination{
       height:.5rem;
       top:11.2rem;
    }
    .swiper-container-horizontal > .swiper-pagination-bullets{
        bottom:auto;
    }
</style>