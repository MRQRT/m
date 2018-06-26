<template>
	<div class="feedback">
		<head-top headTitle='意见反馈' class="head-top">
			<img slot='head_goback' src='../../images/back.png' class="head_goback" @click="$router.go(-1)">
		</head-top>
		<section class="feedback-core">
			 <textarea maxlength="500" id="content" @input="textareaFn" class="chackTextarea" placeholder="请写下您宝贵的意见！" v-model="text" @focus="initNum"></textarea>
           <div class="tips"><span class="num" ref="num">0</span>/<span>500</span></div>
		</section>
		<section class="submitBtn" :class="{'actived':text!=''}">提交反馈</section>
	</div>
</template>

<script>
	import headTop from '../../components/header/head.vue';
	export default {
		data(){
			return {
				text:'',
				num:500,
				flag:true//文本框初次获取焦点时初始化数字
			}
		},
		mounted() {
			var hgt=window.innerHeight;
			document.querySelector('.feedback').style.height=hgt+'px';
		},
		computed:{
			
		},
		methods:{
			textareaFn(){
				var strlen = 0;
				var thisChar=this.text;
				for(var i=0;i<thisChar.length;i++){
					if(this.isChinese(thisChar.charAt(i))==true){
					 strlen = strlen + 2; //中文为2个字符
				  } else{
					 strlen = strlen + 1; //英文一个字符
				  }
				}
				strlen = Math.ceil(strlen / 2); //中英文相加除2取整数
                this.$refs.num.innerHTML=this.num-strlen;
                this.text=this.text.substring(0,500);
            },
            isChinese(str) {  //判断是不是中文
                var reCh = /[u00-uff]/;
                return !reCh.test(str);
            },
            initNum(){
            	if(this.flag){
            		var here=this;
            		setTimeout(function(){
            			here.$refs.num.innerHTML=500;
            			here.flag=false;
            		},800)
            	}
            }
		},
		components:{
			headTop
		}
	}
</script>

<style scoped>
   .feedback{
   	    width:100%;
   	    background-color: #F5F5F5;
   	    overflow-y: scroll;
   }
   .feedback .feedback-core{
   	    margin-top:.88rem;
   	    background-color: #fff;
   	    height:3.6rem;
   	    padding:.36rem .3rem .4rem .3rem;
   	    position: relative;
   }
   .feedback .feedback-core textarea{
     	  resize: none;
   	    width: 100%;
   	    font-size:.3rem;
   	    border: none;
   	    color: #333333;
   	    height: 100%;
   	    outline-style: none;
   }
   input::input-placeholder{
        color:#A3A3A3;
   }
   .feedback .feedback-core .tips{
   	    position: absolute;
   	    right:.3rem;
   	    bottom:.4rem;
   	    font-size:.26rem;
   	    color:#999999;
   }
   .feedback .submitBtn{
   	    width:6.94rem;
   	    margin:0 auto;
   	    margin-top:1.54rem;
   	    background-color:#F2D49A;
   	    color:#fff;
   	    height:.9rem;
   	    line-height:.9rem;
   	    text-align: center;
   	    font-size:.36rem;
        border-radius: 4px;
   }
   .feedback .submitBtn.actived{
       background-color: #f2b643;
   }
</style>