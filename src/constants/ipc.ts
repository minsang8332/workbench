export enum IPC_APP_CHANNEL {
    EXIT = 'app:exit',
    UPDATE_OVERLAY_VIDEOS = 'app:update-overlay-videos',
    INSTALL_UPDATE = 'app:install-update',
    AVAILABLE_UPDATE = 'app:available-update',
}
export enum IPC_SETTING_CHANNEL {
    LOAD_PASSCODE = 'setting:load-passcode',
    UPDATE_PASSCODE = 'setting:update-passcode',
    VERIFY_PASSCODE = 'setting:verify-passcode',
    ACTIVATE_PASSCODE = 'setting:activate-passcode',
    LOAD_OVERLAY_VIDEOS = 'setting:load-overlay-videos',
    UPDATE_OVERLOAY_VIDEO = 'setting:update-overlay-video',
}
export enum IPC_DIARY_CHANNEL {
    LOAD = 'diary:load',
    READ = 'diary:read',
    WRITE = 'diary:write',
    OPEN_DIR = 'diary:open-dir',
    WRITE_DIR = 'diary:write-dir',
    DELETE = 'diary:delete',
    RENAME = 'diary:rename',
    MOVE = 'diary:move',
}
export enum IPC_TODO_CHANNEL {
    LOAD = 'todo:load',
    SAVE = 'todo:save',
    DELETE = 'todo:delete',
    LOAD_SPRINT = 'todo:load-sprint',
    DELETE_SPRINT = 'todo:delete-sprint',
}
export enum IPC_CRAWLER_CHANNEL {
    LOAD_WORKERS = 'crawler:load-workers',
    LOAD_SCHEDULE = 'crawler:load-schedule',
    SAVE_WORKER = 'crawler:save-worker',
    SAVE_WORKER_LABEL = 'crawler:save-worker-label',
    SAVE_WORKER_COMMANDS = 'crawler:save-worker-commands',
    SAVE_SCHEDULE = 'crawler:save-schedule',
    DELETE_WORKER = 'crawler:delete-worker',
    DELETE_SCHEDULE = 'crawler:delete-schedule',
    RUN_WORKER = 'crawler:run-worker',
    LOAD_HISTORIES = 'crawler:load-histories',
}
