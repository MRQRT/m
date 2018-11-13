<template>
<div>
	<!-- <div style="width:100%;height:180px;margin-bottom:20px;background:#fff">
		<div id="pressure-contain" style="width:100%; height:200px;float:right"></div>			
	</div> -->
	<p class="gram_title">点击直接输入卖金克重</p>
	<input type='text' v-model="gram" class="input_gram">
	<div class="line"><span class="line_span"></span></div>
	<div class="tips">
		<p>最大输入克重为10000克</p>
		<p>若您有更大需求请联系客服：400-8196-199</p>
	</div>
</div>
</template>
<script type="text/javascript">
import '../../config/ruler.js'
import { mapState } from 'vuex'
import {isNumber,clearNoNum} from '@/config/mUtils.js'
export default{
	data(){
		return {
			gram:10,//初识输入的克重
		}
	},
	mounted(){
		// this.init()
		if(this.initRulerData){
			this.gram=this.initRulerData
		}
	},
	components:{

	},
	props:{
		
	},
	computed:{
		...mapState({
			initRulerData:	state => state.initRulerData
		}),
	},
	watch:{
		gram:function(value){
			var str = clearNoNum(value,2);
			if(Number(str)>10000){
				this.gram=10000
				this.$store.commit('set_rulerData', 5000)
			}else if(str==''){
				this.$store.commit('set_rulerData', '')
			}else{
				this.gram=str
				this.$store.commit('set_rulerData', str)
			}
		}
	},
	filters:{
		
	},
	methods:{
        // init(){
        //     //调用此插件须输入两个参数，第一个为要注入标签的id名，第二个为他的参数对象，详情如下
	    //     var ruler=new Ruler("pressure-contain",{
		// 		    maxNum: 300,        	    //最大数值
		// 			minNum: 0,			    //最小数值
		// 		   initNum: this.initRulerData,  //初始数值
		// 		decimalWei: 1,			    //保留几位有效小数；默认为零
		// 		   cellNum: 1,			    //两个大刻度的数值区间
		// 			  name: "血压",			    //名称
		// 			  unit: "mmHg",			    //单位
		// 		       vue: this,
		// 	});
		// }
	}
}
</script>
<style type="text/css" scoped>
.gram_title{
	width: 100%;
	font-size:.24rem;
	text-align: center;
	color:#999999;
	margin-top:.55rem;
}
.input_gram{
	width:98%;
	font-size:.65rem;
	color:#EDA835;
	text-align:center;
	margin-right:1.2rem;
	margin-top:.2rem;
}
.line{
	width: 100%;
	text-align: center;
}
.line_span{
	display: inline-block;
	width: 35%;
	height: 3px;
	border-bottom:1px solid #E1E1E1;
}
.tips{
	margin-top:.35rem;
	color:#FF6D39;
	font-size:.22rem;
	padding:0 .4rem 0 .84rem;
	background-image: url(../../images/gantanhao.png);
	background-repeat: no-repeat;
	background-size:.24rem;
	background-position: .45rem .04rem;
}
</style>

