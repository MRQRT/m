<template>
	<div class="writeData">
		<head-top headTitle='填写资料'>
			<img slot='head_goback' src='../../../images/back.png' class="head_goback" @click="back()">
		</head-top>
		<div @click="toAddress" class="get_address">
			<span>取金地址</span>
			<span></span>
			<div class="address">
				<p align="right" id="p" style="padding-left:.5rem;"><span id="set" style="display: inline-block;">{{name}}</span>&nbsp;&nbsp;&nbsp;&nbsp;<span>{{comTel}}</span></p>
				<p align="right" style="overflow:hidden;text-overflow:ellipsis;white-space: nowrap;padding-left:.5rem;padding-top: .13rem">{{detailAddress}}</p>
			</div>
		</div>
		<div class="get_time"  @click="openPicker">
			<span>取金时间</span>
			<span></span>
			<span>{{pickerValue2}}</span>
		</div>
		<div class="writeData_confirm">
			<a id="click_btn" @click="confirm_order">确定</a>
		</div>
		<mt-datetime-picker ref="picker" type="date" v-model="pickerValue" :startDate="startDate" :endDate="endDate"></mt-datetime-picker>
	</div>
</template>
<script type="text/javascript">
	import headTop from '@/components/header/head'
	import rightJian from '@/images/right_jian.png'
	import {formatDate} from "@/config/mUtils"

	import { DatetimePicker,Toast } from 'mint-ui'

	import { queryAddress,addRecycleOrder } from '@/service/getData.js'
	import { mapState } from 'vuex'
	export default{
		data(){
			return{
				rightJian: rightJian,
			  pickerValue: null,//时间选取框声明的值
			 pickerValue2: null,//经过格式化时间的值
			 		 name: null,//取金姓名
			 	 telPhone: null,//取金电话
		    detailAddress: null,//取金地址
			 	   canshu: null,//上一页带过来的参数
			 	noAddress: null,//是否有地址的标志，true表示没有地址，false表示有地址
			  btnCtroller: true,//订单频繁提交操作控制
			}
		},
		mounted(){
			this.queryAddress()//获取用户默认地址
		},
		watch: {
			//监听时间选取框的值，并将转换格式后的时间绑定到'取金时间'上
			pickerValue: function(){
				this.pickerValue2 = formatDate(new Date(this.pickerValue), 'yyyy-M-d')
			}
		},
		computed: {
			...mapState([
				'address','recycleParams'
			]),
			//开始时间是t+1日
			startDate(){
				let dateAdd = new Date().getTime()+(24*60*60*1000);
				return new Date(dateAdd)
			},
			//结束时间为(t+1)加一个月
			endDate(){
				let monthAdd = new Date().getTime()+(24*60*60*1000*31);
				return new Date(monthAdd)
			},
			comTel(){
				let tp='';
				if(this.telPhone)tp=this.telPhone.substr(0,3)+'****'+this.telPhone.substr(7,10)
				return tp
			}
		},
		methods: {
			//时间选取框
			openPicker() {
        		this.$refs.picker.open()
      		},
      		//获取用户的地址
      		async queryAddress(){
      			const res = await queryAddress()
      			if(res.code==100){
      				//用户地址为空，去设置
      				if(res.content.length==0){
      					this.name='去设置'
      					this.noAddress=true
      					document.querySelector('#set').style.color='red'
      					document.querySelector('#set').style.fontSize=.28+'rem'
      					document.querySelector('#set').style.paddingTop=.25+'rem'
      				//再判断vuex中是否有地址，如果有，显示
      				}else if(this.address){
      					this.noAddress=false
      					this.name=this.address.contact
      					this.telPhone=this.address.telephone
      					this.detailAddress=this.address.address
      				//用户地址不为空，vuex中没有地址，取用户默认地址
      				}else{
      					this.noAddress=false
      					for(let i=0;i<res.content.length;i++){
      						if(res.content[i].isDefault==1){
      							this.name=res.content[i].contact
      							this.telPhone=res.content[i].telephone
      							this.detailAddress=res.content[i].address
      						}
      					}
      				}
      			}
      		},
      		//去地址页
      		toAddress(){
      			if(this.noAddress){//没有地址时跳转添加地址
                    this.$router.push({
                    	 path:'/personHomepage/addAddress',
                    	query:{
                    		from:2
                    	}
                    })
                }else{ //有地址时跳转我的地址
      				this.$router.push({
      					 path:'/personHomepage/address',
      				    query:{
      						from: 2,//参数2表示是从存金业务类型跳到我的地址页的
      					}
      				})
      			}
      		},
      		//提交订单
      		async confirm_order(){
      			if(this.name=='去设置'){
      				Toast({
      					message: '先去选择地址',
      					position: 'middle',
      					duration: 3000,
      				})
      			}else{
      				if(this.btnCtroller){
      					this.btnCtroller=false
	      				// console.log(this.recycleParams.img.join());
		      			const res = await addRecycleOrder(this.recycleParams.params.id,this.name,this.telPhone,this.detailAddress,this.pickerValue2+' '+'00:00:00',this.recycleParams.params.piece,this.recycleParams.params.gram,this.recycleParams.params.handIDphotoUrl,this.recycleParams.img.join());
		      			if(res.code==100){
		      				this.$router.push({
		      					path:'/storResult',
		      					query:res.content
		      				})
		      			}
      				}else{
      					Toast('频繁操作')
      				}
      			}
      		},
      		//返回
      		back(){
      			this.$router.push('/stor/uploadPho')
      		}
		},
		components: {
			headTop,
		}
	}
