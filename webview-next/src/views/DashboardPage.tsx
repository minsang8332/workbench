import MdPreviewCard from '@/components/markdown/MdPreviewCard'
import '@/views/DashboardPage.scoped.scss'
import { defineComponent, ref } from 'vue'
export default defineComponent({
    name: 'DashboardPage',
    components: {
        MdPreviewCard
    },
    setup() {
        const documents = ref([])
        return () => (
            <v-container class="dashboard-page pa-0" fluid>
                <v-card flat>
                    <v-row class="pa-2" no-gutters>
                        <v-col>
                            <h1 class="text-title">최근 작성한 문서</h1>
                        </v-col>
                    </v-row>
                    <v-divider class="pa-1" />
                    <v-row no-gutters>
                        {documents.value.map((doc) => (
                            <v-col cols="12" md="4" class="pa-4">
                                <div class="dp-card-recently-doc">
                                    <md-preview-card v-bind={doc} />
                                </div>
                            </v-col>
                        ))}
                    </v-row>
                </v-card>
            </v-container>
        )
    }
})
