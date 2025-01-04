import _ from 'lodash'
import { ref, computed, defineComponent, type PropType, onMounted, onBeforeMount } from 'vue'
import { useAppStore } from '@/stores/app'
export default defineComponent({
    name: 'OverlayVideo',
    props: {
        items: {
            type: Array as PropType<string[]>,
            default: () => ['\/overlay.mp4']
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
        const onPlay = () => {
            idxRef.value = _.random(0, itemsRef.value.length - 1)
            videoRef.value?.load()
            videoRef.value?.play()
        }
        onMounted(() => {
            appStore
                .loadOverlayVideos()
                .then((videos) => (itemsRef.value = videos))
                .catch((e) => e)
                .finally(onPlay)
        })
        return () => (
            <video
                ref={videoRef}
                class="absolute w-full h-full top-0 left-0 z-[-1] object-cotain bg-black"
                onEnded={onPlay}
            >
                {getVideo.value && <source src={getVideo.value} />}
            </video>
        )
    }
})
