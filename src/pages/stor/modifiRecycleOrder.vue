<template>
	<div class="modify_recycle_order">
		<head-top headTitle='修改订单'>
			<img slot='head_goback' src='../../images/back.png' class="head_goback" @click="goBack">
		</head-top>
		<div class="stor_content">
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
				<content class="item_row item_row_2" @click="checkGramFun()">
					<span>黄金克重</span>
					<span>{{order.applyWeight | formatWeight}}克</span>
				</content>
				<content class="item_row item_row_3" @click="checkBrandFun()">
					<span>选择品牌</span>
					<span><span style="color:#999999;" v-show="checkBrand">选填</span><span v-show="!checkBrand"  style="color:#333333;">{{order.brandType | brandTran}}</span></span>
				</content>
				<!-- 选择图片 -->
				<h3 class="title_two">存金图片<span style="color:#999999;font-size: .28rem;">（请上传实物、发票等相关图片，最多9张）</span></h3>
				<div class="uploadPho_photo">
					<div class="upload_image_preview">
						<section v-for="(item, index) in order.images" :key="index">
							<img :src="item" class="modify_img">
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
                <!-- 取件地址 -->
                <div class="title">
                    <span>取件地址</span>
                </div>
                <section class="name_tel_addr"  @click="toAddress()">
                    <div class="addr_left">
                        <section class="_name_tel">
                            <span class="__name">{{order.contact}}</span>
                            <span class="__tel">{{order.telephone}}</span>
                        </section>
                        <section class="_addr">{{order.address}}</section>
                    </div>
                    <div class="addr_right"></div>
                </section>
                <!-- 存金方式 -->
                <div class="title">
                    <span>存金方式</span>
                </div>
                <section class="is_cash">
                    <div class="isCash_top isCash_unChecked" :class="{'isCash_checked':direct}" @click="checkCash(0)">
                        <span style="font-size: .28rem;color: #666666;margin-left: .85rem;margin-right: .2rem;">存入克重</span><span style="color: #EDA835;font-size: .24rem;" v-show="direct">保值抗通胀，可随时卖金变现</span>
                    </div>
                    <div class="isCash_bottom isCash_unChecked" :class="{'isCash_checked':!direct}" @click="checkCash(1)">
                        <span style="font-size: .28rem;color: #666666;margin-left: .85rem;margin-right: .2rem;">直接变现</span><span style="color: #EDA835;font-size: .24rem;" v-show="!direct">按结算当日实时金价直接变现到银行卡</span>
                    </div>
                </section>
                <!-- 银行卡号 -->
                <div class="title" v-show="!direct">
                    <span>银行卡号</span>
                </div>
                <div>
                    <div class="bank_content add_bank" @click="goto_bindBank" v-show="!direct && !isHasBank">
                        <span>绑定银行卡</span>
                        <img src="../../images/right_jian.png">
                    </div>
                    <div class="bank_content has_bank" v-show="!direct && isHasBank"> 
                        <span>{{bankCardName}}</span> 
                        <span style="float: right;font-size:.24rem;">{{bankCardNo | tran_bankCardNo }}</span>
                        <img :src="bankCardImg">
                    </div>
                </div>
                <!-- 身份认证 -->
                <div class="title" v-show="hasUploadPhoto">
					<span>身份认证</span>
					<label class="id_photo_in" for="idCardInput" @click="updataIdCradImg">
						<input type="file" accept="image/*" name="file" class="ipt" @change="updataIdCradImg" v-if="canPhoto" id="idCardInput">
						<img :src="photo"  @click="updataIdCradImg">
					</label>
				</div>
                <!-- 风险提示 -->
                <section class="argument">
                    <input type="checkBox" class="check">
                    <strong :class="{'change1':bg,'change2':!bg}" @click="changeBg" ref="arg"></strong>
                    <div @click="arg" style="padding-top: .02rem;padding-left: .1rem">
                        <span class="txt">我已阅读并同意<span style="color:#999999;">《黄金管家存金服务协议》</span></span>
                    </div>
                </section>
			</div>
		</div>
		<div class="submit_buyBack_order" @click="submitBuyBackOrder">
			<div>提交</div>
		</div>
		<mt-popup position="bottom"  :closeOnClickModal="false" v-model="popupVisible" class="mint-popup-bottom">
			<!-- 黄金品牌选择 -->
			<div class="brand_box" v-if="popInputType=='brand_frame'">
				<section class="brandItem" v-for="(item,index) in brandArray" @click="brandCheck(item)" :key="index">{{item | brandTran}}</section>
				<section style="text-align:center;padding-top:.2rem;">
					<input type="text" placeholder="其他品牌" v-model="zidingyiBrand" class="user-defined"><span @click="zidingyiFun" class="confirm">确定</span>
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
	</div>
