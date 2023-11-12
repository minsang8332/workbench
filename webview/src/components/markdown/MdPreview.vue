<template>
    <div v-html="preview" class="md-preview markdown-body px-4 py-2" />
</template>
<script>
import _ from 'lodash'
import { marked } from 'marked'
import 'github-markdown-css'
export default {
    name: 'MdPreview',
    props: {
        text: {
            type: [String, null],
            default: null,
        },
    },
    computed: {
        preview() {
            return marked(_.toString(this.text))
        },
    },
}
</script>
<style scoped lang="scss">
.md-preview {
    height: 100%;
    overflow-y: scroll;
}
</style>
