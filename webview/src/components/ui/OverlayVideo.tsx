import _ from 'lodash'
import { ref, computed, defineComponent, onBeforeMount, watch, type PropType } from 'vue'
import { useSettingStore } from '@/stores/setting'
import './OverlayVideo.scoped.scss'
export default defineComponent({
    name: 'OverlayVideo',
    props: {
        items: {
            type: Array as PropType<string[]>,
            default: () => []
        },
        video: {
            type: Boolean as PropType<boolean>,
            default: false
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
        const onLoadVideo = () => {
            console.log('load-video')
            if (itemsRef.value.length > 0) {
                idxRef.value = _.random(0, itemsRef.value.length - 1)
                videoRef.value?.load()
            }
        }
        const onPlayVideo = () => {
            console.log('play-video')
            videoRef.value?.play()
        }
        const onPauseVideo = () => {
            console.log('pause-video')
        }
        const onLoad = () => {
            if (!props.video) {
                return
            }
            settingStore
                .loadOverlayVideos()
                .then(
                    (response: IResponse) =>
                        response.data.videos && (itemsRef.value = response.data.videos)
                )
                .catch((e) => e)
                .finally(onLoadVideo)
        }
        watch(
            () => settingStore.getOverlayVideoDirname,
            (newValue) => {
                onLoad()
            }
        )
        onBeforeMount(() => {
            onLoad()
        })
        return () => (
            <div class="overlay-video absolute w-full h-full top-0 left-0 z-[-10000]">
                {props.video && itemsRef.value.length > 0 ? (
                    <video
                        ref={videoRef}
                        class="absolute object-cotain z-[-9999] h-full w-full"
                        onEnded={onLoadVideo}
                        onCanplay={onPlayVideo}
                        onPause={onPauseVideo}
                    >
                        {getVideo.value && <source src={getVideo.value} />}
                    </video>
                ) : (
                    Array.from({ length: 200 }, () => <div class="pure-snow" />)
                )}
            </div>
        )
    }
})
