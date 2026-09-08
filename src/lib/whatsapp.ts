import { BRAND_PHONE, CURRENCY, money } from './format';
import type { Order } from './types';

function clean(phone?: string) {
  const raw = (phone || BRAND_PHONE).replace(/[^\d]/g, '');
  return raw || BRAND_PHONE;
}

export function buildWhatsAppMessage(order: Order, brand = 'موسيريا | MOUSSERIE'): string {
  const lines: string[] = [];
  lines.push(`🍫 *طلب جديد من ${brand}*`);
  lines.push('────────────────────');
  lines.push(`*رقم الطلب:* ${order.order_code}`);
  lines.push('');
  lines.push('*معلومات العميل*');
  lines.push(`الاسم: ${order.customer_name}`);
  lines.push(`الجوال: ${order.phone}`);
  lines.push(`المدينة: ${order.city}${order.district ? ` — ${order.district}` : ''}`);
  if (order.address) lines.push(`العنوان: ${order.address}`);
  if (order.delivery_date) {
    lines.push(
      `موعد التوصيل: ${order.delivery_date}${order.delivery_slot ? ` (${order.delivery_slot})` : ''}`
    );
  }
  lines.push('');
  lines.push('*تفاصيل الصندوق*');
  order.items.forEach((it, i) => {
    lines.push(`${i + 1}. ${it.name_ar} × ${it.qty} — ${money(it.price * it.qty)} ${CURRENCY}`);
  });
  lines.push('');
  if (order.is_gift) {
    lines.push('*هدية* 🎀');
    if (order.gift_recipient) lines.push(`المُهدى إليه: ${order.gift_recipient}`);
    if (order.gift_message) lines.push(`رسالة الإهداء: «${order.gift_message}»`);
    if (order.gift_wrap) lines.push('تغليف فاخر: نعم');
    lines.push('');
  }
  lines.push('*الحساب*');
  lines.push(`المجموع: ${money(order.subtotal)} ${CURRENCY}`);
  if (order.discount > 0) {
    lines.push(
      `الخصم${order.discount_code ? ` (${order.discount_code})` : ''}: −${money(order.discount)} ${CURRENCY}`
    );
  }
  if (order.gift_wrap_fee > 0) lines.push(`التغليف الفاخر: ${money(order.gift_wrap_fee)} ${CURRENCY}`);
  lines.push(`التوصيل: ${order.delivery_fee > 0 ? `${money(order.delivery_fee)} ${CURRENCY}` : 'مجاني'}`);
  lines.push(`*الإجمالي: ${money(order.total)} ${CURRENCY}*`);
  if (order.notes) {
    lines.push('');
    lines.push(`*ملاحظات:* ${order.notes}`);
  }
  lines.push('');
  lines.push('شكرًا لاختياركم موسيريا 🤍');
  return lines.join('\n');
}

export function whatsappUrl(order: Order, phone?: string, brand?: string): string {
  return `https://wa.me/${clean(phone)}?text=${encodeURIComponent(buildWhatsAppMessage(order, brand))}`;
}

export function whatsappSimple(text: string, phone?: string): string {
  return `https://wa.me/${clean(phone)}?text=${encodeURIComponent(text)}`;
}
