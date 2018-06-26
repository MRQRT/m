<template>
	<div class="address">
		<head-top headTitle='我的地址'>
			<img slot='head_goback' src='../../../images/back.png' class="head_goback" @click="backWard">
		</head-top>
		<div class="address_list" v-show='hasAddress'>
			<section class="addressDe" v-for="(item,index) in addre">
				<p @click="selectAdd(item)"><span>{{item.contact}}</span><span>{{item.telephone}}</span></p>
				<div @click="selectAdd(item)">{{item.address}}</div>
				<p>
					<input type="radio"  v-model="picked" :id="index" :value="index" @click="putDefault(item,item.id)">
					<label :for="index" @click="putDefault(item,item.id)">设为默认</label>
					<span class="del" @click="delAddress(item.id)">
						<img :src="del">
						<span>删除</span>
					</span>
					<span class="compile" @click="putAddress(item)">
						<img :src="compile">
						<span>编辑</span>
					</span>
				</p>
				<textarea :value="item" style="display: none"></textarea>
			</section>
		</div>
		<div class="empty" v-show='empty'>
			<img src="../../../images/emptA.png">
			<p>您的家在哪里？赶紧告诉我吧！</p>
			<my-button @click.native="addNewAddr" class="toAdd" buttonText="添加地址">
			</my-button>
		</div>
		<a class="add" @click="addNewAddr" v-show='hasAddress'><img :src="add3">新建地址</a>
	</div>
