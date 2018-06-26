<template>
	<div class="addAddress">
		<head-top :headTitle='title'>
			<img slot='head_goback' src='../../../images/back.png' class="head_goback" @click="$router.go(-1)">
		</head-top>
		<section class="name_tel_addr" style="margin-top: .88rem;">
			<input type="text" name="realName" placeholder="请输入您的真实姓名" v-model="realName" maxlength="15" id="name">
			<img :src="delImg" @click="del('n')" v-show="is_1">
		</section>
		<section class="name_tel_addr">
			<input type="number" name="telNum" placeholder="请输入11位手机号码" pattern="[0-9]*" v-model="telNum" maxlength="11" id="tel">
			<img :src="delImg" @click="del('t')" v-show="is_2">
			<img :src="right" v-show="rightShow" style="margin-right: .2rem;">
		</section>
		<section class="name_tel_addr last" style="height: 1.6rem">
			<textarea name="addr" placeholder="请输入详细地址" v-model="addr" maxlength="50" id="area">
			</textarea>
		</section>
		<div class="stor"><span class="storAdd" :class="stor?'isStor':'noStor'" @click="baocun()">保存</span></div>
	</div>
</template>
<script type="text/javascript">
	import headTop from "@/components/header/head"
	import	delImg from '@/images/delImg.png'
	import	right from '@/images/right.png'

	import { addAddress, putAddress, putDefault } from '@/service/getData.js'
	import { getStore } from '@/config/mUtils.js'
	import { mapState,mapMutations } from 'vuex'
	export default{
		data(){
			return {
				delImg: delImg,//删除图片
				 right: right,//对号
			  realName: '',//真实姓名
			    telNum: '',//电话号
			      is_1: 0,//删除变量1
			      is_2: 0,//删除变量2
			 rightShow: 0,
			      addr: '',
			      stor: 0,//底部保存地址开关
			     title: '添加地址',
			 addressId: null//修改地址的Id

			}
		},
		created(){
			if(this.$route.query.modify=='address'){
				this.title='修改地址'
				this.modify()
			}
		},
		mounted(){
			
		},
		watch:{
			realName: function(val){
				val!=''?this.is_1=1:this.is_1=0
				val!=''&&this.rightShow==1&&this.addr!=''?this.stor=1:this.stor=0
			},
			telNum: function(val){
				val!=''?this.is_2=1:this.is_2=0;
				let reg = /^(0|86|17951)?(13[0-9]|15[0-9]|17[0-9]|18[0-9]|14[0-9]|19[0-9])[0-9]{8}$/;
				if(val.match(reg)){
					this.rightShow = 1;
				}else if(this.telNum ==''){
					this.rightShow = 0
				}else{
					this.rightShow = 0
				};
				this.realName!=''&&this.rightShow==1&&this.addr!=''?this.stor=1:this.stor=0
			},
			addr: function(val){
				val!=''&&this.rightShow==1&&this.realName!=''?this.stor=1:this.stor=0
			}
		},
		computed:{
            ...mapState([
            	'updateAddress'
            ])
		},
		methods:{
			...mapMutations([
                'RECORD_ADDRESS'
            ]),
			del: function(val){
				return val=='n'?this.realName='':this.telNum=''
			},
			//保存地址
			async baocun(){
				if(this.$route.query.from){
					var from=this.$route.query.from;
					var that=this;
					if(from==1){ //如果当前是提金业务，需要保存提金标志from 1
						if(this.title=='添加地址' && this.stor){
							const res_1 = await addAddress(this.realName, this.telNum, this.addr)
							if(res_1.code==100){
								//设置默认地址
								this.putDefault(res_1.content)
							}
						}
						if(this.title=='修改地址' && this.stor){
							const res_2 = await putAddress(this.addressId, this.realName, this.telNum, this.addr)
							res_2.code==100?this.$router.push({path:"/fillInOrder",query:{from:1}}):''
						}
						return;
					}
					if(from==2){ //如果当前是存金业务，需要保存存金标志from 2
						let address = {
								contact: this.realName,
								address: this.addr,
							  telephone: this.telNum
						};
						this.RECORD_ADDRESS(address)
						if(this.title=='添加地址' && this.stor){
							const res_1 = await addAddress(this.realName, this.telNum, this.addr)
							if(res_1.code==100){
								//设置默认地址
								this.putDefault(res_1.content)
							}
						}
						if(this.title=='修改地址' && this.stor){
							const res_2 = await putAddress(this.addressId, this.realName, this.telNum, this.addr)
							res_2.code==100?this.$router.push({path:"/storAddress"}):''
						}
						return;
					}
					if(from==3){ //如果当前是存金修改订单业务，需要保存存金标志from 3
						let address = {
								contact: this.realName,
								address: this.addr,
							  telephone: this.telNum
						};
						this.RECORD_ADDRESS(address)
						if(this.title=='添加地址' && this.stor){
							const res_1 = await addAddress(this.realName, this.telNum, this.addr)
							if(res_1.code==100){
								//设置默认地址
								this.putDefault(res_1.content)
							}
						}
						if(this.title=='修改地址' && this.stor){
							const res_2 = await putAddress(this.addressId, this.realName, this.telNum, this.addr)
							res_2.code==100?this.$router.push({path:"/modifiRecycleOrder",query:{from: 3}}):''
						}
						return;
					}
				}
				if(this.title=='添加地址' && this.stor){
					const res_1 = await addAddress(this.realName, this.telNum, this.addr)
					if(res_1.code==100){
						//设置默认地址
						this.putDefault(res_1.content)
					}
				}
				if(this.title=='修改地址' && this.stor){
					const res_2 = await putAddress(this.addressId, this.realName, this.telNum, this.addr)
					res_2.code==100?this.$router.push("/personHomepage/address"):''
				}
			},
			//设置默认地址
			async putDefault(val){
				let res = await putDefault(val)
				if(res.code==100){
					if(this.$route.query.from==1){
						this.$router.push({path:"/fillInOrder",query:{from:1}})
						return;
					}
					if(this.$route.query.from==2){
						this.$router.push({path:"/storAddress",query:{from:2}})
						return;
					}
					if(this.$route.query.from==3){
						this.$router.push({path:"/modifiRecycleOrder",query:{from:3}})
						return;
					}
					this.$router.push("/personHomepage/address")
				}
			},
			//需要修改的地址渲染页面
			modify(){
				let a = this.updateAddress;
				this.realName = a.contact
				this.telNum = a.telephone
				this.addr = a.address
				this.addressId = a.id
			},
		},
		components:{
			headTop: headTop
		}
	}
