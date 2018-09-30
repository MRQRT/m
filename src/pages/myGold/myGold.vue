<template>
	<div class="myGold">
		<head-top headTitle='我的黄金'>
			<img slot='head_goback' src='../../images/back.png' class="head_goback" @click="goBack()">
			<router-link slot='custom' class="custom"  tag="span" to="tranDetail">交易记录</router-link>
		</head-top>
		<div v-show="firstShow">
			<p class="myGold_title">&nbsp;&nbsp;&nbsp;&nbsp;黄金总资产（克）<img :src="eyeImg" v-on:touchstart="check"></p>
			<p class="myGold_gram" ref="refe">{{computeGram}}</p>
			<p class="estimated">黄金市值(元)：<span>{{estimated}}</span></p>
			<div class="averPrice_profLos">
				<div class="averPrice" @click="goCurrent">
					<p class="averPrice_name">实时金价(元/克)</p>
					<p class="averPrice_value">{{currentPrice}}</p>
				</div>
				<div class="averPrice">
					<p class="averPrice_name">成本均价(元/克)<img :src="question" @click="averPriceAnsw" class="explainWord"></p>
					<p class="averPrice_value">{{averPrice}}</p>
				</div>
				<div class="profLos">
					<p class="averPrice_name">累计收益(元)<img :src="question" @click="profLosAnsw" class="explainWord"></p>
					<p class="averPrice_value">{{profLos}}</p>
				</div>
			</div>
			<p class="goldBean">黄金资产分布</p>
			<!-- <p class="annualRat"><span style="float:left">我的近7日年化生金率达：</span><span style="float:left">{{annualRat}}%</span></p> -->
			<div class="graph" id="container">
			</div>
			<div class="myGoldFooter">
				<mt-button type="default" class="myGold_button" @click="sell_buy('sellgold')">卖出</mt-button>
				<mt-button type="default" class="myGold_button2" @click="sell_buy('buygold')">买入</mt-button>
			</div>
		</div>
		<!--成本均价-->
        <div v-show="averagePrivePupUp" class="averagePrivePupUp">
            <p class="priceTitle">成本均价</p>
            <h4>成本均价代表你每买入1克黄金所付出的成本。</h4>
            <div class="content">
                <div class="mess">
                    <p>1. 买金的影响</p>
                    <p>成本均价=(原持仓克重X原成本均价+买入克重X买入价格) ÷ (原持仓克重+买入克重)。</p>
                </div>
            </div>
            <div class="content" style="margin-top:.5rem;">
                <div class="mess">
                    <p>2. 卖金/提金/存金的影响</p>
                    <p>卖出/提金/存金操作只减去当前持有克重，不影响价格。</p>
                </div>
            </div>
            <div class="content" style="margin-top:.5rem">
                <div class="mess">
                    <p>3. 赠金的影响</p>
                    <p>赠金按0元买入计算新的成本均价。</p>
                </div>
            </div>
            <div class="closePopup">
                <img src="../../images/grayClose.png"  @click="closePop('aver')" style="margin-top: 1.5rem">
            </div>
        </div>
        <!--累计收益-->
        <div v-show="accumulate" class="averagePrivePupUp">
            <p class="priceTitle">累计收益</p>
            <h4>成本收益代表指买入黄金后的盈亏情况。</h4>
            <div class="content">
                <div class="mess">
                    <p>累计收益=持仓克重X实时金价+累计卖出收入-累计买入支出</p>
                </div>
            </div>
            <div class="closePopup">
                <img src="../../images/grayClose.png"  @click="closePop('acc')" style="margin-top: 6rem">
            </div>
        </div>
	</div>
