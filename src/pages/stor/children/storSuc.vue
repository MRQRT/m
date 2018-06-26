<template>
	<div class="storSuc">
		<head-top headTitle='存金预约成功'>
			<img slot='head_goback' src='../../../images/back.png' class="head_goback" @click="$router.go(-3)">
			<p slot=""></p>
		</head-top>
		<div class="storSuc_img">
			<h5 class="storSuc_title">存金预约成功</h5>
		</div>
		<div class="stor_order">
			<p><span>订单编号</span><span>k877468000017865</span></p>
			<p><span>类型</span><span>金条</span></p>
			<p><span>件数</span><span>2件</span></p>
			<p><span>克重</span><span>30克</span></p>
			<p><span>损耗</span><span>0%</span></p>
			<p><span>预约时间</span><span>2017-05-28 09:37</span></p>
		</div>
		<div class="check_mine_order">
			<p>查看我的订单</p>
		</div>
		<h5 class="mine_favorite"><span>猜你喜欢</span><img :src="rightJian"></h5>
		<div class="dingtou">
			<div class="dingtou_list">
				<span class="already">已加入</span>
				<img :src="urls3">
				<h4>宝宝快乐成长</h4>
				<p>黄金定投 做最长情的陪伴</p>
			</div>
		</div>
	</div>
</template>
<script type="text/javascript">
	import headTop from '@/components/header/head.vue'

	import rightJian from '@/images/right_jian.png'
	import c from '@/images/dingtou.png'


	export default{
		data(){
			return{
				rightJian: rightJian,
				    urls3: c,
			}
		},
		components:{
			headTop: headTop
		}
	}
</script>
<style type="text/css">
*{
	margin: 0;
	padding: 0;
	box-sizing: border-box;
}
.storSuc{
	width: 100%;
	height: 12.94rem;
	background-color: #f5f5f5;
	position: absolute;
	z-index: 200;
}
.storSuc>.storSuc_img{
	margin-top: .88rem;
	width: 100%;
	height: 3.6rem;
	background-color: #fff;
	background-image: url(../../../images/suc.png);
	background-repeat: no-repeat;
	background-position: center;
	background-size: 1.2rem;
	position: relative;
}
.storSuc>.storSuc_img>h5{
	width: 100%;
	text-align: center;
	font-size: .35rem;
	text-align: center;
	position: absolute;
	bottom: .3rem;
}
.stor_order{
	width: 100%;
	background-color: #fff;
}
.stor_order>p{
	height: .5rem;
	line-height: .5rem;
	font-size: .27rem;
	padding: 0 .3rem 0 .3rem;
}
.stor_order>p>span:first-child{
	float: left;
}
.stor_order>p>span:nth-child(2){
	float: right;
	color: #666666;
}
.check_mine_order{
	width: 100%;
	height: 2rem;
	background-color: #fff;
	display: flex;
    display: -webkit-flex;
    display: -moz-flex;
    display: -o-flex;
    justify-content: center;
    -moz-justify-content: center;
    -o-justify-content: center;
    -webkit-justify-content: center;
  	align-items: center;
  	-webkit-align-items: center;
  	-moz-align-items: center;
  	-o-align-items: center;
}
.check_mine_order>p{
	width: 6.9rem;
	height: .88rem;
	line-height: .88rem;
	background-color: #f2b643;
	font-size: .35rem;
	color: #fff;
	border-radius: .05rem;
	-webkit-border-radius: .05rem;
	-moz-border-radius: .05rem;
	-o-border-radius: .05rem;
	text-align: center;
}
.mine_favorite{
	height: 1rem;
	line-height: 1rem;
	background-color: #fff;
	padding: 0 .3rem 0 .3rem;
}
.mine_favorite>span{
	float: left;
}
.mine_favorite>img{
	width: .15rem;
	float: right;
	margin-top: .3rem;
}
.dingtou{
	width: 100%;
	background-color: #fff;
}
.dingtou_list{
	height: 3.8rem;
	padding-top: .28rem;
	padding-left: .3rem;
	padding-right: .3rem;
	position: relative;
}
.list_last{
	height: 4rem;
	background-color: #fff;
}
.dingtou_list h4{
	height: .65rem;
	line-height: .75rem;
	font-size: .3rem;
}
.dingtou_list p{
	font-size: .25rem;
	color: #9a9998;
}
.dingtou_list>.already{
	display: inline-block;
	font-size: .25rem;
	color: #fff;
	width: 1.2rem;
	text-align: center;
	height: .34rem;
	background-image: url(../../../images/already.png);
	background-size: 100%;
	position: absolute;
	top: .19rem;
}
.dingtou_list>img{
	width: 100%;
}
</style>