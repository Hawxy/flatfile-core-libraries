<template>
  <div class="ff_error_container">
    <h3 class="ff_error_heading">Something went wrong</h3>
    <p class="ff_error_text">{{ errorMessage }}</p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  error: string | Error
}>()

const errorMessage = computed(() => typeof props.error === 'string' ? props.error : props.error.message)

</script>

<style lang="scss">
.ff_error_container {
  display: flex;
  flex-direction: column;
  margin: 16px;
}

.ff_error_heading {
  display: flex;
  margin-bottom: 0;
}
</style>