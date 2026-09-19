import {createElement,useEffect,useMemo,useState} from 'react';
import {supabase} from './supabase';
import {Heart,Check,ArrowLeft,ArrowRight,CalendarDays,ChevronDown,Clock3,Instagram,MapPin,Menu,Phone,Plane,Star,X,Users,Wifi,Car,Utensils,CircleParking,Gamepad2,Dumbbell,Store,AtSign} from 'lucide-react';

const WA='967783231118';
const hotelImages={
  exterior:'https://panorama-ye.com/wp-content/uploads/2025/02/777777777777777777.jpg',
  lobby:'https://panorama-ye.com/wp-content/uploads/2025/02/DSC04851.jpg',
  room:'https://panorama-ye.com/wp-content/uploads/2025/02/DSC04805.jpg',
  pool:'https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=1800&q=88',
  dining:'https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?auto=format&fit=crop&w=1800&q=88',
  room2:'https://panorama-ye.com/wp-content/uploads/2025/04/DSC05163-600x600.jpg',
  room3:'https://panorama-ye.com/wp-content/uploads/2025/04/DSC05026-1-600x600.jpg'
};

const rooms=[
 {name:'جناح رئاسي بحري',en:'Presidential Sea Suite',tag:'VIP',meta:'إطلالة بحرية · مسبح خاص',features:['سرير فاخر','إطلالة بحرية','مسبح خاص','واي فاي مجاني'],image:hotelImages.room},
 {name:'جناح ملكي بحري',en:'Royal Sea Suite',tag:'Sea View',meta:'سرير عائلي · مجلس خاص',features:['سرير عائلي','مجلس خاص','إطلالة بحرية','تكييف وتلفزيون LED'],image:hotelImages.room2},
 {name:'جناح ملكي خلفي',en:'Royal Rear Suite',tag:'Royal',meta:'إطلالة خلفية · منطقة جلوس',features:['سرير عائلي','منطقة جلوس','واي فاي مجاني','موقف سيارات مجاني'],image:hotelImages.room3},
 {name:'غرفة بحري',en:'Sea View Room',tag:'Sea View',meta:'إطلالة بحرية · منطقة جلوس',features:['سرير عائلي','إطلالة بحرية','منطقة جلوس','تكييف وتلفزيون LED'],image:hotelImages.lobby},
 {name:'غرفة خلفي',en:'Rear Room',tag:'Comfort',meta:'سرير مزدوج أو سريران',features:['واي فاي مجاني','سرير مزدوج أو سريران','تكييف','تلفزيون LED'],image:hotelImages.room},
 {name:'غرفة بحري مع جاكوزي',en:'Sea View Jacuzzi Room',tag:'Jacuzzi',meta:'إطلالة بحرية · جاكوزي خاص',features:['سرير مزدوج','إطلالة بحرية','جاكوزي','مساحة ترفيهية مجانية'],image:hotelImages.pool}
];

const iconMap:any={Utensils,Clock3,Dumbbell,Gamepad2,Store,Car,Wifi,Plane,CircleParking,Star};
function renderServiceIcon(icon:any){if(typeof icon==='function')return createElement(icon,{size:22,strokeWidth:1.7});if(typeof icon==='string')return createElement(iconMap[icon]||Clock3,{size:22,strokeWidth:1.7});return createElement(Clock3,{size:22,strokeWidth:1.7});}

