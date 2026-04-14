#!/usr/bin/env python3
"""Script para configurar repositório remoto no GitHub"""

import subprocess
import sys
import os

os.chdir(r'C:\Users\Nei\Desktop\PMRV-main-main')

def run_command(cmd, description):
    """Executa comando e mostra resultado"""
    print(f"\n{'='*50}")
    print(description)
    print('='*50)
    try:
        result = subprocess.run(cmd, shell=True, capture_output=False, text=True)
        return result.returncode == 0
    except Exception as e:
        print(f"❌ Erro: {e}")
        return False

def main():
    print("\n🚀 Configurando repositório remoto GitHub...\n")
    
    # Remover remote anterior
    run_command('git remote remove origin', 'Limpando remote anterior...')
    
    # Adicionar novo remote
    if not run_command(
        'git remote add origin https://github.com/nenzinhu/PMRV-SC2026.git',
        'Adicionando novo remote'
    ):
        print("❌ Erro ao adicionar remote")
        return False
    
    # Verificar remote
    run_command('git remote -v', 'Verificando remote configurado')
    
    # Status
    run_command('git status', 'Status dos arquivos')
    
    # Add all
    if not run_command('git add -A', 'Adicionando arquivos'):
        print("❌ Erro ao adicionar arquivos")
        return False
    
    # Commit
    if not run_command(
        'git commit -m "Initial commit: PMRV project setup\n\nCo-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"',
        'Fazendo commit'
    ):
        print("⚠️ Sem mudanças para commitar")
    
    # Push
    print("\n" + "="*50)
    print("🔐 Fazendo push para GitHub...")
    print("="*50)
    print("\n⏳ Se solicitado, faça login via browser com GitHub CLI\n")
    
    if run_command('git push -u origin main', 'Push para main'):
        print("\n✅ Push concluído com sucesso!")
        return True
    else:
        print("\n❌ Erro ao fazer push")
        return False

if __name__ == '__main__':
    success = main()
    sys.exit(0 if success else 1)
