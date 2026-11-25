#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const pkgRoot = path.resolve(__dirname, '..');

const CYAN = '\x1b[36m';
const GREEN = '\x1b[32m';
const YELLOW = '\x1b[33m';
const BOLD = '\x1b[1m';
const DIM = '\x1b[2m';
const RESET = '\x1b[0m';

function readPkgVersion() {
  try {
    const pkg = JSON.parse(fs.readFileSync(path.join(pkgRoot, 'package.json'), 'utf8'));
    return pkg.version || '2.7.0';
  } catch {
    return '2.7.0';
  }
}

function printBanner() {
  const version = readPkgVersion();
  console.log(`
${CYAN}${BOLD}  ╔══════════════════════════════════════════════════════════════════════╗
  ║   ⚡ uxiGL v${version} — Liquid Glass & Google Material You Design System  ║
  ║   SheetGL (WebGL DataGrid) + FileManGL (WebGL2 VFS) Unified Suite    ║
  ╚══════════════════════════════════════════════════════════════════════╝${RESET}
`);
}

function printHelp() {
  printBanner();
  console.log(`${BOLD}Usage:${RESET}
  npx truncgil-uxigl <command> [options]
  npmx truncgil-uxigl <command> [options]

${BOLD}Commands:${RESET}
  ${GREEN}init${RESET} [target-file]      Generate a ready-to-use <UXIWorkspace /> component in your React project
                          (Supports: --template <enterprisegl|flowgl|cargogl|synthgl|osgl|tesseragl>)
  ${GREEN}create${RESET} <project-name>   Scaffold a new Vite + React + TypeScript + uxiGL starter app
                          (Supports: --template <enterprisegl|flowgl|cargogl|synthgl|osgl|tesseragl>)
  ${GREEN}template${RESET} <name>         Quick-select and generate a template in one command
  ${GREEN}demo${RESET}                    Launch the interactive uxiGL Showcase & Documentation server
  ${GREEN}doctor${RESET}                  Verify Node.js, build artifacts, styles, and environment readiness
  ${GREEN}help${RESET}                    Show this help message

${BOLD}Single-Command Installation:${RESET}
  ${DIM}# npm / pnpm / yarn / bun (SheetGL & FileManGL included):${RESET}
  npm install truncgil-uxigl
  pnpm add truncgil-uxigl
  yarn add truncgil-uxigl
  bun add truncgil-uxigl

${BOLD}CLI Examples:${RESET}
  ${DIM}# 1. Generate ready-to-use UXIWorkspace.tsx component:${RESET}
  npx truncgil-uxigl init
  npx truncgil-uxigl init --template macosgl
  npx truncgil-uxigl template flowgl

  ${DIM}# 2. Scaffold a brand-new starter project with a chosen template:${RESET}
  npx truncgil-uxigl create my-uxigl-app --template macosgl
  npx truncgil-uxigl create my-flow-app --template flowgl
`);
}

const TEMPLATE_REGISTRY = {
  enterprisegl: {
    label: 'EnterpriseGL',
    importSymbol: 'EnterpriseGLTemplate',
    description: 'Veri yoğun kurumsal yönetim paneli (KPI + Analitik)',
  },
  flowgl: {
    label: 'FlowGL',
    importSymbol: 'FlowGLTemplate',
    description: 'Ferah 3 kolonlu master-detail çalışma alanı',
  },
  cargogl: {
    label: 'CargoGL',
    importSymbol: 'CargoGLTemplate',
    description: 'Akıllı lojistik ve filo takip paneli',
  },
  synthgl: {
    label: 'SynthGL',
    importSymbol: 'SynthGLTemplate',
    description: 'AI iş akışı ve ajan orkestrasyon stüdyosu',
  },
  osgl: {
    label: 'OSGL',
    importSymbol: 'OSGLTemplate',
    description: 'WebGL Aurora arka planlı, yüzen pencereli masaüstü & mobil OS şablonu',
  },
  tesseragl: {
    label: 'TesseraGL',
    importSymbol: 'TesseraGLTemplate',
    description: '4 kolonlu Tessera çalışma alanı, sprint kapasite ve takım performans panosu',
  },
};

