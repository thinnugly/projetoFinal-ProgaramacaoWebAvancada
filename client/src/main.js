import { createApp } from 'vue'
import App from './App.vue'
import 'bootstrap/dist/css/bootstrap.min.css'; 
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import BaseCard from './components/UI/BaseCard.vue';
import BaseButton from './components/UI/BaseButton.vue';
// Importar Font Awesome
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faSignInAlt, faUserPlus, faBell, faEye, faTrashAlt, faSignOutAlt, faArrowRight, faArrowLeft, faPlus, faEdit, faSave } from '@fortawesome/free-solid-svg-icons';
import router from './router';
import store from './store/store'; 
import VueSweetalert2 from 'vue-sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

// Adicionar ícone à biblioteca
library.add(faSignInAlt, faUserPlus, faBell, faEye, faTrashAlt, faSignOutAlt, faArrowRight, faArrowLeft, faPlus, faEdit, faSave );

const app = createApp(App);
app.component('base-card', BaseCard);
app.component('base-button', BaseButton);
app.component('font-awesome-icon', FontAwesomeIcon);
app.use(router);
app.use(store);
app.use(VueSweetalert2);
app.mount('#app');