export enum IPC_APP {
    EXIT = 'app:exit',
    LOAD_OVERLAY_VIDEOS = 'app:load-overlay-videos',
    INSTALL_UPDATE = 'app:install-update',
    AVAILABLE_UPDATE = 'app:available-update',
}
export enum IPC_SETTING {
    LOAD_PASSCODE = 'setting:load-passcode',
    UPDATE_PASSCODE = 'setting:update-passcode',
    VERIFY_PASSCODE = 'setting:verify-passcode',
    ACTIVATE_PASSCODE = 'setting:activate-passcode',
}
export enum IPC_DIARY {
    LOAD = 'diary:load',
    READ = 'diary:read',
    WRITE = 'diary:write',
    OPEN_DIR = 'diary:open-dir',
    WRITE_DIR = 'diary:write-dir',
    REMOVE = 'diary:remove',
    RENAME = 'diary:rename',
    MOVE = 'diary:move',
}
export enum IPC_TODO {
    LOAD = 'todo:load',
    SAVE = 'todo:save',
    REMOVE = 'todo:remove',
}