const services=[
 ['مطعم المراسيم','إفطار وغداء وعشاء','استمتع بتجربة طعام متكاملة داخل الفندق.',Utensils],
 ['كافيه الفندق','مشروبات وحلويات ووجبات خفيفة','أجواء هادئة ومذاق رائع طوال اليوم.',Clock3],
 ['نادي لياقة ومسبح','لياقة · مسبح · كراسي استرخاء','مساحة للاسترخاء والحركة بإطلالة مميزة.',Dumbbell],
 ['صالة ألعاب','بلياردو · بلايستيشن · تنس طاولة','ترفيه متنوع للضيوف والعائلات.',Gamepad2],
 ['متاجر متنوعة','هدايا · عطور · إكسسوارات وجوالات','كل ما تحتاجه أثناء إقامتك في مكان واحد.',Store],
 ['خدمات الضيوف','مطار · سيارات · صرافة · اجتماعات','حلول عملية تجعل الإقامة أسهل وأكثر راحة.',Car],
 ['محل الصرافة وATM','صرافة · مكائن صراف آلي','خدمات مالية عملية داخل الفندق للضيوف.',AtSign],
 ['صالون الحلاقة','حلاقة وعناية شخصية','خدمة إضافية لراحة الضيوف أثناء الإقامة.',Users],
 ['متجر الهدايا والعطور','هدايا · عطور · إكسسوارات','متجر متنوع داخل الفندق لاحتياجات الضيوف.',Store],
 ['متجر الجوالات','إكسسوارات · جوالات','احتياجات الجوال والإكسسوارات أثناء إقامتك.',AtSign],
 ['خدمة السيارات','تأجير سيارات · سائق','خدمة سيارات للضيوف للمشاوير الخاصة.',Car],
 ['منتزه وطيرمانات','إطلالة بحرية · استرخاء','مساحات مفتوحة للاستمتاع بالأجواء الساحلية.',Star],
 ['قاعات الاجتماعات','اجتماعات · تدريب · مناسبات','قاعات متنوعة ومتكاملة للاجتماعات والفعاليات.',CalendarDays],
 ['خدمة الاستقبال','24 ساعة','فريق استقبال لخدمتك على مدار الساعة.',Clock3]
];

const perks=[
 ['80','غرفة وجناح'],['5','طوابق سكنية'],['24/7','استقبال'],['SEA','إطلالة ساحلية']
];

function Logo({dark=false,name='PANORAMA',logoUrl}:{dark?:boolean;name?:string;logoUrl?:string}){return <a className={'brand '+(dark?'brand-dark':'')} href="#top" aria-label={name}><span className="brand-mark">{logoUrl?<img src={logoUrl} alt={name}/>:<><b>PH</b><i>★★★★★</i></>}</span><span><strong>{name}</strong><small>HOTEL · ADEN</small></span></a>}

function BookingModal({close,selectedRoom,whatsapp}:{close:()=>void;selectedRoom?:string;whatsapp:string}){
 const [sent,setSent]=useState(false);
 const [form,setForm]=useState({name:'',phone:'',checkIn:'',checkOut:'',guests:'2',room:selectedRoom||rooms[0].name});
 const submit=async(e:any)=>{e.preventDefault();const {error}=await supabase.from('pano_bookings').insert({guest_name:form.name,phone:form.phone,check_in:form.checkIn,check_out:form.checkOut,guests:Number(String(form.guests).replace('+',''))||2,room_name:form.room});const msg=`مرحباً فندق بانوراما، أرغب في حجز غرفة.\nالاسم: ${form.name}\nالجوال: ${form.phone}\nالوصول: ${form.checkIn}\nالمغادرة: ${form.checkOut}\nالأشخاص: ${form.guests}\nالغرفة: ${form.room}${error?'\\n(تم إرسال الطلب عبر واتساب؛ تعذر حفظ نسخة قاعدة البيانات.)':''}`;window.open('https://wa.me/'+whatsapp.replace(/\D/g,'')+'?text='+encodeURIComponent(msg),'_blank');setSent(true)};
 return <div className="modal" onMouseDown={close}><div className="booking-card" onMouseDown={e=>e.stopPropagation()} dir="rtl"><button className="close" onClick={close}><X/></button>{sent?<div className="sent"><div className="sent-icon">✓</div><span className="eyebrow">تم إرسال الطلب</span><h2>نحن بانتظارك في بانوراما.</h2><p>تم فتح واتساب لإرسال تفاصيل الحجز إلى الفندق. سيتواصل معك فريق الحجز لتأكيد التوفر.</p><button className="gold-btn" onClick={close}>إغلاق</button></div>:<><span className="eyebrow">الحجز المباشر</span><h2>ابدأ إقامتك في بانوراما.</h2><p className="modal-lead">أرسل طلب الحجز مباشرة إلى فريق الفندق عبر واتساب.</p><form onSubmit={submit}><div className="form-grid"><label>الاسم الكامل<input required value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/></label><label>رقم الجوال<input required value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})}/></label><label>تاريخ الوصول<input required type="date" value={form.checkIn} onChange={e=>setForm({...form,checkIn:e.target.value})}/></label><label>تاريخ المغادرة<input required type="date" value={form.checkOut} onChange={e=>setForm({...form,checkOut:e.target.value})}/></label><label>عدد الأشخاص<select value={form.guests} onChange={e=>setForm({...form,guests:e.target.value})}><option>1</option><option>2</option><option>3</option><option>4</option><option>5+</option></select></label><label>الغرفة أو الجناح<select value={form.room} onChange={e=>setForm({...form,room:e.target.value})}>{rooms.map(r=><option key={r.name}>{r.name}</option>)}</select></label></div><button className="gold-btn full" type="submit">إرسال طلب الحجز إلى واتساب <ArrowLeft size={17}/></button></form></>}</div></div>
}

