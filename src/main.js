import Vue from 'vue'
import App from './App.vue'
import { router } from './router';
import 'amfe-flexible';
import './assets/validate'
import axios from 'axios'

import {get,post,uploadPost} from '../src/servers/request'
import wechatInterface from '../src/servers/wechatInterface'

Vue.prototype.$post=post;
Vue.prototype.$get=get;
Vue.prototype.$uploadPost=uploadPost;
Vue.prototype.$wechatInterface=wechatInterface;
import {Button, Tabbar, TabbarItem,Card,NavBar,Field,Cell, CellGroup,Popup,Dialog,Checkbox, CheckboxGroup,Search,RadioGroup, Radio,Swipe, SwipeItem,Lazyload,Tag,AddressEdit,Step, Steps,Icon,Uploader,Panel,Area,Toast } from 'vant'
Vue.use(Button).use(Tabbar).use(TabbarItem).use(Card).use(NavBar).use(Field).use(Cell).use(CellGroup).use(Popup).use(Dialog).use(Checkbox).use(CheckboxGroup).use(Search)
.use(RadioGroup).use(Radio).use(Swipe).use(SwipeItem).use(Lazyload).use(Tag).use(AddressEdit).use(Step).use(Steps).use(Icon).use(Uploader).use(Panel).use(Area).use(Toast)

new Vue({
  router,
  axios,
  render: h => h(App),
}).$mount('#app')
