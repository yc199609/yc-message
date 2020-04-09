<template>
    <transition name="yc-message-fade" @after-leave="handleAfterLeave">
        <div
            :class="[
                'yc-message',
                type ? `yc-message--${type}` : '',
            ]"
            :style="positionStyle" 
            v-show="visible"
            @mouseenter="clearTimer"
            @mouseleave="startTimer"
        >
            <i :class="typeClass"></i>
            <slot>
                <p class="yc-message__content">{{ message }}</p>
            </slot>
        </div>
    </transition>
</template>

<script>
const typeMap = {
    success: 'success',
    info: 'info',
    warning: 'warning',
    error: 'error'
}
export default {
    data(){
        return {
            message: '',
            visible: false,
            verticalOffset: 20,
            closed: false,
            onClose: null,
            duration: 3000,
            timer: null,
            type: 'info',
        }
    },
    computed: {
        positionStyle() {
            return {
                'top': `${ this.verticalOffset }px`
            };
        },
        typeClass() {
            return this.type ? `yc-message__icon iconfont icon${typeMap[this.type]} yc-message__icon--${typeMap[this.type]}` : ''
        }
    },
    watch: {
        closed(newVal) {
            if(newVal) {
                this.visible = false;
            }
        }
    },
    methods: {
        handleAfterLeave() {
            this.$destroy(true);
            this.$el.parentNode.removeChild(this.$el);
        },
        startTimer() {
            if(this.duration > 0) {
                this.timer = setTimeout(() => {
                    if(!this.closed) {
                        this.close();
                    }
                }, this.duration);
            }
        },
        clearTimer() {
            clearTimeout(this.timer);
        },
        keydown(e) {
            if(e.keydown === 27) {
                if(!this.closed) {
                    this.close();
                }
            }
        },
        close() {
            this.closed = true;
            if (typeof this.onClose === 'function') {
                this.onClose(this);
            }
        },
    },
    mounted() {
        this.startTimer();
        document.addEventListener('keydown', this.keydown);
    },
    beforeDestroy() {
        document.removeEventListener('keydown', this.keydown);
    }
}
</script>
