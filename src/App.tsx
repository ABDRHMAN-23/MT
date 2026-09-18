import {useEffect,useMemo,useState} from 'react';
import {createClient} from '@supabase/supabase-js';

const supabase=createClient(import.meta.env.VITE_SUPABASE_URL || 'https://djpfjbjjybpquvzacmtj.supabase.co', import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || '');
import {Heart,Check,ArrowLeft,ArrowRight,CalendarDays,ChevronDown,Clock3,Instagram,MapPin,Menu,Phone,Plane,Star,X,Users,Wifi,Car,Utensils,CircleParking,Gamepad2,Dumbbell,Store,AtSign} from 'lucide-react';

const WA='967783231118';
const hotelImages={
  exterior:'https://panorama-ye.com/wp-content/uploads/2025/02/777777777777777777.jpg',
  lobby:'https://panorama-ye.com/wp-content/uploads/2025/02/DSC04851.jpg',
  room:'https://panorama-ye.com/wp-content/uploads/2025/02/DSC04805.jpg',
  pool:'https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=1800&q=88',
  dining:'https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?auto=format&fit=crop&w=1800&q=88'
};

const rooms=[
 {name:'جناح رئاسي بحري',en:'Presidential Sea Suite',tag:'VIP',meta:'إطلالة بحرية · مسبح خاص',features:['سرير فاخر','إطلالة بحرية','مسبح خاص','واي فاي مجاني'],image:hotelImages.room},
 {name:'جناح ملكي بحري',en:'Royal Sea Suite',tag:'Sea View',meta:'سرير عائلي · مجلس خاص',features:['سرير عائلي','مجلس خاص','إطلالة بحرية','تكييف وتلفزيون LED'],image:hotelImages.lobby},
 {name:'جناح ملكي خلفي',en:'Royal Rear Suite',tag:'Royal',meta:'إطلالة خلفية · منطقة جلوس',features:['سرير عائلي','منطقة جلوس','واي فاي مجاني','موقف سيارات مجاني'],image:hotelImages.room},
 {name:'غرفة بحري',en:'Sea View Room',tag:'Sea View',meta:'إطلالة بحرية · منطقة جلوس',features:['سرير عائلي','إطلالة بحرية','منطقة جلوس','تكييف وتلفزيون LED'],image:hotelImages.lobby},
 {name:'غرفة خلفي',en:'Rear Room',tag:'Comfort',meta:'سرير مزدوج أو سريران',features:['واي فاي مجاني','سرير مزدوج أو سريران','تكييف','تلفزيون LED'],image:hotelImages.room},
 {name:'غرفة بحري مع جاكوزي',en:'Sea View Jacuzzi Room',tag:'Jacuzzi',meta:'إطلالة بحرية · جاكوزي خاص',features:['سرير مزدوج','إطلالة بحرية','جاكوزي','مساحة ترفيهية مجانية'],image:hotelImages.pool}
];

const services=[
 ['مطعم المراسيم','إفطار وغداء وعشاء','استمتع بتجربة طعام متكاملة داخل الفندق.',Utensils],
 ['كافيه الفندق','مشروبات وحلويات ووجبات خفيفة','أجواء هادئة ومذاق رائع طوال اليوم.',Clock3],
 ['نادي لياقة ومسبح','لياقة · مسبح · كراسي استرخاء','مساحة للاسترخاء والحركة بإطلالة مميزة.',Dumbbell],
 ['صالة ألعاب','بلياردو · بلايستيشن · تنس طاولة','ترفيه متنوع للضيوف والعائلات.',Gamepad2],
 ['متاجر متنوعة','هدايا · عطور · إكسسوارات وجوالات','كل ما تحتاجه أثناء إقامتك في مكان واحد.',Store],
 ['خدمات الضيوف','مطار · سيارات · صرافة · اجتماعات','حلول عملية تجعل الإقامة أسهل وأكثر راحة.',Car]
];

const perks=[
 ['99','غرفة وجناح فاخر'],['5','طوابق سكنية'],['24/7','استقبال'],['SEA','إطلالة ساحلية']
];

