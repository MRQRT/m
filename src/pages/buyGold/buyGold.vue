<template>
	<div class="buyGold">
		<div class="topBack" ref="headTopRef">
			<head-top id="head-top"  style="background-color: rgba(255,255,255,0);color:rgba(0,0,0,0);" ref="myHeadTop">
				<div slot="head_goback" class="head_goback"  ref="headTop">
					<img slot='message' :src='message' class="message" ref="message" @click="$router.push({path:'/messCenter'})">
					<span slot='mes_num' class="mes_num" v-show="hasUnread"></span>
				</div>
				<img slot="custom" :src="activity" class="activity" ref="activity" @click="showCard" v-show="hasActivity">
				<img :src="logo" slot="logo" class="homeLogo" style="opacity:0;">
			</head-top>
		</div>
		<div class="swiper-container swiper-container-1">
			<div class="swiper-wrapper">
				<div class="swiper-slide swiper-slide-1" v-for="(item, val, index) in banner" :style="{ backgroundImage: 'url(' + item.imgUrl + ')' }" @click="link(item.hrefUrl)"></div>
			</div>
			<div class="swiper-pagination swiper-pagination-white"></div>
		</div>
		<div class="gold_price">
			<div class="gold_price_content">
				<p class="gold_tendency">
                    <span @click="goCurrent">
                        <span class="gold_tendency_span">国际金价走势<img src="../../images/tendency.png"></span>
                    </span>
				</p>
				<div class="price">
					<div class="price_left" @click="goCurrent">
						<span>{{currentPrice}}</span><span>元/克</span>
					</div>
					<router-link to="/buyProductDetail" class="goldEntrance" tag='div'>
						<img src="../../images/buyEntrance.png">
						<p>立即买金</p>
					</router-link>
				</div>
				<p class="market_price" @click="goCurrent">市场价：<span>310.0</span>元/克</p>
			</div>
		</div>
		<div class="infor_Entr">
			<div class="infor_Entr_left"><img :src="newText"></div>
			<router-link to="/infoList" class="infor_Entr_right" tag="div" prevent="false" showIndicators="false">
				<div class="swiper-container swiper-container-3">
					<div class="swiper-wrapper">
						<div class="swiper-slide swiper-slide-3" v-for="item in news"><span></span>{{item.title}}</div>
					</div>
				</div>
			</router-link>
		</div>
		<div class="goods_list" v-if="goods.length">
			<router-link to="/extractGoldList" tag="p" class="goods_header">
				<span>爱有金</span>
                <span style="float: right;padding-right:.2rem;font-weight: normal;font-size: .26rem;color:#666666;">更多</span>
			</router-link>
			<div class="swiper-container swiper-container-2">
				<div class="swiper-wrapper">
					<div class="swiper-slide swiper-slide-2" v-for="item in goods" :style="{ backgroundImage: 'url(' + item.imageUrl + ')' }" :id='item.id'  @click="$router.push({path:'/productDetail',query:{id:item.id}})">
						<p></p>
						<p style="padding-left:.2rem;padding-right:.2rem;overflow:hidden;line-height:.32rem;height:.28rem;">{{item.name}}</p>
					</div>
				</div>
			</div>
		</div>
		<div class="dingtou" v-if="productLists.length">
			<router-link to="/buyInvestment" tag="div">
				<p class="dingtou_header">
					<span>积存定投</span>
					<span style="float: right;padding-right:.2rem;font-weight: normal;font-size: .26rem;color:#666666;">更多</span>
				</p>
			</router-link>
			<div class="dingtou_list" v-for="item in productLists" @click="goTo_set(item.id)">
				<span class="already" v-if="item.isJoin==1">已加入</span>
				<img :src="item.thumbPath">
				<h4>{{item.name}}</h4>
				<p>{{item.description}}</p>
			</div>
		</div>
		<section class="safety_about">
		    <router-link to="/safety" tag="div" class="safety">
                <img src="../../images/safety.png">
                <span>安全保障</span>
			</router-link>
			<router-link to="/aboutUs" tag="div" class="about">
                <img src="../../images/about.png">
                <span>了解我们</span>
			</router-link>
		</section>
		<footer>
			<p>已累计为用户管理黄金</p>
			<div class="manager_gold">
				<div v-if="ton">
					<span v-for="item in ton">{{item}}</span><strong>吨</strong>
				</div>
				<div v-if="kilogram">
					<span v-for="item in kilogram">{{item}}</span><strong>千克</strong>
				</div>
				<div v-if="gram">
					<span v-for="item in gram">{{item}}</span><strong style="margin-right:0;">克</strong>
				</div>
			</div>
		</footer>
		<!--股东背景-->
		<p class="partners-text">股东背景</p>
		<div class="partners_box">
			<div class="partners">
					<div class="">
						<img src="../../images/zhongxinlogo.png">
					</div>
					<div class="">
						<img src="../../images/lanchilogo.png">
					</div>
					<div class="">
						<img src="../../images/yuanyilogo.png">
					</div>
					<div class="swiper-slide swiper-slide-">
						<img src="../../images/360logo.png">
					</div>
					<div class="">
						<img src="../../images/jdfinance.png">
					</div>
					<div class="">
						<img src="../../images/tjbclogo.png">
					</div>
			</div>
		</div>
		<!--遮罩区域-->
		<div class="mask" v-if="maskShow"></div>
		<!--右上角点击显示活动区域-->
		<div v-if="cardShow">
		<swiper class="myCard" :options="swiperOption">
			<swiper-slide v-for="(sing, index) in pupup" :key="index">
				<img :src='sing.imgUrl' style="border-radius: 8px" @click="linkSite(sing.hrefUrl)">
			</swiper-slide>
			<div class="swiper-pagination" slot="pagination"></div>
			<div class="closeCard" @click="closeCard"></div>
		</swiper>
		</div>
		<!--不在交易时间段内弹窗-->
		<div class="period" v-show="periodShow">
			<h4 class="tipTitle">提示</h4>
			<h4 class="tipDesc">亲,非交易时间段,无法进行交易哦~</h4>
			<div class="periodBtn" @click="closePeriod">我知道了</div>
		</div>
		<!--点击查看检测报告-->
		<mt-popup
		v-model="popupVisibleReport"
		position="middle" id="popupVisibleReport" v-if="orderDetail">
		<section class="view_report">
			<h3 class="report_title">检测报告</h3>
			<p>订单号：{{orderDetail.code || '--'}}</p>
			<p>实测总毛重：{{orderDetail.realGrossWeight || '--'}}克</p>
			<p>实测总净重：{{orderDetail.realNetWeight || '--'}}克</p>
			<p>产品成色：{{orderDetail.productCondition || '--'}}‰</p>
			<p>检测人：{{orderDetail.verifyBy || '--'}}</p>
			<p>检测时间：{{orderDetail.verifyTime || '--'}}</p>
			<p>检测说明：{{orderDetail.verifyRemark || '--'}}</p>
			<p>检测结果：{{orderDetail.verifyResult==0?'通过':'不通过'}}</p>
			<img :src="orderDetail.imageUrl">
			<div class="report_btns">
				<p style="border-right:1px solid #EEEEEE;" @click="confirmStor">确认订单</p>
				<p @click="tele">联系客服</p>
			</div>
		</section>
	    </mt-popup>
	</div>
