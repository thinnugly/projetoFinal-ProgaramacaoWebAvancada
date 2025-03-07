<template>
    <div class="container mt-5">
        <div class="row justify-content-center">
            <div class="col-md-6">
                <div class="card shadow p-4">
                    <div class="d-flex justify-content-start gap-2">
                        <base-button :mode="setAuthLoginActiveTab" @click="switchTab('AuthLogin')">
                        <font-awesome-icon :icon="['fas', 'sign-in-alt']" class="me-2" />
                            LOGIN
                        </base-button>
                        <base-button :mode="setAuthRegisterActiveTab" @click="switchTab('AuthRegister')">
                        <font-awesome-icon :icon="['fas', 'user-plus']" class="me-2" />
                            REGISTER
                        </base-button>
                    </div>
                </div>
            </div>
        </div>
        <component :is="selectedTab" />
    </div>
    <router-view></router-view>
</template>

<script>
import AuthLogin from '@/views/AuthLogin.vue';
import AuthRegister from '@/views/AuthRegister.vue';

export default {
    name: 'HomePage',
    components: {
        AuthLogin,
        AuthRegister,
    },
    data() {
        return {
            selectedTab: 'AuthLogin',
        };
    },
    methods: {
        switchTab(tab) {
            this.selectedTab = tab;
        },
    },
    computed: {
        setAuthLoginActiveTab() {
            return this.selectedTab === 'AuthLogin' ? 'default' : '';
        },
        setAuthRegisterActiveTab() {
            return this.selectedTab === 'AuthRegister' ? 'default' : '';
        },
    },
};
</script>

<style scoped></style>