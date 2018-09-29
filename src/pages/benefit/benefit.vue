<template>
	<div class="credit">
		<mt-popup v-model="popupVisible" pop-transition="popup-fade" :closeOnClickModal="false">
			<section class="tips">
				<p class="title">公告</p>
				<div class="article" style="padding-bottom:.2rem;">
					&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;自10月1日起，黄金管家原生金业务下线，9月29日15:00:00后购买活期金将不再产生收益。具体业务调整如下：
				</div>
				<div class="article">
					<span>1.</span><div style="float:left">9月30日23:59:59前账户活期金产生的收益，已自动转入您的活期金账户中，账户内活期金不再产生收益；</div>
				</div>
				<div class="article">
					<span>2.</span> <div style="float:left">9月29日15:00:00后购买活期金将不再产生收益；</div>
				</div>
				<div class="article">
					<span>3.</span> <div style="float:left">实名绑卡赠金在您完成实名绑卡后，正常发放。</div>
				</div>
				<div class="article" style="padding-top:.2rem;">
					&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;由于黄金管家业务调整给您带来的不便，请您谅解， 感谢您对黄金管家的支持，祝您生活愉快。
				</div>
				<div class="button" @click="close">我知道了</div>
			</section>
		</mt-popup>
	</div>
</template>
<script>
import {MessageBox,Popup} from 'mint-ui'
export default{
	data(){
		return {
			ispop:1,
			popupVisible:false,
		}
	},
	mounted(){
		if(localStorage.getItem('pop')){
			this.popupVisible=false;
		}else{
			this.popupVisible=true;
			localStorage.setItem('pop',1);
		}
	},
	watch:{
		
	},
	methods:{
		close(){
			this.popupVisible=false;
		}
	},
}
</script>
<style>
.credit{
	width:100%;
	min-height:100vh;
	background:url(../../images/creditbg.png);
	background-repeat:no-repeat;
	background-size:100%;
}
.tips{
	width:6.7rem;
	height:7rem;
	background-color:#ffffff;
	border-radius: 10px;
	padding-left:.34rem;
	padding-right:.34rem;
	position: relative;
}
.title{
	font-size:.32rem;
	text-align:center;
	height: 1rem;
	line-height: 1.1rem;
	font-weight: bold;
}
.article{
	font-size:.26rem;
	color:#333;
	overflow: hidden;
}
.article div{
	width:94%;
	float:right;
	line-height:.5rem;
}
.article span{
	width:5%;
	float:left;
	padding-top:.1rem;
}
.button{
	height: .9rem;
	line-height: .9rem;
	border-bottom-right-radius: 10px;
    border-bottom-left-radius: 10px;
	position: absolute;
	width:100%;
	color:#EDA835;
	font-size:.32rem;
	text-align:center;
	left:0;
	bottom:0;
}
@media(-webkit-min-device-pixel-ratio:1.5),(min-device-pixel-ratio:1.5),(-o-min-device-pixel-ratio:1.5){
	.button:before{
		content: '';
		width: 100%;
		border-bottom: 1px solid #999;
		-webkit-transform: scaleY(0.7);
		-o-transform: scaleY(0.7);
		-moz-transform: scaleY(0.7);
		transform:scaleY(0.7);
		float: left;
	}
}
@media(-webkit-min-device-pixel-ratio:2),(min-device-pixel-ratio:2),(-o-min-device-pixel-ratio:1.5){
	.button:before{
		content: '';
		width: 100%;
		border-bottom: 1px solid #999;
		-webkit-transform: scaleY(0.5);
		-o-transform: scaleY(0.5);
		-moz-transform: scaleY(0.5);
		transform:scaleY(0.5);
		float: left;
	}
}
</style>
<style>
.mint-popup{
	border-radius:10px;
}
</style>


