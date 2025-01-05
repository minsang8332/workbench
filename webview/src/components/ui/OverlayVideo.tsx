import _ from 'lodash'
import { ref, computed, defineComponent, onMounted, watch, type PropType } from 'vue'
import { useSettingStore } from '@/stores/setting'
export default defineComponent({
    name: 'OverlayVideo',
    props: {
        items: {
            type: Array as PropType<string[]>,
            default: () => []
        }
    },
    setup(props) {
        const settingStore = useSettingStore()
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
        const onLoad = () => {
            settingStore
                .loadOverlayVideos()
                .then(
                    (response: IResponse) =>
                        response.data.videos && (itemsRef.value = response.data.videos)
                )
                .catch((e) => e)
                .finally(onPlay)
        }
        watch(
            () => settingStore.getOverlayVideoDirname,
            (newValue) => {
                onLoad()
            }
        )
        onMounted(() => {
            onLoad()
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
