<template>
	<div class="store">
		<head-top id="head-top"  style="background-color: rgba(255,255,255,0);color:rgba(0,0,0,0);" ref="myHeadTop">
			<div slot="head_goback" class="head_goback"  ref="headTop" style="width:100%;position:relative;">
				<img slot='message' :src='message' class="message" ref="message" @click="$router.push({path:'/messCenter'})">
				<span slot='mes_num' class="mes_num" v-show="hasUnread"></span>
				<p slot="custom" class="my_store_order" @click="goToMyOrder">我的订单</p>
			</div>
		</head-top>
		<!--存金banner-->
		<!-- <div class="storBanner">
			<img src="../../images/storeGoldaBanner.jpg">
			<img src="../../images/gradient.png" class="gradient">
			<div class="price_container">
				<p class="price_in" @click="toCurrent">
					<span>回收金价(元/克)</span>
					<img src="../../images/goldGo.png">
				</p>
				<p class="price_amount" @click="toCurrent">{{currentPrice | formatNum}}</p>
				<button class="goStore" @click="$router.push('/stor')">我要存金
					<a class="click_bg"></a>
				</button>
			</div>
		</div> -->

		<!-- 存金banner -->
		<div class="storBanner">
			<div class="swiper-container swiper-container-1">
				<div class="swiper-wrapper">
					<div class="swiper-slide swiper-slide-1" v-for="(item, val, index) in banner" :style="{ backgroundImage: 'url(' + item.imgUrl + ')' }" :key="index"></div>
				</div>
			</div>
			<img src="../../images/gradient.png" class="gradient">
			<div class="price_container">
				<p class="price_in" @click="toCurrent">
					<span>回收金价(元/克)</span>
					<img src="../../images/goldGo.png">
				</p>
				<p class="price_amount" @click="toCurrent">{{currentPrice | formatNum}}</p>
				<button class="goStore" @click="$router.push('/stor')">我要卖金
					<a class="click_bg"></a>
				</button>
			</div>
		</div>
		<!--存金流程-->
		<div class="store_flow">
			<h4>存金流程</h4>
			<section class="flow_container">
				<div class="each_flow_container">
					<img src="../../images/flow1.png">
					<p>在线预约</p>
				</div>
				<p class="store_join_line"></p>
				<div class="each_flow_container">
					<img src="../../images/flow2.png">
					<p>顺丰上门</p>
				</div>
				<p class="store_join_line"></p>
				<div class="each_flow_container">
					<img src="../../images/flow3.png">
					<p>检测变现</p>
				</div>
				<!-- <p class="store_join_line"></p>
				<div class="each_flow_container">
					<img src="../../images/flow4.png">
					<p>快捷变现</p>
				</div> -->
			</section>
		</div>
		<!--安全保障-->
		<section class="insurance">
			<h4>安全保障</h4>
			<div class="insurance_container">
				<div>
					<p>实力央企背景</p>
					<p>雄厚资本助力</p>
				</div>
				<div style="margin-left:.19rem;margin-right:.19rem;">
					<p>安全可信赖的经营</p>
					<p>理念及风控体系</p>
				</div>
				<div>
					<p>顺丰速递</p>
					<p>全程无条件赔付</p>
				</div>
			</div>
		</section>
		<foot></foot>
	</div>