function normalizeTemplateId(raw) {
  if (!raw) return null;
  const key = String(raw).trim().toLowerCase().replace(/[^a-z0-9]/g, '');
  if (key === 'enterprise' || key === 'enterprisegl') return 'enterprisegl';
  if (key === 'flow' || key === 'flowgl') return 'flowgl';
  if (key === 'cargo' || key === 'cargogl') return 'cargogl';
  if (key === 'synth' || key === 'synthgl') return 'synthgl';
  if (key === 'osgl' || key === 'os' || key === 'macos' || key === 'macosgl' || key === 'eduos') return 'osgl';
  if (key === 'tessera' || key === 'tesseragl') return 'tesseragl';
  return null;
}

function buildTemplateComponentCode(templateId, componentName) {
  if (templateId === 'osgl') {
    return `import React from 'react';
import {
  OSGLApp,
  Card,
  SheetGLGridAdapter,
  FileManGLExplorerAdapter,
  type OSWorkspaceApp,
} from 'truncgil-uxigl';
import 'truncgil-uxigl/styles';

const APPS: OSWorkspaceApp[] = [
  {
    id: 'overview',
    label: 'Genel Bakış',
    shortLabel: 'Özet',
    googleIcon: 'dashboard',
    category: 'Genel',
    gradient: 'linear-gradient(135deg, #2563eb, #06b6d4)',
    defaultOpen: true,
    element: (
      <Card variant="glass" title="uxiGL OSGL Çalışma Alanı">
        <p style={{ margin: 0, color: 'var(--uxu-text-secondary)' }}>
          WASM pencere yöneticisi, klasörler, Dock, 6 yerleşik widget, Spotlight (⌘K) ve Tema Stüdyosu hazır.
        </p>
      </Card>
    ),
  },
  {
    id: 'sheet',
    label: 'SheetGL DataGrid',
    shortLabel: 'Tablo',
    googleIcon: 'table_chart',
    category: 'Veri',
    gradient: 'linear-gradient(135deg, #10b981, #059669)',
    fullBleed: true,
    element: <SheetGLGridAdapter scenario="saas_finance" />,
  },
  {
    id: 'files',
    label: 'FileManGL VFS',
    shortLabel: 'Dosyalar',
    googleIcon: 'folder_open',
    category: 'Depolama',
    gradient: 'linear-gradient(135deg, #f59e0b, #ea580c)',
    fullBleed: true,
    element: <FileManGLExplorerAdapter initialPath="/workspace/projects" />,
  },
];

export function ${componentName}() {
  return (
    <OSGLApp
      apps={APPS}
      storageScopeKey="my-osgl-app"
      brandTitle="${componentName}"
      brandSubtitle="OSGL"
    />
  );
}

export default ${componentName};
`;
  }

  const entry = TEMPLATE_REGISTRY[templateId];
  if (!entry) return STARTER_COMPONENT_TEMPLATE.replace(/UXIWorkspace/g, componentName);

  const renderProps =
    templateId === 'enterprisegl'
      ? ''
      : `\n          onNavigate={() => {}}\n          onOpenThemeStudio={() => {}}`;

  return `import React from 'react';
import {
  ThemeProvider,
  ToastProvider,
  ${entry.importSymbol},
} from 'truncgil-uxigl';
import 'truncgil-uxigl/styles';

export function ${componentName}() {
  return (
    <ThemeProvider defaultMode="dark" defaultPalette="cupertino-blue" defaultRadius={12}>
      <ToastProvider>
        <${entry.importSymbol}${renderProps}
        />
      </ToastProvider>
    </ThemeProvider>
  );
}

export default ${componentName};
`;
}

