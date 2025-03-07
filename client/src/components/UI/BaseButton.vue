<template>
  <button :class="mode" class="btn btn-primary">
    <slot></slot>
  </button>
</template>

<script>
export default {
  name: 'BaseButton',
  props: {
    mode: String, // A classe do botão será passada via a propriedade 'mode'
  },
};
</script>

<style scoped>
button {
  padding: 0.5rem 1rem;
  background-color: #03045e;
  border: 1px solid #03045e;
  color: white;
  cursor: pointer;
}

button:hover,
button:active {
  background-color: #023e8a;
  border-color: #023e8a;
  border: 1px solid #03045e;
}

.default {
  background-color: transparent;
  color: #03045e;
  border: none;
}

.default:hover,
.default:active {
  background-color: #eee;
  border: 1px solid #03045e;
}

.active {
  background-color: #023e8a;
  border-color: #023e8a;
}

.active:hover,
.active:active {
  background-color: #03045e;
  border-color: #03045e;
}
</style>
