import Vue from 'vue'
import './index.scss'
import './font.css'
import MessageEL from './index.vue'

let seed = 1;
let instance;
let instances = [];

const Message = (options) => {
    if (Vue.prototype.$isServer) return;
    options = options || {};
    if(typeof options === 'string') {
        options = {
            message: options
        }
    }
    const userOnClose = options.onClose;
    const id = 'message_' + seed++;
    options.onClose = () => {
        Message.close(id, userOnClose)
    }

    const Profile = Vue.extend(MessageEL);
    instance = new Profile({
        data: options
    });
    instance.id = id;
    instance.$mount();
    document.body.appendChild(instance.$el)

    let verticalOffset = 20;
    instances.forEach(item => {
        verticalOffset += item.$el.offsetHeight + 16;
    });
    instance.verticalOffset = verticalOffset;
    instance.visible = true;
    instances.push(instance);
    return instance
}

Message.close = (id, userOnClose) => {
    const len = instances.length;
    let index = -1;
    let removeHeight;

    // 找到关闭的那一个
    for(let i = 0; i < len; i++){
        if(id === instances[i].id) {
            removeHeight = instances[i].$el.offsetHeight;
            index = i;
            if (typeof userOnClose === 'function') {
                userOnClose(instances[i]);
            }
            instances.splice(i, 1);
            break;
        }
    }
    // 此时instances的长度为len-1
    if (len <= 1 || index === -1 || index > instances.length - 1) return;
    for (let i = index; i < len - 1; i ++) {
        let dom = instances[i].$el;
        dom.style['top'] =
            parseInt(dom.style['top'], 10) - removeHeight - 16 + 'px';
    }
}

export default Message
