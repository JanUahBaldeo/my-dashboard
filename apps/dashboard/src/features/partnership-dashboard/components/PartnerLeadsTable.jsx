import React, { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle,
  PauseCircle,
  Clock,
  ArrowUpDown,
  TrendingUp,
  DollarSign,
  Users,
  Target,
  Filter,
  RefreshCw,
  Search,
} from 'lucide-react';

// --- Accent Color ---
const ACCENT = '#01818E';

const cx = (...classes) => classes.filter(Boolean).join(' ');

// --- UI Components ---
const Card = ({ children, className = '', hoverable = false }) => (
  <div
    className={cx(
      'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-sm',
      hoverable && 'group transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md ring-1 ring-transparent hover:ring-[var(--accent)]/30',
      className,
    )}
    style={{ ['--accent']: ACCENT }}
  >
    {children}
  </div>
);

const CardContent = ({ children, className = '' }) => (
  <div className={cx('p-4', className)}>{children}</div>
);

const CardHeader = ({ children, className = '' }) => (
  <div className={cx('px-4 pt-4 pb-2', className)}>{children}</div>
);

const CardTitle = ({ children, className = '' }) => (
  <h3 className={cx('text-lg font-semibold text-gray-900 dark:text-gray-100', className)}>{children}</h3>
);

const Badge = ({ children, variant = 'default', className = '' }) => {
  const variants = {
    default: 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200',
    outline: 'border border-gray-300 dark:border-gray-600 bg-transparent text-gray-700 dark:text-gray-300',
  };
  return (
    <span className={cx('inline-flex items-center px-2 py-1 text-xs font-medium rounded-full', variants[variant], className)}>
      {children}
    </span>
  );
};

const Input = ({ className = '', ...props }) => (
  <input
    className={cx(
      'w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent',
      className,
    )}
    style={{ ['--accent']: ACCENT }}
    {...props}
  />
);

const Button = ({ children, variant = 'default', size = 'default', className = '', ...props }) => {
  const variants = {
    default: 'bg-[var(--accent)] hover:brightness-95 text-white',
    ghost: 'bg-transparent hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300',
  };
  const sizes = {
    default: 'px-4 py-2',
    icon: 'p-2',
  };
  return (
    <button
      className={cx(
        'inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:ring-offset-2',
        variants[variant],
        sizes[size],
        className,
      )}
      style={{ ['--accent']: ACCENT }}
      {...props}
    >
      {children}
    </button>
  );
};

const Separator = ({ className = '' }) => <hr className={cx('border-gray-200 dark:border-gray-700', className)} />;

// --- Data ---
const leadsData = [
  { partner: 'ABC Title Co.', leads: 67, mqls: 41, cpl: 12.5, source: 'Co-branded email', status: 'Active', url: '#' },
  { partner: 'HomeShield Warranty', leads: 82, mqls: 52, cpl: 9.1, source: 'Paid Meta Ads', status: 'Pending', url: '#' },
  { partner: 'RateCompare Pro', leads: 138, mqls: 37, cpl: 15.7, source: 'GMB/Web', status: 'Paused', url: '#' },
];

const statusIcon = {
  Active: <CheckCircle size={16} className="text-green-500" />,
  Pending: <Clock size={16} className="text-yellow-500" />,
  Paused: <PauseCircle size={16} className="text-red-500" />,
};

const rowVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: (i) => ({ opacity: 1, y: 0, transition: { delay: i * 0.06, duration: 0.35, ease: 'easeOut' } }),
};

const prettyCurrency = (n) => new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD' }).format(n);

// --- KPI Card ---
const KPI = ({ label, value, delta, icon }) => (
  <Card hoverable className="flex-1 min-w-0">
    <CardContent className="p-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
          <p className="text-2xl font-semibold tracking-tight mt-1">{value}</p>
          <div className={cx('mt-1 text-xs inline-flex items-center', (delta || '').startsWith('+') ? 'text-green-600' : 'text-red-600')}>
            <TrendingUp size={14} className={(delta || '').startsWith('+') ? 'mr-1' : 'mr-1 rotate-180'} />
            {delta}
          </div>
        </div>
        <div className="p-2 rounded-xl bg-[var(--accent)]/10 text-[var(--accent)]" style={{ ['--accent']: ACCENT }}>
          {icon}
        </div>
      </div>
    </CardContent>
  </Card>
);

