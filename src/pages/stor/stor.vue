<template>
	<div class="write_order">
		<head-top headTitle='填写订单'>
			<img slot='head_goback' src='../../images/back.png' class="head_goback" @click="goBack">
			<span slot='custom' class="custom" @click="stor_state">存金须知</span>
		</head-top>
		<div class="stor_content" v-show="stor_content_show">
			<div class="price">
				<span>实时金价：</span><span>{{currentPrice | formatNum}}</span><span style="color:#333333;">元/克</span>
			</div>
			<div class="estimate_value">
				<span>预估金额：</span><span>{{estimatePrice | formatNum}}</span><span>元</span>
			</div>
			<h3 class="title_one">存金信息</h3>
			<div class="order_item">
				<content class="item_row item_row_1">
					<span>黄金类型</span>
					<span class="item_row_1_unchecked" :class="{'item_row_1_checked':order.checkType==item.name}" @click="checkTypeFun(item.id,item.name,index)" v-for="(item, index) in productType" :key="index">{{item.name}}</span>
				</content>
				<content class="item_row item_row_2">
					<span>黄金克重</span>
					<!-- <span>{{order.applyWeight}}克</span> -->
					<span>克</span>
					<input type="text" v-model="gram" class="input_gram">
				</content>
				<div v-show="gram<10" class="tip_gram_less">小于10克需承担运保费</div>
				<div v-show="gram>10000" class="tip_gram_greater">
					<p>最大输入克重为10000克</p>
					<p>若您有更大需求请联系客服：400-8196-199</p>
				</div>
				<content class="item_row item_row_3" @click="checkBrandFun()">
					<span>选择品牌</span>
					<span><span style="color:#999999;" v-show="checkBrand">选填</span><span v-show="!checkBrand"  style="color:#333333;">{{order.brandType | brandTran}}</span></span>
				</content>
				<!-- 福利券 -->
				<div class="">
					<!-- 无福利券或未登录情况下显示 -->
					<content class="item_row item_row_4" v-if="!token || !hasWelfare || welfarePrice==''">
						<span>福利券</span>
						<span>暂无福利券可用</span>
					</content>
					<content class="item_row item_row_5" v-else>
						<span>福利券</span>
						<div class="has-coupon">
							<p>¥{{welfarePrice}}福利券可用</p>
							<p>以实测毛重自动匹配福利券</p>
						</div>
					</content>
				</div>
				<!-- 选择图片 -->
				<h3 class="title_two">存金图片<span style="color:#999999;font-size: .28rem;">（请上传实物、发票等相关图片,最多9张）</span></h3>
				<div class="uploadPho_photo">
					<div class="upload_image_preview">
						<section v-for="(image, index) in order.images" :key="index">
							<img :src="image.src" class="thing_img">
							<span @click='delImage(index)' class="del_image"></span>
						</section>
						<input type="file" accept="image/*" @change="selectImage($event)" v-if="canPhoto" ref="file" style="display: none" name="file" id="storImg" multiple>
						<label for="storImg" class="add_img_label" @click="selectImage" v-show="canAdd">
							<div>
								<img src="../../images/add.png">
							</div>
						</label>
					</div>
				</div>
			</div>
		</div>
		<div class="submit_buyBack_order" @click="submitBuyBackOrder">
			<div>提交订单</div>
		</div>
		<!-- 存金说明 -->
		<div class="stor_box" v-show="show">
			<p class="priceTitle">存金说明</p>
            <div class="content" style="margin-top:.4rem;">
                <div class="mess">
                    <p>1.重量大于10g,运费、保价费、检测费全免。</p>
                </div>
            </div>
            <div class="content" style="margin-top:.5rem;">
                <div class="mess">
                    <p>2.存入的黄金可直接变现，也可存为持有克重（价格随金价波动变化）。</p>
                </div>
            </div>
            <div class="content" style="margin-top:.5rem">
                <div class="mess">
                    <p>3. 手续费中包含黄金损耗，各类投资金（含金量≥99.9%）损耗为2%。黄金饰品（含金量≥99.9%）损耗为4%，（99.9%>含金量>99%）损耗为5%，（含金量＜99%）按照实际成色计算。</p>
                </div>
            </div>
             <div class="content" style="margin-top:.5rem">
                <div class="mess">
                    <p>4.如提交的存金信息与实际检测结果不符，与用户协商未达成一致时导致交易失败，退回的运费及保价费（按实际发生）由用户承担。</p>
                </div>
            </div>
             <div class="content" style="margin-top:.5rem">
                <div class="mess">
                    <p>5. 由于黄金价格实时波动，预估金额仅供参考。</p>
                </div>
            </div>
			<div class="closePopup">
	            <img src="../../images/grayClose.png"  @click="closePop()" style="margin-top: 1.5rem">
	        </div>
		</div>
		<mt-popup position="bottom"  :closeOnClickModal="false" v-model="popupVisible" class="mint-popup-bottom">
			<!-- 黄金品牌选择 -->
			<div class="brand_box" v-if="popInputType=='brand_frame'">
				<section class="brandItem" v-for="(item,index) in brandArray" @click="brandCheck(item)" :key="index">{{item | brandTran(this.$data)}}</section>
				<section style="text-align:center;padding-top:.2rem;">
					<input type="text" placeholder="其他品牌" v-model="zidingyiBrand" class="user-defined"><span @click="zidingyiFun()" class="confirm">确定</span>
				</section>
			</div>
			<!-- 黄金克重选择 -->
			<div class="gram_box" v-if="popInputType=='gram_frame'">
				<section class="gramItem">
					<p class="gram_title"><span>黄金克重</span><span class="gram_confirm" @click="close_pop">确定</span></p>
					<ruler class="ruler"></ruler>
					<!-- <p style="width:100%;color:#E1E1E1;font-size:.24rem;text-align:center;position:absolute;bottom: 20%;">左右滑动选择克重</p> -->
					<div class="gram_tip" v-show="weight_show">小于10克，需要承担运保费</div>
				</section>
			</div>
		</mt-popup>
		<!-- 克重大于10000克提示框 -->
		<section class="cover" v-show="tips">
			<div class="pop_message_box">
				<p class="pop_title">提示</p>
				<section class="pop_message">您输入的克重超过最大回收克重10000克，请重新输入回收克重，若您有更大需求请联系客服400-8196-199。</section>
				<div class="line"></div>
				<section class="pop_bottom">
					<span class="pop_bottom_left" @click="rewrite">重试</span>
					<span class="pop_bottom_right"><a href="tel:4008196199">联系客服</a></span>
				</section>
			</div>
		</section>
	</div>
