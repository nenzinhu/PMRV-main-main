# 🛠️ Guia de Desenvolvimento

## Setup Inicial

### 1. Instalar dependências Python
```bash
pip install -r requirements.txt
```

### 2. Instalar dependências Node.js
```bash
npm install
```

## Scripts Disponíveis

### Web Development
- `npm start` - Inicia servidor web em http://localhost:8000
- `npm run dev` - Inicia servidor com cache desabilitado
- `npm run serve` - Inicia servidor básico

### Python Scripts
- `npm run refs:gfloripa` - Gera referências de pontos quilométricos (Grande Florianópolis)
- `npm run update:images` - Atualiza imagens base64 com versões sem background
- `npm run install:python` - Instala dependências Python

### Capacitor (Android)
- `npm run cap:sync` - Sincroniza arquivos web com projeto Android
- `npm run cap:open:android` - Abre Android Studio
- `npm run build:apk:debug` - Compila APK de debug

### Manutenção
- `npm run cleanup` - Remove arquivos duplicados
- `npm run prepare:web` - Prepara assets web para o Android

## Estrutura de Pastas

```
PMRV-main-main/
├── index.html              # App principal
├── service_worker.js       # Cache para PWA
├── manifest.json           # Configuração PWA
├── css/                    # Estilos (centralizado)
├── js/                     # Lógica da aplicação
├── data/                   # Dados JSON (rodovias, infrações, etc)
├── scripts/                # Scripts de automação (Python/Node)
├── icon/                   # Ícones da aplicação
└── img/                    # Imagens extraídas
```

## Ferramentas de Qualidade

### ESLint (Validação JavaScript)
```bash
npx eslint js/ --fix
```

### Prettier (Formatação)
```bash
npx prettier --write js/ css/
```

## Componentes Principais

### 🚗 Módulos JavaScript
- **core.js** - Funcionalidades centrais
- **danos.js** - Registro de danos veiculares
- **infracoes.js** - Tabela de infrações
- **gps.js** - Localização GPS
- **pesos.js** - Cálculo de pesos
- **patrulhamento.js** - Controle de patrulhamento
- **tacografo.js** - Leitura de tacógrafo

### 📊 Dados Armazenados
- **data/gps_data_sc.json** - Pontos GPS de rodovias
- **data/infracoes.json** - Base de infrações
- **referencias-grande-florianopolis-150m.json** - Marcos quilométricos

## Deploy

### PWA (Progressive Web App)
O app funciona offline via Service Worker:
1. Acesse http://localhost:8000
2. Menu do navegador > "Instalar app"

### Android (APK)
```bash
npm run build:apk:debug
```
APK gerado em `android/app/build/outputs/apk/debug/`

## Troubleshooting

### Server não inicia
```bash
# Porta 8000 pode estar em uso, tente:
npm run serve -- -p 8001
```

### Erro ao rodar script Python
```bash
# Instale dependências ausentes:
pip install -r requirements.txt
```

### Service Worker não atualiza
1. DevTools > Application > Clear site data
2. Recarregue a página (Ctrl+Shift+R)

## Convenções de Código

- **JavaScript**: Padrão Airbnb (via ESLint)
- **Python**: PEP 8
- **Nomes de variáveis**: camelCase em JS, snake_case em Python
- **Comentários**: Apenas para lógica complexa

## Performance

- Index.html: 146.5 KB (considerar split se ultrapassar 200 KB)
- Service Worker cache: ~50 assets (~5-10 MB)
- Imagens base64: Considerar extração para reduzir HTML

## Recursos Externos

- [MDN Service Workers](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)
- [Web.dev PWA Guide](https://web.dev/progressive-web-apps/)
- [Capacitor Docs](https://capacitorjs.com/docs)

---
**Mantido por**: Nei  
**Última atualização**: 2026-04-14