const STARTER_COMPONENT_TEMPLATE = `import React, { useState } from 'react';
import {
  ThemeProvider,
  ToastProvider,
  Card,
  Button,
  Input,
  Badge,
  Switch,
  SheetGLGridAdapter,
  FileManGLExplorerAdapter,
  UXILogo,
} from 'truncgil-uxigl';
import 'truncgil-uxigl/styles';

export function UXIWorkspace() {
  const [activeTab, setActiveTab] = useState<'overview' | 'sheet' | 'files'>('overview');
  const [metricEnabled, setMetricEnabled] = useState(true);

  return (
    <ThemeProvider defaultMode="dark" defaultPalette="cupertino-blue" defaultRadius={12}>
      <ToastProvider>
        <div
          style={{
            minHeight: '100vh',
            padding: '24px',
            backgroundColor: 'var(--uxu-surface-base)',
            color: 'var(--uxu-text-primary)',
            fontFamily: 'var(--uxu-font-sans)',
            display: 'flex',
            flexDirection: 'column',
            gap: 20,
          }}
        >
          {/* Top Control Bar */}
          <header
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '14px 20px',
              borderRadius: 'var(--uxu-radius-lg)',
              backgroundColor: 'var(--uxu-surface-glass-regular)',
              border: '1px solid var(--uxu-border-subtle)',
              backdropFilter: 'blur(20px)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <UXILogo size={36} animated />
              <div>
                <h1 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800 }}>uxiGL Unified Workspace</h1>
                <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--uxu-text-secondary)' }}>
                  Liquid Glass & M3 Design System with WebGL Accelerators
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Button
                variant={activeTab === 'overview' ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => setActiveTab('overview')}
              >
                Genel Bakış
              </Button>
              <Button
                variant={activeTab === 'sheet' ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => setActiveTab('sheet')}
              >
                SheetGL (DataGrid)
              </Button>
              <Button
                variant={activeTab === 'files' ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => setActiveTab('files')}
              >
                FileManGL (VFS)
              </Button>
            </div>
          </header>

          {/* Active View */}
          {activeTab === 'overview' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
              <Card variant="glass" title="uxiGL Tasarım Sistemi">
                <p style={{ fontSize: '0.88rem', color: 'var(--uxu-text-secondary)', lineHeight: 1.5 }}>
                  Liquid Glass tabakası, canlı 0px–32px köşe geometrisi ve Google Material You tonal renk paletleri.
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 14 }}>
                  <Badge variant="success">Hazır</Badge>
                  <Badge variant="info">v${readPkgVersion()}</Badge>
                  <Badge variant="default">WebGL Hızlandırmalı</Badge>
                </div>
              </Card>

              <Card variant="glass" title="Bileşen Örnekleri">
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '0.88rem' }}>Donanım Hızlandırması</span>
                    <Switch checked={metricEnabled} onChange={setMetricEnabled} />
                  </div>
                  <Input placeholder="Hızlı komut veya arama filtresi..." />
                </div>
              </Card>
            </div>
          )}

          {activeTab === 'sheet' && (
            <div style={{ height: '680px', borderRadius: 'var(--uxu-radius-lg)', overflow: 'hidden' }}>
              <SheetGLGridAdapter scenario="saas_finance" />
            </div>
          )}

          {activeTab === 'files' && (
            <div style={{ height: '680px', borderRadius: 'var(--uxu-radius-lg)', overflow: 'hidden' }}>
              <FileManGLExplorerAdapter initialPath="/workspace/projects" />
            </div>
          )}
        </div>
      </ToastProvider>
    </ThemeProvider>
  );
}

export default UXIWorkspace;
`;

function handleInit(rawArgs) {
  printBanner();
  let dirOpt = null;
  let nameOpt = null;
  let templateOpt = null;
  let positionalPath = null;

  for (let i = 0; i < rawArgs.length; i++) {
    const arg = rawArgs[i];
    if (arg === '--dir' || arg === '-d') {
      dirOpt = rawArgs[++i];
    } else if (arg === '--name' || arg === '-n') {
      nameOpt = rawArgs[++i];
    } else if (arg === '--template' || arg === '-t') {
      templateOpt = rawArgs[++i];
    } else if (arg.startsWith('--template=')) {
      templateOpt = arg.split('=')[1];
    } else if (!arg.startsWith('-') && !positionalPath) {
      positionalPath = arg;
    }
  }

  const templateId = normalizeTemplateId(templateOpt);
  if (templateOpt && !templateId) {
    console.error(`${YELLOW}⚠ Unknown template "${templateOpt}". Available templates: ${Object.keys(TEMPLATE_REGISTRY).join(', ')}${RESET}`);
    process.exit(1);
  }

  const componentName = (nameOpt || 'UXIWorkspace').replace(/\.(tsx|ts|jsx|js)$/i, '');
  const defaultRelPath = path.join(dirOpt || 'src/components', `${componentName}.tsx`);
  const outPath = path.resolve(process.cwd(), positionalPath || defaultRelPath);
  const outDir = path.dirname(outPath);

  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  const customizedTemplate = buildTemplateComponentCode(templateId, componentName);

  fs.writeFileSync(outPath, customizedTemplate, 'utf8');
  const label = templateId ? ` (${TEMPLATE_REGISTRY[templateId].label})` : '';
  console.log(`${GREEN}✔ Created uxiGL starter component${label} at:${RESET} ${BOLD}${outPath}${RESET}`);
  console.log(`
${BOLD}Next steps:${RESET}
  1. Ensure ${CYAN}truncgil-uxigl${RESET} is installed in your project:
     ${YELLOW}npm install truncgil-uxigl${RESET}
  2. Import and render ${CYAN}<${componentName} />${RESET} in your ${BOLD}App.tsx${RESET}:
     ${DIM}import { ${componentName} } from './components/${componentName}';${RESET}
`);
}

