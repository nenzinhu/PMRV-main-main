"""
Script para substituir imagens base64 em HTML com versões sem background.
Uso: python remove_bg.py [folder] [html_file]
Exemplo: python remove_bg.py . index.html
"""
import base64
import re
import sys
from pathlib import Path

# Aceitar argumento de linha de comando ou usar padrão
folder = Path(sys.argv[1]) if len(sys.argv) > 1 else Path('.')
html_file = Path(sys.argv[2]) if len(sys.argv) > 2 else folder / 'index.html'

def b64(path):
    """Converte arquivo para base64."""
    with open(path, 'rb') as f:
        return base64.b64encode(f.read()).decode()

# Dicionário de imagens (ajustar nomes de arquivo conforme necessário)
imgs = {
    'v360-img-frente':   folder / 'frente_nobg.png',
    'v360-img-tras':     folder / 'traseira_nobg.png',
    'v360-img-direita':  folder / 'lateral_direita_nobg.png',
    'v360-img-esquerda': folder / 'lateral_esquerda_nobg.png',
}

try:
    with open(html_file, 'r', encoding='utf-8') as f:
        html = f.read()
    
    updated_count = 0
    for img_id, img_path in imgs.items():
        if not img_path.exists():
            print(f'⚠️  {img_id}: arquivo não encontrado ({img_path})')
            continue
        
        b64data = b64(img_path)
        html = re.sub(
            r'(src=")data:image/[^;]+;base64,[^"]*("\s[^>]*id="' + img_id + r'")',
            r'\g<1>data:image/png;base64,' + b64data + r'\g<2>',
            html
        )
        updated_count += 1
        print(f'✓ {img_id}: substituído')
    
    if updated_count > 0:
        with open(html_file, 'w', encoding='utf-8') as f:
            f.write(html)
        print(f'\n✓ CONCLUÍDO: {updated_count} imagens atualizadas em {html_file}')
    else:
        print('⚠️  Nenhuma imagem foi atualizada')

except FileNotFoundError as e:
    print(f'✗ Erro: arquivo não encontrado: {e}')
    sys.exit(1)
except Exception as e:
    print(f'✗ Erro: {e}')
    sys.exit(1)