</template>
<script type="text/javascript">
	import headTop from '../../components/header/head.vue'//头部组件
	import Highcharts from 'highcharts'//图标插件
	import { Popup  } from 'mint-ui'//alert框
	import {mapState,mapMutations} from 'vuex'//
	import {formatDate} from "@/config/mUtils"//格式化时间

	import open from '@/images/open.png'
	import close from '@/images/close.png'
	import question from '@/images/definitions.png'
	import noBean from '@/images/noBean.png'

	import { queryMyProfil,floatingAverage,allTradeWeight,queryRate,queryAllInterest } from '@/service/getData.js'

	export default{
		data(){
			return{
				myGoldGram: '— —',//黄金克重
				 averPrice: '— —',//均价
				   profLos: '— —',//浮动盈亏
				  question: question,
				  goldBean: 0,
				 annualRat: '--',
				    option: null,//图标插件配置项
				 dateArray: [],//近七天的时间,放入图表中的数据
				   average: '',//成本均价
				  floating: '',//浮动盈亏
			  goldBeanData: null,//收取金豆数组
			  goldRateData: null,//年化生金率数组
		 averagePrivePupUp: false,//成本均价弹窗
		        accumulate: false,//累计收益弹框
		         firstShow: true,//我的黄金页面显示控制
			}
		},
		created: function(){

		},
		mounted() {
            this.token ? this.userInforma() : '';//获取用户信息
            this.token ? this.floatingAverage() : ''//成本均价和浮动盈亏
            this.token ? this.queryAllInterest() : ''//累计收取克重
            this.token ? this.queryRate() : ''//查询利息图表
		},
		computed: {
			...mapState([
                'eye','currentPrice','token'
			]),
			eyeImg: function(){
				return (this.eye == 1)?open:close
			},
			computeGram: function(){
				return (this.eye == 1)?(this.myGoldGram) : this.hide();
			},
			estimated: function(){
				return this.myGoldGram=='— —'?'--':((this.myGoldGram*this.currentPrice).toFixed(2))
			}
		},
		watch:{
			currentPrice(val){
				return val
			},
			token(){
				this.token ? this.userInforma() : '';//获取用户信息
            	this.token ? this.floatingAverage() : ''//成本均价和浮动盈亏
            	this.token ? this.queryAllInterest() : ''//累计收取克重
            	this.token ? this.queryRate() : ''//查询利息图表
			}
		},
		methods:{
			...mapMutations([
                'RECORD_EYE'
			]),
			//返回按钮
			goBack(){
				window.toApp();
				if(this.$route.query.from=='lottery'){ //从活动页活来再跳转回去
					window.location.href = this.$route.query.lotteryUrl;
					return
				}else{
					this.$router.push('/mine');
				}
			},
			//调往实时金价
			goCurrent(){
				window.localStorage.setItem('page','myGold')
				this.$router.push('/currentAndHistory')
			},
			//黄金余额账户的显示控制
			check: function(){
			    (this.eye==1)?this.eyeImg = close : this.eyeImg = open;
		        (this.eye==1)?this.RECORD_EYE(0) : this.RECORD_EYE(1);
			},
			hide: function(){
				let hideGrams = '* * * *'
				return hideGrams;
			},
			//成本均价弹框
			averPriceAnsw: function(){
				this.averagePrivePupUp=1
				this.firstShow=false
			},
			//累计收益弹框
			profLosAnsw: function(){
				this.accumulate=1
				this.firstShow=false
			},
			//关闭弹出层
			closePop: function(val){
				this.firstShow=1
				if(val=='acc'){
					this.accumulate=false
				}else{
					this.averagePrivePupUp=false
				}
			},
			sell_buy(value){
				(value=='sellgold')?this.$router.push({path: '/sell'}):this.$router.push({path: '/buyProductDetail'})
			},
			//获取用户信息
			async userInforma(){
				const res = await queryMyProfil();
				if(res.code==100){
					this.myGoldGram = Number(res.content.goldBalance)
				}
			},
			//获取浮动盈亏
			async floatingAverage(){
				const res = await floatingAverage()
				if(res.code==100){
					(res.content.average)?this.averPrice = res.content.average.toFixed(2):this.averPrice = "— —";
					(res.content.floating)?this.profLos = res.content.floating.toFixed(2):this.profLos = "— —";
				}
			},
			//查询收益明细总克重
			async queryAllInterest(){
				var res=await queryAllInterest();
				if(res.code==100){
					if(res.content!=null){
						this.goldBean=res.content.interest;
					}else{
						this.goldBean=0;
					}
				}
			},
			//查询利息图表
			async queryRate(){
				const res = await queryRate();
				if(res.code==100){
					if(res.content.date){
						if(res.content.avgRate){
							this.annualRat = res.content.avgRate
						}
						if(res.content.date){
							this.dateArray = res.content.date.split(',')
						}
						if(res.content.rate){
							this.goldRateData = res.content.rate.split(',')
						}
						if(res.content.weight){
							this.goldBeanData = res.content.weight.split(',')
						}
						this.initialize(this.dateArray,this.goldBeanData,this.goldRateData)
					}else{
						const html = '<p style="font-size:.28rem;color:#666666;text-align: center;margin-top: 4.5rem;">没有金豆产生哦，可能是黄金太少or金豆未成熟呢~</p>'
						const con = document.querySelector('#container')
						con.classList.add("noBean")
						con.innerHTML = html
					}
				}
			},
			//初始化图表数据
			initialize(val1,val2,val3){
				var goldBeanData = [],//金豆收入克重
				            date = [],//日期
				    goldRateData = [];//年化生金率
				//将字符串数组转化
				if(val1.length==0){//如果返回的时间是空值，将近七天的时间放入日期数组中
					let data1 = new Date(new Date().getTime()-(24*60*60*1000*6))//前六天
					let data2 = new Date(new Date().getTime()-(24*60*60*1000*5))//前五天
					let data3 = new Date(new Date().getTime()-(24*60*60*1000*4))//前四天
					let data4 = new Date(new Date().getTime()-(24*60*60*1000*3))//前三天
					let data5 = new Date(new Date().getTime()-(24*60*60*1000*2))//前两天
					let data6 = new Date(new Date().getTime()-(24*60*60*1000*1))//前一天
					let data7 = new Date(new Date().getTime())                  //今天时间
					let days = [data1,data2,data3,data4,data5,data6,data7];
					for(var i=0;i<days.length;i++){
						let forDate = formatDate(new Date(days[i]), 'MM-d')
						date.push(forDate);//近七天的时间放入数组中
					}
				}else{
					for(var i=0;i<val1.length;i++){
						date.push(val1[i].substring(5,10));
					}
					if(date.length<7){
						for(var s=0;s<7-date.length;s++){
							date.unshift('--')
						}
					}
				}
				if(val2==null){
					goldBeanData = [0,0,0,0,0,0,0]
				}else{
					for(var i=0;i<val2.length;i++){
						goldBeanData.push(Number(val2[i]));
					}
					if(goldBeanData.length<7){
						for(var j=0;j<7-goldBeanData.length;j++){
							goldBeanData.unshift(0)
						}
					}
				}
				for(var i=0;i<val3.length;i++){
					goldRateData.push(Number(val3[i]));
				}
				if(goldRateData.length<7){
					for(var j=0;j<7-goldRateData.length;j++){
						goldRateData.unshift(0)
					}
				}
				this.option={
					chart: {
						zoomType: 'xy',
						inverted: false,
					},
					title: {
						text: ''
					},
					subtitle: {
						text: ''
					},
					xAxis: [{
						categories: date,
						crosshair: true,
						tickLength: 1//去掉X轴的小短线
					}],
					yAxis: [{ // Primary yAxis
						labels: {
							format: '{value}%',
							style: {
								color: '#666'
							}
						},
						lineWidth: 1,
						lineColor: '#E1E1E1',
						title: {
							text: '',
							style: {
								color: ''
							}
						}
					}, { // Secondary yAxis
						title: {
							text: '',
							style: {
								color: 'blue'
							}
						},
						labels: {
							format: '{value}',
							style: {
								color: '#666'
							}
						},
						opposite: true
					}],
					legend: {
						layout: 'horizontal',
						align: 'center',
						x: 0,
						verticalAlign: 'bottom',
						y: 0,
						backgroundColor: ('red' && '#fff') || '#FFFFFF'
					},
					series: [{
						name: '金豆收入（g）',
						type: 'column',
						yAxis: 1,
						data: goldBeanData,
						tooltip: {
							valueSuffix: ' g'
						}
					}, {
						name: '年化生金率（%）',
						type: 'spline',
						data: goldRateData,
						tooltip: {
							valueSuffix: '%'
						}
					}],
					plotOptions:{
	                	column: {
	                		color: '#f2b643',
						},
						spline: {
							color: '#FF6D39',
							threshold: null,
							marker:{
                              enabled: false
							},
							lineWidth: 1.5,
						}
					},
					credits: {
	            		enabled: false
	        		},
				}
				var that = this
				setTimeout(function(){
					that.highChart()
				},500)
			},
			highChart: function(){
				let container = document.getElementById('container');
				Highcharts.chart(container,this.option);
			},
		},
		components:{
			headTop: headTop
		}
	}
