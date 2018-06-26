<template>
	<div class="arguments">
		<head-top headTitle='黄金管家提金服务协议'>
			<img slot='head_goback' src='../../images/back.png' class="head_goback" @click="$router.push({path:'/fillInOrder',query:{'address':address,'physicalId':physicalId,'count':count}})">
		</head-top>
		<div class="content">
			<p class="title">黄金管家提金服务协议<span class="middLine"></span></p>
			<div class="start">
				<p class="subContent1">黄金管家提金业务是指，黄金管家用户（以下简称“用户”）通过北京盈吉通电子商务有限公司（“黄金管家”品牌创立者及所有企业，以下简称“黄金管家”）购买实物黄金（包括但不限于金币、金条、黄金饰品、纪念黄金产品等在黄金管家客户端展示的实物黄金产品）或者将其在黄金管家账户内的现货黄金兑换为实物黄金的行为。当用户有提金业务需求时，黄金管家按照《黄金管家服务协议》（以下简称“协议”）规定帮助用户进行购买实物黄金、兑换实物黄金等操作。</p>
				<p class="subContent1">据此，为更好地维护双方的合法权益，用户需了解、遵守及承诺如下事项：</p>
			</div>
			<div>
				<ul>
					<li class="subTitle">1、用户陈述、承诺及保证</li>

					<li class="subContent1">1.1用户已年满18周岁，为完全民事行为能力人。</li>
					<li class="subContent1">1.2用户对本须知的所有内容已经充分理解。</li>
					<li class="subContent1">1.3用户在办理须知项下的黄金提金业务前已是黄金管家的注册用户，并同意黄金管家的服务条款。</li>
					<li class="subContent1">1.4用户承诺其为履行须知内容而向黄金管家和／或相关商户提供的所有文件、资料和凭证和其他信息是准确、真实、完整和有效的，不存在任何虚假、误导或重大遗漏，如与事实不符，用户将承担由此引起的一切法律责任。</li>

					<li class="subTitle">2、用户责任</li>

					<li class="subContent1">2.1用户通过黄金管家购买实物黄金的资金来源合法，且属于个人完全可支配财产，购买行为需遵守本须知的相关规定。</li>
					<li class="subContent1">2.2用户通过黄金管家将其账户内的现货黄金兑换为实物黄金兑换时，需遵守本须知的相关规定。</li>

					<li class="subTitle">3、实物黄金购买与兑换须知</li>

					<li class="subContent1">3.1黄金管家有权根据实物黄金产品库存及订单情况，规定在特定时间实物黄金产品的出售或可兑换限额。</li>
					<li class="subContent1">3.2用户在黄金管家所购买的现货黄金或用户黄金管家账户内的现货黄金重量小于黄金管家所销售的实物黄金产品重量时，用户无法完成将现货黄金兑换为实物黄金的操作；但用户可以通过申请兑换实物黄金操作，并按黄金管家当时展示的金价支付差额与管理费用，以完成兑换实物黄金产品的操作。</li>
					<li class="subContent1">3.3用户在购买或兑换实物黄金交易完成后，因原料环节、生产环节、物流环节或其他非黄金管家主观原因导致用户无法按网站声明的规定时间收到实物黄金产品的，黄金管家不承担相关责任。</li>
					<li class="subContent1">3.4黄金管家所有实物黄金产品通过网站规定的方式发送至您的手中，包括但不限于快递、普通邮寄、挂号信等，具体请详见本须知第4条。</li>
					<li class="subContent1">3.5黄金管家所有实物黄金产品，非产品质量（成色、克重）问题的，一经签收不接受无偿退货。</li>
					<li class="subContent1">3.6黄金管家有“支付时间”的设定，按是否超出支付时间分以下情况：</li>
					<li class="thirdTitle">3.6.1用户下订单后，若在支付时间内完成支付的，无论黄金价格如何波动，黄金管家将按照订单的约定价格完成交易；</li>
					<li class="thirdTitle">3.6.2用户下订单后，若超出了支付时间，且用户是用其账户余额或现货黄金进行兑换并进行支付或部分支付的，那么黄金管家将视此为无效操作，资金和现货黄金重量将回到用户的资金账户和现货黄金账户。</li>

					<li class="subTitle">4、物流运输及验货签收须知</li>
					<li class="subContent1">4.1用户成功交易的订单，黄金管家会在交易成功后5个工作日内发货。</li>
					<li class="subContent1">4.2黄金管家所有实物黄金产品的发送均向保险公司投保，以保障用户的财产安全；</li>
					<li class="subContent1">4.3用户收货时请检查包装是否有损坏，且务必在快递员在场的情况下开箱确认后签收。</li>
					<li class="subContent1">4.4用户知晓并理解在快递签收单上签字确认即被视为用户已认为产品数量准确、产品外观无损。家人、门卫、前台等的签收行为将视为用户本人签收。</li>
					<li class="subContent1">4.5若快递员不同意先确认货品后签收的，建议用户在签字时将快递单据留下，先开箱验货无误后再将快递单还给快递员；若货品有损，则请快递员将签字划去，要求拒收。</li>
					<li class="subContent1">4.6用户如遇到产品在发送过程中丢失或掉包的情形，请留存好相关证据，并在第一时间告知黄金管家客服人员。如在产品寄出后10天内黄金管家未收到用户的反馈信息，则默认为用户已收到所购买的实物黄金产品并放弃一切追诉的权利。</li>

					<li class="subTitle">5、消费发票</li>
					<li class="subContent1">黄金管家在用户购买或兑换实物黄金时提供消费发票，且仅对实际消费部分提供发票，发票金额以用户实际购买或兑换时黄金管家展示的黄金价格为依据。用户的消费发票将通过挂号信的形式进行邮寄送达。</li>
				</ul>
			</div>
		</div>
	</div>
</template>
<script>
import headTop from '../../components/header/head.vue';
	export default {
		data() {
			return {
				address:null,
				physicalId:null,
				count:null
			}
		},
		created(){
			this.address=this.$route.query.address;
			this.physicalId=this.$route.query.physicalId;
			this.count=this.$route.query.count;
		},
		mounted(){
			
		},
		components: {
			headTop
		}
	}
</script>
<style scoped>
    li{
    	list-style: none;
    }
	.content{
		margin-top:0.88rem;
		background-color:#fff;
		padding:0 .32rem;
		color:#666666;
		font-size:.28rem;
		padding-bottom:.8rem;
	}
	p.title{
		height:1.28rem;
		line-height: 1.28rem;
		text-align: center;
		font-size:.42rem;
		position: relative;
		color:#000000;
		font-weight: bold;
	}
	.start{
		margin-top:0.55rem;
	}
	.start p{
		text-indent: .48rem;
	}
	.subContent1{
		line-height:.5rem;
		margin-bottom:.49rem;
	}
	.content .subTitle{
		height:.98rem;
		color:#000000;
		font-weight: bold;
	}
	.thirdTitle{
		line-height:.48rem;
		text-indent:.55rem;
		margin-bottom:.49rem;
	}
	.middLine{
		position:absolute;
		width:.46rem;
		height:.05rem;
		background-color:#EDA835;
		top:1.3rem;
		left:50%;
		margin-left:-.23rem;
	}
</style>