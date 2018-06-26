<template>
	<div class="aboutUs">
		<head-top headTitle='关于' class="head-top">
			<img slot='head_goback' src='../../images/back.png' class="head_goback" @click="goBack()">
		</head-top>
		<div class="about-core">
		   <p @click="goToRobot" class="aboutP"><span class="left">在线客服</span><span class="right"><img src="../../images/right_jian.png"></span></p>
		   <!-- <p @click="$router.push('/feedback')" class="aboutP"><span class="left">意见反馈</span><span class="right"><img src="../../images/right_jian.png"></span></p> -->
		   <p class="aboutP"><span class="left">当前版本</span><span class="right">V3.1</span></p>
		   <p @click="$router.push('/aboutUs')" class="aboutP"><span class="left">关于我们</span><span class="right"><img src="../../images/right_jian.png"></span></p>
		   <p @click="$router.push('/contact')" class="aboutP"><span class="left">联系方式</span><span class="right"><img src="../../images/right_jian.png"></span></p>
		   <p style="border:none;" class="aboutP" @click="clear"><span class="left">清理缓存</span><span class="right">{{cache}}&nbsp;&nbsp;<img src="../../images/right_jian.png"></span></p>
		</div>
	</div>
</template>

<script>
	import headTop from '../../components/header/head.vue';
	import { mapState, mapMutations } from 'vuex';
	export default {
		data(){
			return {
				cache:null
			}
		},
		mounted() {
			this.calculate()
			var hgt=window.innerHeight;
			document.querySelector('.aboutUs').style.height=hgt+'px';
		},
		computed:{
			...mapState([
				'userInfo',
				])
		},
		methods:{
			//返回首页
			goBack(){
				window.toApp();
				this.$router.push('/mine');
			},
			...mapMutations([
                'CLEAR_TOKEN','CLEAR_USERINFO'
            ]),
			goToRobot(){
				/*和原生APP交互，有userInfo传uiserInfo,没有传no*/
				if(this.userInfo){
					window.openRobot(this.userInfo.name);
				}else{
					window.openRobot('no');
				}
			},
			//计算缓存
			calculate(){
                if(window.localStorage || window.localStorage){
                    let cache1 = parseFloat(unescape(encodeURIComponent(JSON.stringify(localStorage))).length).toFixed(2);
                    let cache2 = parseFloat(unescape(encodeURIComponent(JSON.stringify(sessionStorage))).length).toFixed(2);
                    this.cache=~~(cache1)+~~(cache2)+'KB'
                }
            },
            //清空缓存
            clear(){
     			localStorage.clear()
     			sessionStorage.clear()
     			this.CLEAR_TOKEN()
     			this.CLEAR_USERINFO()
				this.cache=0+'KB';
				window.logOut('ok');
				localStorage.setItem('needRender',true)
     			// console.log(unescape(encodeURIComponent(JSON.stringify(localStorage))).length)
     			// console.log(unescape(encodeURIComponent(JSON.stringify(sessionStorage))).length)
     		}
		},
		components:{
			headTop
		}
	}
</script>

<style scoped>
   .aboutUs{
   	    width:100%;
   	    background-color: #F5F5F5;
   	    padding-top:.88rem;
    }
   .aboutUs .about-core{
   	    background-color: #fff;
   	    padding:0 .3rem;
    }
    .aboutUs .about-core p{
    	height:1.1rem;
    	line-height:1.1rem;
    	font-size:.3rem;
    	color:#333333;
    }
   .aboutUs .about-core img{
   	    width:.13rem;
   	    height:.24rem;
    }
    .aboutUs .about-core .right{
    	text-align: right;
    }
    .aboutUs .about-core .left{
    	padding-left:.22rem;
    }
    @media(-webkit-min-device-pixel-ratio:1.5),(min-device-pixel-ratio:1.5),(-o-min-device-pixel-ratio:1.5){
	.aboutP:after{
		content: '';
		display: block;
		width: 100%;
		border-bottom: 1px solid #eeeeee;
		-webkit-transform: scaleY(0.7);
		-o-transform: scaleY(0.7);
		-moz-transform: scaleY(0.7);
		transform:scaleY(0.7);
	}

}
@media(-webkit-min-device-pixel-ratio:2),(min-device-pixel-ratio:2)(-o-min-device-pixel-ratio:1.5){
	.aboutP:after{
		content: '';
		display: block;
		width: 100%;
		border-bottom: 1px solid #eeeeee;
		-webkit-transform: scaleY(0.5);
		-o-transform: scaleY(0.5);
		-moz-transform: scaleY(0.5);
		transform:scaleY(0.5);
	}
}
</style>