</script>
<style lang="less" scoped>
@import '../../style/common.less';
*{
	margin: 0;
	padding: 0;
	box-sizing: border-box;
}
.myGold{
	width: 100%;
	background-color: #f5f5f5;
}
.myGold_title{
	width: 100%;
	height: .9rem;
	text-align: center;
	font-size: .24rem;
	color: #999999;
	margin-top: .88rem;
	padding-top: .4rem;
	background-color: #fff;
}
.myGold_title>img{
	width: .36rem;
	height: .22rem;
	margin-left: .2rem;
	vertical-align: middle;
}
.myGold_gram{
	width: 100%;
	height: 1rem;
	line-height: 1.05rem;
	font-size: .8rem;
	color: #eda835;
	text-align: center;
	padding: 0 .3rem 0 .3rem;
	background-color: #fff;
}
.estimated{
	width: 100%;
	height: .86rem;
	font-size: .24rem;
	line-height: .35rem;
	text-align: center;
	background-color: #fff;
	color:#333333;
}
.averPrice_profLos{
	.flex-simple;
	justify-content: space-around;
	width: 100%;
	background-color: #fff;
	text-align: center;
	padding-bottom:.3rem;
	img{
		.imgStyle(0.24rem,0.24rem);
		margin-left:.08rem;
		position: relative;
		top:.04rem;
	}
	.averPrice_name{
		.font-style(0.24rem,#999999);
		padding-bottom:.1rem;
	}
	.averPrice_value{
		.font-style(0.28rem,#333333);
	}
}
.goldBean{
	width: 100%;
	padding-left: .3rem;
	padding-right: .3rem;
	height: 1rem;
	line-height: 1rem;
	font-size: .28rem;
	color: #333333;
	background-color: #fff;
	margin-top: .15rem;
}
.annualRat{
	width: 100%;
	height: .5rem;
	line-height: .5rem;
	color: #999999;
	font-size: .28rem;
	padding-left: .3rem;
	padding-right: .3rem;
	background-color: #fff;
}
.annualRat>span:nth-child(2){
	color: red;
}
.graph{
	width: 100%;
	height: 6.2rem;
	background-color: #fff;
	padding-top: .2rem;
	padding-left: .2rem;
	padding-right: .2rem;
}
.noBean{
	background-color: #f5f5f5;
	background-image: url('../../images/noBean.png');
	background-size: 45%;
	background-repeat: no-repeat;
	background-position: center 1rem;
}
.myGoldFooter{
	width: 100%;
	height: .9rem;
	position: fixed;
	bottom: 0;
}
/*成本均价*/
.averagePrivePupUp{
	width: 100%;
	background-color: #fff;
	position: absolute;
	top: .88rem;
	padding: 0 .65rem 0 .65rem;
	letter-spacing: 2px;
	color: #666;
}
.priceTitle{
	font-size: .38rem;
	color: #000;
	height: 1.78rem;
	line-height: 1.78rem;
	text-align: center;
	border-bottom: 1px solid #eeeeee;
	vertical-align: center;
}
.averagePrivePupUp>h4{
	font-size: .3rem;
	height: 1.5rem;
	padding-top: .4rem;
	color: #666666;
}
.closePopup{
	width: 100%;
	height: 3rem;
	line-height: 3rem;
	text-align: center;
}
.closePopup img{
	width: .46rem;
	height: .52rem;
}

</style>
<style type="text/css">
.myGold_button{
	display: inline-block;
	float: left;
	color: #ffffff;
    background-color: #f2b643;
    box-shadow: none;
	border-radius: 0px;
    width: 50%;
    height: .9rem;
    font-size: .34rem;
}
.myGold_button::after {
    background-color: #eda835;
    content: " ";
    opacity: 0;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    position: absolute;
}
.myGold_button2{
	display: inline-block;
	float: left;
	color: #ffffff;
    background-color: #ff6d39;
    box-shadow: none;
	border-radius: 0px;
    width: 50%;
    height: .9rem;
    font-size: .34rem;
}
.myGold_button2::after {
    background-color: #e03e05;
    content: " ";
    opacity: 0;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    position: absolute;
}
.mycolumn{
	width:.4rem;
	height:.1rem;
}
</style>