</template>
<script>
import foot from '@/components/footer/footGuid.vue'
import headTop from '@/components/header/head.vue'
import { queryMessagUnreadCount,getLimit } from '@/service/getData'
import message from '@/images/message.png'//消息图标白色
import message2 from '@/images/message2.png'//消息图标黑色
import {mapState} from 'vuex'
export default {
	data() {
		return {
			message: message,
			hasUnread:false,//是否有未读的消息
			banner:[],//banner
		}
	},
	mounted() {
		this.bannerAxios();
	},
	computed:{
       ...mapState([
       	  'token','currentPrice',
       	])
    },
	watch:{
		currentPrice(val){
			return val
		}
	},
	filters:{
		formatNum(val){
			if(!val) return;
			if(val=='0') return '0.00'
			return val.toFixed(2)
		}
	},
	methods: {
		//轮播图
    	async bannerAxios(){
  			const res = await getLimit(3,3);
  			if(res.code==100){
  				this.banner = res.content;
  				let that = this
  				setTimeout(function(){
  					that.banner_swiper()
  				},1000)
  			}
		},
		//banner的swiper初始化
    	banner_swiper(){
    		var swiper = new Swiper('.swiper-container-1', {
            	loop:true,
            	speed: 400,
            	autoplay: 3000,
        	});
    	},
		//跳转实时金价
		toCurrent(){
			window.localStorage.setItem('page','storeGold'); //记录上一页是存金首页
            this.$router.push('/currentAndHistory')
		},
		//查询用户未读消息数量
		async queryMessagUnreadCount(){
    		var res=await queryMessagUnreadCount();
    		if(res.code==100){
    			if(res.content.count){
    				this.hasUnread=true;
    			}else{
    				this.hasUnread=false;
    			}
    		}
    	},
    	//滚动改变导航栏样式
    	changeHead(){
    		var scrollTop=document.documentElement.scrollTop || document.body.scrollTop;
    		this.$refs.myHeadTop.$el.style.backgroundColor = 'rgba(255,255,255,'+scrollTop/150+')'
    		if(scrollTop>=150){
    			this.message=message2
    			this.$refs.myHeadTop.$el.style.borderBottom = '1px solid #EEEEEE'
    		}else{
    			this.message=message
    			this.$refs.myHeadTop.$el.style.borderBottom = 'none'
    		}
    	},
		//跳转我的存金订单
		goToMyOrder(){
			this.$router.push('/storOrder')
		}
	},
	components:{
		foot,
		headTop,
	},
	activated: function () {
		this.token ? this.queryMessagUnreadCount() :this.hasUnread=false;
	    document.onscroll=this.changeHead;
	    document.ontouchmove=this.changeHead;
    },
    deactivated: function () {
    	document.onscroll=null;
    	document.ontouchmove=null;
    }
}
</script>
<style type="text/css" scoped>
#head-top>.head_goback>.mes_num{
	display: inline-block;
    color: #fff;
    font-size: .2rem;
    width: 11px;
    height: 11px;
    line-height: .3rem;
    text-align: center;
    border-radius: 50%;
    -webkit-border-radius: 50%;
    -moz-border-radius: 50%;
    -o-border-radius: 50%;
    background-color: #ff6d39;
    position: absolute;
    top: 0;
    left: .4rem;
}
*{
	margin: 0;
	padding: 0;
	box-sizing: border-box;
	font-family:PingFang-SC-Regular;
}
img{
	width: 100%;
}
.store{
	width: 100%;
	min-height: 100vh;
	position: relative;
	top: 0;
	padding-bottom:1.22rem;
}
.storBanner{
	width:100%;
	height:5.62rem;
	position: relative;
}
.storBanner img{
	width:100%;
}
.storBanner .gradient{
	width:100%;
	position: absolute;
	bottom:0;
	left:0;
}
.insurance{
	padding-left:.32rem;
	padding-right:.32rem;
	margin-top:.65rem;
	margin-bottom:.44rem;
}
.insurance h4{
	font-size:.34rem;
	color:#333333;
	font-weight: 600;
}
.insurance_container{
	overflow: hidden;
	margin-top:.44rem;
	-webkit-display: flex;
	-o-display: flex;
	-moz-display: flex;
	display: flex;
	-webkit-justify-content: center;
	-o-justify-content: center;
	-moz-justify-content: center;
	justify-content: center;
}
.insurance_container>div{
	background-color: #F9F5EF;
	width:2.16rem;
	height:1.3rem;
	text-align: center;
	padding-top:.32rem;
	font-size:.22rem;
	color:#333333;
}
.insurance_container img{
	width:.6rem;
	height:.6rem;
	margin-bottom:.2rem;
}
#head-top{
	height: .88rem;
	width: 100%;
	z-index: 100;
	padding: .18rem .3rem 0 0;
	text-align: center;
	position:fixed;
	top:0;
}
.message{
	width: .6rem;
	height: .6rem;
	position: absolute;
	left:0;
}
.price_container{
	width:7.1rem;
	height:3.2rem;
	background-color: #fff;
	bottom:-.56rem;
	left:.2rem;
	position: absolute;
	padding-top:.38rem;
	box-shadow: 0px 8px 5px #f7f6f6;
	z-index: 100;
}
.price_in{
	text-align: center;
}
.price_in span{
	color:#666666;
	font-size:.28rem;
}
.price_in img{
	width:.44rem;
	height:.44rem;
	vertical-align: middle;
}
.price_amount{
	color:#EDA835;
	font-size:.88rem;
	text-align: center;
	font-weight:800;
	margin-top:.1rem;
}
.goStore{
	width:3.5rem;
	height:.7rem;
	background-color: #F2B643;
	border-radius: 18px;
	color:#fff;
	font-size:.34rem;
	text-align: center;
	display: block;
	margin:0 auto;
	line-height:.7rem;
	margin-top:.06rem;
	position: relative;
}
.goStore .click_bg{
	width:3.5rem;
	height:.7rem;
	background-color:transparent;
	border-radius: 18px;
	position: absolute;
	left:0;
}
.goStore .click_bg:active{
	background-color:rgba(0,0,0,.2);
}
.store_flow{
	margin-top:1.44rem;
}
.store_flow h4{
	font-size: .34rem;
	padding-left: .32rem;
    color: #333333;
    font-weight: 600;
}
.flow_container{
	-webkit-display: flex;
	-o-display: flex;
	-moz-display: flex;
	display: flex;
	-webkit-justify-content: center;
	-o-justify-content: center;
	-moz-justify-content: center;
	justify-content: center;
	margin-top:.4rem;
}
.flow_container img{
	width:.6rem;
}
.flow_container .each_flow_container{
	text-align: center;
	position: relative;
}
.flow_container .each_flow_container p{
	font-size:.24rem;
	color:#666666;
	padding-top:.14rem;
}
.flow_container  .store_join_line{
	width:1.8rem;
	height:.02rem;
	background-color: #E1E1E1;
	margin-left:.1rem;
	margin-right:.1rem;
	margin-top:.3rem;
}
.store .my_store_order{
	font-size:.24rem;
	color:#eda835;
	position:absolute;
	right:.3rem;
	top:.18rem;
}
.swiper-container-1{
	height: 5.62rem;
}
.swiper-slide-1{
	height: 5.62rem;
	background-size:100%;
}
</style>

