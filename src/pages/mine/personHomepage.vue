<template>
	<div id="personHomepage">
		<head-top headTitle='个人主页'>
			<img slot='head_goback' src='../../images/back.png' class="head_goback" @click="toMine()">
		</head-top>
		<div class="headPho">
			<label class="headPho_content"  for="headImg">
				<span>头像</span>
				<span class="jian_right"></span>
				<input type="file" name="file" id="headImg" v-if="canPhoto" accept="image/*" style="display: none" @change="selectImage">
				<img :src="headImg">
			</label>
		</div>
		<div class="realname" v-show="userInfo?(userInfo.name?1:0):0">
			<section class="realname_content">
				<span>真实姓名</span>
				<span>{{userInfo?(userInfo.name?userInfo.name:''):''}}</span>
			</section>
		</div>
		<div class="loginAccount">
			<section>
				<span>登录账号</span>
				<span>{{userInfo.userName}}</span>
			</section>
		</div>
		<div class="approve" @click="Toast()">
			<router-link :to="realnamed?'':'/personHomepage/authentication'" tag='section'>
				<span>实名认证</span>
				<span class="jian_right"></span>
				<!-- <span class="noApprove isApprove" :class="{'realnamedcolor':comRealnamed=='实名送3mg黄金'}">{{comRealnamed}}</span> -->
			</router-link>
		</div>
		<div class="myAddress">
			<router-link to="/personHomepage/address" tag='section'>
				<span>我的地址</span>
				<span class="jian_right"></span>
			</router-link>
		</div>
		<div class="quit">
			<a @click="quit" id="click_btn">安全退出</a>
		</div>
		<router-view></router-view>
	</div>
</template>
<script type="text/javascript">
import	headTop from '@/components/header/head'
import	defaults from '@/images/defaults.png'
import	{removeCookie, getCookie,bucketName} from '@/config/mUtils'
import	{mapState, mapMutations} from 'vuex'
import	{logout, putAvatar, queryMyProfil,getpolicy,uploadimg } from '@/service/getData.js'
import {Toast, Indicator} from 'mint-ui'