function handleCreate(projectName, rawArgs = []) {
  printBanner();
  if (!projectName || projectName.startsWith('-')) {
    console.error(`${YELLOW}⚠ Please specify a project directory name:${RESET}\n  npx truncgil-uxigl create my-uxigl-app --template macosgl`);
    process.exit(1);
  }

  let templateOpt = null;
  for (let i = 0; i < rawArgs.length; i++) {
    const arg = rawArgs[i];
    if (arg === '--template' || arg === '-t') {
      templateOpt = rawArgs[++i];
    } else if (arg.startsWith('--template=')) {
      templateOpt = arg.split('=')[1];
    }
  }

  const templateId = normalizeTemplateId(templateOpt);
  if (templateOpt && !templateId) {
    console.error(`${YELLOW}⚠ Unknown template "${templateOpt}". Available templates: ${Object.keys(TEMPLATE_REGISTRY).join(', ')}${RESET}`);
    process.exit(1);
  }

  const targetDir = path.resolve(process.cwd(), projectName);
  if (fs.existsSync(targetDir) && fs.readdirSync(targetDir).length > 0) {
    console.error(`${YELLOW}⚠ Target directory "${projectName}" already exists and is not empty.${RESET}`);
    process.exit(1);
  }

  fs.mkdirSync(path.join(targetDir, 'src', 'components'), { recursive: true });

  const appPkg = {
    name: projectName.toLowerCase().replace(/[^a-z0-9-_]/g, '-'),
    private: true,
    version: '0.1.0',
    type: 'module',
    scripts: {
      dev: 'vite',
      build: 'tsc && vite build',
      preview: 'vite preview',
    },
    dependencies: {
      'truncgil-uxigl': `^${readPkgVersion()}`,
      react: '^19.0.0',
      'react-dom': '^19.0.0',
    },
    devDependencies: {
      '@types/react': '^19.0.0',
      '@types/react-dom': '^19.0.0',
      '@vitejs/plugin-react': '^4.3.4',
      typescript: '~5.7.2',
      vite: '^6.2.0',
    },
  };

  fs.writeFileSync(path.join(targetDir, 'package.json'), JSON.stringify(appPkg, null, 2), 'utf8');
  fs.writeFileSync(
    path.join(targetDir, 'index.html'),
    `<!doctype html>
<html lang="tr" class="dark">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${projectName} — uxiGL</title>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;600&display=swap" rel="stylesheet" />
  </head>
  <body style="margin:0;padding:0;background:#06080e;color:#f8fafc;">
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
`,
    'utf8'
  );

  fs.writeFileSync(
    path.join(targetDir, 'vite.config.ts'),
    `import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
});
`,
    'utf8'
  );

  fs.writeFileSync(
    path.join(targetDir, 'tsconfig.json'),
    JSON.stringify(
      {
        compilerOptions: {
          target: 'ES2022',
          lib: ['ES2022', 'DOM', 'DOM.Iterable'],
          module: 'ESNext',
          moduleResolution: 'bundler',
          jsx: 'react-jsx',
          strict: true,
          skipLibCheck: true,
          noEmit: true,
        },
        include: ['src'],
      },
      null,
      2
    ),
    'utf8'
  );

  fs.writeFileSync(
    path.join(targetDir, 'src', 'components', 'UXIWorkspace.tsx'),
    buildTemplateComponentCode(templateId, 'UXIWorkspace'),
    'utf8'
  );
  fs.writeFileSync(
    path.join(targetDir, 'src', 'App.tsx'),
    `import React from 'react';
import { UXIWorkspace } from './components/UXIWorkspace';

export default function App() {
  return <UXIWorkspace />;
}
`,
    'utf8'
  );
  fs.writeFileSync(
    path.join(targetDir, 'src', 'main.tsx'),
    `import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
`,
    'utf8'
  );

  console.log(`${GREEN}✔ Scaffolded new uxiGL project in:${RESET} ${BOLD}${targetDir}${RESET}\n`);
  console.log(`${BOLD}Run the following commands to start:${RESET}
  ${CYAN}cd ${projectName}${RESET}
  ${CYAN}npm install${RESET}
  ${CYAN}npm run dev${RESET}
`);
}