export default function PartnerLeadsDashboard() {
  // search + filters
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState(['All']);
  const [sourceFilter, setSourceFilter] = useState('All');

  // sorting
  const [sortKey, setSortKey] = useState(null);
  const [sortDir, setSortDir] = useState('asc');

  useEffect(() => {
    const saved = localStorage.getItem('partner-dashboard:search');
    if (saved) setSearch(saved);
  }, []);
  useEffect(() => {
    const id = setTimeout(() => localStorage.setItem('partner-dashboard:search', search), 250);
    return () => clearTimeout(id);
  }, [search]);

  const sources = useMemo(() => ['All', ...Array.from(new Set(leadsData.map((d) => d.source)))], []);

  const filtered = useMemo(() => {
    const needle = search.trim().toLowerCase();
    return leadsData.filter((d) => {
      const matchesText = !needle || d.partner.toLowerCase().includes(needle) || d.source.toLowerCase().includes(needle);
      const matchesStatus = statusFilter.includes('All') || statusFilter.length === 0 ? true : statusFilter.includes(d.status);
      const matchesSource = sourceFilter === 'All' ? true : d.source === sourceFilter;
      return matchesText && matchesStatus && matchesSource;
    });
  }, [search, statusFilter, sourceFilter]);

  const sorted = useMemo(() => {
    if (!sortKey) return filtered;
    const arr = [...filtered].sort((a, b) => {
      const A = a[sortKey];
      const B = b[sortKey];
      if (typeof A === 'number' && typeof B === 'number') return A - B;
      return String(A).localeCompare(String(B));
    });
    return sortDir === 'asc' ? arr : arr.reverse();
  }, [filtered, sortKey, sortDir]);

  const columns = [
    { key: 'partner', label: 'Partner' },
    { key: 'leads', label: 'Leads' },
    { key: 'mqls', label: 'MQLs' },
    { key: 'cpl', label: 'CPL' },
    { key: 'source', label: 'Source' },
    { key: 'status', label: 'Status' },
  ];

  const onSort = (key) => {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  return (
    <div className="w-full mx-auto px-4 lg:px-6 max-w-l" style={{ ['--accent']: ACCENT }}>
      {/* KPIs in a SINGLE ROW (no extra margins) */}
      <div className="flex gap-3 items-stretch m-0 p-0">
        <KPI label="Team Performance" value="94%" delta="+3% vs last month" icon={<TrendingUp className="h-5 w-5" />} />
        <KPI label="Monthly Volume" value="$8.2M" delta="+15% vs last month" icon={<DollarSign className="h-5 w-5" />} />
        <KPI label="Active LOs" value="12" delta="+1 vs last month" icon={<Users className="h-5 w-5" />} />
        <KPI label="Avg Close Time" value="28d" delta="-5% vs last month" icon={<Target className="h-5 w-5" />} />
      </div>

      {/* Recent Activity */}
      <Card className="mt-4" hoverable>
        <CardHeader className="pb-2"><CardTitle>Recent Activity</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { dot: 'bg-green-500', title: 'Monthly goal achieved', meta: 'Team Alpha', time: '1 hour ago' },
              { dot: 'bg-[var(--accent)]', title: 'New LO onboarded', meta: 'Alex Thompson', time: '4 hours ago' },
              { dot: 'bg-[var(--accent)]', title: 'Campaign launched', meta: 'Q1 Promotion', time: '6 hours ago' },
              { dot: 'bg-yellow-500', title: 'Performance review', meta: 'Team Beta', time: '1 day ago' },
            ].map((r, i) => (
              <div key={i} className="flex items-center">
                <div className={cx('w-2 h-2 rounded-full mr-3', r.dot)} />
                <div className="flex-1">
                  <span className="text-sm font-medium">{r.title}</span>
                  <span className="text-sm text-muted-foreground ml-2">{r.meta}</span>
                </div>
                <span className="text-xs text-muted-foreground">{r.time}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Mini Widgets in a SINGLE ROW (tight, no big margins) */}
      <div className="mt-4 flex gap-3 items-stretch">
        <Card hoverable className="flex-1 min-w-0"><CardContent className="p-5">🔥 Top Partner: <span className="font-medium">RateCompare Pro</span></CardContent></Card>
        <Card hoverable className="flex-1 min-w-0"><CardContent className="p-5">💰 Avg CPL: {prettyCurrency(sorted.reduce((a, c) => a + c.cpl, 0) / (sorted.length || 1))}</CardContent></Card>
        <Card hoverable className="flex-1 min-w-0"><CardContent className="p-5">📈 Total MQLs: {sorted.reduce((a, c) => a + c.mqls, 0)}</CardContent></Card>
      </div>

      {/* Controls */}
      <Card className="mt-4" hoverable>
        <CardContent className="p-4 lg:p-5">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-2 w-full lg:w-1/2">
              <div className="relative w-full">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search partner or source..." className="pl-8" />
              </div>
              <Button variant="ghost" size="icon" onClick={() => setSearch('')}> <RefreshCw className="h-4 w-4" /> </Button>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden lg:flex items-center gap-2">
                <Filter className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-500">Status:</span>
              </div>

              <div className="inline-flex rounded-lg border bg-white dark:bg-gray-800 p-1">
                {['All', 'Active', 'Pending', 'Paused'].map((s) => (
                  <button
                    key={s}
                    onClick={() => {
                      if (statusFilter.includes(s)) {
                        setStatusFilter(statusFilter.filter((f) => f !== s));
                      } else {
                        setStatusFilter([...statusFilter.filter((f) => f !== 'All'), s]);
                      }
                    }}
                    className={cx(
                      'px-3 py-1.5 text-sm rounded-md transition-colors',
                      statusFilter.includes(s)
                        ? 'bg-[var(--accent)]/10 text-[var(--accent)]'
                        : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300',
                    )}
                    style={{ ['--accent']: ACCENT }}
                  >
                    {s}
                  </button>
                ))}
              </div>

              <select
                value={sourceFilter}
                onChange={(e) => setSourceFilter(e.target.value)}
                className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                style={{ ['--accent']: ACCENT }}
              >
                {sources.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data Table */}
      <Card className="mt-4 overflow-hidden border" hoverable>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-left">
              <thead className="bg-gray-50 dark:bg-gray-700 text-xs uppercase tracking-wide sticky top-0 z-10">
                <tr>
                  {columns.map((col) => (
                    <th key={col.key} className="px-4 lg:px-6 py-3 lg:py-4 whitespace-nowrap">
                      <button
                        onClick={() => onSort(col.key)}
                        className="inline-flex items-center gap-1 hover:text-[var(--accent)]"
                        style={{ ['--accent']: ACCENT }}
                      >
                        {col.label}
                        <ArrowUpDown className={cx('h-3.5 w-3.5', sortKey === col.key ? 'opacity-100' : 'opacity-50')} />
                      </button>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                <AnimatePresence initial={false}>
                  {sorted.map((row, idx) => (
                    <motion.tr
                      key={row.partner}
                      className="transition-colors cursor-pointer hover:bg-[var(--accent)]/5"
                      initial="hidden"
                      animate="visible"
                      custom={idx}
                      variants={rowVariants}
                      exit={{ opacity: 0 }}
                      whileHover={{ scale: 1.003, transition: { duration: 0.18 } }}
                      style={{ ['--accent']: ACCENT }}
                    >
                      <td className="px-4 lg:px-6 py-3 lg:py-4">
                        <a href={row.url} className="font-medium text-[var(--accent)] hover:opacity-85" style={{ ['--accent']: ACCENT }}>
                          {row.partner}
                        </a>
                      </td>
                      <td className="px-4 lg:px-6 py-3 lg:py-4 font-medium">{row.leads}</td>
                      <td className="px-4 lg:px-6 py-3 lg:py-4 font-medium">{row.mqls}</td>
                      <td className="px-4 lg:px-6 py-3 lg:py-4">{prettyCurrency(row.cpl)}</td>
                      <td className="px-4 lg:px-6 py-3 lg:py-4">{row.source}</td>
                      <td className="px-4 lg:px-6 py-3 lg:py-4">
                        <Badge variant="outline" className="gap-1">{statusIcon[row.status]} {row.status}</Badge>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
                {sorted.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">No partners match your filters.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Tips / Tabs */}
      <Separator className="my-6" />
    </div>
  );
}