</template>
<script type="text/javascript">
	import headTop from "@/components/header/head"
	import { Toast } from 'mint-ui'
	import { queryAddress, putDefault, delAddress, putAddress } from '@/service/getData.js'
	import { setStore,getStore,getRem } from '@/config/mUtils.js'
	import myButton from '@/components/myButton/myButton.vue'
	import { mapState, mapMutations } from 'vuex'

	import del from "@/images/del.png"
	import compile from "@/images/compile.png"
	import add3 from "@/images/add3.png"
	import emptA from '@/images/emptA.png'

	export default{
		data(){
			return {
				picked: null,//和radio的值匹配，所匹配的值就是那个默认值
				   del: del,//删除
			   compile: compile,//编辑
				  add3: add3,
			     addre: null,//地址
				 empty: false, //无地址
				 hasAddress:false  //有地址
			}
		},
		created(){
			var from=this.$route.query.from;
		},
		mounted(){
			this.getAddress();
			const continer = document.getElementsByClassName('address')[0];
			continer.style.minHeight=(document.documentElement.clientHeight)+'px';
		},
		watch: {
			$route(to,from){
				this.watchRouter(to,from)
			},
			addre(val){
				(val==null || val.length=='0')?this.empty=1:this.empty=0
			}
		},
		computed:{
			...mapState([
				'address','fillExtractInfo'
			])
		},
		methods:{
			...mapMutations([
                'RECORD_ADDRESS','RECORD_UPDATEADDRESS'
            ]),
			//点击返回按钮
			backWard(){
				var from=this.$route.query.from;
				//从填写提金订单处跳转过来的，则跳转回填写提金订单
				if(this.fillExtractInfo){
					this.$router.push({
						path: '/fillInOrder',
					});
				}else if(from==2){//从存金订单提交页面跳转过来，跳回到存金订单提交的页面
					this.$router.push({
						path: '/storAddress',
						query: {
							from: 2
						}
					});
				}else if(from==3){//从修改存金订单提交页面跳转过来，跳回到修改存金订单的页面
					//获取用户的默认地址
					this.$router.push({
						path: '/modifiRecycleOrder',
						query: {
							from: 3
						}
					});
				}else{
					this.$router.push('/mine');
				}
			},
			watchRouter(to, from){
			},
			//获取用户地址
			async getAddress(){
				let res = await queryAddress()
				this.picked=null
				if(res.code==100){
					this.addre = res.content
					if(res.content.length>0){
						this.hasAddress=true
						this.empty=false
						//遍历地址是否默认,如果没有默认地址，设置第一个地址为默认地址
						for(var i=0; i<res.content.length;i++){
							if(res.content[i].isDefault==1){
								this.picked=i
								break;
							}
						}
						//如果add的值为0，说明没有默认地址，设置第一个地址为默认地址
						if(this.picked==null){
							this.picked=0
							await putDefault(res.content[0].id)
						}
					}else{
						this.empty=true
						this.hasAddress=false
					}
				}
			},
			//设置默认地址设置默认地址
			async putDefault(item,val){
				let res = await putDefault(val)
				this.RECORD_ADDRESS(item)
			},
			//删除地址
			async delAddress(val){
				let res = await delAddress(val)
				if(res.code==100){
					this.getAddress();
				}
			},
			//编辑地址
			putAddress(val){
				this.RECORD_UPDATEADDRESS(val)
				var from=this.$route.query.from;
				if(from=='1') { //如果是由提金业务跳转过来，则保存参数from1
					this.$router.push({path:'addAddress',  query: { modify: 'address',from:1}})
				}else if(from=='2'){ //如果是由存金业务跳转过来，则保存参数from2
					this.$router.push({path:'addAddress',  query: { modify: 'address',from:2}})
				}else if(from=='3') {//如果是从修改订单业务跳转过来的，则保存参数from3
					this.$router.push({path:'addAddress',  query: { modify: 'address',from:3}})
				}else{
					this.$router.push({path:'addAddress',  query: { modify: 'address'}})
				}
			},
			//地址选择
			selectAdd(value){
				this.RECORD_ADDRESS(value);
				var from=this.$route.query.from;
				if(!from) return;
				if(from=='1'){
					var params=this.$route.query;
					params.address=value
					this.$router.push({
						path:'/fillInOrder',
						query: {
							from: 1,
							address:value
						}
					})
				}else if(from=='2'){
					this.$router.push({//从存金订单提交页面跳转过来
						path:'/storAddress',
						query: {
							from: 2
						}
					})
				}else if(from=='3'){//从修改存金订单页面跳转过来
					this.$router.push({
						path:'/modifiRecycleOrder',
						query: {
							from: 3
						}
					})
				}
			},
			//点击添加新地址
			addNewAddr(){
				var from=this.$route.query.from;
				if(from=='1') { //如果是由提金业务跳转过来，则保存参数from:1  如果是由存金业务跳转过来，则保存参数from:2
					this.$router.push({path:'/personHomepage/addAddress',query:{'from':1}})
				}else if(from=='2'){
					this.$router.push({path:'/personHomepage/addAddress',query:{'from':2}})
				}else if(from=='3'){
					this.$router.push({path:'/personHomepage/addAddress',query:{'from':3}})
				}else{
					this.$router.push({path:'/personHomepage/addAddress'})
				}
			},
		},
		components:{
			headTop: headTop,
			myButton
		}
	}
