<template>
    <v-card class="md-preview-card" :width="width" outlined shaped v-ripple>
        <v-row class="row-md-title bg-theme-1 px-2" no-gutters>
            <v-col class="d-flex align-center fill-height text-truncate">
                <p class="text-mpc-title d2coding white--text">{{ title }}</p>
            </v-col>
        </v-row>
        <v-divider class="mpc-divider" />
        <v-row class="row-md-preview" no-gutters>
            <v-col class="fill-height">
                <md-preview ref="preview" :text="text" />
            </v-col>
        </v-row>
        <v-divider class="mpc-divider" />
        <v-row class="row-md-created-at bg-theme-1 px-2" no-gutters>
            <v-col class="d-flex flex-column justify-center text-truncate">
                <p class="text-mpc-date d2coding text-truncate white--text">
                    작성일
                    {{ printDate(createdAt) }}
                </p>
                <p class="text-mpc-date d2coding text-truncate white--text">
                    수정일
                    {{ printDate(updatedAt) }}
                </p>
            </v-col>
        </v-row>
    </v-card>
</template>
<script>
import dayjs from 'dayjs'
import MdPreview from '@/components/markdown/MdPreview'
export default {
    name: 'MdPreviewCard',
    components: {
        MdPreview,
    },
    props: {
        title: {
            type: [String, null],
            default: null,
        },
        text: {
            type: [String, null],
            default: null,
        },
        createdAt: {
            type: [Date, null],
            default: null,
        },
        updatedAt: {
            type: [Date, null],
            default: null,
        },
        width: {
            type: [String, null],
            default: '100%',
        },
    },
    methods: {
        printDate(date) {
            date = dayjs(new Date(date))
            if (date.isValid()) {
                date = date.format('YYYY.MM.DD HH:mm:ss')
                return date
            }
            return null
        },
    },
}
</script>
<style scoped lang="scss">
.md-preview-card {
    height: 100%;
    border: 1px solid var(--theme-color-1);
    .row-md-title {
        height: 15%;
        .text-mpc-title {
            font-size: 15px;
        }
    }
    .row-md-preview {
        height: 65%;
        overflow-y: hidden;
    }
    .row-md-created-at {
        height: 20%;
        .text-mpc-date {
            font-size: 13px;
        }
    }
    .mpc-divider {
        background: var(--theme-color-1);
    }
}
</style>
