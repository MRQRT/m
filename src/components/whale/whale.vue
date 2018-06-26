<template>
    <div class="whale">
        <span v-show="topStatus !== 'loading'">
            <img :src="staticS" style="width:auto;margin-top:.25rem;" id="jingyu">
        </span>
        <span v-show="topStatus === 'loading'" style="position:absolute;left:50%; top:-.4rem;margin-left:-0.475rem;">
            <img :src="loading" style="width:.95rem;">
        </span>
    </div>
</template>

<script>
import { getRem,getStyle } from '@/config/mUtils'
import staticS from '@/images/static.png'
import loading from '@/images/loading.gif'
    export default {
    	data(){             
            return{
                staticS: staticS,//静态鲸鱼
                loading: loading,//动态鲸鱼
                clientY: null,
                rem: null
            }
        },
        mounted(){
            this.rem=getRem();
            var dv=document.querySelector(".whale").parentNode.parentNode;
            dv.addEventListener('touchstart',this.c)
            dv.addEventListener('touchmove',this.d)
        },
        props: ['topStatus'],
        methods: {
            c(e){
                this.clientY=e.targetTouches[0].clientY;
            },
            d(e){
                var y=e.targetTouches[0].clientY;
                var height=(((y-this.clientY)-10)/7)/this.rem;
                if( height > 0.61) height = 0.61
                var db=document.querySelector('#jingyu')
                db.style.height = height+'rem';
                var dbWidth=getStyle(db,'width')
                db.style.marginLeft = -dbWidth.split('p')[0]/2+'px'
            },
        },
    }
</script>

<style scoped>
    *{
        box-sizing: border-box;
        margin:0;
        padding:0;
    }
    #jingyu{
        height: 0;
    }
    .whale{
        height: .88rem;
    }
</style>