</script>
<style type="text/css" scoped>
*{
	margin: 0;
	padding: 0;
	box-sizing: border-box;
}
.address{
	width: 100%;
	position: absolute;
	top: 0;
	z-index: 11;
	background-color: #f5f5f5;
}
.address_list{
	width: 100%;
	margin-top: .88rem;
	padding-bottom: 1rem;
	background-color: #f5f5f5;
}
.address_list>.addressDe{
	background-color: #fff;
	margin-top: .2rem;
	min-height: 2.1rem;
	padding: 0 .3rem 0 .3rem;
}
.address_list>.addressDe>p{
	height: .7rem;
	line-height: .8rem;
	font-size: .3rem;
}
.address_list>.addressDe>p:first-child{
	height: .7rem;
	line-height: .8rem;
	font-size: .3rem;
}
.address_list>.addressDe>div:nth-child(2){
	word-break: break-all;
	min-height: .7rem;
	line-height: .4rem;
	font-size: .3rem;
	padding-top: .15rem;
}
.address_list>.addressDe>p:nth-child(3){
	height: .75rem;
	line-height: .75rem;
	font-size: .3rem;
}
.address_list>.addressDe>p:first-child span{
	margin-right: .4rem;
}
@media(-webkit-min-device-pixel-ratio:1.5),(min-device-pixel-ratio:1.5),(-o-min-device-pixel-ratio:1.5){
	.address_list>.addressDe>div:nth-child(2):after{
		content: '';
		display: inline-block;
		width: 100%;
		border-bottom: 1px solid #eeeeee;
		-webkit-transform: scaleY(0.7);
		-o-transform: scaleY(0.7);
		-moz-transform: scaleY(0.7);
		transform:scaleY(0.7);
	}
}
@media(-webkit-min-device-pixel-ratio:2),(min-device-pixel-ratio:2)(-o-min-device-pixel-ratio:1.5){
	.address_list>.addressDe>div:nth-child(2):after{
		content: '';
		display: inline-block;
		width: 100%;
		border-bottom: 1px solid #eeeeee;
		-webkit-transform: scaleY(0.5);
		-o-transform: scaleY(0.5);
		-moz-transform: scaleY(0.5);
		transform:scaleY(0.5);
	}
}
.add{
	position: fixed;
	bottom: 0;
	width: 100%;
	height: .95rem;
	text-align: center;
	line-height: .95rem;
	color: #fff;
	font-size: .3rem;
	background-color: #f2b643;
}
.add:active{
	background-color: #eda835;
}
.add>img{
	width: .45rem;
	height: .43rem;
	vertical-align: middle;
	margin-bottom: .1rem;
	margin-right: .1rem;
}
.add>span{
	font-size: .5rem;
	margin-right: .1rem;
}
.address_list>.addressDe>p:nth-child(3)>input{
	width: .28rem;
	height: .28rem;
	vertical-align: middle;
	opacity: 1;
	position: relative;
	margin-right: .1rem;
}
.address_list>.addressDe>p:nth-child(3)>input[type=radio]:before {
	content: '';
    display: inline-block;
    width: .34rem;
    height: .35rem;
    background: url("../../../images/reading.png") no-repeat;
    background-size: 100%;
    border: none;
    position: absolute;
    top: -3px;
    left: -2px;
    background-color: #fff;
}
.address_list>.addressDe>p:nth-child(3)>input[type=radio]:checked:before{
    background: url("../../../images/readed.png") no-repeat;
    background-size: 100%;
    border: none;
}
.address_list>.addressDe>p:nth-child(3)>.compile{
	display: inline-block;
	float: right;
	margin-right: .25rem;
}
.address_list>.addressDe>p:nth-child(3)>.compile>img{
	width: .35rem;
	height: .31rem;
}
.address_list>.addressDe>p:nth-child(3)>.compile>span{
	font-size: .26rem;
	color: #999999;
}
.address_list>.addressDe>p:nth-child(3)>.del{
	display: inline-block;
	float: right;
}
.address_list>.addressDe>p:nth-child(3)>.del>img{
	width: .35rem;
	height: .32rem;
	vertical-align: middle;
	margin-bottom: 3px;
}
.address_list>.addressDe>p:nth-child(3)>.del>span{
	font-size: .26rem;
	color: #999999;
}
.address_list>.addressDe>p:nth-child(3)>label{
	font-size: .26rem;
}
.empty{
	width: 100%;
	height:100vh;
	text-align: center;
	padding-top:2.98rem;
}
.empty img{
	width:3.1rem;
	height:2.38rem;
}
.empty>p{
	padding-top:.8rem;
	font-size: .28rem;
	color: #666666;
}
.myBtn.toAdd{
	width:2.2rem;
	height:.7rem;
	background-color: #f2b643;
	line-height:.7rem;
	text-align:center;
	font-size:.28rem;
	margin-top:.4rem;
	color:#fff;
	-webkit-border-radius:2px;
	-o-border-radius:2px;
	-moz-border-radius:2px;
	border-radius:2px;
	position: relative;
}
</style>
