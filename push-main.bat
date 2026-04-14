@echo off
cd /d C:\Users\Nei\Desktop\PMRV-main-main

echo.
echo ========================================
echo Git Status
echo ========================================
git status

echo.
echo ========================================
echo Adicionando arquivos...
echo ========================================
git add -A

echo.
echo ========================================
echo Fazendo commit...
echo ========================================
git commit -m "feat: Initial commit - PMRV project

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"

echo.
echo ========================================
echo Push para main
echo ========================================
git push origin main

echo.
echo ========================================
echo Concluído!
echo ========================================
pause
