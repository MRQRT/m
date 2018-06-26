<template>
	<div class="spring">
		<div class="myHead">
			<span class="backMo" @click="backHome">
				<img src="../../images/myBack.png" class="myBack">
				<span>返回</span>
			</span>
		</div>
	    <img src="../../images/activityPersov.jpg" class="awardHistory">
	</div>
</template>
<script>
	export default {
		data() {
			return {
				
			}
		},
		created(){
		},
		mounted() {
		},
		methods:{
			backHome(){
				window.toApp()
				this.$router.push('/buyGold')
			},
		},
	}
</script>
<style scoped>
    .spring .myHead{
		height:.88rem;
		position: fixed;
		width:100%;
 		top:0;
		background: transparent;
		padding-top:.25rem;
		box-sizing: border-box;
	}
	.spring .myHead .myBack{
		width:.16rem;
		height:.34rem;
	}
	.spring .myHead .backMo{
		position: absolute;
		left:.3rem;
	}
	.spring .myHead .backMo span{
		font-size:.32rem;
		color:#333333;
		line-height:.32rem;
		height:.32rem;
		display: inline-block;
		vertical-align: top;
	}
	.spring .awardHistory{
		display: block;
	}
</style>