export default{
	data(){
		return{
			headImg: null,
			     is: 1,//通过监听路由控制当前组件是否显示
			    url: '',//上传图片占位符
		  realnamed: null,
		   canPhoto: false,//可以拍照
		    noPhoto: true, //不可以拍照
	   clientHeight: document.documentElement.clientHeight,
		}
	},
	created(){
		if(window.stub){  //查看手机拍照读写权限(安卓手机需要验证)
			window.openPhoto();
			window.close('cancel');
		}else{
			this.canPhoto=true; //苹果手机不需要验证权限
			this.noPhoto=false;
		}
	},
	mounted(){
		this.token ? this.getUserInfo() : '';
	},
	watch:{
		token(){
			this.token ? this.getUserInfo() : '';
		}
	},
	computed: {
		...mapState([
			'userInfo','token'
		]),
		// comRealnamed: function(){
		// 	if(this.userInfo){
		// 		if(this.userInfo.realnamed){
		// 			return '已认证'
		// 		}else{
		// 			return '实名送3mg黄金'
		// 		}
		// 	}
		// }
	},
	methods:{
		...mapMutations([
            'CLEAR_TOKEN','CLEAR_USERINFO','RECORD_USERINFO'
		]),
		//头像选择
		selectImage(e){
			if(this.noPhoto){  //查看手机拍照读写权限
				if(window.backPerInfo){  //查看手机拍照读写权限
					var res=window.backPerInfo();
					if(res=='OK'){
						this.canPhoto=true;
						this.noPhoto=false;
						document.querySelector('#headImg').onchange();
					}else{
						this.canPhoto=false;
						this.noPhoto=true;
						Toast({
							message:'请在应用权限管理中打开“电话或读写手机存储”访问权限!',
							position: 'bottom',
							duration: 3000
						})
						Indicator.close();
						return;
					}
				}
		    }
			if (!e.target.files || !e.target.files[0]){
				Indicator.close();
				return;
			}
			var that=this;
			let item = {
				name: e.target.files[0].name,
				size: e.target.files[0].size,
				file: e.target.files[0],
			}
            let reader = new FileReader();
            reader.readAsDataURL(e.target.files[0]);
            reader.onload =function(evt){
            	that.headImg = evt.target.result;
				that.getpolicy(reader,item)
            }
		},
		//获取上传图片凭证
		async getpolicy(reader,item){
			Indicator.close();
			const res = await getpolicy();
			if(res.code=='000000'){
				this.param_policy=res.data
				this.format(reader,item)//图片处理（压缩或者不压缩）
			}else{
				Indicator.close("上传失败");
				Toast('获取参数失败');
			}
		},
		//图片处理
		format(reader,item){
			const uuidv1 = require('uuid/v1');
			var that = this,
				uuid = uuidv1(),
				random = Math.random().toString(36).substr(2);
			let fd = new FormData();
			fd.append('name',item.name)
			fd.append('key',this.param_policy.dir+'/'+random+'-'+uuid+'-'+item.name)
			fd.append('policy',this.param_policy.policy)
			fd.append('OSSAccessKeyId',this.param_policy.accessKeyId)
			fd.append('signature',this.param_policy.signature)
			fd.append('success_action_status','200')
			fd.append('file',item.file);
			that.uploadImage(fd,item,uuid,random);
		},
		//上传图片接口(新-oss)
		async uploadImage(val,item,uuid,random){
			Indicator.open('上传中...')
			const res = await uploadimg(val);
			var netimgurl = bucketName()+'.'+'oss-cn-beijing.aliyuncs.com/'+this.param_policy.dir+'/'+random+'-'+uuid+'-'+item.name;
			this.url=netimgurl
			Indicator.close();
			this.uploadheadImage();
		},
        //头像上传
        async uploadheadImage() {
        	var res=await putAvatar(this.url);
        	if(res.code==100){
        		Toast({
					message:'头像设置成功',
					duration: 1500
				})
        	}else{
        		Toast({
					message:'图片上传失败',
					duration: 1500
				})
        	}
        },
        //退出登录
        async quit(){
        	//不管退出是否成功，每次都清除用户数据，再让用户重新登录
        	const res = await logout()
        	if(res.code==100){
        		this.CLEAR_TOKEN()
        		this.CLEAR_USERINFO()
        		window.logOut('ok');
				localStorage.setItem('needRender',true)
				window.toApp();
        		this.$router.push('/mine')
        	}else{
        		this.CLEAR_TOKEN()
        		this.CLEAR_USERINFO()
				window.logOut('ok');
				window.toApp();
				this.$router.push('/mine')
        		Toast({
                    message: '退出失败',
                    position: 'bottom',
                    duration: 3000
                })
        	}
        },
        //获取用户数据
        async getUserInfo(){
        	const res = await queryMyProfil()
        	if(res.code==100){
        		this.RECORD_USERINFO(res.content)
        		this.realnamed = res.content.realnamed
        		res.content.avatar?this.headImg=res.content.avatar:this.headImg=defaults
        	}
        },
        //认证提示
        Toast(){
        	this.realnamed?Toast({message:'已认证',position:'middle',duration:1000}):''
        },
        //返回上一页
		toMine(){
			window.toApp();
        	Indicator.close()
			this.$router.push('/mine')
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
	font-family:PingFang-SC-Regular;
}
#personHomepage{
	width:100%;	background-color: #f5f5f5;position: absolute;height:100vh;
}
#personHomepage>.headPho{
	width: 100%;
	height: 1.4rem;
	background-color: #fff;
	padding: 0 .3rem 0 .3rem;
	margin-top: .88rem;
}
.headPho>.headPho_content{
	display: inline-block;
	width: 100%;
	height: 100%;
}
.headPho_content>span:first-child{
	width: .66rem;
	height: 100%;
	line-height: 1.4rem;
	font-size: .3rem;
	float: left;
}
.headPho_content>span:nth-child(2){
	width: .3rem;
	height: 100%;
	background-image: url(../../images/right_jian.png);
	background-position: center;
	background-repeat: no-repeat;
	background-size: .15rem;
	float: right;
}
.headPho_content>input:nth-child(3){
	display: none;
}
.headPho_content>.label{
	display: inline-block;
	width: 100%;
	height: 100%;
	background-color: red;
}
.headPho_content>img{
	width: 1.2rem;
	height: 1.2rem;
	border-radius: 50%;
	float: right;
	margin-top: .1rem;
	margin-right: .25rem;
}
#personHomepage>.realname{
	width: 100%;
	height: 1.1rem;
	padding: 0 .3rem 0 .3rem;
	background-color: #fff;
}
#personHomepage>.realname>.realname_content{
	width: 100%;
	height: 1.1rem;
	background-color: #fff;
}
#personHomepage>.realname>.realname_content>span:nth-child(1){
	font-size: .28rem;
	height: 1.1rem;
	line-height: 1.1rem;
	float: left;
}
.jian_right{
	width: .3rem;
	height: 100%;
	background-image: url(../../images/right_jian.png);
	background-position: center;
	background-repeat: no-repeat;
	background-size: .15rem;
	float: right;
}
#personHomepage>.realname>.realname_content>span:nth-child(2){
	float: right;
	font-size: .28rem;
	height: 1.1rem;
	line-height: 1.1rem;
	padding-right: .2rem;
}
#personHomepage>.loginAccount{
	width: 100%;
	height: 1.1rem;
	background-color: #fff;
	padding: 0 .3rem 0 .3rem;
}
#personHomepage>.loginAccount>section{
	width: 100%;
	height: 1.1rem;
}
#personHomepage>.loginAccount>section>span:first-child{
	font-size: .28rem;
	line-height: 1.1rem;
	height: 1.1rem;
	float: left;
}
#personHomepage>.loginAccount>section>span:nth-child(2){
	font-size: .28rem;
	line-height: 1.1rem;
	height: 1.1rem;
	float: right;
}
#personHomepage>.approve{
	width: 100%;
	height: 1.1rem;
	background-color: #fff;
	padding: 0 .3rem 0 .3rem;
}
#personHomepage>.approve>section{
	width: 100%;
	height: 1.1rem;
}
#personHomepage>.approve>section>span:first-child{
	font-size: .28rem;
	line-height: 1.1rem;
	height: 1.1rem;
	float: left;
}
#personHomepage>.approve>section>span:nth-child(3){
	font-size: .28rem;
	line-height: 1.1rem;
	height: 1.1rem;
	float: right;
	margin-right: .1rem;
}
.noApprove{
	color: #999999;
}
.isApprove{
	color: #000;
}

