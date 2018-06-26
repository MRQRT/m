<template>
	<div class="uploadPho" v-show="is">
		<head-top headTitle='上传图片'>
				<img slot='head_goback' src='../../../images/back.png' class="head_goback" @click="goBack()">
				<span @click="next" slot="custom" style="float: right; font-size: .24rem;margin-right:.2rem;"></span>
		</head-top>
		<div class="uploadPho_photo">
           <ul  v-if="images.length >0" class="upload_image_preview">
              <li v-for="(image, key) in images">
                 <img :src="image" @click="openBigImg(image)">
                 <span @click='delImage(key)' class="del_image"></span>
              </li>
           </ul>
			<input type="file" accept="image/*" @change="selectImage" v-if="canPhoto" id="add" style="display: none" name="file" multiple >
			<label for="add" @click="selectImage">添加图片</label>
			<p style="margin-top: .2rem; font-size: .25rem;color: #666666;">*请您上传相关实物及发票图片</p>
		</div>
		<div class="uploadPho_examp">
			<p class="example_title"><span>示例&nbsp;<img :src="mark" id="mark"  @click="phoRequ(1)"></span></p>
			<div class="uploadPho_examp_img"><img :src="examp1"><span>实物标准</span></div>
			<div class="uploadPho_examp_img"><img :src="examp2"><span>发票标准</span></div>
			<div class="uploadPho_examp_img"><img :src="examp3"><span>模糊不合格</span></div>
			<div class="uploadPho_examp_img"><img :src="examp4"><span>黑白不合格</span></div>
			<a to="/stor/writeData" class="uploadPho_next" :class="isNext?'uploadPho_yesNext':'uploadPho_noNext'" @click="next">下一步</a>
		</div>
		<transition name="fade">
			<div class="magnify_img" v-show="magnify" @click="closeBigImg">
				<img :src="bigImg">
			</div>
		</transition>
		<transition name="fade">
			<div class="require" v-show="isShow">
				<div class="require_content">
					<h5>拍照要求</h5>
					<p>1、请上传清晰彩色的相关实物图片；</p>
					<p>2、所上传发票图片必须为所存黄金相应的发票图片，且信息完整清晰。</p>
					<h4 @click="phoRequ(0)">我知道了</h4>
				</div>
			</div>
		</transition>
	</div>
</template>