</template>
<script type="text/javascript">
	import headTop from '@/components/header/head.vue'
	import ruler from '@/components/ruler/ruler.vue'
	import { clearNoNum } from '../../config/mUtils.js'
	import { queryRecycleProduct,queryRecycleOrderDetail,updateRecycleOrder,xmlUploadImg,withDrawMax,queryMyProfil,queryChildDictionary,queryBankCard,getpolicy,uploadimg } from '@/service/getData.js'
	import { mapState,mapMutations } from 'vuex'
	import { MessageBox, Toast, Indicator,Popup } from 'mint-ui'
	import { getRem,openAPI,checkAndroAgent,iosVersion,bucketName } from "@/config/mUtils"
	import '../../config/ruler.js'
	export default{
		data () {
			return {
				  	checkBrand: true,//黄金品牌是否有值 true没值 false有值(这个状态从详情接口获取)
				      canPhoto: false,//可以拍照
		               noPhoto: true, //不可以拍照
				  popInputType: 'brand_frame',//弹框类型(选克重 选品牌)
		   	      popupVisible: false,//克重的弹出层
		           productType: null,//存金类型
					brandArray: null,//1、周大福，2、老凤祥，3、菜百，4、周生生，5、周大生，6老庙，7、中国黄金，8、山东黄金，9、中金
				        brand1: [],//饰品品牌数组
				        brand2: [],//投资金品牌数组
				   weight_show: false,//克重不足提示开关
			   	 zidingyiBrand: '',//自定义品牌
				        direct: true,//是否提现
					 bank_show: false,
					 isHasBank: false,//是否已绑卡
				  bankCardName: '',
					bankCardNo: '',
				   bankCardImg: '',
					        bg: true,//是否阅读了协议
					 realnamed: null,//是否实名认证过
				hasUploadPhoto: false,//false上传过手持身份证件照，true没有上传
					     photo: '',//渲染身份证
					     order: {//订单对象
								  contact: '',
								telephone: '',
								  address: '',
								       id: '',
								   isCash: null,
								    idPic: '',
				               	checkType: '',//投资金的选择类型
				   			   	productId: '',//投资金类型的产品ID
						      applyWeight: '',//克重
						       	brandType: '',//品牌
						          picUrls: [],//手机上选择图片的后台返回图片地址
								brandName: '',	//存金品牌自己自定义的
							  productName: '', //存金类型
								   images: [],//存金实物图片本地地址（有正式ip 有base64）
	   			 			},
		       	 estimatePrice: null, //预估金价
				         files: [], // 文件缓存（上传图片）
      			         index: 0, // 序列号 可记录一共上传了多少张
      			   	 maxLength: 9, // 图片最大数量
						apiUrl: openAPI()+'/v3/recycleOrder/uploadRecyclePic2',
					    canAdd: true, //添加图片加号是否显示
						   url: '',//重新选择idCard图片的地址
					  btn_lock: '',//频繁操作开关
				   AndroVerson: checkAndroAgent(),
				     iosVerson: iosVersion(),
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
			this.queryMyProfil() //查看是否已实名绑卡时需要
			this.queryChildDictionary();//查询存金产品品牌
			this.queryRecycleProduct(); //查看存金产品类型
			this.queryBankCard() //查看绑卡情况
			this.orderChange();//计算克重
		    // /*根据上一个页面是哪个(我的地址页 存金协议 实名认证 绑卡)，将之前保存的信息进行渲染*/
		    if((this.$route.query.from==3 || this.$route.query.from=='bindBank') && this.modifiRecycleParams){
				this.order = this.modifiRecycleParams
				this.checkBrand=this.order.checkBrand
				this.direct=this.order.direct
				this.estimatePrice=this.order.applyWeight*this.currentPrice
				this.initWeight=this.order.applyWeight
				//初始化brandArray
				if(this.order.productName=='投资金'){
					this.brandArray=this.brand2
				}else{
					this.brandArray=this.brand1
				}
				if(this.modifiRecycleParams.idPic){
					this.photo=this.modifiRecycleParams.idPic
				}
				if(this.address){
					this.order.address=this.address.address
					this.order.contact=this.address.contact
					this.order.telephone=this.address.telephone
				}
				return
			} //直接从vuex拿数据时不需要查询详情
		    this.queryRecycleOrderDetail()
		},
		computed:{
			...mapState({
				currentPrice: state => state.currentPrice,
				rulerData: state => state.rulerData,
				modifiRecycleParams: state => state.modifiRecycleParams,
				address:state => state.address,
				userInfo: state => state.userInfo
    		})
		},
		watch:{
			//自定义品牌
			zidingyiBrand(val){
				this.checkBrand=false
				this.order.brandType=val
				this.order.brandName=val
			},
			//标尺的值，同时也表示克重
			rulerData(val){
				this.order.applyWeight = val
				Number(val)<10?this.weight_show=true:this.weight_show=false
				this.orderChange()//计算金价
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
			tran_bankCardNo: function(val){
				return val.slice(0,3)+'**********'+val.slice(val.length-3,val.length)
			},
			formatNum(val){
				if((!val && Number(val)!=0) || val==null) return;
				return Number(val).toFixed(2)
			},
			formatWeight(val){
				if((!val && Number(val)!=0) || val==null) return;
				return Number(val).toFixed(1)
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
				'RECORD_MODIFIRECYCLEPARAMS','RECORD_RETURNRECYCLEORDER','RECORD_ADDRESS','RECORD_USERINFO','set_initRulerData'
			]),
			//获取用户银行卡
            async queryBankCard(){
                const res = await queryBankCard()
                if(res.code==100){
                    if(res.content.length==0){
                        this.isHasBank = false
                    }else{
                        this.isHasBank = true
						this.bankCardNo = res.content[0].bankCardNo
						this.withDrawMax(this.bankCardNo)
                    }
                }
			},
			//判断是否实名认证过,是否上传过身份证证件照片
			async queryMyProfil(){
				var res=await queryMyProfil()
				if(res.code==100){
					this.RECORD_USERINFO(res.content)
					this.realnamed=res.content.realnamed
					if(this.userInfo){
							this.userInfo.isHandheldIDphoto==1?this.hasUploadPhoto=0:this.hasUploadPhoto=1
						}
				}
			},
			//通过银行卡号获取银行卡名称和logo
			async withDrawMax(cardNo){
				var res=await withDrawMax(cardNo)
				if(res.code==100){
					this.bankCardName=res.content.bankName
					this.bankCardImg=res.content.bankImgUrl
				}
			},
			//立即绑卡
            goto_bindBank(){
				if(this.url){
					this.order.idPic=this.url
				}
				this.order.direct=this.direct  //记录是否选择提现
				this.order.checkBrand=this.checkBrand //记录是否有选品牌还是选填状态
				this.order.isCash=this.direct==true ? 2 : 1
      			this.RECORD_MODIFIRECYCLEPARAMS(this.order)
               	if(this.realnamed!=1){
                    this.$router.push({
                    	path:'/personHomepage/authentication',
                    	query: {
                    		paths: '/modifiRecycleOrder'
                    	}
                    })
               	}else{
                    this.$router.push({
                    	path:'/personHomepage/bindBank',
                    	query:{
                    		paths: '/modifiRecycleOrder'
                    	}
                    })
               	}
            },
			//重新选择证件照
			updataIdCradImg(e) {
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
				Indicator.open();
				var _this=this;
				var targetFile = e.target.files[0];
				let item = {
					name: e.target.files[0].name,
					size: e.target.files[0].size,
					file: e.target.files[0],
				}
				var reader = new FileReader();
				reader.readAsDataURL(e.target.files[0]);
				reader.onload = function(evt) {
					Indicator.close();
					_this.photo=evt.target.result;
					// _this.uploadRecyclePic(evt.target.result,targetFile);
					_this.getpolicy2(reader,item)
                }
			},
			//获取上传图片凭证
			async getpolicy2(reader,item){
				const res = await getpolicy();
				if(res.code=='000000'){
					this.param_policy=res.data
					this.format2(reader,item)//图片处理（压缩或者不压缩）
				}else{
					Toast('获取参数失败');
				}
			},
			//图片处理
			format2(reader,item){
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
				fd.append('file',item.file)
				that.uploadImage2(fd,item,uuid,random);
			},
			//上传图片接口(新-oss)
			async uploadImage2(val,item,uuid,random){
				const res = await uploadimg(val);
				var netimgurl = bucketName()+'.'+'oss-cn-beijing.aliyuncs.com/'+this.param_policy.dir+'/'+random+'-'+uuid+'-'+item.name;
				this.url=netimgurl;
				this.order.idPic=netimgurl;
				Indicator.close()
				Toast({
					message:'上传成功',
					duration: 800,
				});
			},

            //图片上传
			// uploadRecyclePic(value) {
			// 	//参数一表示vue实例，参数二表示base64格式的图片，参数三表示方法，参数四表示mint-ui的加载的动画，参数五是Toast提示，参数六是缩小的比例,参数七表示订单数组的索引值
 			// 	xmlUploadImg(this,value,'',Indicator,Toast)
            // },
			//图片上传
			uploadRecyclePic(value,value2) {
				//参数一表示vue实例，参数二表示base64格式的图片，参数三表示方法，参数四表示mint-ui的加载的动画，参数五是Toast提示，参数六是缩小的比例,参数七表示订单数组的索引值，参数八表示选中的图片文件
 				xmlUploadImg(this,value,'',Indicator,Toast,'','',value2)
            },
			//选择是否变现
			checkCash(val){
				if(val==0){
					this.direct=true
					this.order.isCash=2
				}else{
					this.direct=false
					this.order.isCash=1
				}
			},
			//去地址页
      		toAddress(){
				if(this.url){
					this.order.idPic=this.url
				}
				this.order.direct=this.direct  //记录是否选择提现
				this.order.checkBrand=this.checkBrand //记录是否有选品牌还是选填状态
				this.order.isCash=this.direct==true ? 2 : 1
      			this.RECORD_MODIFIRECYCLEPARAMS(this.order)
				this.$router.push({
      					path:'/personHomepage/address',
      				    query:{
      						from: 3,//参数3表示是从存金业务类型跳到我的地址页的
      					}
      				})
      		},
			//去存金协议页
            arg(){
				if(this.url){
					this.order.idPic=this.url
				}
				this.order.direct=this.direct //记录是否选择提现
				this.order.checkBrand=this.checkBrand //记录是否有选品牌还是选填状态
				this.order.isCash=this.direct==true ? 2 : 1
      			this.RECORD_MODIFIRECYCLEPARAMS(this.order)
            	this.$router.push({
					path: "/storArg",
					query:{
						from:3
					}
            	})
			},
			//协议阅读与否
			changeBg(){
				this.bg=!this.bg;
			},
			//返回上一页
			goBack(){
				this.$router.push({
					path:'/storOrderDet',
					query:{
						id:this.order.id
					}
				})
				Indicator.close()
			},
			//查询存金产品列表
			async queryRecycleProduct(){
				const res = await queryRecycleProduct()
				if(res.code==100){
					this.productType=res.content
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
			},
			//投资金还是首饰
			checkTypeFun(id, name, index){
				this.order.productId = id
				this.order.checkType = name
				this.order.productName=name
				this.order.brandName=''
				// this.zidingyiBrand=''
				this.checkBrand=true //切换类型时‘选填’字样出现
				if(index==0){
					this.brandArray = this.brand2
				}else if(index==1){
					this.brandArray = this.brand1
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
					this.popupVisible=false
				}
			},
			//关闭弹框
			close_pop(){
				if(this.order.applyWeight==''){
					alert('请输入克重')
				}else{
					this.popupVisible=false
				}
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
					if((e.target.files.length+this.order.picUrls.length)>9){
						Toast('最多上传9张图片')
						return;
					}
					this.selectImgs(e.target.files)
				} 
			},
			/*删除图片*/
			delImage: function(index){
                this.order.images.splice(index,1)
				this.order.picUrls.splice(index,1)
				this.index--
                if(this.order.images.length==0){
                }
            },
			//提交订单
            async submitBuyBackOrder(){
				if(this.url){ //更改证件照
					this.order.idPic=this.url
				}
				if(this.order.applyWeight==0){
					Toast({
						message:'克重不能为0',
						position: 'bottom'
					})
					return
				}else if( this.order.picUrls.length==0 ){
					Toast({
						message:'至少上传一张存金图片',
						position: 'bottom'
					})
					return
				}else if(!this.direct && !this.isHasBank){
					Toast({
        				message: '请先绑定银行卡',
        				position: 'bottom',
            		})
					return
            	}else if( this.hasUploadPhoto && this.photo=='' && this.url==''){
            		Toast({
            			message: '请上传手持身份证',
            			position: 'bottom',
            		})
					return
            	}else if(this.bg==false){
            		Toast({
            			message: '请同意存金服务协议',
            			position: 'bottom',
            		})
					return
            	}
				if(this.btn_lock==true){
					Toast({
						message:'频繁操作',
						position: 'bottom'
					})
					return
				}
				this.btn_lock=true
				this.set_initRulerData(Number(10))//标尺的值进行初始化
				Indicator.open()
				var aa = JSON.stringify([{url:this.order.picUrls}]);
				if(this.order.brandName && (Number(this.order.brandType)!=1&&Number(this.order.brandType)!=2&&Number(this.order.brandType)!=3&&Number(this.order.brandType)!=4&&Number(this.order.brandType)!=5&&Number(this.order.brandType)!=6&&Number(this.order.brandType)!=7&&Number(this.order.brandType)!=8&&Number(this.order.brandType)!=9)){ //有自定义的品牌
					var brand_name=this.zidingyiBrand || this.order.brandName
					var  res = await updateRecycleOrder(this.order.contact,this.order.telephone,this.order.address,this.order.id,this.order.isCash,this.order.productId,this.order.idPic,'',10,this.order.applyWeight,aa,brand_name);
				}else if(this.checkBrand){ //品牌没空
					var res = await updateRecycleOrder(this.order.contact,this.order.telephone,this.order.address,this.order.id,this.order.isCash,this.order.productId,this.order.idPic,'',10,this.order.applyWeight,aa,'');
				}else{ 
					var res = await updateRecycleOrder(this.order.contact,this.order.telephone,this.order.address,this.order.id,this.order.isCash,this.order.productId,this.order.idPic,'',this.order.brandType,this.order.applyWeight,aa,'');
				}		
				if(res.code==100){
					Indicator.close()
					const or = {
						  contact: this.order.contact,
						telephone: this.order.telephone,
						  address: this.order.address,
					   bankCardNo: this.bankCardNo,
					   isWithDraw: this.direct ?0:1,
					   orderArray: res.content.vo,
					}
					this.RECORD_RETURNRECYCLEORDER(or)
					this.$router.push({
						path: '/storResult',
					})
					this.btn_lock=false
					this.RECORD_MODIFIRECYCLEPARAMS(null)
					this.RECORD_ADDRESS(null)
        	    }else if(res.code==2004){
					Indicator.close()
        	    		Toast({
        	    			message: '操作过于频繁',
        	    			position: 'bottom'
						})
						this.RECORD_MODIFIRECYCLEPARAMS(null)
						this.RECORD_ADDRESS(null)
				}else{
					Indicator.close()
					this.btn_lock=false
					this.RECORD_MODIFIRECYCLEPARAMS(null)
					this.RECORD_ADDRESS(null)
				}
            },
            //从订单详情跳转过来，给页面的数据赋值
            async queryRecycleOrderDetail(){
            	var res=await queryRecycleOrderDetail(this.$route.query.id)
            	if(res.code==100){
            		this.order.checkType=res.content.productName
            		this.order.applyWeight=res.content.applyWeight
					this.order.brandType=res.content.brandType
					//如果是自定义的品牌，就将brandType的值赋值成brandName的值
					if(this.order.brandType==10 && res.content.brandName){
						this.order.brandType=res.content.brandName
						this.order.brandName=res.content.brandName
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
            		this.order.contact=res.content.contact
            		this.order.telephone=res.content.telephone
					this.order.address=res.content.address
					this.order.id=res.content.id
					this.order.isCash=res.content.isCash
					this.order.productId=res.content.productId
					this.order.applyWeight=res.content.applyWeight
					this.set_initRulerData(this.order.applyWeight)
					this.order.productName=res.content.productName
					//初始化brandArray
					if(this.order.productName=='投资金'){
						this.brandArray=this.brand2
					}else{
						this.brandArray=this.brand1
					}
					if(this.order.isCash==2){
						this.direct=true
					}else{
						this.direct=false
					}
            		this.order.productId=res.content.productId
					var arrDocument=res.content.recycleDocumentVos;
          			for(var i=0,length=arrDocument.length;i<length;i++){
            			if(arrDocument[i].type==0){
							this.order.picUrls.push(arrDocument[i].url)
							this.order.images.push(arrDocument[i].url)
							this.index=this.order.images.length
            			}
            			if(arrDocument[i].type==3){  //身份证件照
							this.order.idPic=arrDocument[i].url
							this.photo=this.order.idPic
            			}
					}
            		this.weight_show=false
            		var	totalWeight=this.order.applyWeight
            		this.estimatePrice=Number(totalWeight)*Number(this.currentPrice)
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
							this.order.images.push(item.src)
						}
						if(this.files.length==len){
							// this.submit()
							this.getpolicy(reader,item)
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
				this.order.picUrls.push(netimgurl)
				this.files = [] // 清空文件缓存
				Indicator.close()
				Toast({
					message:'上传成功',
					duration: 800,
				});
			},
    		// 上传图片（旧）
    		submit () {
				Indicator.open();
        		var dataURLToBlob=function(url){
                	var arr=url.split(','),mime=arr[0].match(/:(.*?);/)[1],
                	bstr=atob(arr[1]),n=bstr.length,u8arr=new Uint8Array(n);
                	while(n--){
                    	u8arr[n]=bstr.charCodeAt(n);
                	}
                	return new Blob([u8arr],{type:mime});
				}  //base64转换成二进制文件
				let formData = new FormData()
        		this.files.forEach((item, index) => {
          			var img_size=item.size
					var img = new Image,
					canvas = document.createElement("canvas"),
					ctx = canvas.getContext("2d");
					img.crossOrigin = "Anonymous";
					img.src = item.src
					if(this.AndroVerson>4||this.iosVerson>10){
						img.onload =() => {
							var width = img.width;
							var height = img.height;
							// 最大上传不得查过500k
							var rate = (img_size/(1024*500)).toFixed(1)
							if(rate*1>1){
								var real_rate = (width<height ? width/height : height/width)/rate;
								canvas.width = width*real_rate;
								canvas.height = height*real_rate;
								ctx.drawImage(img,0,0,width,height,0,0,width*real_rate,height*real_rate);
								var src1 = canvas.toDataURL("image/jpg");
								var blob=dataURLToBlob(src1)
								formData.append('files', blob,'image.jpg')
							}else{
								formData.append('files', item.file)
							}
							if(index==(this.files.length-1)){ //formdata已创建完
								xhr_send(this)
							} 
						}
					}else{
						formData.append('files', item.file)
						if(index==(this.files.length-1)){ //formdata已创建完
							xhr_send(this)
						}
					}
				})
				var xhr_send=(val)=>{
					// 新建请求
					const xhr = new XMLHttpRequest()
					xhr.open('POST', val.apiUrl, true)
					xhr.send(formData)
					xhr.onload = () => {
						if (xhr.status === 200 || xhr.status === 304) {
							let datas = JSON.parse(xhr.responseText)
							if(datas.code==100){
							// 存储返回的地址
								datas.content.forEach((item)=> {
									val.order.picUrls.push(item)
									val.files = [] // 清空文件缓存
									Indicator.close()
								})
							} else {
								val.$toast('请求错误')
								Indicator.close()
							}
						}
					}
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
.modify_recycle_order{
	width: 100%;
	position: relative;
	background-color: #ffffff;
	padding-bottom:1rem;
}
.stor_content{
	padding: 0;
	margin-top: .88rem;
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
	background-color: #f5f5f5;
	margin-top: 0;
	font-size: .32rem;
	margin-top: .4rem;
	padding-left: .3rem;
	padding-top:.5rem;
	padding-bottom:.3rem;
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
.item_row_2,.item_row_3{
	margin-left: 4%;
	width: 92%;
	background-image: url(../../images/right_jian.png);
	background-position: right .4rem;
    background-repeat: no-repeat;
    background-size: .15rem;
}
.item_row_2>span:first-child,item_row_3>span:first-child{
	float: left;
    height: 1.1rem;
    line-height: 1.1rem;
}
.item_row_2>span:nth-child(2){
    float: right;
    height: 1.1rem;
    line-height: 1.1rem;
    padding-right: .4rem;
}
.item_row_3>span:nth-child(2){
	float: right;
    height: 1.1rem;
    line-height: 1.1rem;
    padding-right: .4rem;
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
	width: 2.14rem;
	height: 2.14rem;
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
}
.upload_image_preview>section{
	position: relative;
	float: left;
	margin-top: .28rem;
	margin-right: .23rem;
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
.upload_image_preview .modify_img{
	width: 2.14rem;
	height: 2.14rem;
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
    margin-top: 2.4rem;
    text-align: left;
    /* background-image: url(../../images/gantanhao.png); */
	/* background-position: 2.1rem .1rem; */
    /* background-repeat: no-repeat; */
    /* background-size: .27rem; */
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
	line-height: 1.2rem;
	color: #000000;
	text-align: center;
	position: relative;
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
/*添加地址的样式*/
.title{
	padding: 0 .3rem 0 .3rem;
    background-color: #f5f5f5;
}
.title>span:nth-child(1){
	display: inline-block;
	width: 25%;
	font-size: .3rem;
	color: #333333;
	padding-top:.5rem;
	padding-bottom:.3rem;
}
.title>span:nth-child(2){
	float: right;
	width: 25%;
	height: 1rem;
	line-height: 1rem;
	font-size: .3rem;
	text-align: right;
	color: #333333;
}
.name_tel_addr{
	width: 100%;
	height: 1.4rem;
	background-color: #ffffff;
}
.addr_left{
	width: 94%;
	height: 1.4rem;
	float: left;
}
.addr_right{
	width: 6%;
	height: 1.4rem;
	float: left;
	background-image: url(../../images/right_jian.png);
	background-repeat: no-repeat;
	background-size: .17rem;
	background-position: left center;
}
._name_tel{
	width: 100%;
	height: .7rem;
	line-height: .8rem;
	font-size: .3rem;
}
._addr{
	width: 100%;
	height: .7rem;
	line-height: .6rem;
	font-size: .24rem;
	padding-left: .3rem;
	overflow: hidden; white-space: nowrap; text-overflow: ellipsis;
}
.__name{
	margin-right: .2rem;
	margin-left: .3rem;
}
.is_cash{
	width: 100%;
	height: 2.2rem;
	background-color: #ffffff;
}
.isCash_top{
	width: 92%;
	height: 1.1rem;
	line-height: 1.1rem;
	margin-left: 4%;
	position: relative;
}
.isCash_unChecked:before{
	content: '';
	width: .36rem;
	height: .36rem;
	background-image: url(../../images/select_gray.png);
	background-size: .36rem;
	position: absolute;
	left: .3rem;
	top: .39rem;
}
.isCash_checked:before{
	content: '';
	width: .36rem;
	height: .36rem;
	background-image: url(../../images/select_orange.png);
	background-size: .36rem;
	position: absolute;
	left: .3rem;
	top: .39rem;
}
.isCash_bottom{
	width: 92%;
	height: 1.1rem;
	line-height: 1.1rem;
	margin-left: 4%;
	position: relative;
}
@media(-webkit-min-device-pixel-ratio:1.5),(min-device-pixel-ratio:1.5),(-o-min-device-pixel-ratio:1.5){
	.isCash_top:after{
		content: '';
		display: block;
		width: 100%;
		border-bottom: 1px solid #eee;
		-webkit-transform: scaleY(0.7);
		-o-transform: scaleY(0.7);
		-moz-transform: scaleY(0.7);
		transform:scaleY(0.7);
		position: absolute;
		bottom: 0;
	}
}
@media(-webkit-min-device-pixel-ratio:2),(min-device-pixel-ratio:2),(-o-min-device-pixel-ratio:1.5){
	.isCash_top:after{
		content: '';
		display: block;
		width: 100%;
		border-bottom: 1px solid #eee;
		-webkit-transform: scaleY(0.5);
		-o-transform: scaleY(0.5);
		-moz-transform: scaleY(0.5);
		transform:scaleY(0.5);
		position: absolute;
		bottom: 0;
	}
}
.bank_content{
	background-color: #ffffff;
	height: 1.4rem;
	line-height: 1.4rem;
	padding-right: .3rem;
	font-size: .3rem;
	color: #333333;
}
.add_bank{
	padding-left: 1.1rem;
	background-image: url(../../images/addBank.png);
	background-repeat: no-repeat;
	background-position: .28rem .42rem;
	background-size: .5rem;
}
.bank_content>img{
	width: .2rem;
	float: right;
	margin-top: .52rem;
}
.has_bank{
	padding: 0 .3rem 0 .3rem;
}
.has_bank>img{
	width: .55rem;
	float: left;
	margin-top: .42rem;
	margin-right: .24rem;
}
.id_photo_in{
	display: inline-block;
	width: 6.9rem;
	height: 4.16rem;
	border: 1px solid #F2B643;
	background: url(../../images/addHandId.png);
	background-repeat: no-repeat;
	background-size: 100%;
	background-position: center;
	position: relative;
}
.id_photo_in>img{
	position: absolute;
	top: 0;
	left: 0;
	width: 6.9rem;
	height: 4.16rem;
}
.ipt{
	opacity: 0;
}
.argument{
	margin-top:.62rem;
	font-size:.24rem;
	color:#9E9E9E;
	padding-left:.3rem;
	padding-bottom: .35rem;
	position: relative;
	padding-bottom: .42rem;
}
.check{
	display:none;
}
strong{
	width:.3rem;
	height:.3rem;
	position:absolute;
	left:0.3rem;
	top:.06rem;
}
.change1{
	background: url('../../images/readed.png') no-repeat;
	background-size: 100% 100%;
}
.change2{
	background-image: url('../../images/reading.png');
	background-repeat: no-repeat;
	background-position: 0 0;
	background-size: 100% 100%;
}
.txt{
	margin-left:.48rem;
	color: rgb(171, 171, 171)
}
</style>