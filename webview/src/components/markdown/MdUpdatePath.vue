<template>
    <v-text-field
        class="md-update-path"
        :value="printValue"
        :color="$app.scss('--theme-color-1')"
        dense
        filled
        outlined
        hide-details
        @input="onInput"
        @keydown.enter="onUpdateName"
        @focusout="clear"
    />
</template>
<script>
import _ from 'lodash'
import { mapActions } from 'vuex'
// 이름바꾸기 입력 컴포넌트
export default {
    name: 'MdUpdatePath',
    props: {
        path: {
            type: [String, null],
            default: null,
        },
    },
    data() {
        return {
            input: null,
        }
    },
    computed: {
        printValue() {
            let name
            try {
                let tmp = this.path.split('/')
                name = _.last(tmp)
                if (name) {
                    tmp = name.split('.')
                    name = _.first(tmp)
                }
            } catch (e) {
                console.error(e)
            }
            return name
        },
    },
    methods: {
        ...mapActions('markdown', ['renameMarkdown']),
        onInput(value) {
            this.input = value
        },
        onUpdateName(event) {
            event.preventDefault()
            const { input: name, path } = this
            if (name) {
                this.renameMarkdown({ path, name })
                    .then(({ renamed }) =>
                        this.$toast.success({
                            text: `${renamed} 으로 변경되었습니다.`,
                        })
                    )
                    .catch((e) => e)
            }
            this.clear()
        },
        clear() {
            this.name = null
            this.$app.setUpdatePath(null)
        },
    },
}
</script>
<style scoped lang="scss">
.md-update-path::v-deep {
    font-size: 14px;
}
</style>
