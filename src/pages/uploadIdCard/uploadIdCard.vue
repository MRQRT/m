<template>
	<div class="uploadIdCard">
		<head-top headTitle='上传图片' class="head-top">
			<img slot='head_goback' src='../../images/back.png' class="head_goback" @click="goBack()">
		</head-top>
		<!--主要内容区域-->
		<div v-show="mainShow">
		    <!--上传照片区域-->
		    <div class="uploadArea">
		    	<p class="uploadTitle">请上传手持身份证正面照片</p>
		    	<img :src="src" class="uploadPic" id="image">
		    	<img src="../../images/uploading.png" class="uploading" v-show="needShow">
		    	<input type="file" accept="image/*" name="file" class="ipt" @change="selectImage" v-if="canPhoto" id="idCardInput">
		    	<div class="ipt" @click="selectImage" v-if="noPhoto"></div>
		    </div>
		    <!--示例-->
		    <div class="example">
		    	<h4>示例
		    		<img src="../../images/yellowGTH.png" @click="findTip">
		    	</h4>
		    	<div class="example-pic">
		    		<div>
		    			<img src="../../images/normal.png">
		    			<p class="normal">标准</p>
		    		</div>
		    		<div>
		    			<img src="../../images/differ.png">
		    			<p>不一致不合格</p>
		    		</div>
		    		<div>
		    			<img src="../../images/vague.png">
		    			<p>模糊不合格</p>
		    		</div>
		    		<div>
		    			<img src="../../images/blackWhite.png">
		    			<p>黑白不合格</p>
		    		</div>
		    	</div>
		    </div>
		    <!--下一步-->
		    <!--点击需要判断调转去哪里-->
		    <div class="uploadNext" @click="nextFillOrder">下一步</div>
		</div>
		<!--上传照片提示-->
		<div class="prompt" v-show="!mainShow">
			<h3>照片说明</h3>
			<div class="photoTip">
				<p>1、身份证的所有信息清晰可见。</p>
				<p>2、照片需免冠,所持证件人的五官清晰可见。</p>
				<p>3、照片内容真实,不得做任何修改。</p>
			</div>
			<div class="closeTip" @click="closeDesc"></div>
		</div>
	</div>
</template>