<script type="text/javascript">
	import headTop from '@/components/header/head.vue'
	import	mark from '@/images/mark.png'
	import	examp1 from '@/images/examp1.png'
	import	examp2 from '@/images/examp2.png'
	import	examp3 from '@/images/examp3.png'
	import	examp4 from '@/images/examp4.png'
	import	delImg from '@/images/delImg.png'
	import store from '@/store'

	import { xmlUploadImg } from '@/service/getData.js'
	import { mapState,mapMutations } from 'vuex'
	import {Toast,Indicator} from 'mint-ui'
	
	export default{
		data(){
			return{
				mark: mark,
			  examp1: examp1,
			  examp2: examp2,
			  examp3: examp3,
			  examp4: examp4,
			  delImg: delImg,
			  bigImg: examp1,
			 magnify: 0,
		 magnify_img: '',
			  images: [],
			  isShow: 0,
			      is: 1,//监听路由变化的数据开关，默认值表示该组件显示
			     url: '',//上传图片接口返回地址
			 imgForm: new FormData(),
	     imgUrlArray: [],
	             url:'',//图片占位符
	          params:{},//存放上一页url地址带过来的参数
	          isNext:false,//是否可以点击进入下一步
	          canPhoto:false,//可以拍照
		      noPhoto:true, //不可以拍照
			}
		},
		props: ['event'],
		created(){
			this.params = this.$route.query;
			if(window.stub){  //查看手机拍照读写权限(安卓手机需要验证)
				window.openPhoto();
				window.close('cancel');
			}else{
			    this.canPhoto=true; //苹果手机不需要验证权限
			    this.noPhoto=false;
		    }
		},
		watch: {
			$route(to,from){
				this.watchRouter(to,from);
			},
			images(val){
				val.length!=0?this.isNext=true:this.isNext=false
			}
		},
		computed: {
			...mapState([
				'recycleParams'
			])
		},
		methods:{
			...mapMutations([
				'RECORD_RECYCLEPARAMS'
			]),
			watchRouter(to,from){
				if(from.path=='/stor/storSuc'){
					this.is = 1;
				}else if(to.path=='/stor/storSuc'){
					this.is = 0
				}
			},
			selectImage(e){
				if(this.noPhoto){  //查看手机拍照读写权限

				     if(window.backPerInfo){  //查看手机拍照读写权限
					    var res=window.backPerInfo();
					    if(res=='OK'){
						   this.canPhoto=true;
						   this.noPhoto=false;
						   document.querySelector('#add').onchange();
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

				if (this.images.__ob__.value.length>4){
					Toast('最多上传5张图片')
					return;
				}
				let files = e.target.files || e.dataTransfer.files;
				if (!(files && files.length)) return;
				const ss =  document.getElementById('add').files[0];
				const imgForm = new FormData()
				var reader = new FileReader()
				let vm = this
				reader.readAsDataURL(e.target.files[0])
				reader.onload = function(e) {
					vm.images.push(e.target.result)
					vm.uploadRecyclePic(e.target.result)
                }
			},
			//点击下一步
			next(){
				Indicator.close()
				if(this.isNext){
					//如果地址栏有参数，将地址栏的参数放入一个对象中，并存入vuex
					if(this.params.from){
						/*将图片地址和存金参数放入一个对象*/
						let canshu = {};
						canshu.img = this.imgUrlArray;
						canshu.params = this.params
						//将用户的参数存放入vuex
						//参数结构：{img:[/*存金图片地址*/],params:{from:'来自存金页',id:'产品Id',piece:'存金件数'，type:'存金类型'，handIDphotoUrl:'手持身份证照片地址'}}
						this.RECORD_RECYCLEPARAMS(canshu)
					}else{//地址栏没有参数，看vuex中的recycleParams，如果有，改变参数中的实物图片地址
						let canshu = {};
						canshu.img = this.imgUrlArray
						canshu.params = this.recycleParams.params
						this.RECORD_RECYCLEPARAMS(canshu)
					}
					//地址跳转
					this.$router.push({
						path:'/stor/writeData',
					})	
				}
			},
			//图片上传
			uploadRecyclePic(value) {
				//参数一表示vue实例，参数二表示base64格式的图片，参数三表示方法，参数四表示mint-ui的加载的动画，参数五是Toast提示
 				xmlUploadImg(this,value,'storeImageUrl',Indicator,Toast)
            },
			//将图片地址保存在保存图片地址
			storeImageUrl(){
				this.imgUrlArray.push(this.url)
			},
            delImage: function(index){
                this.images.shift(index);
            },
            //显示放大图片
            openBigImg: function(image){
            	this.bigImg = image;
            	this.magnify = 1;
            },
            //放大图片关闭
            closeBigImg: function(){
            	this.magnify = 0;
            },
            phoRequ: function(v){
            	return v==1?this.isShow = 1:this.isShow = 0;
            },
            goBack: function(){
            	Indicator.close()
            	this.$router.push('/stor')
            }
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
.uploadPho{
	width: 100%;
	height: 12.94rem;
	background-color: #f5f5f5;
	position: absolute;
}
.uploadPho>.uploadPho_photo{
	width: 100%;
	height: 6.75rem;
	margin-top: .88rem;
	padding-top: .3rem;
	padding-left: .3rem;
	padding-right: .3rem;
}
.uploadPho .uploadPho_examp{
	width: 100%;
	height: 5.3rem;
	background-color: #fff;
	padding: 0 .3rem 0 .3rem;
}
.uploadPho_examp>.example_title{
	font-size: .24rem;
	color: #000;
	height: .84rem;
	margin: 0;
	text-align: center;
	padding-top: 0;
	margin-bottom: .3rem;
}
#mark{
	width: .24rem;
	margin-left: .05rem;
}
.uploadPho_examp>.example_title>span{
	display: inline-block;
	width: 100%;
	height: 100%;
	text-align: left;
	border-bottom: 1px solid #eeeeee;
	padding-top: .3rem;
}
.uploadPho_examp_img{
	display: inline-block;
	width: 1.6rem;
	margin-right: .05rem;
}
.uploadPho_examp_img>img{
	width: 1.6rem;
	height: 1.6rem;
	float: left;
}
.uploadPho_examp_img>span{
	margin-top: .15rem;
	width: 100%;
	display: inline-block;
	font-size: .22rem;
	text-align: center;
}
.uploadPho_examp>.uploadPho_examp_img:nth-child(4)>span{
	color: red;
}
.uploadPho_examp>.uploadPho_examp_img:nth-child(5)>span{
	color: red;
}
.uploadPho_next{
	display: inline-block;
	width: 100%;
	height: .88rem;
	line-height: .88rem;
	border-radius: .08rem;
	-webkit-border-radius: .08rem;
	-moz-border-radius: .08rem;
	-o-border-radius: .08rem;
	color: #fff;
	font-size: .34rem;
	text-align: center;
	margin-top: .8rem;
}
.uploadPho_noNext{
	background-color: #F3D59c;
}
.uploadPho_yesNext{
	background-color: #f2b643;
}
.uploadPho_photo>label{
	display: inline-block;
	width: 2.1rem;
	height: 2.1rem;
	border: 1px solid #eaeaea;
	background-image: url(../../../images/add.png);
	background-repeat: no-repeat;
	background-position: center .65rem;
	background-size: 30%;
	font-size: .2rem;
	color: #999999;
	text-align: center;
	padding-top: 1.5rem;
	background-color: #fff;
	margin-top: .2rem;
}
.upload_image_preview{
	list-style: none;
}
.upload_image_preview>li{
	width: 2.1rem;
	height: 2.1rem;
	border: 1px solid #eaeaea;
	float: left;
	margin-right: .2rem;
	margin-top: .2rem;
	position: relative;
}
.upload_image_preview>li>img{
	width: 100%;
	height: 100%;
}
.upload_image_preview>li>.del_image{
	display: inline-block;
	width: .35rem;
	height: .35rem;
	position: absolute;
	top: -.1rem;
	left: -.1rem;
	border-radius: 50%;
	-webkit-border-radius: 50%;
	-moz-border-radius: 50%;
	-o-border-radius: 50%;
	background-image: url(../../../images/delImg.png);
	background-position: center;
	background-size: 100%;
}
.uploadPho>.magnify_img{
	width: 100%;
	height: 100%;
	position: absolute;
	top: 0;
	z-index: 201;
	background-color: rgba(122,122,122,.5);
	display: flex;
    display: -webkit-flex;
    display: -moz-flex;
    display: -o-flex;
    justify-content: center;
    -moz-justify-content: center;
    -webkit-justify-content: center;
    -o-justify-content: center;
    align-items: center;
    -webkit-align-items: center;
    -moz-align-items: center;
    -o-align-items: center;
}
.uploadPho>.magnify_img>img{
	width: 100%;
}
.fade-enter-active, .fade-leave-active {
  	transition: all .5s;
  	-webkit-transition: all .5s;
  	-moz-transition: all .5s;
  	-o-transition: all .5s;
}
.fade-enter, .fade-leave-to{
  	opacity: 0;
}
.uploadPho .require{
	width: 100%;
	height: 100%;
	background-color: rgba(127, 127, 127, .5);
	position: absolute;
	top: 0;
	z-index: 200;
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
.require_content{
	width: 6rem;
	height: 4.4rem;
	background-color: #fff;
	border-radius: .1rem;
	-webkit-border-radius: .1rem;
	-moz-border-radius: .1rem;
	-o-border-radius: .1rem;
	padding: .35rem 0rem 0 0rem;
	position: relative;
}
.require_content>h5{
	font-size: .35rem;
	text-align: center;
	font-weight: normal;
}
.require_content>p{
	font-size: .28rem;
	color: #666666;
	height: .5rem;
	line-height: .5rem;
	padding: 0 .3rem 0 .3rem;
}
.require_content>p:nth-child(2){
	margin-top: .2rem;
}
.require_content>h4{
	font-size: .35rem;
	color: #eda835;
	position: absolute;
	bottom: 0;
	height: 1rem;
	line-height: 1rem;
	width: 100%;
	text-align: center;
	border-top: 1px solid #eeeeee;
}
</style>