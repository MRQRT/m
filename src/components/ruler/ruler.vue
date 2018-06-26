<template>
<div>
	<div style="width:100%;height:180px;margin-bottom:20px;background:#fff">
		<div id="pressure-contain" style="width:100%; height:200px;float:right"></div>			
	</div>
</div>
</template>
<script type="text/javascript">
import '../../config/ruler.js'
import { mapState } from 'vuex'
export default{
	data(){
		return {
		}
	},
	mounted(){
		this.init()
	},
	watch:{
		
	},
	components:{

	},
	props:{
		
	},
	computed:{
		...mapState({
			initRulerData:	state => state.initRulerData
		})
    },
	filters:{
		
	},
	methods:{
        init(){
            //调用此插件须输入两个参数，第一个为要注入标签的id名，第二个为他的参数对象，详情如下
	        var ruler=new Ruler("pressure-contain",{
				    maxNum: 300,        	    //最大数值
					minNum: 0,			    //最小数值
				   initNum: this.initRulerData,  //初始数值
				decimalWei: 1,			    //保留几位有效小数；默认为零
				   cellNum: 1,			    //两个大刻度的数值区间
					  name: "血压",			    //名称
					  unit: "mmHg",			    //单位
				       vue: this,
			});
			
        }
	}
}

</script>
