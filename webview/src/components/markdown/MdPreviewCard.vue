<template>
    <v-card
        class="md-preview-card test ma-4"
        height="40vh"
        width="20vw"
        v-ripple
    >
        <v-row class="row-md-title px-2" no-gutters>
            <v-col class="d-flex align-center fill-height text-truncate">
                <b class="text-mpc-title">{{ title }}</b>
            </v-col>
        </v-row>
        <v-divider />
        <v-row class="row-md-preview" no-gutters>
            <v-col>
                <md-preview :text="text" />
            </v-col>
        </v-row>
        <v-divider />
        <v-row class="row-md-created-at px-2" no-gutters>
            <v-col class="d-flex flex-column justify-center text-truncate">
                <p class="text-mpc-date d2coding text-truncate">
                    작성일
                    {{ printDate(createdAt) }}
                </p>
                <p class="text-mpc-date d2coding text-truncate">
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
    },
    methods: {
        printDate(date) {
            date = dayjs(new Date(date))
            if (date.isValid()) {
                date = date.format('YYYY년 MM월 DD일 HH:mm:ss')
                return date
            }
            return null
        },
    },
}
</script>
<style scoped lang="scss">
.md-preview-card {
    .test {
        background: rgba(255, 255, 255, 0.25);
        box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
        backdrop-filter: blur(2px);
        -webkit-backdrop-filter: blur(2px);
        border-radius: 10px;
        border: 1px solid rgba(255, 255, 255, 0.18);
    }
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
}
</style>