<script>
	import headTop from '../../components/header/head.vue';
	import {Toast, Indicator} from 'mint-ui'
	import { getpolicy,uploadimg } from '@/service/getData'
	import  defaultUpload  from '@/images/uploadPic.png'
	import	{bucketName} from '@/config/mUtils'
	export default {
		data(){
			return {
				needShow: true, //是否可选择图片
				mainShow: true,  //主要内容显示还是提示内容显示
				     url: '',//上传图片接口返回地址
				   query: '',//跳转到此页带的参数，进入到下一页时需要
				     src: defaultUpload,//默认的身份证图片
				    from: null, //页面的上一页是哪儿
				canPhoto: false,//可以拍照
				 noPhoto: true //不可以拍照
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
		mounted() {
			this.query=this.$route.query;
			this.from=this.$route.query.from;
		},
		methods:{
			selectImage(e) {
				if(this.noPhoto){  //查看手机拍照读写权限
				    if(window.backPerInfo){  //查看手机拍照读写权限
					    var res=window.backPerInfo();
					    if(res=='OK'){
						   	this.canPhoto=true;
						   	this.noPhoto=false;
						   	document.querySelector('#idCardInput').onchange();
					    }else{
						   	this.canPhoto=false;
						   	this.noPhoto=true;
						   	Toast({
								message:'请在应用权限管理中打开“电话或读写手机存储”访问权限!',
							  	position: 'bottom',
							  	duration: 3000
						    })
						    return;
					    }
				    }
			    }
				if (!e.target.files || !e.target.files[0]){
					return;
				}
				Indicator.open('加载中...');
				var that=this;
				let item = {
					name: e.target.files[0].name,
					size: e.target.files[0].size,
					file: e.target.files[0],
				}
				let reader = new FileReader();
				reader.readAsDataURL(e.target.files[0]);
				reader.onload =function(evt){
					Indicator.close();
					document.getElementById('image').src = evt.target.result;
					t.src=evt.target.result;
					t.needShow=false;
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
			},
            findTip(){  //打开照片上传提示窗
           	    this.mainShow=!this.mainShow;
            },
            closeDesc(){ //关闭照片上传提示窗
           	    this.mainShow=true;
            },
            //点击下一步需要带参数到上一页
            nextFillOrder(){
           	    if(this.src == defaultUpload){
           	    	Toast({
						message:'未选择照片',
						position: 'bottom',
						duration: 3000
					})
           	    	return;
           	    }
				var to='';
           	    if(this.from=='1'){   //判断该返回那个业务 1为提金业务
           	    	to='/fillInOrder';
           	    	this.query.url=this.url;
           	    	this.$router.push({
           				path:to,
           				query:this.query
           			})
           			Indicator.close();
           	    }else if(this.from=='2'){ //2为存金业务
           	    	this.query.handIDphotoUrl=this.url
           	    	to='/stor/uploadPho'
           				this.$router.push({
           					path:to,
           					query:this.query
           				})
           			Indicator.close();
           	    }
           	},
           	goBack(){
           		Indicator.close();
           		this.$router.go(-1)
           	}
		},
		components:{
			headTop
		}
	}
</script>

<style scoped>
    .uploadIdCard{
    	padding-top:.88rem;
    }
    .prompt{
    	padding-top:.82rem;
    	padding-left:.74rem;
    	padding-right:.74rem;
    }
    .prompt h3{
    	text-align: center;
    	font-size:.42rem;
    	height:.96rem;
    }
    .prompt .photoTip{
    	border-top:1px solid #EEEEEE;
    	padding-top:.42rem;
    	font-size:.28rem;
    	color:#666666;
    }
    .prompt .photoTip p{
    	height:.48rem;
    }
    .prompt .closeTip{
    	width:.46rem;
    	height:.52rem;
    	margin:0 auto;
    	margin-top:6.7rem;
    	background:url(../../images/grayClose.png);
    	background-size: 100%;
    }
    .uploadArea{
    	height:6.74rem;
    	background-color:#DCDBDB;
    	padding-top:.9rem;
    	text-align: center;
    	position: relative;
    }
	.uploadArea .uploadTitle{
		font-size:.3rem;
		color:#727272;
	}
	.uploadArea .uploadPic{
		width:5.6rem;
		height:3.36rem;
		margin-top:.56rem;
		border:2px solid #E6C693;
	}
	.uploadArea .uploading{
		width:1rem;
		height:1rem;
		position: absolute;
		top:2.9rem;
		left:50%;
		margin-left:-.5rem;
	}
	.uploadArea .ipt{
		width:1rem;
		height:1rem;
		position: absolute;
		top:2.9rem;
		left:50%;
		margin-left:-.5rem;
		z-index: 1;
		border-radius: 50%;
		-webkit-border-radius: 50%;
		-moz-border-radius: 50%;
		-o-border-radius: 50%;
		opacity: 0;
	}
	.example{
		padding:.3rem .3rem .84rem .32rem;
	}
	.example h4{
		font-size:.28rem;
		height:.54rem;
		border-bottom: 1px solid #F1F1F1;
	}
	.example h4 img{
		width:.24rem;
		height:.24rem;
	}
	.example-pic img{
		width:1.6rem;
		height:1.6rem;
		border:1px solid #EAEAEA;
	}
	.example-pic{
		margin-top:.32rem;
		display: flex;
	    display: -webkit-flex;
	    display: -moz-flex;
	    display: -o-flex;
	    justify-content:space-between;
	    -webkit-justify-content:space-between;
	    -moz-justify-content:space-between;
	    -o-justify-content:space-between;
	}
	.example-pic p{
		color:#FF845A;
		font-size:.2rem;
		text-align: center;
		margin-top:.1rem;
	}
	.example-pic .normal{
		color:#6C6C6C;
	}
	.uploadNext{
		width:6.92rem;
		margin:0 auto;
		height:.9rem;
		line-height:.9rem ;
		text-align: center;
		color:#fff;
		font-size:.36rem;
		background-color: #F2B643;
		margin-bottom:.4rem;
		border-radius: 3px;
	}

</style>