function Logo({dark=false}:{dark?:boolean}){return <a className={'brand '+(dark?'brand-dark':'')} href="#top" aria-label="Panorama Hotel"><span className="brand-mark"><b>PH</b><i>★★★★★</i></span><span><strong>PANORAMA</strong><small>HOTEL · ADEN</small></span></a>}

function BookingModal({close,selectedRoom}:{close:()=>void;selectedRoom?:string}){
 const [sent,setSent]=useState(false);
 const [form,setForm]=useState({name:'',phone:'',checkIn:'',checkOut:'',guests:'2',room:selectedRoom||rooms[0].name});
 const submit=async(e:any)=>{e.preventDefault();const {error}=await supabase.from('pano_bookings').insert({guest_name:form.name,phone:form.phone,check_in:form.checkIn,check_out:form.checkOut,guests:Number(String(form.guests).replace('+',''))||2,room_name:form.room});const msg=`مرحباً فندق بانوراما، أرغب في حجز غرفة.\nالاسم: ${form.name}\nالجوال: ${form.phone}\nالوصول: ${form.checkIn}\nالمغادرة: ${form.checkOut}\nالأشخاص: ${form.guests}\nالغرفة: ${form.room}${error?'\\n(تم إرسال الطلب عبر واتساب؛ تعذر حفظ نسخة قاعدة البيانات.)':''}`;window.open('https://wa.me/'+WA+'?text='+encodeURIComponent(msg),'_blank');setSent(true)};
 return <div className="modal" onMouseDown={close}><div className="booking-card" onMouseDown={e=>e.stopPropagation()} dir="rtl"><button className="close" onClick={close}><X/></button>{sent?<div className="sent"><div className="sent-icon">✓</div><span className="eyebrow">تم إرسال الطلب</span><h2>نحن بانتظارك في بانوراما.</h2><p>تم فتح واتساب لإرسال تفاصيل الحجز إلى الفندق. سيتواصل معك فريق الحجز لتأكيد التوفر.</p><button className="gold-btn" onClick={close}>إغلاق</button></div>:<><span className="eyebrow">الحجز المباشر</span><h2>ابدأ إقامتك في بانوراما.</h2><p className="modal-lead">أرسل طلب الحجز مباشرة إلى فريق الفندق عبر واتساب.</p><form onSubmit={submit}><div className="form-grid"><label>الاسم الكامل<input required value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/></label><label>رقم الجوال<input required value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})}/></label><label>تاريخ الوصول<input required type="date" value={form.checkIn} onChange={e=>setForm({...form,checkIn:e.target.value})}/></label><label>تاريخ المغادرة<input required type="date" value={form.checkOut} onChange={e=>setForm({...form,checkOut:e.target.value})}/></label><label>عدد الأشخاص<select value={form.guests} onChange={e=>setForm({...form,guests:e.target.value})}><option>1</option><option>2</option><option>3</option><option>4</option><option>5+</option></select></label><label>الغرفة أو الجناح<select value={form.room} onChange={e=>setForm({...form,room:e.target.value})}>{rooms.map(r=><option key={r.name}>{r.name}</option>)}</select></label></div><button className="gold-btn full" type="submit">إرسال طلب الحجز إلى واتساب <ArrowLeft size={17}/></button></form></>}</div></div>
}