</script>
<style type="text/css" scoped>
*{
	margin: 0;
	padding: 0;
	box-sizing: border-box;
}
.addAddress{
	width: 100%;
	position: absolute;
	top: 0;
	z-index: 12;
	background-color: #f5f5f5;
	min-height: 100vh;
}
.addAddress>.name_tel_addr{
	width: 100%;
	height: 1.1rem;
	background-color: #fff;
	padding: 0 .3rem 0 .3rem;
	position: relative;
}
.addAddress>.name_tel_addr>input{
	margin-top: .3rem;
	width: 80%;
	height: .5rem;
	border: none;
	outline: none;
	font-size: .3rem;
	float: left;
	margin-bottom: .2rem;
}
.addAddress>.name_tel_addr>textarea{
	margin-top: .3rem;
	width: 100%;
	height: 1rem;
	border: none;
	outline: none;
	background: transparent;
	resize: none;
	font-size: .3rem;
    color: #000;
    display: inline-block;
    font-family: 'Microsoft Yahei';
}
@media(-webkit-min-device-pixel-ratio:1.5),(min-device-pixel-ratio:1.5),(-o-min-device-pixel-ratio:1.5){
	.addAddress>.name_tel_addr:after{
		content: '';
		display: block;
		width: 100%;
		border-bottom: 1px solid #eee;
		-webkit-transform: scaleY(0.7);
		-o-transform: scaleY(0.7);
		-moz-transform: scaleY(0.7);
		transform:scaleY(0.7);
		float: left;
	}
}
@media(-webkit-min-device-pixel-ratio:2),(min-device-pixel-ratio:2)(-o-min-device-pixel-ratio:1.5){
	.addAddress>.name_tel_addr:after{
		content: '';
		display: block;
		width: 100%;
		border-bottom: 1px solid #eee;
		-webkit-transform: scaleY(0.5);
		-o-transform: scaleY(0.5);
		-moz-transform: scaleY(0.5);
		transform:scaleY(0.5);
		float: left;
	}
}
.addAddress>.name_tel_addr.last:after{
	border: none;
}
.addAddress>.name_tel_addr>img{
	width: .3rem;
	float: right;
	margin-top: .4rem;
}
.stor{
	width: 100%;
	text-align: center;
	margin-top: 7rem;
}
.storAdd{
	display: inline-block;
	bottom: 0;
	width: 94%;
	height: .95rem;
	text-align: center;
	line-height: .95rem;
	color: #fff;
	font-size: .35rem;
	border-radius: 5px;
}
.storAdd:active{
 background-color: #eda835;
}
.isStor{
	background-color: #f2b643;
}
.noStor{
	background-color: #f3d59c;
}
</style>