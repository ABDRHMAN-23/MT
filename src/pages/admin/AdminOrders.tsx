import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Gift, MessageCircle, Search, Trash2 } from 'lucide-react';
import { api } from '../../lib/api';
import type { Order } from '../../lib/types';
import { arDateTime, money, ORDER_STATUS } from '../../lib/format';
import { whatsappUrl } from '../../lib/whatsapp';
import { useToast } from '../../contexts/ToastContext';
import { useSettings } from '../../contexts/SettingsContext';
import { useConfirm } from '../../contexts/ConfirmContext';
import { EmptyState } from '../../components/ui/Bits';

const FILTERS = [
  { value: 'all', label: 'الكل' },
  { value: 'new', label: 'جديد' },
  { value: 'preparing', label: 'قيد التحضير' },
  { value: 'ready', label: 'جاهز' },
  { value: 'delivering', label: 'في الطريق' },
  { value: 'delivered', label: 'تم التسليم' },
  { value: 'cancelled', label: 'ملغي' },
];

export default function AdminOrders() {
  const { toast } = useToast();
  const { settings } = useSettings();
  const confirm = useConfirm();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState('all');
  const [term, setTerm] = useState('');
  const [expanded, setExpanded] = useState<number | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      setOrders(await api.orders({ status: filter !== 'all' ? filter : undefined }));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'تعذّر تحميل الطلبات');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  const changeStatus = async (order: Order, status: string) => {
    try {
      await api.updateOrderStatus(order.id, status);
      toast('تم تحديث حالة الطلب', {
        description: `${order.order_code} ← ${ORDER_STATUS[status]?.label ?? status}`,
      });
      load();
    } catch (e) {
      toast('تعذّر التحديث', {
        description: e instanceof Error ? e.message : undefined,
        tone: 'error',
      });
    }
  };

  const removeOrder = async (order: Order) => {
    const ok = await confirm({
      title: `حذف الطلب ${order.order_code}؟`,
      description: `سيُحذف طلب «${order.customer_name}» وأصنافه نهائيًا من السجل، ولن يظهر في التقارير.`,
      confirmLabel: 'نعم، احذف الطلب',
    });
    if (!ok) return;
    try {
      await api.deleteOrder(order.id);
      toast('تم حذف الطلب', { tone: 'info' });
      load();
    } catch (e) {
      toast('تعذّر الحذف', {
        description: e instanceof Error ? e.message : undefined,
        tone: 'error',
      });
    }
  };

  const visible = orders.filter((o) => {
    if (!term.trim()) return true;
    const t = term.trim();
    return (
      o.order_code.includes(t.toUpperCase()) ||
      o.customer_name.includes(t) ||
      o.phone.includes(t)
    );
  });

  return (
    <div className="space-y-6">
      <div>
        <p className="eyebrow text-[10px] text-gold">Commandes</p>
        <h1 className="headline mt-2 text-2xl text-cocoa sm:text-3xl">الطلبات</h1>
        <p className="mt-1.5 text-[13px] text-mocha">تابع كل صندوق من المطبخ حتى الباب.</p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search size={16} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-mocha-2" />
          <input
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            placeholder="بحث برقم الطلب أو الاسم أو الجوال…"
            className="h-12 w-full rounded-full border border-line bg-ivory pe-12 ps-5 text-[13px] text-cocoa placeholder:text-mocha-2/70 focus:border-gold focus:outline-none"
          />
        </div>
        <div className="no-scrollbar flex gap-2 overflow-x-auto">
          {FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={`shrink-0 rounded-full border px-4 py-2.5 text-[12.5px] transition ${
                filter === f.value
                  ? 'border-cocoa bg-cocoa text-cream'
                  : 'border-line bg-ivory text-cocoa-2 hover:border-gold'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="skeleton h-24 rounded-4xl" />
          ))}
        </div>
      ) : error ? (
        <div className="rounded-4xl border border-raspberry/25 bg-raspberry/5 px-6 py-12 text-center">
          <p className="text-sm text-berry">{error}</p>
          <button onClick={load} className="mt-5 rounded-full bg-cocoa px-6 py-2.5 text-[13px] text-cream">
            إعادة المحاولة
          </button>
        </div>
      ) : visible.length === 0 ? (
        <EmptyState
          title="لا توجد طلبات هنا"
          description="عندما يصل طلب جديد سيظهر في هذه القائمة فورًا."
        />
      ) : (
        <div className="space-y-3">
          {visible.map((o) => {
            const st = ORDER_STATUS[o.status] ?? ORDER_STATUS.new;
            const open = expanded === o.id;
            return (
              <div key={o.id} className="overflow-hidden rounded-4xl border border-line bg-ivory">
                <div className="flex flex-wrap items-center gap-4 p-4 sm:p-5">
                  <button
                    onClick={() => setExpanded(open ? null : o.id)}
                    className="flex min-w-0 flex-1 items-center gap-3 text-start"
                  >
                    <span
                      className={`grid h-10 w-10 shrink-0 place-items-center rounded-full transition ${
                        open ? 'bg-cocoa text-cream' : 'bg-cream text-cocoa-2'
                      }`}
                    >
                      <motion.span animate={{ rotate: open ? 180 : 0 }}>
                        <ChevronDown size={16} />
                      </motion.span>
                    </span>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="wordmark truncate text-[12px] text-cocoa">{o.order_code}</span>
                        {o.is_gift && <Gift size={13} className="text-gold" />}
                      </div>
                      <p className="mt-1 truncate text-[12.5px] text-mocha">
                        {o.customer_name} · {o.city} · {arDateTime(o.created_at)}
                      </p>
                    </div>
                  </button>

                  {/* Own pill + shrink-0 so the total never collides with the
                      MS- order code sitting in the flexible column beside it. */}
                  <span className="inline-flex shrink-0 items-baseline gap-1 whitespace-nowrap rounded-full bg-cream px-3.5 py-1.5">
                    <span className="num text-[15px] leading-none text-cocoa">{money(o.total)}</span>
                    <span className="text-[10.5px] leading-none text-mocha">ر.س</span>
                  </span>

                  <select
                    value={o.status}
                    onChange={(e) => changeStatus(o, e.target.value)}
                    className={`h-9 shrink-0 rounded-full border px-3 text-[12px] focus:outline-none ${st.tone}`}
                    aria-label="حالة الطلب"
                  >
                    {Object.entries(ORDER_STATUS).map(([k, v]) => (
                      <option key={k} value={k}>
                        {v.label}
                      </option>
                    ))}
                  </select>

                  <a
                    href={whatsappUrl(o, settings.whatsapp, `${settings.brand_name_ar} | ${settings.brand_name_en}`)}
                    target="_blank"
                    rel="noreferrer"
                    aria-label="إرسال عبر واتساب"
                    className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-pistachio/12 text-pistachio transition hover:bg-pistachio hover:text-ivory"
                  >
                    <MessageCircle size={15} />
                  </a>
                  <button
                    onClick={() => removeOrder(o)}
                    aria-label="حذف"
                    className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-raspberry/10 text-raspberry transition hover:bg-raspberry hover:text-ivory"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>

                <AnimatePresence initial={false}>
                  {open && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.32 }}
                      className="overflow-hidden border-t border-line bg-cream/50"
                    >
                      <div className="grid gap-6 p-5 lg:grid-cols-2">
                        <div>
                          <h3 className="mb-3 text-[12.5px] font-semibold text-cocoa">الأصناف</h3>
                          <ul className="space-y-2.5">
                            {o.items.map((it, i) => (
                              <li key={i} className="flex items-center gap-3">
                                <img
                                  src={it.image}
                                  alt=""
                                  className="h-12 w-11 shrink-0 rounded-xl object-cover"
                                />
                                <span className="min-w-0 flex-1 truncate text-[12.5px] text-cocoa-2">
                                  {it.name_ar}
                                </span>
                                <span className="num shrink-0 text-[12px] text-mocha">
                                  {it.qty} × {money(it.price)}
                                </span>
                              </li>
                            ))}
                          </ul>
                          <div className="mt-4 space-y-1.5 border-t border-line pt-4 text-[12.5px]">
                            <Line label="المجموع" value={`${money(o.subtotal)} ر.س`} />
                            {o.discount > 0 && (
                              <Line
                                label={`الخصم ${o.discount_code ? `(${o.discount_code})` : ''}`}
                                value={`−${money(o.discount)} ر.س`}
                              />
                            )}
                            {o.gift_wrap_fee > 0 && (
                              <Line label="التغليف" value={`${money(o.gift_wrap_fee)} ر.س`} />
                            )}
                            <Line
                              label="التوصيل"
                              value={o.delivery_fee === 0 ? 'مجاني' : `${money(o.delivery_fee)} ر.س`}
                            />
                            <Line label="الإجمالي" value={`${money(o.total)} ر.س`} strong />
                          </div>
                        </div>

                        <div className="space-y-4 text-[12.5px]">
                          <div>
                            <h3 className="mb-2 font-semibold text-cocoa">العميل</h3>
                            <p className="text-mocha">{o.customer_name}</p>
                            <p className="num text-mocha" dir="ltr">
                              {o.phone}
                            </p>
                            {o.email && (
                              <p className="text-mocha" dir="ltr">
                                {o.email}
                              </p>
                            )}
                          </div>
                          <div>
                            <h3 className="mb-2 font-semibold text-cocoa">التوصيل</h3>
                            <p className="leading-relaxed text-mocha">
                              {o.city}
                              {o.district ? ` — ${o.district}` : ''}
                              {o.address ? ` · ${o.address}` : ''}
                            </p>
                            <p className="text-mocha">
                              {o.delivery_date || 'أقرب وقت'} {o.delivery_slot ? `· ${o.delivery_slot}` : ''}
                            </p>
                            <p className="text-mocha">طريقة الدفع: {o.payment_method}</p>
                          </div>
                          {o.is_gift && (
                            <div className="rounded-2xl border border-gold/30 bg-gold/6 p-4">
                              <h3 className="mb-2 flex items-center gap-2 font-semibold text-cocoa">
                                <Gift size={14} className="text-gold" />
                                إهداء
                              </h3>
                              {o.gift_recipient && <p className="text-mocha">إلى: {o.gift_recipient}</p>}
                              {o.gift_message && (
                                <p className="headline mt-1.5 text-[15px] leading-loose text-cocoa">
                                  «{o.gift_message}»
                                </p>
                              )}
                              {o.gift_wrap && <p className="mt-1.5 text-gold">✓ تغليف فاخر</p>}
                            </div>
                          )}
                          {o.notes && (
                            <div>
                              <h3 className="mb-2 font-semibold text-cocoa">ملاحظات</h3>
                              <p className="leading-relaxed text-mocha">{o.notes}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function Line({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className={`flex justify-between ${strong ? 'font-semibold text-cocoa' : 'text-mocha'}`}>
      <span>{label}</span>
      <span className="num">{value}</span>
    </div>
  );
}
