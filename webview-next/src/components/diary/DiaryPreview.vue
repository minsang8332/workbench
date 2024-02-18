<template>
    <div v-html="preview" class="document-preview markdown-body" />
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import type { PropType } from 'vue'
import 'github-markdown-css'
export default defineComponent({
    name: 'DocumentPreview',
    props: {
        preview: {
            type: String as PropType<string>,
            default: ''
        }
    }
})
</script>
<style scoped lang="scss">
.document-preview {
    height: 100%;
    overflow-y: scroll;
    padding: 16px 8px;
}
</style>
