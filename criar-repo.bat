@echo off
cd /d C:\Users\Nei\Desktop\PMRV-main-main

echo.
echo ========================================
echo Criando repositório no GitHub
echo ========================================
echo.

gh repo create PMRV-SC2026 --public --source=. --remote=origin --push

echo.
echo ========================================
echo Concluído!
echo ========================================
pause
