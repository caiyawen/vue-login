<template>
    <div>
        <div id="player" ref="player"></div>
    </div>
</template>

<script>
import loadScript from 'load-script';

export default {
    // props: ['resNo'],
    data() {
        return {
            playToken: '',
            resNo: '',
        }
    },
    mounted() {
        this.resNo = this.$route.params.id;
        this.initPlayer();
    },
    methods: {
        getPlayToken(resNo) {
            return this.$axios.get('/play/token', {params: {resNo: resNo}}).then(response => {
                this.playToken = response.data;
                console.log(this.playToken);
            }).promise;
        },
        getPlayerSDK(url) {
            return new Promise((resolve, reject) => {
                loadScript(url, (err) => {
                if (err) {
                    reject(err);
                }
                resolve();
                });
            });
        },
        initPlayer() {
            const playerSDKUri = '//oilgb9e2p.qnssl.com/js-sdk/sdk-v1.js' + '?' + ~~(Date.now() / 1000 / 60);
            Promise.all([
                this.getPlayToken(this.resNo),
                this.getPlayerSDK(playerSDKUri)
                ]).then(() => {
                    console.log(this.playToken);
                let player = new window.QiQiuYun.Player({
                    id: 'player',  // 用于初始化的DOM节点id
                    resNo: this.resNo, // 想要播放的资源编号
                    token: 'private:' + this.playToken, // 请求播放的认证token
                });
            });
        },
    }
}
</script>
