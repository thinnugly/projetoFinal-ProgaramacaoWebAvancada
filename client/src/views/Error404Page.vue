<template>
    <div class="error-container">
        <h1>404 - Page Not Found</h1>
        <p>Sorry, the page you are looking for does not exist.</p>
    </div>
</template>

<script>
export default {
    name: "Error404Page"
};
</script>

<style scoped>
.error-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    text-align: center;
    flex-direction: column;
}

h1 {
    margin-bottom: 20px;
}

p {
    font-size: 1.2rem;
}
</style>