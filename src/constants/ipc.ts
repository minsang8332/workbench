export enum IPC_APP {
    EXIT = 'exit',
}
export enum IPC_UPDATER {
    AVAILABLE = 'updater:available',
    INSTALL = 'updater:install',
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