</template>
<script type="text/javascript" src="@/plugins/swiper.min.js"></script>
<script>
import headTop from '../../components/header/head.vue'
// import Swiper from 'swiper'
import '@/style/swiper.min.css'
import { queryNews,getLimit,queryGoods,queryMessagUnreadCount,queryRegularProduct,queryRegularProductHasLogin,allTradeWeight,queryRecycleOrderRead,confirmationResult } from '@/service/getData.js'
import message from '@/images/message.png'
import message2 from '@/images/message2.png'
import activity from '@/images/activity.png'
import activity2 from '@/images/activity2.png'
import newText from '@/images/new.png'
import {mapState,mapMutations} from 'vuex'
import { getRem,checkAgent } from '@/config/mUtils.js'
import logo from '@/images/myLogo@2x.png'
import { Popup } from 'mint-ui';
export default {
	data() {
		return {
			news: [],//新闻资讯数组
		 newText: newText,//新闻资讯图片文字
		 message: message,
		activity: activity,
		 zhixing: true,
		  banner: [],//轮播数组
		   pupup: [],//弹屏广告数组
		maskShow: false,
		cardShow: false,
      periodShow: false,
      goods:[], //提金产品
      hasUnread:false,//有没有未读的消息
      productLists:[],//定投产品
      weightTotal:null,//管理总克重
      ton:null,//吨
      kilogram:null,//千克
      gram:null,//克
      hasActivity:false,//有没有活动
      logo:logo,
    swiperOption: {
		          pagination: '.swiper-pagination',
		 paginationClickable: false,
		              effect: 'fade',
		   paginationElement: 'li',
			        autoplay: 3000,
		  },
		  orderDetail:null,//用户要确认的订单
		  noReadArr:[],//待用户确认未读的订单
		  popupVisibleReport:false,//弹窗是否出现
		  currentToConfirmIndex:null,//当前要确认的订单索引
		  equipment:null,
		  isOne:true,//是不是第一次渲染
		  canCheck:false,//判断是否可以监听pop渲染下一张
		}
	},
	created() {
		
	},
    mounted() {
		new Swiper('.swiper-container-4', {
			slidesPerView: 2.5,
			spaceBetween: 30,
			freeMode: true
		})
    	let agent=checkAgent();
        this.equipment=agent  //拨打电话时有用
		this.bannerAxios();//banner轮播图
    },
    computed:{
       ...mapState([
       	  'currentPrice','token'
       	])
    },
    watch:{
    	currentPrice(val){
    		return val
    	},
    	popupVisibleReport(val){
    		var that=this;
    		if(!val){
    			this.canCheck=true
    		}
    		if(this.currentToConfirmIndex<this.noReadArr.length-1 && !this.isOne){
    			if(!this.canCheck) return;
    			setTimeout(function(){
    				that.currentToConfirmIndex+=1
    			    that.orderDetail=that.noReadArr[that.currentToConfirmIndex]
    				that.canCheck=false
    				that.popupVisibleReport=true
    			},300)
    		}else{
    			this.isOne=false
    		}
    	}
    },
    methods: {
    	...mapMutations([
    		'RECORD_REGULARPRODUCTS','RECORD_REGULARPRODUCTPARAMS'
    	]),
        //跳转实时金价
        goCurrent(){
            window.localStorage.setItem('page','buyGold'); //记录上一页是首页
            this.$router.push('/currentAndHistory')
        },
    	//查询待用户确认订单列表
    	async queryRecycleOrderRead(){
    		var res=await queryRecycleOrderRead()
    		if(res.code==100){
    			this.noReadArr=res.content
    			if(this.noReadArr.length){
    				this.orderDetail=this.noReadArr[0]
    			    this.currentToConfirmIndex=0
    			    this.isOne=true
    			    this.popupVisibleReport=true;
    			}
    		}
    	},
    	//用户确认订单
    	async confirmStor(){
            var res=await confirmationResult(this.orderDetail.id, 0)
            var that=this;
            setTimeout(function(){
            	if(that.currentToConfirmIndex<that.noReadArr.length-1){
            		that.currentToConfirmIndex+=1
            		that.orderDetail=that.noReadArr[that.currentToConfirmIndex]
            		that.popupVisibleReport=true
            	}else{
            		that.popupVisibleReport=false
            	}
            },300)
            
        },
         tele(){  //拨打电话
         	if(this.equipment=="IOS"){
         		if(phone){
         			phone("400-819-6199");
         		}
         	}else{
         		if(window.getPhonePer){
         			window.getPhonePer("400-819-6199");
         		}
         	}
         },
    	changeHead(){
    		var scrollTop=document.documentElement.scrollTop || document.body.scrollTop;
    		this.$refs.myHeadTop.$el.style.backgroundColor = 'rgba(255,255,255,'+scrollTop/150+')'
    		document.querySelector('.homeLogo').style.opacity = scrollTop/100;
    		if(scrollTop>=150){
    			this.message=message2
    			this.activity=activity2
    			this.$refs.myHeadTop.$el.style.borderBottom = '1px solid #EEEEEE'
    		}else{
    			this.message=message
    			this.activity=activity
    			this.$refs.myHeadTop.$el.style.borderBottom = 'none'
    		}
    	},
    	//点击活动弹屏链接网页
    	linkSite(src){
    		window.location.href=src
    	},
    	//查询管理总克重
    	async allTradeWeight(){
    		var res=await allTradeWeight();
    		if(res.code==100){
    			this.weightTotal=res.content.weightTotal;
    			var a=parseInt(this.weightTotal/1000)+'';
    			var  b=a.length
    			//克重可到达克
    			if(b>0 && b<4){
    				if(!a*1){
    					this.gram=Math.ceil(this.weightTotal)+'';
    				}else{//克重可到达千克
    					this.kilogram=a;
    					this.gram=Math.ceil(this.weightTotal-a*1000)+''
    				}
    			  
    			}else{ //克重可到达吨
    				this.ton=parseInt(this.weightTotal/1000/1000)+''
    				this.kilogram=parseInt(this.weightTotal/1000)-this.ton*1000+'';
    				this.gram=Math.ceil(this.weightTotal-this.ton*Math.pow(10,6)-this.kilogram*Math.pow(10,3))+''
    			}
    		}
    	},
    	//跳转设置定投的开始页
        goTo_set(id){
            this.RECORD_REGULARPRODUCTPARAMS(id)
            this.$router.push({
				path:'/investmentDetail',
				query: {
					'productId':id
				}
			})
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
    	//是否有活动
    	async popup(){
    		const res = await getLimit(2,10)
    		if(res.code==100){
    			this.pupup = res.content;
    			if(this.pupup.length){
    				this.hasActivity=true;
    				// this.showCard();
    			}else{
    				this.hasActivity=false;
    				document.getElementsByClassName('homeLogo')[0].style.right=0+'px';
    			}
    		}
    	},
    	//首页轮播图
    	async bannerAxios(){
  			const res = await getLimit(1,10);
  			if(res.code==100){
  				this.banner = res.content;
  				let that = this
  				setTimeout(function(){
  					that.banner_swiper()
  				},1000)
  			}
    	},
    	//请求提金产品
    	async queryGoods(){
    		var res=await queryGoods();
    		if(res.code==100){
    			this.goods=res.content.slice(0,3);
    			let that = this
  				setTimeout(function(){
	    			that.goods_swiper()
  				},300)
    		}
    	},
    	//banner的swiper初始化
    	banner_swiper(){
    		var swiper = new Swiper('.swiper-container-1', {
            	pagination: '.swiper-pagination',
            	// paginationClickable: true,
            	// loop:true,
            	speed: 400,
            	// autoplay: 3000,
            	paginationElement : 'li',
        	});
    	},
    	/*提金产品的swiper的初始化*/
    	goods_swiper(){
    		var swiper2 = new Swiper('.swiper-container-2', {
				slidesPerView: 2.5,
				spaceBetween: 10,
				paginationClickable: true,
				freeMode: true
			});
    	},
    	news_swiper(){
    		var swiper = new Swiper('.swiper-container-3', {
    			direction: 'vertical',
    			loop: true,
    			autoplay: 3000,
    			onlyExternal: true,//触摸不能拖动
    			slidesPerView: 2,
    		})
    	},
    	async showCard(){  //点击展示广告浮窗
    		const res = await getLimit(2,10)
    		if(res.code==100){
    			this.pupup = res.content;
    			if(this.pupup.length){
    				this.maskShow=true;
    		        this.cardShow=true;
    			}
    		}
    	},
    	closeCard(){ //关闭活动弹窗展示页
    		this.maskShow=false;
    		this.cardShow=false;
    	},
    	closePeriod(){ //关闭不在交易时段提示框
    		this.maskShow=false;
    		this.periodShow=false;
    	},
    	async queryNews(remV){
    		const that = this
    		const res = await queryNews()
    		if(res.code==100){
    			that.news=res.content
    			setTimeout(function(){
    				that.news_swiper()
    			},500)
    		}
    // 		if(res.code==100){
    // 			that.news = res.content;
    // 			var daojishi = setTimeout(function(){
    // 				var container = document.getElementsByClassName("info_list_ul")[0],
		  //       		a = 38,
		  //   			ulHeight = container.offsetHeight;
				// var scroll = function(){
				// 	a--;
				// 	if(a<=ulHeight*(-1)){
				// 		a = 38;
				// 	}
		  //   		container.style.position = 'absolute';
  		// 			container.style.top = a/50+'rem';
  		// 			container.style.left = 0+'rem';
				// }
				// setInterval(scroll, 100);
    // 			},100)
    // 		}
    	},
    	//banner活动链接跳转
    	link(value){  
    		var arr=value.split('/')
			var value='/'+arr[arr.length-1]
			if(value!='/spring' && value!='/putupDetail' && value!='/extractGoldList' && value!='/register') return;
			if(value=='/spring'){
				this.$router.push('spring')
			}else if(value=='/putupDetail'){
				this.$router.push('putupDetail')
			}else if(value=='/register'){
				this.$router.push('register')
			}else{
				this.$router.push('extractGoldList')
			}
    	},
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
    },
	components:{
		headTop,
	},
	destroyed(){
	},
	activated: function () {
        this.token ? this.queryRecycleOrderRead() : ''
		const remV = getRem();
		this.queryNews(remV);
		document.onscroll=this.changeHead;
		document.ontouchmove=this.changeHead;
		this.queryGoods();
		this.popup();
		this.allTradeWeight();
		this.token ? this.queryRegularProductHasLogin() : this.queryRegularProduct();
		this.token ? this.queryMessagUnreadCount() :'';
    },
    deactivated: function () {
    	document.onscroll=null;
    	document.ontouchmove=null;
    }
}
</script>
<style scoped lang='less'>
	@import '../../style/common.less';
	*{
		margin: 0;
	   	padding: 0;
		box-sizing: border-box;
    }
	img{
		width: 100%;
	}
	.static{
		background-image: url(../../images/banner.png)
	}
	.buyGold{
		background-color: #f7f7f7;
		position: relative;
		padding-bottom: 1rem;
	}
	.homeLogo{
		width:1.6rem;
		height:.32rem;
		position: relative;
		top:.1rem;
	}
	.buyGold{
		.topBack{
			width: 100%;
	 		position: fixed;
	 		top: 0;
	 		z-index: 100;
		}
	}
	#head-top{
		height: .88rem;
		width: 100%;
		z-index: 100;
		padding: .18rem .3rem 0 .3rem;
		text-align: center;
	}
	#head-top .title_head{
		position: relative;
		right:-0.2rem;
	}
	#head-top>.head_goback{
		width: .6rem;
		height: .6rem;
		float: left;
	}
	#head-top>.head_goback>.message{
		width: .6rem;
		height: .6rem;
	}
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
		right: 0;
	}
	#head-top>.activity{
		width: .6rem;
		float: right;
	}
	.router-fade-enter-active, .router-fade-leave-active {
	  	transition: opacity 1s;
	}
	.router-fade-enter, .router-fade-leave-active {
	  	opacity: 0;
	}
	.swiper-container-1 {
    	width: 100%;
    	height: 6.06rem;
	}
	.swiper-container-1 .swiper-slide-1{
		background-size: 100%;
	}
	.swiper-container-2{
		padding-top: .2rem;
		width: 100%;
		height: 3.4rem;
		padding-left: .3rem;
	}
	.swiper-container-2 .swiper-slide-2 {
		width: 2.5rem;
		height: 2.85rem;
		background-size: 100%;
		box-shadow: 6px 0px 7px 6px #f5f5f5;
	    -webkit-box-shadow: 6px 0px 7px 6px #f5f5f5;
        -moz-box-shadow: 6px 0px 7px 6px #f5f5f5;
        -o-box-shadow: 6px 0px 7px 6px #f5f5f5;
        padding-top: 2rem;
	}
	.swiper-container-3 {
    	width: 86%;
    	height: .92rem;
    	color: #333333;
	}
	.swiper-container-3 .swiper-slide-3{
		height: .46rem;
		overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
	}
	.swiper-container-3 .swiper-slide-3>span{
		display: inline-block;
		width: 6px;
		height: 6px;
		border-radius: 50%;
		-webkit-border-radius: 50%;
		-moz-border-radius: 50%;
		-o-border-radius: 50%;
		background-color: #000;
		float: left;
		margin: .12rem .2rem 0 .2rem;
	}
	.gold_price{
		position: absolute;
		top: 3.46rem;
		width: 100%;
		height: 2.6rem;
		display: flex;
		display: -webkit-flex;
		display: -moz-flex;
		display: -ms-flex;
		display: -o-flex;
		justify-content: center;
		-webkit-justify-content: center;
		-moz-justify-content: center;
		-o-justify-content: center;
		-ms-justify-content: center;
		z-index: 1;
		background-image: url(../../images/gradient.png);
		background-size: cover;
	}
	.gold_price_content{ 
		width: 94%;
		height: 2.6rem;
		background-color: #fff;
		box-shadow: 0px 8px 5px #f7f6f6;
		-webkit-box-shadow: 0px 8px 5px #f7f6f6;
        -moz-box-shadow:0 5px 8px #f7f6f6; 
        -o-box-shadow:0 5px 8px #f7f6f6;  
        padding: 0 .3rem 0 .3rem;
	}
	.gold_tendency{
		width: 100%;
		height: .65rem;
	}
	.gold_tendency_span{
		display: inline-block;
		height: .30rem;
		width: 2rem;
		font-size: .25rem;
		margin-top: .28rem;
		color:@base-font-color1;
		font-weight: bold;
	}
	.gold_tendency_span img{
		width: .27rem;
		height: .26rem;
		margin-left: .05rem;
		margin-bottom: -.03rem;
	}
	.gold_price_content .price{
		width: 100%;
		height: 1.3rem;
	}
	.price_left{
		float: left;
		width: 80%;
		padding-top: .24rem;
	}
	.price_left span:nth-child(1){
		font-size: .66rem;
		font-weight: bold;
		color: #eda835;
	}
	.price_left span:nth-child(2){
		font-size: .25rem;
		color: #EDA835;
	}
	.goldEntrance{
		position: relative;
		width: 20%;
		float: right;
	}
	.goldEntrance img{
		width: 1.3rem;
		animation: myImg 6s ease 1;
		-moz-animation: myImg 6s ease 1;
		-webkit-animation: myImg 6s ease 1;
	}
	@keyframes myImg {
    from { transform: rotate(0deg)  rotate(720deg); }
    to   { transform: rotate(0deg)  rotate(-720deg); }
	}	
	.goldEntrance p{
		display: inline-block;
		position: absolute;
		top: 0;
		width: 1.3rem;
		height: 1.3rem;
		line-height: .3rem;
		padding: .37rem;
		font-size: .25rem;
		color: #fff;
	}
	.market_price{
		color: @base-font-color3;
		font-size: .2rem;
		text-decoration: line-through;
	}
	.swiper-pagination{
	    position: absolute;
	    top: 3.05rem;
	}
	.swiper-pagination li{
		width: .25rem;
		height: .04rem;
		border-radius: 0;
		-webkit-border-radius: 0;
		-moz-border-radius: 0;
		-o-border-radius: 0;
	}
	.infor_Entr{
		width: 100%;
		padding: .25rem .35rem 0 .3rem;
		height: 1.36rem;
		font-weight: bold;
		color: #ebac45;
		background-color: #fff;
	}
	.infor_Entr_left{
		font-family: "Cursive";
		display: inline-block;
		font-size: .35rem;
		width: .75rem;
		line-height: .35rem;
		float: left;
		margin-top: .1rem;
	}
	.infor_Entr_right{
		text-decoration: none;
		color: #000;
		font-size: .24rem;
		font-weight: normal;
		height: .92rem;
		margin-top: .02rem;
	}
	/*.info_list{
		position: relative;
		float: left;
		list-style: none;
		width: 88%;
		height: .8rem;
		overflow-y: hidden;
		text-indent: 0;
		padding-top: .05rem;
	}*/
	/*.info_list ul{
		left: 0;
		right: 0;
	}*/
	/*.info_list li{
		position: relative;
		padding-left: .5rem;
		height: .33rem;
		line-height: .33rem;
		overflow: hidden;
    	text-overflow: ellipsis;
    	white-space: nowrap;
	}*/
	/*.info_list li:before{
		content: '';
		width: .07rem;
		height: .07rem;
		background-color: #000;
		border-radius: .035rem;
		position: absolute;
		top: .15rem;
		left: .30rem;
	}*/
	.goods_list{
		width: 100%;
		height: 4.35rem;
		background-color: #fff;
	}
	.goods_header{
		height: .9rem;
		background-image: url(../../images/right_jian.png);
		background-position: 96% .46rem;
		background-size: .13rem .24rem;
		background-repeat: no-repeat;
		line-height: 1.15rem;
		font-size: .25rem;
		padding: 0 .25rem 0 .3rem;
	}
	.goods_header span{
		font-size: .34rem;
		color: #000;
		font-weight: bold;
		margin-right: .2rem;
	}
	.dingtou{
		width: 100%;
		background-color: #fff;
	}
	.dingtou .dingtou_list:last-child{
		height: 4.1rem;
	}
	.dingtou_list img{
		width:6.9rem;
		height:2.3rem;
	}
	.dingtou_header{
		height: .9rem;
		background-image: url(../../images/right_jian.png);
		background-position: 96% .46rem;
		background-size: .13rem .24rem;
		background-repeat: no-repeat;
		line-height: 1.15rem;
		font-size: .25rem;
		color: #9a9998;
		padding: 0 .25rem 0 .25rem;
	}
	.dingtou_header span{
		font-size: .35rem;
		color: #000;
		font-weight: bold;
		margin-right: .1rem;
	}
	.dingtou_list{
		height: 3.8rem;
		padding-top: .28rem;
		padding-left: .3rem;
		padding-right: .3rem;
		position: relative;
	}
	.dingtou_list img{
		width:6.9rem;
		height:2.34rem;
	}
	.list_last{
		height: 4rem;
		background-color: #fff;
	}
	.dingtou_list h4{
		height: .65rem;
		line-height: .75rem;
		font-size: .32rem;
		color:@base-font-color1;
	}
	.dingtou_list p{
		font-size: .24rem;
		color: @base-font-color3;
	}
	.dingtou_list>.already{
		display: inline-block;
		font-size: .25rem;
		color: #fff;
		width: 1.2rem;
		text-align: center;
		height: .34rem;
		background-image: url(../../images/already.png);
		background-size: 100%;
		position: absolute;
		top: .19rem;
	}
	.safety_about{
		margin-top:.42rem;
		width: 100%;
		height: 1.2rem;
		.flex;
	}
	.safety{
		margin-right:2.9%;
	}
	.safety,.about{
		width: 44.5%;
		line-height: 1.2rem;
		text-align: center;
		background-color: #fff;
		font-size: .28rem;
	}
    .safety img,.about img{
        width: .62rem;
        height: .62rem;
        vertical-align: middle;
        margin-right:.22rem;
    }
	footer{
		width: 100%;
		margin-top: 1.02rem;
	}
	footer p{
		font-size: .30rem;
		color: #9a9998;
		text-align: center;
	}
	.manager_gold{
		text-align: center;
		font-size: .22rem;
		margin-top: .2rem;
		background-color: #f7f7f7;
		display: -webkit-flex;
		display: -moz-flex;
		display: -o-flex;
		display: -ms-flex;
        display: flex;
		-webkit-justify-content:center;
		-moz-justify-content:center;
		-o-justify-content:center;
        justify-content:center;
		color:#999999;
	}
	.manager_gold span{
		display: inline-block;
		width: .44rem;
		height: .6rem;
		line-height: .6rem;
		font-size: .44rem;
		background-color: #fff;
		margin-right: .06rem;
		color:#333333;
		-webkit-border-radius: 2px;
		-moz-border-radius: 2px;
		-o-border-radius: 2px;
        border-radius: 2px;
		-webkit-box-shadow: 0px 1px 5px #EFEFEF;
		-moz-box-shadow: 0px 1px 5px #EFEFEF;
		-o-box-shadow: 0px 1px 5px #EFEFEF;
        box-shadow: 0px 1px 5px #EFEFEF;
	}
    .manager_gold strong{
        font-weight:normal;
        margin-left:.04rem;
        margin-right:.1rem;
    }
	.swiper-slide-2 p:first-child{
		color: #000;
		font-size: .25rem;
		text-align: center;
		height: .2rem;
	}
	.swiper-slide-2 p:nth-child(2){
		color: #333333;
		font-size: .28rem;
		text-align: center;
	}

	/*集金卡*/
	.buyGold .mask{
		position: fixed;
		width:100%;
		height:100%;
		top:0;
		left:0;
		z-index: 101;
		background-color: rgba(0,0,0,.5);
	}
	.buyGold .myCard{
		position: fixed;
		top:2.3rem;
		left:50%;
		margin-left:-3rem;
		width:6rem;
		height:8rem;
		z-index: 102;
		background-color: #fff;
		border-radius: 10px;
		-webkit-border-radius: 10px;
		-moz-border-radius: 10px;
		-o-border-radius: 10px;
		overflow: visible;
	}
	.buyGold .myCard img{
		width:6rem;
		height:8rem;
	}
	.myCard .swiper-pagination{
		top:7.6rem;
	}
	.buyGold .myCard .closeCard{
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
	.buyGold .myCard .closeCard:before{
		content:'';
		width:.02rem;
		height:.4rem;
		background-color: #fff;
		position: absolute;
		bottom:-.4rem;
		left:50%;
		margin-left:-.01rem;
	}

	.buyGold .period{
        width:4.9rem;
        height:2.46rem;
        position: fixed;
        background-color: #fff;
        border-radius: 10px;
        -webkit-border-radius: 10px;
        -moz-border-radius: 10px;
        -o-border-radius: 10px;
        left:50%;
        margin-left:-2.48rem;
        top:4.8rem;
        z-index: 230;
        padding-top:.38rem;
    }
    .buyGold .period h4{
        text-align: center;
    }
    .buyGold .period .tipTitle{
    	font-size:.36rem;
    	margin-bottom:.16rem;
    }
    .buyGold .period .tipDesc{
    	font-size:.26rem;
    	font-weight: normal;
    	color:#454545;
    }
    .buyGold .periodBtn{
        height:.8rem;
        border-top:1px solid #EEEEEE;
        margin-top:.26rem;
        line-height:.8rem;
        text-align: center;
        font-size:.32rem;
        color:#EDA835;
    }
    .swiper-container-horizontal>.swiper-pagination-bullets .swiper-pagination-bullet{
    	margin: 0 2px;
    	width: 8px;
    }
    @media(-webkit-min-device-pixel-ratio:1.5),(min-device-pixel-ratio:1.5),(-o-min-device-pixel-ratio:1.5){
		.goods_list:before{
			content: '';
			display: inline-block;
			width: 100%;
			border-bottom: 1px solid #eeeeee;
			-webkit-transform: scaleY(0.7);
			-o-transform: scaleY(0.7);
			-moz-transform: scaleY(0.7);
			transform:scaleY(0.7);
			float: left;
		}
		/*.dingtou:before{
			content: '';
			display: inline-block;
			width: 100%;
			border-bottom: 1px solid #eeeeee;
			-webkit-transform: scaleY(0.7);
			-o-transform: scaleY(0.7);
			-moz-transform: scaleY(0.7);
			transform:scaleY(0.7);
			float: left;
		}*/
	}
	@media(-webkit-min-device-pixel-ratio:2),(min-device-pixel-ratio:2),(-o-min-device-pixel-ratio:1.5){
		.goods_list:before{
			content: '';
			display: inline-block;
			width: 100%;
			border-bottom: 1px solid #eeeeee;
			-webkit-transform: scaleY(0.5);
			-o-transform: scaleY(0.5);
			-moz-transform: scaleY(0.5);
			transform:scaleY(0.5);
			float: left;
		}
		/*.dingtou:before{
			content: '';
			display: inline-block;
			width: 100%;
			border-bottom: 1px solid #eeeeee;
			-webkit-transform: scaleY(0.5);
			-o-transform: scaleY(0.5);
			-moz-transform: scaleY(0.5);
			transform:scaleY(0.5);
			float: left;
		}*/
	}
  #popupVisibleReport{
    padding-top:.34rem;
  }
  #popupVisibleReport img{
    width:5.64rem;
    height:3.8rem;
  }
  .view_report .report_title{
    font-size:.32rem;
    color:#000000;
    text-align: center;
    font-weight:700;
    padding-bottom:.2rem;
  }
  .view_report p{
    font-size:.26rem;
    color:#666666;
    padding-bottom:.08rem;
    padding-left:.4rem;
  }
  .view_report img{
    margin-left:.4rem;
    display: block;
    margin-top:.32rem;
  }
  .view_report .report_btns{
    height:.9rem;
    line-height:.9rem;
    border-top:1px solid #EEEEEE;
    font-size:.32rem;
    margin-top:.4rem;
  }
  .view_report .report_btns p{
    display: inline-block;
    width:50%;
    float:left;
    text-align: center;
    color:#EDA835;
  }
  .partners-text{
	  .font-style(0.26rem,@base-font-color3);
	  text-align: center;
	  .bottom-padding(0.3rem);
	  .top-padding(0.6rem);
  }
   .partners_box{
	  width:100%;
	  overflow-x: scroll;
  }
  .partners{
	.left-padding(0.28rem);
	 margin-bottom:.6rem;
	 width:20rem;
  }
  .partners div{
	display: inline-block;
	width:3rem;
	height:1.1rem;
	margin-right:.14rem;
  }
  .partners img{
	width:100%;
  }
</style>
<style>
.swiper-pagination-bullet{
    width:.12rem;
    height:.04rem;
    border-radius: 0;
    -webkit-border-radius: 0;
    -moz-border-radius: 0;
    -o-border-radius: 0;
    background-color:#FFFFFF;
    opacity:0.4;
} 
.swiper-pagination-bullet-active{
    background-color:#FFFFFF;
    opacity:1;
}
.mint-popup{
    width:6.7rem;
    border-radius: 10px;
 }
.mint-popup#popupVisibleReport{
    width:6.7rem;
    height:auto;
}
</style>