</template>
<script type="text/javascript">
	import headTop from '@/components/header/head.vue'
	import ruler from '@/components/ruler/ruler.vue'
	import { clearNoNum, formatDate } from '../../config/mUtils.js'
	import { queryRecycleProduct,queryRecycleOrderDetail,queryChildDictionary,coupons,activityInfo,getpolicy,uploadimg } from '@/service/getData.js'
	import { mapState,mapMutations } from 'vuex'
	import { MessageBox, Toast, Indicator,Popup } from 'mint-ui'
	import { getRem,openAPI,checkAndroAgent,iosVersion,bucketName } from "@/config/mUtils"
	import '../../config/ruler.js'
	export default{
		data () {
			return {
				hasWelfare:false,  //是否有可用福利券
				welfareNum:'',     //可使用福利券张数
				welfareStatus:true,//福利券是否展示
				couponLimitArr:[], //可用福利券克重数组
				  checkBrand: true,//黄金品牌是否选择 true没有选择 false选择
				    canPhoto: false,//可以拍照
		             noPhoto: true, //不可以拍照
				        show: 0,//存金说明弹框切换的标记
				clientHeight: document.documentElement.clientHeight,
				         rem: getRem(),
				popInputType: 'brand_frame',
 		   stor_content_show: 1,
		   	    popupVisible: false,//克重的弹出层
		         productType: null,
		    	  brandArray: null,//1、周大福，2、老凤祥，3、菜百，4、周生生，5、周大生，6老庙，7、中国黄金，8、山东黄金，9、中金
					  brand1: [],//饰品品牌数组
					  brand2: [],//投资金品牌数组
				 weight_show: false,//克重不足提示开关
			   zidingyiBrand: '',//自定义品牌
		               order: {//订单对象
				               checkType: '',//投资金的选择类型
				   			   productId: '',//投资金类型的产品ID
						     applyWeight: '10.0',//克重
						       brandType: null,//品牌
						          images: [],//手机上选择图片的图片地址
				                    urls: [],//存放上传后图片在服务器的地址
							   brandName: '',//自定义品牌
							},
						gram:'10.0',//用户手动输入的克重值
		         editOrderId: null, //需要重新填写的订单编号
		       estimatePrice: null, //预估金价
				screenHeight: document.documentElement.clientHeight,//记录高度值(这里是给到了一个默认值)
				       files: [], // 文件缓存（上传图片）
      			       index: 0, // 序列号 可记录一共上传了多少张
      			   maxLength: 9, // 图片最大数量
						//  url: openAPI()+'/v3/recycleOrder/uploadRecyclePic2',
						 url: '/api/v3/recycleOrder/uploadRecyclePic2',
					  canAdd: true, //添加图片加号是否显示
				 AndroVerson: checkAndroAgent(),
				   iosVerson: iosVersion(),
				greater_show: false,//输入克重大于10000克的提示信息开关
				        tips: false,

 			}
		},
		created(){
			//查看手机拍照读写权限(安卓手机需要验证)
			if(window.stub){
				window.openPhoto();
				window.close('cancel');
			}else{
			    this.canPhoto=true; //苹果手机不需要验证权限
			    this.noPhoto=false;
			}
		},
		mounted(){
			this.queryRecycleProduct();//查询存金产品列表
			this.queryChildDictionary();//查询存金产品品牌
			this.orderChange();//计算克重
			// document.getElementsByClassName('stor_box')[0].style.height=(this.clientHeight-(0.88*this.rem))+'px';
			document.getElementsByClassName('stor_box')[0].style.height=this.clientHeight+'px';
			//是从订单详情页跳转过来，需要重新填写订单
		    if(this.$route.query.from=='storOrderDet'){
		    	this.editOrderId=this.$route.query.id
		    	this.queryRecycleOrderDetail()
		    }
		    /*如果是从storAddress返回过来的，将之前保存的信息进行渲染*/
		    if(this.recycleParams && this.recycleParams!=''){
				this.order = this.recycleParams
				this.estimatePrice=this.order.applyWeight*this.currentPrice
				this.set_initRulerData(this.recycleParams.applyWeight)
			}
			//登录状态下请求福利券
			if(this.token){
				this.coupons();
			}
			//根据活动时间判断是否显示福利券信息
			// this.showWelfare();
		},
		computed:{
			...mapState({
				   token: state => state.token,
			currentPrice: state => state.currentPrice,
		   recycleParams: state => state.recycleParams,
		   	   rulerData: state => state.rulerData,
			  activityId: state => state.activityId,
		    }),
			//根据输入克重显示可用福利券
 		   	welfarePrice(){
 			   var weight = this.order.applyWeight;
			   var limitArr = this.couponLimitArr;
		
 			   if(weight>=200 && limitArr.indexOf(200)!=-1){
 				   return 748
 			   }else if(weight>=100 && limitArr.indexOf(100)!=-1){
 				   return 318
 			   }else if(weight>=50 && limitArr.indexOf(50)!=-1){
 				   return 108
 			   }else if(weight>=20 && limitArr.indexOf(20)!=-1){
 				   return 38
 			   }else if(weight>=10 && limitArr.indexOf(10)!=-1){
 				   return 18
 			   }else{
 				   return ''
 			   }
 		   },

		},
		watch:{
			//监听品牌选择
			brandType(val){
				if(val)this.checkBrand=false
			},
			//自定义品牌
			zidingyiBrand(val){
				this.checkBrand=false
				this.order.brandType=val
			},
			//标尺的值，同时也表示克重
			rulerData(val){
				this.order.applyWeight = val
				Number(val)<10?this.weight_show=true:this.weight_show=false
				this.orderChange()//计算金价
			},
			//输入的克重值
			gram(val){
				var str = clearNoNum(val,2);
				this.order.applyWeight=str
				this.gram=str
			},
			index(){ //监听一共上传了多少张确定添加图片是否显示
				if(this.index>=9){
					this.canAdd=false
				}else{
					this.canAdd=true
				}
			}
		},
		filters:{
			formatNum(val){
				if((!val && Number(val)!=0) || val==null) return;
				return Number(val).toFixed(2)
			},
			formatWeight(val){
				if((!val && Number(val)!=0) || val==null) return;
				return Number(val).toFixed(2)
			},
			brandTran: function(val){
				let brandStrArray = ['周大福','老凤祥','菜百','周生生','周大生','老庙','中国黄金','山东黄金','中金']
				for( var n=1;n<brandStrArray.length+1;n++){
					if(val==n){
						return brandStrArray[val-1]
					}
				}
				for(var n=1;n<brandStrArray.length+1;n++){
					if(val!=n){
						return val
					}
				}
			},
		},
		methods:{
			...mapMutations([
				'RECORD_RECYCLEPARAMS','set_initRulerData'
			]),
			//返回上一页
			goBack(){
				this.RECORD_RECYCLEPARAMS('')
				this.set_initRulerData(Number(10));//修改ruler的初始值
				if(this.$route.query.from=='coupon'){
					this.$router.push('/myCoupon')
				}else if(this.$route.query.from=='lottery'){
					window.location.href = this.$route.query.lotteryUrl;
					return
				}else{
					this.$router.push('/storeGold')
				}
				Indicator.close()
			},
			//查询存金产品列表
			async queryRecycleProduct(){
				const res = await queryRecycleProduct()
				this.productType=res.content
				if(this.recycleParams && this.recycleParams!='' || this.$route.query.id){

				}else{
					this.order.checkType = res.content[res.content.length-1].name//加载选中第一个的name值
					this.order.productId = res.content[res.content.length-1].id//加载选中第一个的id值
				}
			},
			//查询存金产品品牌
			async queryChildDictionary(){
				const res = await queryChildDictionary()
				for(var i=0;i<res.content.data.length;i++){
					for(var v in res.content.data[i]){
						if(v=='value'){
							this.brand1.push(res.content.data[i][v])//给首饰的品牌赋值
						}
					}
				}
				for(var j=0;j<res.content.data1.length;j++){
					for(var v in res.content.data1[j]){
						if(v=='value'){
							this.brand2.push(res.content.data1[j][v])///给投资金的品牌赋值
						}
					}
				}
				this.brandArray = this.brand1
			},
			// 福利券数量
			async coupons(){
				var that = this;
				var res = await coupons(4);//4--交易类型为存金
				if(res.code==100){
					if(res.content.usable.length==0){
						this.hasWelfare = false;
					}else{
						this.hasWelfare = true;
						res.content.usable.forEach(item=>{
							that.couponLimitArr.push(parseFloat(item.useLimit));
						})
					}
				}
			},
			// 控制福利券显示与隐藏
			// async showWelfare(){
			// 	var res = await activityInfo(this.activityId);
			// 	if(res.code==100){
			// 		var date1 = new Date(res.content.endTime.replace(/-/g,"/"));
			// 		var date2 = date1.setDate(date1.getDate() + 10);
			// 		if(Date.parse(new Date()) > date2){
			// 			this.welfareStatus =  false;
			// 		}else{
			// 			 this.welfareStatus = true;
			// 		}
			// 	}
			// },
			//投资金还是首饰
			checkTypeFun(id, name, index){
				this.order.productId = id
				this.checkBrand=true //切换类型时‘选填’字样出现
				this.order.checkType = name
				if(index==0){
					this.brandArray = this.brand2
				}else if(index==1){
					this.brandArray = this.brand1
				}
				if((typeof Number(this.order.brandType))=='number'){
					this.order.brandType=''
					this.checkBrand=true//选填
				}
			},
			//监听克重变化计算预估金价
			orderChange(){
				this.estimatePrice=this.order.applyWeight*this.currentPrice
			},
			//点击选择克重
			checkGramFun(){
				this.popInputType='gram_frame'
				this.popupVisible=true
			},
			//点击选择黄金品牌
			checkBrandFun(){
				this.popInputType='brand_frame'
				this.popupVisible=true
			},
			//自定义品牌选择
			zidingyiFun(){
				if(this.order.brandType=='' && (this.zidingyiBrand).toString().length==0){
					this.checkBrand=true//选填显示
					this.popupVisible=false
				}else{
					this.checkBrand=false
					this.order.brandType=this.zidingyiBrand
					this.popupVisible=false
				}
			},
			rewrite(){
				this.tips=false;
			},
			//关闭弹框
			close_pop(){
				if(this.order.applyWeight==''){
					alert('请输入克重')
				}else if(this.order.applyWeight.match(/^\d*\.$/)){
					var plu_0 = this.order.applyWeight.split('.')[0];
					this.$store.commit('set_rulerData', plu_0);
					this.popupVisible=false
				}else{
					this.popupVisible=false
				}
			},
			//存金说明弹框
			stor_state: function(){
				this.show=1,
				this.stor_content_show = 0
			},
			//关闭金价说明弹框
			closePop(){
				this.show=0
				this.stor_content_show = 1
			},
			//品牌选择
			brandCheck(val){
				this.checkBrand=false
				this.order.brandType=val
				this.popupVisible=false
			},
			//选择照片
			selectImage(e){
				//查看手机拍照读写权限
				if(this.noPhoto){
					//查看手机拍照读写权限
				    if(window.backPerInfo){
					    var res=window.backPerInfo();
					    if(res=='OK'){
						   this.canPhoto=true;
						   this.noPhoto=false;
						   document.querySelector().onchange();
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
				if(e.target.files && e.target.files.length){
					if((e.target.files.length+this.order.images.length)>9){
						Toast('最多上传9张图片')
						return;
					}
					this.selectImgs(e.target.files)
				}
			},
			// 选择图片
    		selectImgs (fileList) {
      			for (var  i = 0, len = fileList.length; i < len; i++) {
        			let item = {
          				key: this.index++,
          				name: fileList[i].name,
          				size: fileList[i].size,
          				file: fileList[i]
        			}
        			// 将图片文件转成BASE64格式
        			let reader = new FileReader()
        			reader.onload = (e) => {
          				this.$set(item, 'src', e.target.result)
						if(this.index>9){ //图片已达到9张 不在执行添加上传操作
						}else{
							this.files.push(item)
							this.order.images.push(item)
						}
						if(this.files.length==len){
							this.getpolicy(reader,item);
						}
					}
					reader.readAsDataURL(fileList[i])
				}
			},
			//获取上传图片凭证
			async getpolicy(reader,item){
				Indicator.open('上传中...')
				const res = await getpolicy();
				if(res.code=='000000'){
					this.param_policy=res.data
					this.format(reader,item)//图片处理（压缩或者不压缩）
				}else{
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
				// var img_size=item.size
				// if(img_size/1024/1024>3){
				// 	//进行压缩
				// 	compress(reader,img_size,item,that,uuid)
				// }else{
				// 	fd.append('file',item.file);//lic[0]如果获取不到文件，就用e.target.files[0]
				// 	// that.upload(formData);//图片上传接口(旧的)
				// 	that.uploadImage(fd,item,uuid);
				// }
			},
			//上传图片接口(新-oss)
			async uploadImage(val,item,uuid,random){
				const res = await uploadimg(val);
				var netimgurl = bucketName()+'.'+'oss-cn-beijing.aliyuncs.com/'+this.param_policy.dir+'/'+random+'-'+uuid+'-'+item.name;
				this.order.urls.push(netimgurl)
				this.files = [] // 清空文件缓存
				Indicator.close()
				Toast({
					message:'上传成功',
					duration: 800,
				});
			},
			/*删除图片*/
			delImage: function(index){
                this.order.images.splice(index,1)
				this.order.urls.splice(index,1)
				this.index--
                if(this.order.images.length==0){
                }
			},
			//从订单详情跳转过来，给页面的数据赋值
            async queryRecycleOrderDetail(){
            	var res=await queryRecycleOrderDetail(this.editOrderId)
            	if(res.code==100){
            		this.order.checkType=res.content.productName
            		this.order.applyWeight=res.content.applyWeight
            		this.gram=res.content.applyWeight
					this.order.brandType=res.content.brandType
					//如果是自定义的品牌，就将brandType的值赋值成brandName的值
					if(this.order.brandType==10 && res.content.brandName){
						this.order.brandType=res.content.brandName
					}
					//之前订单没有选品牌也没有自定义品牌
					if(!this.order.brandType){
						this.checkBrand=true //选填显示
					}else{
						this.checkBrand=false
					}
					if(this.order.brandType==10){
						this.checkBrand=true//选填选项
					}
					//初始化brandArray
					if(this.order.productName=='投资金'){
						this.brandArray=this.brand2
					}else{
						this.brandArray=this.brand1
					}
            		this.order.productId=res.content.productId
            		var imgs=res.content.recycleDocumentVos
            		for(var i=0,length=imgs.length;i<length;i++){
            			if(imgs[i].type==0){
							var srcObj = {src:imgs[i].url}
            				this.order.images.push(srcObj)
            				this.order.urls.push(imgs[i].url)
            			}
            		}
            		this.weight_show=false
            		this.estimatePrice=Number(this.order.applyWeight)*Number(this.currentPrice)
            	}
			},
			 //提交订单
            submitBuyBackOrder(){
				if(this.order.applyWeight==''){
					Toast('克重不能为空')
					return
				}else if(this.order.applyWeight==0){
					Toast('克重不能为0')
					return
				}else if(this.order.applyWeight>10000){
					this.tips=true
					return
				}else if( this.order.images.length==0 ){
					Toast('至少上传一张存金图片')
					return
				}
    			if(!this.token){
					this.RECORD_RECYCLEPARAMS(this.order)
					this.$router.push({
						path:'/loginIn',
			   			query:{
				    		redirect:'/storAddress'
			    		}
		    		})
				}else{
					this.RECORD_RECYCLEPARAMS(this.order)
					this.$router.push({
						path:'/storAddress'
					})
				}
			},
		},
		activated: function () {

		},
		components:{
			headTop: headTop,
			  ruler: ruler
		}

	}
</script>
<style type="text/css" scoped>
*{
	margin: 0;
	padding: 0;
	box-sizing: border-box;
}
.write_order{
	width: 100%;
	position: relative;
	background-color: #ffffff;
}
.stor_content{
	padding: 0;
	margin-top: .88rem;
	padding-bottom: 2rem;
}
/*金价*/
.price{
	font-size: .28rem;
	height: 1rem;
	line-height: 1.2rem;
	padding-left: .3rem;
}
.price>span:first-child{
	color: #333333;
}
.price>span:nth-child(2){
	color: #EDA835;
	font-size: .3rem;
}
/*预估金价*/
.estimate_value{
	font-size: .28rem;
	padding-left: .3rem;
}
.estimate_value>span:nth-child(2){
	font-size: .44rem;
	color: #EDA835;
}
.title_one,.title_two{
	height: 1.1rem;
	line-height: 1.1rem;
	background-color: #f5f5f5;
	margin-top: 0;
	font-size: .32rem;
	margin-top: .4rem;
	padding-left: .3rem;
}
.title_two{
	margin-top: 0rem;
}
/*订单部分*/
.order_item{
	width: 100%;
}
/*订单行*/
.item_row{
	display: block;
	height: 1.1rem;
	font-size: .28rem;
	width: 100%;
	position: relative;
}
.item_row>span{
	display: inline-block;
	height: 1.1rem;
	line-height: 1.2rem;
}
/*订单第一行*/
.item_row_1{
	width: 92%;
	margin-left: 4%;
	margin-right: 4%;
}
.item_row_1>span:first-child{
	float: left;
}
.item_row_1>span:not(:nth-child(1)){
	position: relative;
	float: right;
	padding-left: .5rem;
	margin-right: .4rem;
}
.item_row_1>span:nth-child(2){
	float: right;
	margin-right: 0;
}
.item_row_1_unchecked:before{
	content: '';
	width: .38rem;
	height: .38rem;
	background-image: url(../../images/select_gray.png);
	background-size: .36rem .36rem;
	background-repeat: no-repeat;
	position: absolute;
	left: 0;
	top: 0.39rem;
}
.item_row_1_checked:before{
	content: '';
	width: .38rem;
	height: .38rem;
	background-image: url(../../images/select_orange.png);
	background-size: .36rem .36rem;
	background-repeat: no-repeat;
	position: absolute;
	left: 0;
	top: .39rem;
}
@media(-webkit-min-device-pixel-ratio:1.5),(min-device-pixel-ratio:1.5),(-o-min-device-pixel-ratio:1.5){
	.item_row:after{
		content: '';
		display: inline-block;
		width: 90%;
		border-bottom: 1px solid #eee;
		-webkit-transform: scaleY(0.7);
		-o-transform: scaleY(0.7);
		-moz-transform: scaleY(0.7);
		transform: scaleY(0.7);
		position: absolute;
		bottom: 0px;
		left: 0;
	}
	.brand_box>section:after{
		content: '';
		display: inline-block;
		width: 100%;
		border-bottom: 1px solid #eee;
		-webkit-transform: scaleY(0.7);
		-o-transform: scaleY(0.7);
		-moz-transform: scaleY(0.7);
		transform: scaleY(0.7);
		position: absolute;
		bottom: 0px;
		left: 0;
	}
}
@media(-webkit-min-device-pixel-ratio:2),(min-device-pixel-ratio:2),(-o-min-device-pixel-ratio:1.5){
	.item_row:after{
		content: '';
		display: inline-block;
		width: 100%;
		border-bottom: 1px solid #eee;
		-webkit-transform: scaleY(0.5);
		-o-transform: scaleY(0.5);
		-moz-transform: scaleY(0.5);
		transform:scaleY(0.5);
		position: absolute;
		bottom: 0px;
	}
	.brand_box>section:after{
		content: '';
		display: inline-block;
		width: 100%;
		border-bottom: 1px solid #eee;
		-webkit-transform: scaleY(0.5);
		-o-transform: scaleY(0.5);
		-moz-transform: scaleY(0.5);
		transform: scaleY(0.5);
		position: absolute;
		bottom: 0px;
		left: 0;
	}
}
.item_row_2{
	margin-left: 4%;
	width: 92%;
	background-position: right .37rem;
    background-repeat: no-repeat;
    background-size: .15rem;
	position: relative;
}
.item_row_3{
	margin-left: 4%;
	width: 92%;
	background-image: url(../../images/right_jian.png);
	background-position: right .37rem;
    background-repeat: no-repeat;
    background-size: .15rem;
}
.item_row_2>span:first-child,item_row_3>span:first-child{
	float: left;
    height: 1.1rem;
    line-height: 1.1rem;
}
/* .item_row_2>span:nth-child(2){
    float: right;
    height: 1.1rem;
    line-height: 1.1rem;
    padding-right: .4rem;
} */
.item_row_2>span:nth-child(2){
	float: right;
    height: 1.1rem;
    width: .7rem;
    line-height: 1.1rem;
    text-align: left;
    background-image: url('../../images/input_gram.png');
    background-size: 38%;
    background-position: .35rem center;
    background-repeat: no-repeat;
}
.item_row_3>span:nth-child(2){
	float: right;
    height: 1.1rem;
    line-height: 1.1rem;
    padding-right: .4rem;
}
.item_row_4{
	width: 92%;
	height: 1.1rem;
	margin-left: 4%;
}
.item_row_4>span:nth-of-type(2){
	float: right;
	color: #EDA835;
    height: 1.1rem;
    line-height: 1.1rem;
}
.item_row_5{
	width: 92%;
	margin-left: 4%;
	height: 1.4rem;
	padding:.4rem 0;
	display: flex;
	align-items: flex-start;
	justify-content: space-between;
}
.item_row_5>span{
	height: 1.4rem;
	line-height: normal;
}
.item_row_5 .has-coupon{
	float: right;
	color: #999;
	font-size: .24rem;
	text-align: right;
}
.item_row_5 .has-coupon>p:nth-of-type(1){
	color: #EDA835;
	font-size: .28rem;
}
/*上传图片*/
.uploadPho_photo{
	width: 100%;
	padding-top: .1rem;
	padding-bottom: .3rem;
	padding-left: 4%;
	padding-right: 4%;
}
/*添加图片按钮*/
.add_img_label{
	width: 2.1rem;
	height: 2.1rem;
	font-size: .2rem;
	color: #999999;
	text-align: center;
	background-color: #f5f5f5;
	padding-top: .7rem;
	margin-top: .3rem;
	font-size: .24rem;
	color: #999999;
	float:left;
}
.add_img_label>div>span{
	display: inline-block;
	width: 100%;
}
.add_img_label>div>span:nth-child(2){
	margin-top: .1rem;
}
.add_img_label>div>img{
	width: .6rem;

}
.upload_image_preview{
	list-style: none;
	overflow: hidden;
	box-sizing: border-box;
}
.upload_image_preview>section{
	position: relative;
	float: left;
	margin-top: .28rem;
	margin-right: .28rem;
}
.upload_image_preview>section:nth-child(3){
	margin-right: 0;
}
.upload_image_preview>section:nth-child(6){
	margin-right: 0;
}
.upload_image_preview>section:nth-child(9){
	margin-right: 0;
}
.upload_image_preview .thing_img{
	width: 2.1rem;
	height: 2.1rem;
	border: 1px solid #eaeaea;
}
.upload_image_preview>section>.del_image{
	width: .35rem;
	height: .35rem;
	position: absolute;
	top: -.1rem;
	right: -.03rem;
	border-radius: 50%;
	-webkit-border-radius: 50%;
	-moz-border-radius: 50%;
	-o-border-radius: 50%;
	background-image: url(../../images/delImg.png);
	background-position: center;
	background-size: 100%;
}
.mint-popup-bottom{
	width: 100%;
	background-color: #ffffff;
}
.mint-popup.mint-popup-bottom{
	border-radius: 0;
}
.gram_tip{
   width: 100%;
    height: .5rem;
    line-height: .5rem;
    font-size: .22rem;
    color: #FF6D39;
    text-align: left;
    padding-left: .84rem;
    margin-top: 2.69rem;
    text-align: left;
}
/*弹出的输入层*/
.stor_box{
	width: 100%;
	background-color: #fff;
	position: absolute;
	top: 0rem;
	z-index: 9;
	padding: 0 .56rem;
}
.closePopup{
	width: 100%;
	height: 3rem;
	line-height: 3rem;
	text-align: center;
}
.closePopup img{
	width: .46rem;
	height: .52rem;
}
.priceTitle{
	font-size: .38rem;
	color: #000;
	height: 2.6rem;
	line-height: 3.5rem;
	text-align: center;
	border-bottom: 1px solid #eeeeee;
	vertical-align: center;
}
.mess{
	font-size: .28rem;
	color: #666666;
}
.submit_buyBack_order{
	width: 100%;
	height: 1rem;
	text-align: center;
	position: fixed;
	bottom: 0;
}
.submit_buyBack_order>div{
	display: inline-block;
	width: 100%;
	height: 1rem;
	line-height: 1rem;
	text-align: center;
	background-color: #F2B643;
	color: #ffffff;
	font-size: .34rem;
}
.submit_buyBack_order>div:active{
	width: 100%;
	height: 1rem;
	line-height: 1rem;
	text-align: center;
	background-color: #f1c26a;
	color: #ffffff;
	font-size: .34rem;
}
.brand_box{
	width: 100%;
	padding: 0 .3rem 0.2rem .3rem;
}
.brandItem{
	width: 100%;
	height: 1.1rem;
	line-height: 1.1rem;
	font-size: .3rem;
	text-align: center;
	color: #333333;
	text-align: center;
	position: relative;
}
.gramItem{
	width: 100%;
	/* height: 5.5rem; */
	height: 4.3rem;
	background-color: #ffffff;
	position: relative;
}
.confirm{
	float: right;
	width: .8rem;
	height: .5rem;
	line-height: .5rem;
	background-color: #F2B643;
	color: #ffffff;
	font-size: .24rem;
	text-align:center;
	border-radius: 3px;
	margin-top: .07rem;
}
.gram_title{
	font-size: .34rem;
	color: #000000;
	text-align: center;
	position: relative;
	padding-top:.44rem;
	z-index: 10;
}
.gram_confirm{
	font-size: .28rem;
	font-weight: bold;
	color: #666666;
	font-weight: normal;
	display: inline-block;
	position: absolute;
	right: 10px;
}
.user-defined{
	border: 1px solid #eeeeee;
	height: .7rem;
	width: 3rem;
	margin-left: .77rem;
	text-align: center;
	font-size: .3rem;
}
.ruler{
	width: 100%;
	position: absolute;
	top: 10%;
}
.input_gram{
	width: 70%;
	height: .40rem;
	font-size: .32rem;
	margin-top: .34rem;
	text-align: right;
	float:right;
	padding-right:0.1rem;
}
.tip_gram_less{
	color:#FF6D39;
	font-size:.22rem;
	background-color:#f5f5f5;
	height: .58rem;
	line-height: .58rem;
	background-image:url("../../images/gantanhao.png");
	background-repeat: no-repeat;
    background-position: .25rem 0.15rem;
    background-size: .23rem;
    padding-left: .65rem;
}
.tip_gram_greater{
	color:#FF6D39;
	font-size:.22rem;
	background-color:#f5f5f5;
	height: .88rem;
	background-image:url("../../images/gantanhao.png");
	background-repeat: no-repeat;
    background-position: .25rem 0.15rem;
    background-size: .23rem;
    padding-left: .65rem;
	padding-top:.12rem;
	padding-bottom:.12rem;
}
/*克重大于10000克的提示信息*/
.cover{
	width: 100%;
	min-height: 100vh;
	background-color:rgba(0, 0, 0, 0.5);
	position: fixed;
	top:0;
	z-index: 100;
}
.pop_message_box{
	width: 4.9rem;
	height: 3.33rem;
	background-color:#fff;
	position: absolute;
	left:50%;
	margin-left:-2.45rem;
	margin-top:-1.15rem;
	top:50%;
	border-radius:4px;
}
.pop_title{
	line-height: .8rem;
    font-size: .32rem;
    font-weight: 500;
    color: rgba(51,51,51,1);
    text-align: center;
    padding-top: .15rem;
}
.pop_message{
	font-size:.26rem;
	font-weight:330;
	color:#333;
	line-height:.4rem;
	padding:0 .25rem 0 .25rem;
	margin-bottom: .31rem;
}
.pop_bottom{
	width: 100%;
	height: .88rem;
	position: absolute;
	bottom:0;
}
.pop_bottom_left,.pop_bottom_right{
	width: 50%;
	float: left;
	font-size:.34rem;
	font-weight:400;
	color:rgba(237,168,53,1);
	line-height: .88rem;
	text-align:center;
}
.pop_bottom_right>a{
	color:rgba(237,168,53,1);
}
.pop_bottom:before{
	content:'';
	display: inline-block;
	height: .88rem;
	position: absolute;
	right:50%;
	top:0; 
	border-right:1px solid #dddddd;
    transform: scaleX(0.5);
    transform-origin:0 0;
    overflow: hidden;
}
</style>
