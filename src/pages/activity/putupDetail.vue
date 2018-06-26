<template>
	<div class="putupDetail">
		<div class="myHead">
			<span class="backMo" @click="backHome">
				<img src="../../images/myBack.png" class="myBack">
				<span style="vertical-align:middle;font-size:.32rem;color:#333333;">返回</span>
			</span>
		</div>
	    <img src="../../images/putDetail.jpg" class="awardHistory">
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
	.putupDetail .myHead{
		height:.88rem;
		line-height:.88rem;
		padding-left:.28rem;
	}
    .putupDetail .myBack{
		width:.16rem;
		height:.34rem;
		vertical-align:middle;
	}
	.putupDetail .awardHistory{
		display:block;
	}
</style>