export default function App(){
 const [menu,setMenu]=useState(false),[booking,setBooking]=useState(false),[selected,setSelected]=useState<any|null>(null),[lang,setLang]=useState<'ar'|'en'>('ar'),[faq,setFaq]=useState(-1),[heroSlide,setHeroSlide]=useState(0);
 const heroSlides=[settings?.hero_image_url||hotelImages.exterior,hotelImages.lobby,hotelImages.room2,hotelImages.room3];
 useEffect(()=>{const timer=window.setInterval(()=>setHeroSlide(v=>(v+1)%heroSlides.length),6500);return()=>window.clearInterval(timer)},[heroSlides.length]);
 const [remoteRooms,setRemoteRooms]=useState<any[]|null>(null),[remoteServices,setRemoteServices]=useState<any[]|null>(null),[remoteFaqs,setRemoteFaqs]=useState<any[]|null>(null),[remoteGallery,setRemoteGallery]=useState<any[]|null>(null),[remoteOffers,setRemoteOffers]=useState<any[]|null>(null),[remoteSections,setRemoteSections]=useState<any[]|null>(null),[settings,setSettings]=useState<any>(null);
 useEffect(()=>{let active=true;(async()=>{const [r,s,f,g,o,sec,st]=await Promise.all([supabase.from('pano_rooms').select('*').eq('is_published',true).order('sort_order'),supabase.from('pano_services').select('*').eq('is_published',true).order('sort_order'),supabase.from('pano_faqs').select('*').eq('is_published',true).order('sort_order'),supabase.from('pano_gallery').select('*').eq('is_published',true).order('sort_order'),supabase.from('pano_offers').select('*').eq('is_published',true).order('sort_order'),supabase.from('pano_sections').select('*').eq('is_published',true).order('sort_order'),supabase.from('pano_site_settings').select('*').eq('id',true).single()]);if(!active)return;if(!r.error&&r.data?.length)setRemoteRooms(r.data);if(!s.error&&s.data?.length)setRemoteServices(s.data);if(!f.error&&f.data?.length)setRemoteFaqs(f.data);if(!g.error&&g.data?.length)setRemoteGallery(g.data);if(!o.error&&o.data?.length)setRemoteOffers(o.data);if(!sec.error&&sec.data?.length)setRemoteSections(sec.data);if(!st.error&&st.data)setSettings(st.data)})();return()=>{active=false}},[]);
 const displayRooms=remoteRooms?.map(r=>({name:r.name_ar,en:r.name_en,tag:r.tag,meta:r.meta_ar,features:r.features_ar||[],image:r.image_url}))||rooms;
 const displayServices=remoteServices?.map(s=>[s.title_ar,s.subtitle_ar,s.description_ar,s.icon] as any[])||services;
 const displayFaqs=remoteFaqs?.map((f:any)=>({q:f.question_ar,a:f.answer_ar}))||[{q:'ما أوقات تسجيل الوصول والمغادرة؟',a:'تواصل مع فريق الفندق قبل الوصول لتأكيد تفاصيل تسجيل الدخول والمغادرة.'},{q:'هل الإفطار مجاني للنزلاء؟',a:'نعم، الموقع الرسمي يذكر الإفطار المجاني للنزلاء.'},{q:'هل تتوفر خدمة التوصيل من وإلى المطار؟',a:'نعم، تتوفر خدمة التوصيل والاستقبال من وإلى المطار.'},{q:'هل توجد مواقف سيارات؟',a:'نعم، تتوفر مواقف سيارات مجانية للنزلاء.'},{q:'كيف يتم تأكيد الحجز؟',a:'يُرسل طلب الحجز إلى واتساب الفندق ثم يتواصل فريق الحجز لتأكيد التفاصيل والتوفر.'}];
 const nav=useMemo(()=>lang==='ar'?['الرئيسية','الغرف والأجنحة','الخدمات','الموقع','عن الفندق','تواصل معنا']:['Home','Rooms','Services','Location','About','Contact'],[lang]);
 const jump=(id:string)=>{setMenu(false);document.getElementById(id)?.scrollIntoView({behavior:'smooth'})};
 const gallery=remoteGallery?.length?remoteGallery.map((g:any)=>g):[{id:'exterior',image_url:hotelImages.exterior,title_ar:'واجهة الفندق'},{id:'lobby',image_url:hotelImages.lobby,title_ar:'أجواء الفندق'},{id:'room',image_url:hotelImages.room,title_ar:'الغرف'},{id:'pool',image_url:hotelImages.pool,title_ar:'المسبح'},{id:'room2',image_url:hotelImages.room2,title_ar:'جناح بانوراما'},{id:'room3',image_url:hotelImages.room3,title_ar:'غرفة بانوراما'}]; const offers=remoteOffers||[]; const section=(key:string)=>remoteSections?.find(s=>s.section_key===key); const about=section('about'); const experience=section('experience'); const dining=section('dining'); const finalCta=section('final_cta');
 useEffect(()=>{if(!settings)return;const root=document.documentElement;root.style.setProperty('--gold',settings.primary_color||'#b99761');root.style.setProperty('--green',settings.secondary_color||'#2e3a32');root.style.setProperty('--cream',settings.background_color||'#f5f1e9');root.style.setProperty('--gold2',settings.accent_color||'#d3b77f');document.title=settings.meta_title_ar||settings.hotel_name||'Panorama Hotel Aden'},[settings]);
 const brandName=settings?.hotel_name||'PANORAMA';
 const phonePrimary=settings?.phone_primary||'+967 783 231 118';
 const phoneSecondary=settings?.phone_secondary||'+967 2 233 3331';
 const email=settings?.email||'info@panorama-ye.com';
 const whatsapp=settings?.whatsapp||WA;
 return <div className="site" dir="rtl" id="top">
  <header className="topbar">
   <Logo name={brandName} logoUrl={settings?.logo_url}/>
   <nav className={menu?'open':''}><button onClick={()=>jump('top')}>{nav[0]}</button><button onClick={()=>jump('rooms')}>{nav[1]}</button><button onClick={()=>jump('services')}>{nav[2]}</button><button onClick={()=>jump('location')}>{nav[3]}</button><button onClick={()=>jump('about')}>{nav[4]}</button><button onClick={()=>jump('contact')}>{nav[5]}</button></nav>
   <div className="top-actions"><button className="lang" onClick={()=>setLang(lang==='ar'?'en':'ar')}>{lang==='ar'?'EN':'عربي'}</button><button className="book-mini" onClick={()=>setBooking(true)}>احجز الآن <ArrowLeft size={15}/></button><button className="menu-btn" onClick={()=>setMenu(!menu)}>{menu?<X/>:<Menu/>}</button></div>
  </header>

  <main>
   <section className="hero-pano">
    <div className="hero-slides">{heroSlides.map((src:string,i:number)=><img key={src} className={i===heroSlide?'active':''} src={src} alt="Panorama Hotel Aden"/>)}</div><div className="hero-overlay"/>
    <div className="hero-content">
      <div className="stars">★★★★★ <span>فندق بانوراما · عدن</span></div>
      <h1>{(settings?.hero_title_ar||'عش تجربة استثنائية في عدن').split('\n').map((x:string,i:number)=><span key={i}>{x}{i===0&&<br/>}</span>)}</h1>
      <p>{settings?.hero_description_ar||'فندق بانوراما — إقامة فندقية استثنائية في قلب مدينة عدن، بإطلالات بحرية ساحرة وبالقرب من مطار عدن الدولي.'}</p>
      <div className="hero-buttons"><button className="gold-btn" onClick={()=>setBooking(true)}>احجز إقامتك <ArrowLeft size={17}/></button><button className="ghost-btn" onClick={()=>jump('about')}>اكتشف بانوراما</button></div>
    </div>
    <div className="hero-note"><span>0{heroSlide+1}</span><i/> <span>عدن · اليمن</span></div><div className="hero-proof"><span>PANORAMA HOTEL</span><b>ADEN · YEMEN</b><small>80 ROOMS · SEA VIEW · AIRPORT ACCESS</small></div><div className="hero-dots">{heroSlides.map((_,i)=><button key={i} className={i===heroSlide?'active':''} onClick={()=>setHeroSlide(i)} aria-label={'الصورة '+(i+1)}/>)}</div>
   </section>

   <section className="booking-strip" dir="rtl">
    <div><CalendarDays/><small>الوصول</small><b>اختر التاريخ</b></div><div><CalendarDays/><small>المغادرة</small><b>اختر التاريخ</b></div><div><Users/><small>الضيوف</small><b>2 أشخاص</b></div><button onClick={()=>setBooking(true)}>تحقق من التوفر <ArrowLeft size={16}/></button>
   </section>

   <section className="intro section" id="about">
    <div className="section-kicker"><span>01</span><i/><span>عن بانوراما</span></div>
    <div className="intro-copy"><span className="eyebrow">{about?.subtitle_ar||'مرحبا بكم في فندق بانوراما'}</span><h2>{about?.title_ar||'راحة عصرية، وبحر أمامك.'}</h2><p>{about?.body_ar||'يقع فندق بانوراما على ساحل أبين ويطل على شاطئ البحر والمدينة والمطار. صُمم ليجمع بين الراحة والرفاهية والخدمات المتنوعة في قلب مدينة عدن.'}</p><button className="text-btn" onClick={()=>jump('services')}>اكتشف خدمات الفندق <ArrowLeft size={15}/></button></div>
   </section>

   <section className="stats"><div className="stats-inner">{perks.map(p=><div key={p[0]}><strong>{p[0]}</strong><span>{p[1]}</span></div>)}</div></section>

   <section className="rooms-section section" id="rooms">
    <div className="section-heading"><div><span className="eyebrow">الإقامة</span><h2>غرف وأجنحة<br/><em>بانوراما.</em></h2></div><p>اختر الإقامة التي تناسب رحلتك، من الجناح الرئاسي البحري إلى الغرف العملية بإطلالات مختلفة.</p></div>
    <div className="room-grid">{displayRooms.map((r:any,i:number)=><article className="room-card" key={r.name} onClick={()=>setSelected(r)}><div className="room-photo"><img src={r.image} alt={r.name}/><span>{r.tag}</span><button>تفاصيل <ArrowLeft size={14}/></button></div><div className="room-info"><div><h3>{r.name}</h3><p>{r.meta}</p></div><small>0{i+1}</small></div></article>)}</div>
   </section>

   <section className="image-story"><img src={hotelImages.exterior} alt={brandName}/><div className="image-story-card"><span className="eyebrow">الموقع</span><h2>في خورمكسر،<br/><em>على ساحل أبين.</em></h2><p>بجوار مطار عدن الدولي، مع إطلالات على البحر والمدينة والمطار.</p><button className="text-btn" onClick={()=>jump('contact')}>معلومات الوصول <ArrowLeft size={15}/></button></div></section>

   <section className="services section" id="services">
    <div className="section-kicker"><span>02</span><i/><span>الخدمات والتجارب</span></div>
    <div><div className="section-heading compact"><div><span className="eyebrow">كل ما تحتاجه</span><h2>أكثر من مجرد<br/><em>غرفة.</em></h2></div><p>خدمات الفندق الحالية كما يقدمها بانوراما، مرتبة في تجربة رقمية أوضح وأسهل للضيف.</p></div>
    <div className="service-grid">{displayServices.map(([title,sub,desc,icon]:any)=><article key={title}><span className="service-icon">{renderServiceIcon(icon)}</span><span>{sub}</span><h3>{title}</h3><p>{desc}</p></article>)}</div></div>
   </section>

   <section className="experience">
    <div className="experience-image"><img src={experience?.image_url||hotelImages.pool} alt={experience?.title_ar||'مسبح فندق بانوراما'}/></div><div className="experience-copy"><span className="eyebrow">{experience?.subtitle_ar||'رفاهية واسترخاء'}</span><h2>{experience?.title_ar||'استرخِ. نحن نهتم بالباقي.'}</h2><p>{experience?.body_ar||'مسبح بإطلالة مميزة، نادي لياقة، صالة ألعاب، إفطار مجاني للنزلاء، ومواقف سيارات مجانية.'}</p><div className="check-list"><span><Wifi/>واي فاي مجاني</span><span><Plane/>توصيل من وإلى المطار</span><span><CircleParking/>مواقف مجانية</span><Star/>خدمات مخصصة للنزلاء</div></div>
   </section>

   <section className="dining section"><div><span className="eyebrow">{dining?.subtitle_ar||'الطعام والشراب'}</span><h2>{dining?.title_ar||'مطعم المراسيم وكافيه بانوراما.'}</h2><p>{dining?.body_ar||'مطعم متكامل يقدم الإفطار والغداء والعشاء، إلى جانب كافيه يقدم المشروبات والعصائر الطازجة والحلويات والوجبات الخفيفة.'}</p><button className="text-btn" onClick={()=>jump('contact')}>تواصل مع الفندق <ArrowLeft size={15}/></button></div><div className="dining-photo"><img src={hotelImages.dining} alt="مطعم الفندق"/></div></section>

   <section className="gallery section"><div className="section-heading"><div><span className="eyebrow">الصور</span><h2>بانوراما<br/><em>من الداخل.</em></h2></div><p>لقطات من الفندق والإقامة والمرافق، تُدار بالكامل من لوحة التحكم.</p></div><div className="gallery-grid">{gallery.map((g:any)=><img key={g.id} src={g.image_url} alt={g.title_ar||brandName}/>)}</div></section>

   {offers.length>0&&<section className="offers section"><div className="section-heading"><div><span className="eyebrow">عروض وباقات</span><h2>إقامة<br/><em>أكثر قيمة.</em></h2></div><p>عروض موسمية وباقات يمكن تحديثها مباشرة من لوحة الإدارة.</p></div><div className="offer-grid">{offers.map((o:any)=><article key={o.id}><img src={o.image_url||hotelImages.room} alt={o.title_ar}/><div><span className="eyebrow">عرض خاص</span><h3>{o.title_ar}</h3><p>{o.description_ar}</p>{o.price&&<b>{o.price} USD</b>}</div></article>)}</div></section>}

   <section className="amenities-band"><div><span>صالة ألعاب</span><b>بلياردو · بلايستيشن · تنس طاولة</b></div><div><span>قاعات اجتماعات</span><b>قاعات متنوعة ومتكاملة</b></div><div><span>كافيه الدور السابع</span><b>أجواء هادئة ومذاق رائع</b></div></section>

   <section className="testimonials section"><span className="eyebrow">شهادات ضيوفنا</span><h2>تجارب من<br/><em>زوار بانوراما.</em></h2><div className="testimonial-grid"><blockquote>“فندق بانوراما عدن حيث طيب الإقامة وروعة المكان، تجربة مميزة في مدينة الجمال عدن.”<small>ماريا قحطان · فنانة</small></blockquote><blockquote>“ضمن زيارتي في عدن قررت الإقامة في فندق بانوراما… فخامة وخدمات متنوعة وغرف وأجنحة خاصة.”<small>شيماء محمد · ممثلة</small></blockquote><blockquote>“من أكبر وأفخم الفنادق والذي يعكس صورة جميلة لكل الزوار من خارج مدينتنا الحبيبة عدن.”<small>فهد بن جعموم · شاعر</small></blockquote></div></section>

   <section className="faq section"><div><span className="eyebrow">معلومات مهمة</span><h2>قبل<br/><em>وصولك.</em></h2></div><div>{displayFaqs.map((item:any,i:number)=><div className="faq-row" key={item.q}><button onClick={()=>setFaq(faq===i?-1:i)}>{item.q}<ChevronDown className={faq===i?'up':''}/></button>{faq===i&&<p>{item.a}</p>}</div>)}</div></section>

   <section className="location-section section" id="location"><div className="section-heading"><div><span className="eyebrow">الموقع والوصول</span><h2>بانوراما<br/><em>في قلب عدن.</em></h2></div><p>خورمكسر · ساحل أبين · بجوار مطار عدن الدولي. حرّك الخريطة وقرّبها أو افتح الموقع مباشرة في خرائط Google.</p></div><div className="location-grid"><div className="location-map"><iframe title="Panorama Hotel Aden location" src={settings?.map_url||'https://www.google.com/maps?q=Panorama+Hotel+Aden&output=embed'} loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe></div><div className="location-card"><span className="eyebrow">Panorama Hotel Aden</span><h3>ساحل أبين · خورمكسر</h3><p>بجوار مطار عدن الدولي، مع سهولة الوصول إلى الفندق من المطار والمدينة.</p><div className="location-links"><a href="https://www.google.com/maps/search/?api=1&query=Panorama+Hotel+Aden" target="_blank" rel="noreferrer">فتح في Google Maps <ArrowLeft size={15}/></a><a href={'tel:'+phonePrimary.replace(/\s/g,'')}>الاتصال بالفندق <Phone size={15}/></a></div></div></div></section>

   <section className="final-cta"><div><span className="eyebrow">{finalCta?.subtitle_ar||'بانوراما عدن'}</span><h2>{finalCta?.title_ar||'اجعل إقامتك القادمة تبدأ من هنا.'}</h2></div><button className="gold-btn" onClick={()=>setBooking(true)}>احجز الآن <ArrowLeft size={17}/></button></section>
  </main>

  <footer id="contact">
   <div className="footer-top"><Logo dark name={brandName} logoUrl={settings?.logo_url}/><div><span className="eyebrow">تواصل معنا</span><h3>فريق بانوراما<br/>في خدمتك.</h3></div><div className="contact-list"><a href={'tel:'+phonePrimary.replace(/\s/g,'')}><Phone/>{phonePrimary}</a><a href={'tel:'+phoneSecondary.replace(/\s/g,'')}><Phone/>{phoneSecondary}</a><a href={'mailto:'+email}><AtSign/>{email}</a><span><MapPin/>عدن · خورمكسر · ساحل أبين · بجوار مطار عدن الدولي</span></div></div>
   <div className="footer-bottom"><span>© 2026 {brandName}. جميع الحقوق محفوظة.</span><span>{settings?.footer_text_ar||'فندق بانوراما عدن — إقامة عصرية على ساحل أبين بالقرب من مطار عدن الدولي.'}</span><div className="socials">{settings?.social_instagram&&<a href={settings.social_instagram} target="_blank"><Instagram/></a>}{settings?.social_facebook&&<a href={settings.social_facebook} target="_blank">f</a>}{settings?.social_tiktok&&<a href={settings.social_tiktok} target="_blank">♪</a>}</div></div>
  </footer>

  {booking&&<BookingModal close={()=>setBooking(false)} selectedRoom={selected?.name} whatsapp={whatsapp}/>}
  {selected&&<div className="modal" onMouseDown={()=>setSelected(null)}><div className="room-modal-pano" onMouseDown={e=>e.stopPropagation()} dir="rtl"><button className="close" onClick={()=>setSelected(null)}><X/></button><img src={selected.image} alt={selected.name}/><div><span className="eyebrow">{selected.en}</span><h2>{selected.name}</h2><p>{selected.meta}</p><ul>{selected.features.map((f: string)=><li key={f}>✓ {f}</li>)}</ul><button className="gold-btn" onClick={()=>{setSelected(null);setBooking(true)}}>احجز هذه الغرفة <ArrowLeft size={16}/></button></div></div></div>}
 </div>
}  const [menu,setMenu]=useState(false),[booking,setBooking]=useState(false),[selected,setSelected]=useState<any|null>(null),[lang,setLang]=useState<'ar'|'en'>('ar'),[faq,setFaq]=useState(-1),[heroSlide,setHeroSlide]=useState(0);
  const [remoteRooms,setRemoteRooms]=useState<any[]|null>(null),[remoteServices,setRemoteServices]=useState<any[]|null>(null),[remoteFaqs,setRemoteFaqs]=useState<any[]|null>(null),[remoteGallery,setRemoteGallery]=useState<any[]|null>(null),[remoteOffers,setRemoteOffers]=useState<any[]|null>(null),[remoteSections,setRemoteSections]=useState<any[]|null>(null),[settings,setSettings]=useState<any>(null);
  const heroSlides=[settings?.hero_image_url||hotelImages.exterior,hotelImages.lobby,hotelImages.room2,hotelImages.room3];
  useEffect(()=>{const timer=window.setInterval(()=>setHeroSlide(v=>(v+1)%heroSlides.length),6500);return()=>window.clearInterval(timer)},[heroSlides.length]);

