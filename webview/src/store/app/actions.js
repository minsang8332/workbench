export default {
    powerOff() {
        window.$native.exit()
    },
    waitUpdate() {
        return window.$native.updater.wait()
    },
    availableUpdate() {
        return window.$native.updater.available()
    },
    installUpdate() {
        window.$native.updater.install()
    },
}
