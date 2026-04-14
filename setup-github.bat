@echo off
REM Script para configurar repositório remoto e fazer push no GitHub

cd /d C:\Users\Nei\Desktop\PMRV-main-main

echo.
echo ========================================
echo Configurando repositório remoto GitHub
echo ========================================

REM Remover remote anterior se existir
git remote remove origin 2>nul

REM Adicionar novo remote com GitHub CLI
echo Configurando remote com GitHub CLI...
git remote add origin https://github.com/nenzinhu/PMRV-SC2026.git

echo.
echo ========================================
echo Verificando configuração
echo ========================================
git remote -v

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
git commit -m "Initial commit: PMRV project setup

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"

echo.
echo ========================================
echo Push para GitHub
echo ========================================
echo.
echo Aguardando autenticação com GitHub CLI...
echo Se solicitado, faça login via browser.
echo.

git push -u origin main

echo.
echo ========================================
echo Concluído!
echo ========================================
pause
