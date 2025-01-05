@echo off
set "APPDATA_PATH=%APPDATA%\workbench"
set "PASSCODE_FILE=.passcode"
if exist "%APPDATA_PATH%\%PASSCODE_FILE%" (
    echo Deleting %TARGET_FILE% from %APPDATA_PATH%
    del "%APPDATA_PATH%\%PASSCODE_FILE%"
) else (
    echo File not found: %APPDATA_PATH%\%PASSCODE_FILE%
)
echo Uninstall script executed successfully.
exit