export default function App(){
 const [menu,setMenu]=useState(false),[booking,setBooking]=useState(false),[selected,setSelected]=useState<any|null>(null),[lang,setLang]=useState<'ar'|'en'>('ar'),[faq,setFaq]=useState(-1);
 const [remoteRooms,setRemoteRooms]=useState<any[]|null>(null),[remoteServices,setRemoteServices]=useState<any[]|null>(null),[remoteFaqs,setRemoteFaqs]=useState<any[]|null>(null);
 useEffect(()=>{let active=true;(async()=>{const [r,s,f]=await Promise.all([supabase.from('pano_rooms').select('*').order('sort_order'),supabase.from('pano_services').select('*').order('sort_order'),supabase.from('pano_faqs').select('*').order('sort_order')]);if(!active)return;if(!r.error&&r.data?.length)setRemoteRooms(r.data);if(!s.error&&s.data?.length)setRemoteServices(s.data);if(!f.error&&f.data?.length)setRemoteFaqs(f.data)})();return()=>{active=false}},[]);
 const displayRooms=remoteRooms?.map(r=>({name:r.name_ar,en:r.name_en,tag:r.tag,meta:r.meta_ar,features:r.features_ar||[],image:r.image_url}))||rooms;
 const displayServices=remoteServices?.map(s=>[s.title_ar,s.subtitle_ar,s.description_ar,s.icon] as any[])||services;
 const displayFaqs=remoteFaqs?.map(f=>f.question_ar)||['ما أوقات تسجيل الوصول والمغادرة؟','هل الإفطار مجاني للنزلاء؟','هل تتوفر خدمة التوصيل من وإلى المطار؟','هل توجد مواقف سيارات؟','كيف يتم تأكيد الحجز؟'];
 const nav=useMemo(()=>lang==='ar'?['الرئيسية','الغرف والأجنحة','الخدمات','عن الفندق','تواصل معنا']:['Home','Rooms','Services','About','Contact'],[lang]);
 const jump=(id:string)=>{setMenu(false);document.getElementById(id)?.scrollIntoView({behavior:'smooth'})};
 return <div className="site" dir="rtl" id="top">
  <header className="topbar">
   <Logo/>
   <nav className={menu?'open':''}><button onClick={()=>jump('top')}>{nav[0]}</button><button onClick={()=>jump('rooms')}>{nav[1]}</button><button onClick={()=>jump('services')}>{nav[2]}</button><button onClick={()=>jump('about')}>{nav[3]}</button><button onClick={()=>jump('contact')}>{nav[4]}</button></nav>
   <div className="top-actions"><button className="lang" onClick={()=>setLang(lang==='ar'?'en':'ar')}>{lang==='ar'?'EN':'عربي'}</button><button className="book-mini" onClick={()=>setBooking(true)}>احجز الآن <ArrowLeft size={15}/></button><button className="menu-btn" onClick={()=>setMenu(!menu)}>{menu?<X/>:<Menu/>}</button></div>
  </header>

  <main>
   <section className="hero-pano">
    <div className="hero-overlay"/>
    <div className="hero-content">
      <div className="stars">★★★★★ <span>فندق بانوراما · عدن</span></div>
      <h1>إطلالة على البحر.<br/><em>إقامة تستحق أن تُذكر.</em></h1>
      <p>فندق بانوراما في خورمكسر — تجربة فندقية عصرية على ساحل أبين، بالقرب من مطار عدن الدولي.</p>
      <div className="hero-buttons"><button className="gold-btn" onClick={()=>setBooking(true)}>احجز إقامتك <ArrowLeft size={17}/></button><button className="ghost-btn" onClick={()=>jump('about')}>اكتشف بانوراما</button></div>
    </div>
    <div className="hero-note"><span>01</span><i/> <span>عدن · اليمن</span></div>
   </section>

   <section className="booking-strip" dir="rtl">
    <div><CalendarDays/><small>الوصول</small><b>اختر التاريخ</b></div><div><CalendarDays/><small>المغادرة</small><b>اختر التاريخ</b></div><div><Users/><small>الضيوف</small><b>2 أشخاص</b></div><button onClick={()=>setBooking(true)}>تحقق من التوفر <ArrowLeft size={16}/></button>
   </section>

   <section className="intro section" id="about">
    <div className="section-kicker"><span>01</span><i/><span>عن بانوراما</span></div>
    <div className="intro-copy"><span className="eyebrow">مرحبا بكم في فندق بانوراما</span><h2>راحة عصرية،<br/><em>وبحر أمامك.</em></h2><p>يقع فندق بانوراما على ساحل أبين ويطل على شاطئ البحر والمدينة والمطار. صُمم ليجمع بين الراحة والرفاهية والخدمات المتنوعة في قلب مدينة عدن.</p><p>نسعى إلى تقديم تجربة ضيافة راقية تليق بعدن، من الإقامة والغذاء إلى الترفيه والخدمات المساندة.</p><button className="text-btn" onClick={()=>jump('services')}>اكتشف خدمات الفندق <ArrowLeft size={15}/></button></div>
   </section>

   <section className="stats"><div className="stats-inner">{perks.map(p=><div key={p[0]}><strong>{p[0]}</strong><span>{p[1]}</span></div>)}</div></section>

   <section className="rooms-section section" id="rooms">
    <div className="section-heading"><div><span className="eyebrow">الإقامة</span><h2>غرف وأجنحة<br/><em>بانوراما.</em></h2></div><p>اختر الإقامة التي تناسب رحلتك، من الجناح الرئاسي البحري إلى الغرف العملية بإطلالات مختلفة.</p></div>
    <div className="room-grid">{displayRooms.map((r:any,i:number)=><article className="room-card" key={r.name} onClick={()=>setSelected(r)}><div className="room-photo"><img src={r.image} alt={r.name}/><span>{r.tag}</span><button>تفاصيل <ArrowLeft size={14}/></button></div><div className="room-info"><div><h3>{r.name}</h3><p>{r.meta}</p></div><small>0{i+1}</small></div></article>)}</div>
   </section>

   <section className="image-story"><img src={hotelImages.exterior} alt="فندق بانوراما عدن"/><div className="image-story-card"><span className="eyebrow">الموقع</span><h2>في خورمكسر،<br/><em>على ساحل أبين.</em></h2><p>بجوار مطار عدن الدولي، مع إطلالات على البحر والمدينة والمطار.</p><button className="text-btn" onClick={()=>jump('contact')}>معلومات الوصول <ArrowLeft size={15}/></button></div></section>

   <section className="services section" id="services">
    <div className="section-kicker"><span>02</span><i/><span>الخدمات والتجارب</span></div>
    <div><div className="section-heading compact"><div><span className="eyebrow">كل ما تحتاجه</span><h2>أكثر من مجرد<br/><em>غرفة.</em></h2></div><p>خدمات الفندق الحالية كما يقدمها بانوراما، مرتبة في تجربة رقمية أوضح وأسهل للضيف.</p></div>
    <div className="service-grid">{displayServices.map(([title,sub,desc,icon]:any)=><article key={title}><span className="service-icon">{icon}</span><span>{sub}</span><h3>{title}</h3><p>{desc}</p></article>)}</div></div>
   </section>

   <section className="experience">
    <div className="experience-image"><img src={hotelImages.pool} alt="مسبح فندق بانوراما"/></div><div className="experience-copy"><span className="eyebrow">رفاهية واسترخاء</span><h2>استرخِ.<br/><em>نحن نهتم بالباقي.</em></h2><p>مسبح بإطلالة مميزة، نادي لياقة، صالة ألعاب، إفطار مجاني للنزلاء، ومواقف سيارات مجانية. ولرحلاتك، تتوفر خدمات التوصيل من وإلى المطار وتأجير السيارات مع سائق.</p><div className="check-list"><span><Wifi/>واي فاي مجاني</span><span><Plane/>توصيل من وإلى المطار</span><span><CircleParking/>مواقف مجانية</span><Star/>خدمات مخصصة للنزلاء</div></div>
   </section>

   <section className="dining section"><div><span className="eyebrow">الطعام والشراب</span><h2>مطعم المراسيم<br/><em>وكافيه بانوراما.</em></h2><p>مطعم متكامل يقدم الإفطار والغداء والعشاء، إلى جانب كافيه يقدم المشروبات والعصائر الطازجة والحلويات والوجبات الخفيفة.</p><button className="text-btn" onClick={()=>jump('contact')}>تواصل مع الفندق <ArrowLeft size={15}/></button></div><div className="dining-photo"><img src={hotelImages.dining} alt="مطعم الفندق"/></div></section>

   <section className="amenities-band"><div><span>صالة ألعاب</span><b>بلياردو · بلايستيشن · تنس طاولة</b></div><div><span>قاعات اجتماعات</span><b>قاعات متنوعة ومتكاملة</b></div><div><span>كافيه الدور السابع</span><b>أجواء هادئة ومذاق رائع</b></div></section>

   <section className="testimonials section"><span className="eyebrow">شهادات ضيوفنا</span><h2>تجارب من<br/><em>زوار بانوراما.</em></h2><div className="testimonial-grid"><blockquote>“فندق بانوراما عدن حيث طيب الإقامة وروعة المكان، تجربة مميزة في مدينة الجمال عدن.”<small>ماريا قحطان · فنانة</small></blockquote><blockquote>“ضمن زيارتي في عدن قررت الإقامة في فندق بانوراما… فخامة وخدمات متنوعة وغرف وأجنحة خاصة.”<small>شيماء محمد · ممثلة</small></blockquote><blockquote>“من أكبر وأفخم الفنادق والذي يعكس صورة جميلة لكل الزوار من خارج مدينتنا الحبيبة عدن.”<small>فهد بن جعموم · شاعر</small></blockquote></div></section>

   <section className="faq section"><div><span className="eyebrow">معلومات مهمة</span><h2>قبل<br/><em>وصولك.</em></h2></div><div>{displayFaqs.map((q:any,i:number)=><div className="faq-row" key={q}><button onClick={()=>setFaq(faq===i?-1:i)}>{q}<ChevronDown className={faq===i?'up':''}/></button>{faq===i&&<p>{i===1?'نعم، الموقع الرسمي يذكر الإفطار المجاني للنزلاء.':i===2?'نعم، تتوفر خدمة التوصيل والاستقبال من وإلى المطار.':i===3?'نعم، تتوفر مواقف سيارات مجانية للنزلاء.':i===4?'يُرسل طلب الحجز إلى واتساب الفندق ثم يتواصل فريق الحجز لتأكيد التفاصيل والتوفر.':'تواصل مع فريق الفندق قبل الوصول لتأكيد تفاصيل تسجيل الدخول والمغادرة.'}</p>}</div>)}</div></section>

   <section className="final-cta"><div><span className="eyebrow">بانوراما عدن</span><h2>اجعل إقامتك القادمة<br/><em>تبدأ من هنا.</em></h2></div><button className="gold-btn" onClick={()=>setBooking(true)}>احجز الآن <ArrowLeft size={17}/></button></section>
  </main>

  <footer id="contact">
   <div className="footer-top"><Logo dark/><div><span className="eyebrow">تواصل معنا</span><h3>فريق بانوراما<br/>في خدمتك.</h3></div><div className="contact-list"><a href="tel:+967783231118"><Phone/>+967 783 231 118</a><a href="tel:+9672233331"><Phone/>+967 2 233 3331</a><a href="mailto:info@panorama-ye.com"><AtSign/>info@panorama-ye.com</a><span><MapPin/>عدن · خورمكسر · ساحل أبين · بجوار مطار عدن الدولي</span></div></div>
   <div className="footer-bottom"><span>© 2026 Panorama Hotel Aden. جميع الحقوق محفوظة.</span><span>فندق خمسة نجوم في قلب مدينة عدن على إطلالة بحرية وبالقرب من المطار.</span><div><Instagram/></div></div>
  </footer>

  {booking&&<BookingModal close={()=>setBooking(false)} selectedRoom={selected?.name}/>}
  {selected&&<div className="modal" onMouseDown={()=>setSelected(null)}><div className="room-modal-pano" onMouseDown={e=>e.stopPropagation()} dir="rtl"><button className="close" onClick={()=>setSelected(null)}><X/></button><img src={selected.image} alt={selected.name}/><div><span className="eyebrow">{selected.en}</span><h2>{selected.name}</h2><p>{selected.meta}</p><ul>{selected.features.map(f=><li key={f}>✓ {f}</li>)}</ul><button className="gold-btn" onClick={()=>{setSelected(null);setBooking(true)}}>احجز هذه الغرفة <ArrowLeft size={16}/></button></div></div></div>}
 </div>
}
