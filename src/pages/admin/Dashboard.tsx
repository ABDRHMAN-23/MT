import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  AlertTriangle,
  ArrowLeft,
  Cake,
  Gift,
  MapPin,
  Percent,
  Receipt,
  Repeat,
  TrendingDown,
  TrendingUp,
  Truck,
  Users,
  Wallet,
} from 'lucide-react';
import { api } from '../../lib/api';
import type { Stats } from '../../lib/types';
import { arDateTime, money, ORDER_STATUS } from '../../lib/format';

const RANGES = [
  { value: 7, label: '٧ أيام' },
  { value: 14, label: '١٤ يومًا' },
  { value: 30, label: '٣٠ يومًا' },
  { value: 90, label: '٩٠ يومًا' },
];

export default function Dashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [range, setRange] = useState(14);

  const load = async (days = range) => {
    setLoading(true);
    setError(null);
    try {
      setStats(await api.stats(days));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'تعذّر تحميل الإحصاءات');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load(range);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [range]);

  if (loading && !stats) {
    return (
      <div className="space-y-6">
        <div className="skeleton h-10 w-56 rounded-full" />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="skeleton h-32 rounded-4xl" />
          ))}
        </div>
        <div className="skeleton h-72 rounded-4xl" />
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="rounded-4xl border border-raspberry/25 bg-raspberry/5 px-6 py-12 text-center">
        <p className="headline text-lg text-berry">تعذّر تحميل اللوحة</p>
        <p className="mt-2 text-sm text-mocha">{error}</p>
        <button
          onClick={() => load()}
          className="mt-6 inline-flex h-11 items-center rounded-full bg-cocoa px-7 text-sm text-cream"
        >
          إعادة المحاولة
        </button>
      </div>
    );
  }

  // Round the axis up to a clean step so bar heights map to a readable scale.
  const peakRevenue = Math.max(...stats.days.map((d) => d.revenue), 0);
  const niceStep = (v: number) => {
    if (v <= 0) return 100;
    const pow = 10 ** Math.floor(Math.log10(v));
    return [1, 2, 2.5, 5, 10].map((m) => m * pow).find((s) => s * 4 >= v) ?? pow * 10;
  };
  const axisStep = niceStep(peakRevenue);
  const axisMax = Math.max(axisStep * 4, axisStep);
  const maxCategory = Math.max(...stats.byCategory.map((c) => c.revenue), 1);
  const maxCity = Math.max(...stats.byCity.map((c) => c.revenue), 1);

  const cards = [
    {
      icon: <Wallet size={17} />,
      label: 'إجمالي الإيرادات',
      value: money(stats.revenue),
      suffix: 'ر.س',
      trend: stats.revenueTrend,
      tone: 'text-gold',
      bg: 'bg-gold/10',
    },
    {
      icon: <Receipt size={17} />,
      label: 'إجمالي الطلبات',
      value: String(stats.ordersCount),
      suffix: 'طلب',
      trend: stats.ordersTrend,
      tone: 'text-berry',
      bg: 'bg-berry/10',
    },
    {
      icon: <TrendingUp size={17} />,
      label: 'متوسط قيمة الطلب',
      value: money(stats.avgOrder),
      suffix: 'ر.س',
      tone: 'text-pistachio',
      bg: 'bg-pistachio/12',
    },
    {
      icon: <Truck size={17} />,
      label: 'طلبات قيد التنفيذ',
      value: String(stats.openOrders),
      suffix: `بقيمة ${money(stats.openRevenue)}`,
      tone: 'text-cocoa',
      bg: 'bg-cocoa/8',
    },
  ];

  const secondary = [
    { icon: <Users size={15} />, label: 'العملاء', value: String(stats.customersCount) },
    { icon: <Repeat size={15} />, label: 'عملاء متكررون', value: String(stats.repeatCustomers) },
    { icon: <Gift size={15} />, label: 'نسبة الإهداء', value: `${stats.giftRate}%` },
    { icon: <Cake size={15} />, label: 'عدد الحلويات', value: String(stats.productsCount) },
    { icon: <Percent size={15} />, label: 'خصومات مُستخدمة', value: `${money(stats.discountUsed)} ر.س` },
    { icon: <TrendingUp size={15} />, label: 'نسبة الإتمام', value: `${stats.fulfillmentRate}%` },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow text-[10px] text-gold">Tableau de bord</p>
          <h1 className="headline mt-2 text-2xl text-cocoa sm:text-3xl">لوحة المطبخ</h1>
          <p className="mt-1.5 text-[13px] text-mocha">
            قراءة تفصيلية لأداء موسيريا خلال آخر <span className="num">{stats.range}</span> يومًا.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex rounded-full border border-line bg-ivory p-1">
            {RANGES.map((r) => (
              <button
                key={r.value}
                onClick={() => setRange(r.value)}
                className={`rounded-full px-3.5 py-2 text-[12px] transition ${
                  range === r.value ? 'bg-cocoa text-cream' : 'text-cocoa-2 hover:text-cocoa'
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>
          <Link
            to="/admin/orders"
            className="inline-flex h-11 items-center gap-2 rounded-full bg-cocoa px-5 text-[13px] text-cream transition hover:bg-cocoa-2"
          >
            إدارة الطلبات
            <ArrowLeft size={15} />
          </Link>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((c, i) => (
          <motion.div
            key={c.label}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: i * 0.06 }}
            className="rounded-4xl border border-line bg-ivory p-5"
          >
            <div className="flex items-start justify-between">
              <span className={`grid h-11 w-11 place-items-center rounded-full ${c.bg} ${c.tone}`}>
                {c.icon}
              </span>
              {typeof c.trend === 'number' && (
                <span
                  className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] ${
                    c.trend >= 0 ? 'bg-pistachio/12 text-pistachio' : 'bg-raspberry/10 text-raspberry'
                  }`}
                >
                  {c.trend >= 0 ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
                  <span className="num">{Math.abs(c.trend)}%</span>
                </span>
              )}
            </div>
            <p className="mt-4 text-[12px] text-mocha">{c.label}</p>
            <p className="num mt-1.5 text-3xl text-cocoa">
              {c.value} <span className="text-[11px] text-mocha">{c.suffix}</span>
            </p>
          </motion.div>
        ))}
      </div>

      <div className="grid gap-3 sm:grid-cols-3 xl:grid-cols-6">
        {secondary.map((s) => (
          <div key={s.label} className="rounded-3xl border border-line bg-ivory p-4">
            <span className="grid h-8 w-8 place-items-center rounded-full bg-cream text-gold">{s.icon}</span>
            <p className="mt-2.5 text-[11px] text-mocha">{s.label}</p>
            <p className="num mt-0.5 text-[17px] text-cocoa">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.6fr_1fr]">
        <div className="rounded-4xl border border-line bg-ivory p-6">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="headline text-lg text-cocoa">
                الإيرادات آخر <span className="num">{stats.range}</span> يومًا
              </h2>
              <p className="mt-1 text-[12px] text-mocha">بالريال السعودي</p>
            </div>
            <span className="num rounded-full bg-cream px-3.5 py-1.5 text-[12px] text-gold">
              {money(stats.periodRevenue)} ر.س
            </span>
          </div>

          <div className="flex gap-3" dir="ltr">
            <div className="num flex h-56 w-12 shrink-0 flex-col justify-between text-[10px] text-mocha-2">
              {[4, 3, 2, 1, 0].map((n) => (
                <span key={n} className="-translate-y-1.5 text-end">
                  {money((axisMax / 4) * n)}
                </span>
              ))}
            </div>

            <div className="relative h-56 flex-1">
              {[0, 1, 2, 3, 4].map((n) => (
                <span
                  key={n}
                  className={`absolute inset-x-0 h-px ${n === 0 ? 'bg-line' : 'bg-line/50'}`}
                  style={{ bottom: `${n * 25}%` }}
                />
              ))}

              <div className="relative flex h-full items-stretch gap-1">
                {stats.days.map((d, i) => (
                  <div
                    key={d.date}
                    className="group relative flex h-full flex-1 flex-col items-center justify-end"
                  >
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{
                        height: d.revenue > 0 ? `${(d.revenue / axisMax) * 100}%` : '2px',
                      }}
                      transition={{
                        duration: 0.6,
                        delay: Math.min(i, 25) * 0.02,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                      className={`w-full shrink-0 rounded-t-md transition-colors ${
                        d.revenue > 0 ? 'bg-gold/70 group-hover:bg-gold' : 'bg-sand-2'
                      }`}
                    />
                    <span className="pointer-events-none absolute -top-11 z-10 hidden whitespace-nowrap rounded-lg bg-cocoa px-2.5 py-1.5 text-center text-[10px] leading-relaxed text-cream group-hover:block">
                      {money(d.revenue)} ر.س · {d.orders} طلب
                      <br />
                      <span className="num opacity-60">{d.date}</span>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="num mt-2 flex gap-1 ps-[3.75rem] text-[9.5px] text-mocha-2" dir="ltr">
            {stats.days.map((d, i) => {
              const every = stats.days.length > 20 ? 5 : stats.days.length > 10 ? 2 : 1;
              return (
                <span key={d.date} className="flex-1 text-center">
                  {i % every === 0 ? d.date.slice(5) : ''}
                </span>
              );
            })}
          </div>
        </div>

        <div className="rounded-4xl border border-line bg-ivory p-6">
          <h2 className="headline text-lg text-cocoa">مسار تنفيذ الطلبات</h2>
          <div className="mt-6 space-y-4">
            {Object.entries(stats.byStatus).map(([key, count]) => {
              const meta = ORDER_STATUS[key];
              const pct = stats.ordersCount ? (count / stats.ordersCount) * 100 : 0;
              return (
                <div key={key}>
                  <div className="mb-1.5 flex items-center justify-between text-[12.5px]">
                    <span className="flex items-center gap-2 text-cocoa-2">
                      <span className="h-2 w-2 rounded-full" style={{ background: meta?.dot ?? '#A97C3F' }} />
                      {meta?.label ?? key}
                    </span>
                    <span className="num text-mocha">
                      {count} <span className="text-[10px]">({Math.round(pct)}%)</span>
                    </span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-cream">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.7, ease: 'easeOut' }}
                      className="h-full rounded-full"
                      style={{ background: meta?.dot ?? '#A97C3F' }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-6 grid grid-cols-2 gap-3 border-t border-line pt-5 text-center">
            <div className="rounded-2xl bg-cream p-3">
              <p className="num text-lg text-pistachio">{stats.fulfillmentRate}%</p>
              <p className="text-[11px] text-mocha">تم التسليم</p>
            </div>
            <div className="rounded-2xl bg-cream p-3">
              <p className="num text-lg text-raspberry">{stats.cancelRate}%</p>
              <p className="text-[11px] text-mocha">إلغاء</p>
            </div>
          </div>
        </div>
      </div>

      {(stats.lowStock > 0 || stats.outOfStock > 0) && (
        <div className="rounded-4xl border border-raspberry/25 bg-raspberry/6 p-5">
          <div className="flex items-start gap-3">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-raspberry/12 text-raspberry">
              <AlertTriangle size={17} />
            </span>
            <div className="flex-1">
              <p className="text-[13px] leading-relaxed text-cocoa-2">
                <b className="num">{stats.lowStock}</b> حلوى قاربت على النفاد و
                <b className="num"> {stats.outOfStock}</b> غير متوفرة حاليًا.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {stats.lowStockItems.map((p) => (
                  <Link
                    key={p.id}
                    to="/admin/products"
                    className="inline-flex items-center gap-2 rounded-full border border-line bg-ivory px-3 py-1.5 text-[12px] text-cocoa-2 transition hover:border-gold"
                  >
                    <img src={p.image} alt="" className="h-6 w-6 rounded-full object-cover" />
                    {p.name_ar}
                    <span className={`num ${p.stock_qty <= 0 ? 'text-raspberry' : 'text-gold'}`}>
                      {p.stock_qty}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid gap-5 xl:grid-cols-2">
        <div className="rounded-4xl border border-line bg-ivory p-6">
          <h2 className="headline text-lg text-cocoa">الأكثر مبيعًا</h2>
          {stats.topProducts.length === 0 ? (
            <p className="mt-6 text-[13px] text-mocha">لا توجد مبيعات بعد.</p>
          ) : (
            <ul className="mt-5 space-y-3">
              {stats.topProducts.map((p, i) => (
                <li key={p.name_ar + i} className="flex items-center gap-3.5">
                  <span className="num w-5 shrink-0 text-[13px] text-gold">{i + 1}</span>
                  {p.image && <img src={p.image} alt="" className="h-12 w-11 shrink-0 rounded-2xl object-cover" />}
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[13px] font-medium text-cocoa">{p.name_ar}</p>
                    <p className="num mt-0.5 text-[11.5px] text-mocha">{p.qty} قطعة مباعة</p>
                  </div>
                  <span className="num shrink-0 text-[13px] text-cocoa">{money(p.revenue)} ر.س</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="rounded-4xl border border-line bg-ivory p-6">
          <h2 className="headline text-lg text-cocoa">الإيرادات حسب الصنف</h2>
          {stats.byCategory.length === 0 ? (
            <p className="mt-6 text-[13px] text-mocha">لا توجد بيانات بعد.</p>
          ) : (
            <ul className="mt-5 space-y-4">
              {stats.byCategory.map((c) => (
                <li key={c.slug}>
                  <div className="mb-1.5 flex items-center justify-between text-[12.5px]">
                    <span className="text-cocoa-2">{c.name_ar}</span>
                    <span className="num text-mocha">{money(c.revenue)} ر.س</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-cream">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(c.revenue / maxCategory) * 100}%` }}
                      transition={{ duration: 0.7, ease: 'easeOut' }}
                      className="h-full rounded-full bg-gold/75"
                    />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="rounded-4xl border border-line bg-ivory p-6">
          <h2 className="headline flex items-center gap-2 text-lg text-cocoa">
            <MapPin size={16} className="text-gold" />
            المدن الأعلى طلبًا
          </h2>
          <ul className="mt-5 space-y-4">
            {stats.byCity.map((c) => (
              <li key={c.city}>
                <div className="mb-1.5 flex items-center justify-between text-[12.5px]">
                  <span className="text-cocoa-2">
                    {c.city} <span className="num text-mocha-2">({c.orders})</span>
                  </span>
                  <span className="num text-mocha">{money(c.revenue)} ر.س</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-cream">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(c.revenue / maxCity) * 100}%` }}
                    transition={{ duration: 0.7, ease: 'easeOut' }}
                    className="h-full rounded-full bg-berry/60"
                  />
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-4xl border border-line bg-ivory p-6">
          <div className="flex items-center justify-between">
            <h2 className="headline text-lg text-cocoa">أفضل العملاء</h2>
            <Link to="/admin/customers" className="text-[12.5px] text-gold hover:underline">
              عرض الكل
            </Link>
          </div>
          <ul className="mt-5 divide-y divide-line/70">
            {stats.topCustomers.map((c) => (
              <li key={c.phone} className="flex items-center gap-3 py-3">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-cocoa text-[12px] text-cream">
                  {c.name.charAt(0)}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13px] font-medium text-cocoa">{c.name}</p>
                  <p className="num text-[11.5px] text-mocha">
                    {c.orders_count} طلب · {c.city}
                  </p>
                </div>
                <span className="num shrink-0 text-[13px] text-gold">{money(c.total_spent)} ر.س</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="rounded-4xl border border-line bg-ivory p-6">
        <div className="flex items-center justify-between">
          <h2 className="headline text-lg text-cocoa">أحدث الطلبات</h2>
          <Link to="/admin/orders" className="text-[12.5px] text-gold hover:underline">
            عرض الكل
          </Link>
        </div>
        {stats.recentOrders.length === 0 ? (
          <p className="mt-6 text-[13px] text-mocha">لا توجد طلبات بعد.</p>
        ) : (
          <ul className="mt-5 divide-y divide-line/70">
            {stats.recentOrders.map((o) => {
              const st = ORDER_STATUS[o.status] ?? ORDER_STATUS.new;
              return (
                <li key={o.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
                  <div className="min-w-0">
                    <p className="wordmark flex items-center gap-2 text-[11.5px] text-cocoa">
                      {o.order_code}
                      {o.is_gift && <Gift size={12} className="text-gold" />}
                    </p>
                    <p className="mt-1 truncate text-[12px] text-mocha">
                      {o.customer_name} · {arDateTime(o.created_at)}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-3">
                    <span className="num text-[13px] text-cocoa">{money(o.total)} ر.س</span>
                    <span className={`rounded-full border px-2.5 py-1 text-[10.5px] ${st.tone}`}>
                      {st.label}
                    </span>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