</script>
<style type="text/css" scoped>
*{
	margin: 0;
	padding: 0;
	box-sizing: border-box;
}
.writeData{
	width: 100%;
	height: 12.94rem;
	background-color: #f5f5f5;
	position: absolute;
	top: 0;
	z-index: 200;
}
.get_address{
	width: 100%;
	height: 1.4rem;
	background-color: #fff;
	margin-top: .88rem;
	padding: 0 0.3rem 0 .3rem;
}
.get_address>span:first-child{
	display: inline-block;
	font-size: .3rem;
	height: 1.4rem;
	line-height: 1.4rem;
	float: left;
}
.get_address>span:nth-child(2){
	float: right;
	display: inline-block;
	width: .7rem;
	height: 1.4rem;
	background-image: url(../../../images/right_jian.png);
	background-repeat: no-repeat;
	background-size: .15rem;
	background-position: right;
}
.address{
	padding-top: .25rem;
}
.get_time{
	width: 100%;
	height: 1.4rem;
	background-color: #fff;
	padding: 0 0 0 .3rem;
}
.get_time>span:first-child{
	display: inline-block;
	font-size: .3rem;
	height: 1.4rem;
	line-height: 1.4rem;
	float: left;
}
.get_time>span:nth-child(3){
	height: 1.4rem;
	line-height: 1.4rem;
	display: inline-block;
	font-size: .3rem;
	float: right;
}
.get_time>span:nth-child(2){
	float: right;
	display: inline-block;
	width: .7rem;
	height: 1.4rem;
	background-image: url(../../../images/right_jian.png);
	background-repeat: no-repeat;
	background-size: .15rem;
	background-position: center;
}
.writeData_confirm{
	width: 100%;
	height: 4rem;
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
.writeData_confirm>a{
	display: inline-block;
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
@media(-webkit-min-device-pixel-ratio:1.5),(min-device-pixel-ratio:1.5),(-o-min-device-pixel-ratio:1.5){
	.get_address:after{
		content: '';
		display: inline-block;
		width: 100%;
		border-bottom: 1px solid #eee;
		-webkit-transform: scaleY(0.7);
		-o-transform: scaleY(0.7);
		-moz-transform: scaleY(0.7);
		transform:scaleY(0.7);
		float: left;
	}
}
@media(-webkit-min-device-pixel-ratio:2),(min-device-pixel-ratio:2)(-o-min-device-pixel-ratio:2){
	.get_address:after{
		content: '';
		display: inline-block;
		width: 100%;
		border-bottom: 1px solid #eee;
		-webkit-transform: scaleY(0.5);
		-o-transform: scaleY(0.5);
		-moz-transform: scaleY(0.5);
		transform:scaleY(0.5);
		float: left;
	}
}
</style>
<style type="text/css">
.mint-datetime-action{
	color: #eda835;
}
</style>