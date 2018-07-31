<template>
	<div class="infomationBox">
		<head-top headTitle='提现结果' class="head-top">
			<img slot='head_goback' src='../../images/back.png' class="head_goback" @click="$router.push('/buyGold')">
		</head-top>
		<!--成功失败标志-->
		<div class="buySuccess">
			<div class="symbol">
				<div class="top">
					<p style="color: #EDA835;font-size:.28rem;line-height: .6rem;">提现申请已提交，等待银行处理</p>
					<p style="color: #333333;font-size:.24rem;line-height: .25rem;">提现金额{{pageMsg.amount}}元</p>
					<p style="color: #666666;font-size:.24rem;line-height: .45rem;">{{pageMsg.createTime}}</p>
				</div>
				<div class="bottom">
					<p style="color: #EDA835;font-size:.28rem;line-height: .5rem;">预计到账时间</p>
					<p style="color: #666666;font-size:.24rem;line-height: .45rem;">{{pageMsg.createTime | tran_time}}</p>
				</div>
			</div>
		</div>
		<div style="width:100%;padding:0 .3rem 0 0rem;position:fixed;bottom:1rem;">
			<a class="goldAssets" id="click_btn" @click="$router.push('/balance')">查看现金余额</a>
		</div>
	</div>
</template>
<script>
	import headTop from '@/components/header/head.vue';
	export default {
		data(){
			return {
                pageMsg:{},
			}
		},
        created(){
            this.pageMsg=this.$route.query.msg;
        },
		mounted() {
		},
		computed:{
			result: function(){
                if(this.pageMsg.status==1){
                    return "充值成功"
                }else if(this.pageMsg.status==0){
                    return "充值失败"
                }else{
                    return this.pageMsg.remark
                }
            }
		},
		filters:{
			tran_time(val){
				var date = new Date();
				function formate(val){
					let next = val.setDate(date.getDate()+1);
					return new Date(next)
				}
				var nextDate = formate(date);
				let year = nextDate.getFullYear();
				let month = nextDate.getMonth()+1>9?nextDate.getMonth()+1:'0'+(nextDate.getMonth()+1);
				let day = nextDate.getDate()>9?nextDate.getDate():'0'+nextDate.getDate();
				return year+'-'+month+'-'+day
			}
		},
		methods:{
			
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
		position: relative;
    }

	 @media(-webkit-min-device-pixel-ratio:1.5),(min-device-pixel-ratio:1.5),(-o-min-device-pixel-ratio:1.5){
		.infomationBox:before{
			content: '';
			display: inline-block;
			width: 100%;
			border-bottom: 1px solid #eeeeee;
			-webkit-transform: scaleY(0.7);
			-o-transform: scaleY(0.7);
			-moz-transform: scaleY(0.7);
			transform:scaleY(0.7);
			position: absolute;
			left: 0;
		}
	}
	@media(-webkit-min-device-pixel-ratio:2),(min-device-pixel-ratio:2),(-o-min-device-pixel-ratio:1.5){
		.infomationBox:before{
			content: '';
			display: inline-block;
			width: 100%;
			border-bottom: 1px solid #eeeeee;
			-webkit-transform: scaleY(0.5);
			-o-transform: scaleY(0.5);
			-moz-transform: scaleY(0.5);
			transform:scaleY(0.5);
			position: absolute;
			left: 0;
		}
	}
    .buySuccess .symbol{
    	height:3.3rem;
    	padding-top:.76rem;
    }
    .goldAssets{
    	height:0.92rem;
    	background-color: #F2B643;
    	line-height: 0.92rem;
    	text-align: center;
    	color:#fff;
    	font-size: 0.34rem;
        border-radius: 4px;
        margin-top:.37rem;
		width: 95%;

    }
	.top{
		height: 1.37rem;
		position: relative;
		background-image: url(../../images/right.png);
		background-repeat: no-repeat;
		background-size: .5rem;
		background-position: .18rem 0;
	}
	.top p{
		padding-left: 1rem; 
	}
	.top:before{
		content: '';
		display: inline-block;
		width: 3px;
		height: .8rem;
		background-color: #F2B643;
		position: absolute;
		left: .4rem;
		top: .5rem;
	}
	.bottom{
		height: 1.5rem;
		position: relative;
		padding-top: .4rem;
		background-image: url(../../images/￥.png);
		background-repeat: no-repeat;
		background-size: .5rem;
		background-position: .18rem .6rem;
	}
	.bottom p{
		padding-left: 1rem; 
	}
	.bottom:before{
		content: '';
		display: inline-block;
		width: 3px;
		height: .8rem;
		background-color: #C5C5C5;
		position: absolute;
		left: .4rem;
		top: -.2rem;
	}
</style>