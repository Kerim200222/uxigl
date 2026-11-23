import type {
  KanbanColumn,
  KanbanPriority,
  KanbanTask,
} from './types';

export const DEFAULT_KANBAN_COLUMNS: KanbanColumn[] = [
  { id: 'backlog', title: 'Backlog', titleTr: 'Beklemede', tone: 'neutral' },
  { id: 'progress', title: 'In Progress', titleTr: 'Geliştiriliyor', tone: 'primary', wipLimit: 4 },
  { id: 'review', title: 'Code Review', titleTr: 'İncelemede', tone: 'warning', wipLimit: 3 },
  { id: 'done', title: 'Completed', titleTr: 'Tamamlandı', tone: 'success' },
];

export const KANBAN_PRIORITY_META: Record<
  KanbanPriority,
  { labelTr: string; labelEn: string; tone: 'danger' | 'warning' | 'neutral' }
> = {
  high: { labelTr: 'Yüksek', labelEn: 'High', tone: 'danger' },
  medium: { labelTr: 'Orta', labelEn: 'Medium', tone: 'warning' },
  low: { labelTr: 'Düşük', labelEn: 'Low', tone: 'neutral' },
};

/**
 * Builds the default localized seed tasks for {@link Kanban}.
 *
 * @param locale - Display locale (`'tr' | 'en'`, defaults to `'tr'`).
 * @returns Array of initial {@link KanbanTask} items.
 */
export function buildSeedKanbanTasks(locale: 'tr' | 'en' = 'tr'): KanbanTask[] {
  const isTR = locale === 'tr';
  return [
    {
      id: 'UXI-101',
      title: isTR
        ? '8pt Uzamsal Grid & Liquid Glass Sidebar Standardizasyonu'
        : '8pt Spatial Grid & Liquid Glass Sidebar Standardization',
      description: isTR
        ? 'Tüm kabuk bileşenlerinde cam bulanıklığı ve 8pt boşluk tokenlarını hizala.'
        : 'Align glass blur and 8pt spacing tokens across all shell components.',
      tag: 'Design System',
      tagTone: 'primary',
      priority: 'high',
      assignee: 'Ümit Uz',
      progress: 100,
      column: 'done',
      dueDate: isTR ? 'Bugün' : 'Today',
      subtasksDone: 5,
      subtasksTotal: 5,
    },
    {
      id: 'UXI-104',
      title: isTR
        ? 'Passkey (WebAuthn) ve Biyometrik Giriş Akışı Entegrasyonu'
        : 'Passkey (WebAuthn) & Biometric Login Flow Integration',
      description: isTR
        ? 'Zero-Trust oturum açma için donanım anahtarı doğrulama adımlarını ekle.'
        : 'Add hardware key verification steps for Zero-Trust sign-in.',
      tag: 'Security',
      tagTone: 'danger',
      priority: 'high',
      assignee: 'Selin Kaya',
      progress: 75,
      column: 'review',
      dueDate: isTR ? 'Yarın' : 'Tomorrow',
      subtasksDone: 3,
      subtasksTotal: 4,
    },
    {
      id: 'UXI-108',
      title: isTR
        ? 'SheetGL 1M Satır Sanallaştırma & Zebra Satır Performans Testi'
        : 'SheetGL 1M Row Virtualization & Zebra Row Benchmark',
      description: isTR
        ? '60 FPS kaydırma hedefiyle WebGL2 tampon bellek optimizasyonu.'
        : 'WebGL2 buffer optimization targeting 60 FPS scroll performance.',
      tag: 'WebGL Engine',
      tagTone: 'info',
      priority: 'high',
      assignee: 'Mert Demir',
      progress: 60,
      column: 'progress',
      dueDate: isTR ? '12 Kas' : 'Nov 12',
      subtasksDone: 3,
      subtasksTotal: 5,
    },
    {
      id: 'UXI-112',
      title: isTR
        ? 'Kurumsal e-Fatura PDF Şablonu ve QR Doğrulama Modülü'
        : 'Enterprise e-Invoice PDF Template & QR Verification Module',
      description: isTR
        ? 'Otomatik KDV dağılımı ve anlık QR kod doğrulama desteği.'
        : 'Automated tax breakdown and instant QR code verification support.',
      tag: 'Billing',
      tagTone: 'success',
      priority: 'medium',
      assignee: 'Zeynep Ak',
      progress: 45,
      column: 'progress',
      dueDate: isTR ? '15 Kas' : 'Nov 15',
      subtasksDone: 2,
      subtasksTotal: 4,
    },
    {
      id: 'UXI-115',
      title: isTR
        ? 'Çoklu Dil (i18n) Otomatik Sözlük Senkronizasyonu'
        : 'Multi-Language (i18n) Automated Dictionary Sync',
      tag: 'Core',
      tagTone: 'warning',
      priority: 'medium',
      assignee: 'Caner Yılmaz',
      progress: 15,
      column: 'backlog',
      dueDate: isTR ? '19 Kas' : 'Nov 19',
      subtasksDone: 1,
      subtasksTotal: 6,
    },
    {
      id: 'UXI-119',
      title: isTR
        ? '3B Uzamsal Paneller için Optik Derinlik Gölgeleri'
        : 'Optical Depth Shadows for 3D Spatial Panels',
      tag: 'Design System',
      tagTone: 'primary',
      priority: 'low',
      assignee: 'Ümit Uz',
      progress: 0,
      column: 'backlog',
      dueDate: isTR ? '24 Kas' : 'Nov 24',
      subtasksDone: 0,
      subtasksTotal: 3,
    },
  ];
}

/**
 * Filters Kanban tasks by search query (title, ID, tag, assignee) and priority.
 *
 * @param tasks - Source task collection.
 * @param query - Case-insensitive substring query.
 * @param priorityFilter - Specific priority filter or `'all'`.
 * @returns Filtered array of {@link KanbanTask} items.
 */
export function filterKanbanTasks(
  tasks: KanbanTask[],
  query: string,
  priorityFilter: KanbanPriority | 'all'
): KanbanTask[] {
  const q = query.trim().toLowerCase();
  return tasks.filter((t) => {
    const priorityOk = priorityFilter === 'all' || t.priority === priorityFilter;
    const queryOk =
      !q ||
      t.title.toLowerCase().includes(q) ||
      t.id.toLowerCase().includes(q) ||
      t.tag.toLowerCase().includes(q) ||
      t.assignee.toLowerCase().includes(q);
    return priorityOk && queryOk;
  });
}

/**
 * Computes aggregate sprint counts and completion percentage across all tasks.
 *
 * @param tasks - Task list to summarize.
 * @returns Summary object containing `total`, `done`, `inProgress`, `review`, and `completionPct`.
 */
export function computeKanbanStats(tasks: KanbanTask[]) {
  const total = tasks.length;
  const done = tasks.filter((t) => t.column === 'done').length;
  const inProgress = tasks.filter((t) => t.column === 'progress').length;
  const review = tasks.filter((t) => t.column === 'review').length;
  const completionPct = total > 0 ? Math.round((done / total) * 100) : 0;
  return { total, done, inProgress, review, completionPct };
}