function handleDoctor() {
  printBanner();
  const esmBundle = path.join(pkgRoot, 'dist', 'lib', 'uxigl.js');
  const cjsBundle = path.join(pkgRoot, 'dist', 'lib', 'uxigl.cjs');
  const cssBundle = path.join(pkgRoot, 'dist', 'lib', 'style.css');
  const dtsBundle = path.join(pkgRoot, 'dist', 'lib', 'types', 'index.d.ts');
  const demoIndex = path.join(pkgRoot, 'dist', 'index.html');

  console.log(`${BOLD}Environment & Package Diagnostics:${RESET}`);
  console.log(`  • Node.js Runtime : ${GREEN}${process.version}${RESET}`);
  console.log(`  • Platform / Arch : ${process.platform} (${process.arch})`);
  console.log(`  • ESM Library     : ${fs.existsSync(esmBundle) ? `${GREEN}✔ Ready (dist/lib/uxigl.js)${RESET}` : `${YELLOW}⚠ Missing (run npm run build:lib)${RESET}`}`);
  console.log(`  • CJS Library     : ${fs.existsSync(cjsBundle) ? `${GREEN}✔ Ready (dist/lib/uxigl.cjs)${RESET}` : `${YELLOW}⚠ Missing (run npm run build:lib)${RESET}`}`);
  console.log(`  • CSS Stylesheet  : ${fs.existsSync(cssBundle) ? `${GREEN}✔ Ready (dist/lib/style.css)${RESET}` : `${YELLOW}⚠ Missing (run npm run build:lib)${RESET}`}`);
  console.log(`  • TypeScript .d.ts: ${fs.existsSync(dtsBundle) ? `${GREEN}✔ Ready (dist/lib/types/index.d.ts)${RESET}` : `${YELLOW}⚠ Missing (run npm run build:lib)${RESET}`}`);
  console.log(`  • Demo SPA Bundle : ${fs.existsSync(demoIndex) ? `${GREEN}✔ Ready (dist/index.html)${RESET}` : `${YELLOW}⚠ Missing (run npm run build:demo)${RESET}`}`);
  console.log('');
}

function handleDemo() {
  printBanner();
  console.log(`${CYAN}Starting uxiGL Showcase & Documentation server...${RESET}\n`);
  spawnSync('npx', ['vite'], { cwd: pkgRoot, stdio: 'inherit', shell: true });
}

function handleTemplate(rawArgs) {
  const chosen = rawArgs[0];
  if (!chosen || chosen === 'list' || chosen === '--list') {
    printBanner();
    console.log(`${BOLD}Available uxiGL Templates:${RESET}`);
    for (const [id, info] of Object.entries(TEMPLATE_REGISTRY)) {
      console.log(`  ${CYAN}${id.padEnd(14)}${RESET} ${BOLD}${info.label}${RESET} — ${info.description}`);
    }
    console.log(`\n${BOLD}Usage:${RESET}
  npx truncgil-uxigl template macosgl
  npx truncgil-uxigl init --template flowgl
  npx truncgil-uxigl create my-app --template macosgl
`);
    return;
  }
  handleInit(['--template', chosen, ...rawArgs.slice(1)]);
}

const args = process.argv.slice(2);
const invokedBin = path.basename(process.argv[1] || '');
const cmd = (args[0] || 'help').toLowerCase();

if (invokedBin.includes('create-uxigl') && args[0] && !['init', 'create', 'template', 'use', 'doctor', 'demo', 'help', '-v', '--version'].includes(cmd)) {
  handleCreate(args[0], args.slice(1));
} else if (cmd === 'init' || cmd === 'setup') {
  handleInit(args.slice(1));
} else if (cmd === 'create') {
  handleCreate(args[1], args.slice(2));
} else if (cmd === 'template' || cmd === 'use') {
  handleTemplate(args.slice(1));
} else if (cmd === 'doctor' || cmd === 'info' || cmd === 'check') {
  handleDoctor();
} else if (cmd === 'demo' || cmd === 'studio' || cmd === 'start') {
  handleDemo();
} else if (cmd === '-v' || cmd === '--version' || cmd === 'version') {
  console.log(readPkgVersion());
} else {
  printHelp();
}
