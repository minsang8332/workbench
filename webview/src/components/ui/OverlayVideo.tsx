import _ from 'lodash'
import { ref, computed, defineComponent, type PropType, onMounted, onBeforeMount } from 'vue'
import { useAppStore } from '@/stores/app'
export default defineComponent({
    name: 'OverlayVideo',
    props: {
        items: {
            type: Array as PropType<string[]>,
            default: () => ['\/layout.mp4']
        }
    },
    setup(props) {
        const appStore = useAppStore()
        const idxRef = ref<number>(0)
        const videoRef = ref<HTMLVideoElement>()
        const itemsRef = ref<string[]>(props.items)
        const getVideo = computed(() => {
            return itemsRef.value[idxRef.value]
        })
        const onPlay = async () => {
            if (_.isEmpty(props.items)) {
                const videos = await appStore.loadOverlayVideos()
                itemsRef.value = _.shuffle(videos)
            }
            idxRef.value = _.random(0, itemsRef.value.length - 1)
            videoRef.value?.load()
            videoRef.value?.play()
        }
        onBeforeMount(() => {
            onPlay()
        })
        return () => (
            <video
                ref={videoRef}
                autoplay
                class="absolute w-full h-full top-0 left-0 z-[-1] object-cotain bg-black"
                onEnded={onPlay}
            >
                {getVideo.value && <source src={getVideo.value} />}
            </video>
        )
    }
})
