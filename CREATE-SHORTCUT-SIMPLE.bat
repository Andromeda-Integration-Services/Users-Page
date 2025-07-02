@echo off
echo ========================================
echo   Creating Desktop Shortcut for CAFM
echo ========================================
echo.

set "shortcut_name=Start CAFM System"
set "target_path=%cd%\START-CAFM-EASY.bat"
set "desktop_path=%USERPROFILE%\Desktop"

echo Creating shortcut on desktop...

powershell -Command "$WshShell = New-Object -comObject WScript.Shell; $Shortcut = $WshShell.CreateShortcut('%desktop_path%\%shortcut_name%.lnk'); $Shortcut.TargetPath = '%target_path%'; $Shortcut.WorkingDirectory = '%cd%'; $Shortcut.IconLocation = 'shell32.dll,25'; $Shortcut.Description = 'Start CAFM System - One Click Launch'; $Shortcut.Save()"

echo.
echo ========================================
echo   Desktop Shortcut Created!
echo ========================================
echo.
echo What you can do now:
echo.
echo 1. Look for "Start CAFM System" on your desktop
echo 2. Double-click it to start the CAFM system
echo 3. Browser will open automatically
echo 4. Login with: admin@cafm.com / Admin123!
echo.
echo This shortcut will work even after restarting your PC!
echo.
echo To create shortcut again, just run this file
echo.
pause
