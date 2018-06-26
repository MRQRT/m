<template>
    <div class="invite_page">
        <img src="../../images/inviteBg1.jpg" id="imgBg">
        <div class="invite_bg">
            <div id="ewCode">
                <canvas id="canvas" style="display: none;"></canvas>
            </div>

        </div>
    </div>
</template>
<script>
    import QRCode from 'qrcode'
    import { IP } from '@/config/mUtils.js' 
    export default {
        data() {
            return {
               inviteCode:null //邀请码
            }
        },
        mounted(){
            var scrollTop=window.screen.height - window.innerHeight  //微信浏览器状态栏的高度
            var dv=document.querySelector('#imgBg')
            dv.style.position = 'relative'
            dv.style.top = '-'+scrollTop+'px'
            document.querySelector('.invite_page').style.height = window.innerHeight+'px'
            var serach=window.location.hash.split('?')
            if(serach){
                var arr=serach[1].split('=')
                if(arr[0]=='inviteCode'){
                    this.inviteCode=arr[1]
                    if(this.inviteCode.indexOf('&')!=-1){  //删除微信额外加的出于其他目的的参数
                        this.inviteCode=this.inviteCode.split('&')[0]
                    }
                    this.useqrcode()
                }
            }
        },
        filters:{

        },
        methods:{
            useqrcode(){
            //生成的二维码内容，可以添加变量
               var that=this;
               this.QueryDetail=IP()+'/#/loginIn'+'?inviteCode='+this.inviteCode;
               var canvas = document.getElementById('canvas')
               QRCode.toCanvas(canvas, this.QueryDetail, function (error) {
               if (error) console.error(error)
                //   console.log('success!');
                  var canvas1 = document.getElementById('canvas')
                  that.canvasToImage(canvas1)
               })
            },
            canvasToImage(canvas){
                var image = new Image();
                image.src = canvas.toDataURL("image/png");
                image.style.width='1.6rem'
                image.style.height='1.6rem'
                image.style.position='absolute'
                image.style.bottom='1rem'
                image.style.left='50%'
                image.style.marginLeft = '-0.8rem'
                document.querySelector('#ewCode').appendChild(image)
            }
        },
        watch:{
            
        },

    }
</script>
<style scoped>
    .invite_page img{
         width:100vw;
         display: block;
         position: relative;
    }
    .invite_page #canvas{
        width:1.6rem!important;
        height:1.6rem!important;
    }
</style> 