#personHomepage>.myAddress{
	width: 100%;
	height: 1.1rem;
	background-color: #fff;
	padding: 0 .3rem 0 .3rem;
}
#personHomepage>.myAddress>section{
	width: 100%;
	height: 1.1rem;
}
#personHomepage>.myAddress>section>span:first-child{
	font-size: .28rem;
	line-height: 1.1rem;
	height: 1.1rem;
	float: left;
}
.quit{
	width: 100%;
	height: .88rem;
	padding: 0 .3rem 0 .3rem;
	position: absolute;
	bottom: .6rem;
}
.quit>a{
	display: inline-block;
	width: 100%;
	height: .88rem;
	line-height: .88rem;
	text-align: center;
	background-color: #f2b643;
	color: #fff;
	font-size: .3rem;
	border-radius: .08rem;
}
@media(-webkit-min-device-pixel-ratio:1.5),(min-device-pixel-ratio:1.5),(-o-min-device-pixel-ratio:1.5){
	.headPho>label:after{
		content: '';
		width: 100%;
		border-bottom: 1px solid #eeeeee;
		-webkit-transform: scaleY(0.7);
		-o-transform: scaleY(0.7);
		-moz-transform: scaleY(0.7);
		transform:scaleY(0.7);
		float: left;
	}
	.realname_content:after{
		content: '';
		width: 100%;
		border-bottom: 1px solid #eeeeee;
		-webkit-transform: scaleY(0.7);
		-o-transform: scaleY(0.7);
		-moz-transform: scaleY(0.7);
		transform:scaleY(0.7);
		float: left;
	}
	.loginAccount>section:after{
		content: '';
		width: 100%;
		border-bottom: 1px solid #eeeeee;
		-webkit-transform: scaleY(0.7);
		-o-transform: scaleY(0.7);
		-moz-transform: scaleY(0.7);
		transform:scaleY(0.7);
		float: left;
	}
	.approve>section:after{
		content: '';
		width: 100%;
		border-bottom: 1px solid #eeeeee;
		-webkit-transform: scaleY(0.7);
		-o-transform: scaleY(0.7);
		-moz-transform: scaleY(0.7);
		transform:scaleY(0.7);
		float: left;
	}
}
@media(-webkit-min-device-pixel-ratio:2),(min-device-pixel-ratio:2),(-o-min-device-pixel-ratio:1.5){
	.headPho>label:afterafter{
		content: '';
		width: 100%;
		border-bottom: 1px solid #eeeeee;
		-webkit-transform: scaleY(0.5);
		-o-transform: scaleY(0.5);
		-moz-transform: scaleY(0.5);
		transform:scaleY(0.5);
		float: left;
	}
	.realname_content:after{
		content: '';
		width: 100%;
		border-bottom: 1px solid #eeeeee;
		-webkit-transform: scaleY(0.5);
		-o-transform: scaleY(0.5);
		-moz-transform: scaleY(0.5);
		transform:scaleY(0.5);
		float: left;
	}
	.loginAccount>section:after{
		content: '';
		width: 100%;
		border-bottom: 1px solid #eeeeee;
		-webkit-transform: scaleY(0.5);
		-o-transform: scaleY(0.5);
		-moz-transform: scaleY(0.5);
		transform:scaleY(0.5);
		float: left;
	}
	.approve>section:after{
		content: '';
		width: 100%;
		border-bottom: 1px solid #eeeeee;
		-webkit-transform: scaleY(0.5);
		-o-transform: scaleY(0.5);
		-moz-transform: scaleY(0.5);
		transform:scaleY(0.5);
		float: left;
	}
}
.realnamedcolor{
	color:#EDA835;
}
</style>

