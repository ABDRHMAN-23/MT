import { ArrowLeft, Award, ChefHat, Leaf, MessageCircle, Snowflake } from 'lucide-react';
import { Ornament, Reveal, SectionHead } from '../components/ui/Bits';
import { ButtonLink } from '../components/ui/Button';
import { whatsappSimple } from '../lib/whatsapp';
import { useSettings } from '../contexts/SettingsContext';

const STEPS = [
  {
    n: '٠١',
    t: 'الاختيار',
    d: 'ننتقي الشوكولاتة البلجيكية بنسبة كاكاو ٦٤٪، والفستق الحلبي الطازج، والفواكه في ذروة موسمها.',
  },
  {
    n: '٠٢',
    t: 'الخفق',
    d: 'كريمة باردة تُخفق على مهل حتى تحمل الهواء دون أن تفقد ثقلها الحريري.',
  },
  {
    n: '٠٣',
    t: 'التطبيق',
    d: 'طبقة فوق طبقة: إسفنج، كرونش، كريمو، ثم الموس. سبع طبقات في قطعة واحدة.',
  },
  {
    n: '٠٤',
    t: 'التبريد',
    d: 'ستّ ساعات من الصبر في درجة حرارة دقيقة قبل التلميع والتزيين.',
  },
];

const VALUES = [
  {
    icon: <Leaf size={18} />,
    t: 'بلا مواد حافظة',
    d: 'لا محسّنات ولا ألوان صناعية. ما تقرأه في المكوّنات هو كل ما في الطبق.',
  },
  {
    icon: <ChefHat size={18} />,
    t: 'تُحضّر يوميًا',
    d: 'نصنع بكميات محدودة كل صباح، ولا نحتفظ بمخزون لليوم التالي.',
  },
  {
    icon: <Snowflake size={18} />,
    t: 'سلسلة تبريد كاملة',
    d: 'من المطبخ إلى يدك دون انقطاع، ليصل القوام كما صنعناه تمامًا.',
  },
  {
    icon: <Award size={18} />,
    t: 'إتقان لا يتغير',
    d: 'وصفات ثابتة وموازين دقيقة، لتجد المذاق نفسه في كل مرة.',
  },
];

export default function Story() {
  const { settings } = useSettings();
  return (
    <>
      <section className="dust relative overflow-hidden border-b border-line">
        <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-gold/10 blur-[110px]" />
        <div className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6 lg:py-24">
          <p className="eyebrow text-[10px] text-gold">Notre maison</p>
          <h1 className="headline mt-5 text-3xl leading-relaxed text-cocoa sm:text-5xl sm:leading-[1.45]">
            حكاية تبدأ بملعقة
          </h1>
          <Ornament className="mt-6" />
          <p className="mx-auto mt-6 max-w-xl text-[14.5px] leading-loose text-mocha">
            موسيريا ليست محلّ حلويات؛ إنها محاولة دائمة للقبض على لحظة حلوة قبل أن تمرّ.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-[1400px] px-4 py-16 sm:px-6 lg:px-10 lg:py-24">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <Reveal>
            <div className="overflow-hidden rounded-t-[999px] rounded-b-5xl border border-line">
              <img
                src="/img/story.webp"
                alt="مطبخ موسيريا"
                className="aspect-[4/5] w-full object-cover"
              />
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="headline text-2xl leading-relaxed text-cocoa lg:text-4xl">
              من مطبخ صغير في الرياض
            </h2>
            <div className="mt-6 space-y-5 text-[14.5px] leading-loose text-mocha">
              <p>
                في عام ٢٠١٩، وقفت مؤسّستنا أمام قدر من الشوكولاتة المذابة تحاول للمرة الثالثة عشرة أن
                تصل إلى القوام الذي تتخيّله: خفيف كالغيمة، لكنه يترك أثرًا طويلًا.
              </p>
              <p>
                لم تكن الفكرة أن نصنع حلوى أكثر حلاوة، بل حلوى أكثر صدقًا. حلوى تجعل من المساء
                العادي مناسبة، ومن المناسبة ذكرى.
              </p>
              <p>
                اليوم، وبعد أكثر من اثني عشر ألف صندوق غادر مطبخنا، ما زلنا نزن كل مكوّن بالغرام،
                ونصنع كل قطعة في اليوم نفسه الذي تصلك فيه.
              </p>
            </div>
            <blockquote className="mt-8 border-e-2 border-gold pe-6 ps-0">
              <p className="headline text-lg leading-loose text-cocoa">
                «الموس لا يُستعجل. إن تعجّلته عاقبك بالثقل، وإن صبرت عليه أعطاك الهواء.»
              </p>
              <footer className="mt-3 text-[12.5px] text-mocha">— الشيف التنفيذي، موسيريا</footer>
            </blockquote>
          </Reveal>
        </div>
      </section>

      <section className="bg-ivory py-16 lg:py-24">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-10">
          <SectionHead eyebrow="Le processus" title="كيف تُصنع القطعة" subtitle="أربع مراحل، وستّ ساعات من الصبر." />
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((s, i) => (
              <Reveal key={s.n} delay={i * 0.08}>
                <div className="h-full rounded-4xl border border-line/70 bg-cream p-6">
                  <span className="headline text-3xl text-gold-2">{s.n}</span>
                  <h3 className="headline mt-3 text-lg text-cocoa">{s.t}</h3>
                  <p className="mt-3 text-[13px] leading-loose text-mocha">{s.d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1400px] px-4 py-16 sm:px-6 lg:px-10 lg:py-24">
        <SectionHead eyebrow="Nos engagements" title="ما نلتزم به" />
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {VALUES.map((v, i) => (
            <Reveal key={v.t} delay={i * 0.08}>
              <div className="h-full rounded-4xl border border-line/70 bg-ivory p-6">
                <span className="grid h-12 w-12 place-items-center rounded-full bg-cream text-gold">
                  {v.icon}
                </span>
                <h3 className="mt-5 text-[15px] font-semibold text-cocoa">{v.t}</h3>
                <p className="mt-2.5 text-[13px] leading-loose text-mocha">{v.d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img src="/img/wide-banner.webp" alt="" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-cocoa/85" />
        </div>
        <div className="relative mx-auto max-w-2xl px-4 py-20 text-center sm:px-6">
          <h2 className="headline text-2xl leading-relaxed text-cream sm:text-4xl">
            لديك مناسبة خاصة؟
          </h2>
          <p className="mx-auto mt-5 max-w-md text-[14px] leading-loose text-cream/65">
            نصمّم كيكات وصناديق خاصة للأعراس والشركات والمناسبات الكبرى. أخبرنا بفكرتك
            وسنحوّلها إلى حلوى.
          </p>
          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <ButtonLink
              to={whatsappSimple(
                `مرحبًا ${settings.brand_name_ar}، أرغب بطلب خاص لمناسبة`,
                settings.whatsapp
              )}
              target="_blank"
              rel="noreferrer"
              variant="gold"
              size="lg"
            >
              <MessageCircle size={18} />
              تحدّث مع الشيف
            </ButtonLink>
            <ButtonLink
              to="/shop?category=occasions"
              size="lg"
              className="border border-cream/25 bg-transparent text-cream hover:bg-cream/10"
            >
              كيكات المناسبات
              <ArrowLeft size={17} />
            </ButtonLink>
          </div>
        </div>
      </section>
    </>
  );
}
