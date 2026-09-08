import { useEffect, useState } from 'react';
import { MessageCircle, Search, Trash2 } from 'lucide-react';
import { api } from '../../lib/api';
import type { Customer } from '../../lib/types';
import { arDate, money, normalizePhone } from '../../lib/format';
import { EmptyState } from '../../components/ui/Bits';
import { useToast } from '../../contexts/ToastContext';
import { useConfirm } from '../../contexts/ConfirmContext';

export default function AdminCustomers() {
  const { toast } = useToast();
  const confirm = useConfirm();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [term, setTerm] = useState('');

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      setCustomers(await api.customers());
    } catch (e) {
      setError(e instanceof Error ? e.message : 'تعذّر تحميل العملاء');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const remove = async (c: Customer) => {
    const ok = await confirm({
      title: `حذف ملف «${c.name}»؟`,
      description: 'سيُحذف ملف العميل وإحصاءاته فقط، وتبقى طلباته السابقة محفوظة في السجل.',
      confirmLabel: 'نعم، احذف الملف',
    });
    if (!ok) return;
    try {
      await api.deleteCustomer(c.id);
      toast('تم حذف ملف العميل', { tone: 'info' });
      load();
    } catch (e) {
      toast('تعذّر الحذف', { description: e instanceof Error ? e.message : undefined, tone: 'error' });
    }
  };

  const visible = customers.filter(
    (c) => !term.trim() || c.name.includes(term.trim()) || c.phone.includes(term.trim())
  );

  const totalSpent = customers.reduce((s, c) => s + Number(c.total_spent || 0), 0);

  return (
    <div className="space-y-6">
      <div>
        <p className="eyebrow text-[10px] text-gold">Clients</p>
        <h1 className="headline mt-2 text-2xl text-cocoa sm:text-3xl">العملاء</h1>
        <p className="mt-1.5 text-[13px] text-mocha">
          <span className="num">{customers.length}</span> عميل · إجمالي إنفاق{' '}
          <span className="num text-gold">{money(totalSpent)}</span> ر.س
        </p>
      </div>

      <div className="relative">
        <Search size={16} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-mocha-2" />
        <input
          value={term}
          onChange={(e) => setTerm(e.target.value)}
          placeholder="بحث بالاسم أو الجوال…"
          className="h-12 w-full rounded-full border border-line bg-ivory pe-12 ps-5 text-[13px] text-cocoa placeholder:text-mocha-2/70 focus:border-gold focus:outline-none"
        />
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="skeleton h-20 rounded-4xl" />
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
          title="لا يوجد عملاء بعد"
          description="عند أول طلب سيُنشأ ملف العميل تلقائيًا."
        />
      ) : (
        <>
          {/* desktop table */}
          <div className="hidden overflow-hidden rounded-4xl border border-line bg-ivory lg:block">
            <table className="w-full text-start">
              <thead>
                <tr className="border-b border-line bg-cream/60 text-[12px] text-mocha">
                  <th className="px-5 py-4 text-start font-medium">العميل</th>
                  <th className="px-5 py-4 text-start font-medium">الجوال</th>
                  <th className="px-5 py-4 text-start font-medium">المدينة</th>
                  <th className="px-5 py-4 text-start font-medium">الطلبات</th>
                  <th className="px-5 py-4 text-start font-medium">إجمالي الإنفاق</th>
                  <th className="px-5 py-4 text-start font-medium">آخر طلب</th>
                  <th className="px-5 py-4" />
                </tr>
              </thead>
              <tbody className="divide-y divide-line/70">
                {visible.map((c) => (
                  <tr key={c.id} className="text-[13px] transition hover:bg-cream/40">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-cocoa text-[12px] text-cream">
                          {c.name.charAt(0)}
                        </span>
                        <span className="font-medium text-cocoa">{c.name}</span>
                      </div>
                    </td>
                    <td className="num px-5 py-4 text-mocha" dir="ltr">
                      {c.phone}
                    </td>
                    <td className="px-5 py-4 text-mocha">{c.city}</td>
                    <td className="num px-5 py-4 text-cocoa">{c.orders_count}</td>
                    <td className="num px-5 py-4 text-gold">{money(c.total_spent)} ر.س</td>
                    <td className="px-5 py-4 text-mocha">{arDate(c.last_order_at)}</td>
                    <td className="px-5 py-4">
                      <div className="flex gap-2">
                        <a
                          href={`https://wa.me/${normalizePhone(c.phone)}`}
                          target="_blank"
                          rel="noreferrer"
                          aria-label="مراسلة عبر واتساب"
                          className="grid h-9 w-9 place-items-center rounded-full bg-pistachio/12 text-pistachio transition hover:bg-pistachio hover:text-ivory"
                        >
                          <MessageCircle size={15} />
                        </a>
                        <button
                          onClick={() => remove(c)}
                          aria-label="حذف العميل"
                          className="grid h-9 w-9 place-items-center rounded-full bg-raspberry/10 text-raspberry transition hover:bg-raspberry hover:text-ivory"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* mobile cards */}
          <div className="space-y-3 lg:hidden">
            {visible.map((c) => (
              <div key={c.id} className="rounded-4xl border border-line bg-ivory p-4">
                <div className="flex items-center gap-3">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-cocoa text-[13px] text-cream">
                    {c.name.charAt(0)}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[14px] font-semibold text-cocoa">{c.name}</p>
                    <p className="num text-[12px] text-mocha" dir="ltr">
                      {c.phone}
                    </p>
                  </div>
                  <a
                    href={`https://wa.me/${normalizePhone(c.phone)}`}
                    target="_blank"
                    rel="noreferrer"
                    aria-label="واتساب"
                    className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-pistachio/12 text-pistachio"
                  >
                    <MessageCircle size={15} />
                  </a>
                  <button
                    onClick={() => remove(c)}
                    aria-label="حذف العميل"
                    className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-raspberry/10 text-raspberry"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
                <div className="mt-4 grid grid-cols-3 gap-3 border-t border-line pt-4 text-center">
                  <div>
                    <p className="num text-[15px] text-cocoa">{c.orders_count}</p>
                    <p className="text-[10.5px] text-mocha">طلب</p>
                  </div>
                  <div>
                    <p className="num text-[15px] text-gold">{money(c.total_spent)}</p>
                    <p className="text-[10.5px] text-mocha">ر.س</p>
                  </div>
                  <div>
                    <p className="text-[12px] text-cocoa">{c.city}</p>
                    <p className="text-[10.5px] text-mocha">المدينة</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
