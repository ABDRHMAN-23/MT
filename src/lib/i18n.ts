export type Lang = 'ar' | 'en' | 'en-GB';

/** `gb` is an optional British override; when absent `en` is used. */
type Dict = Record<string, { ar: string; en: string; gb?: string }>;

export const LANG_META: Record<Lang, { native: string; short: string; latin: string; dir: 'rtl' | 'ltr' }> = {
  ar: { native: 'العربية', short: 'ع', latin: 'Arabic', dir: 'rtl' },
  en: { native: 'English (US)', short: 'US', latin: 'الإنجليزية الأمريكية', dir: 'ltr' },
  'en-GB': { native: 'English (UK)', short: 'UK', latin: 'الإنجليزية البريطانية', dir: 'ltr' },
};

/** BCP-47 tag used for Intl number and date formatting. */
export function intlLocale(lang: Lang): string {
  if (lang === 'ar') return 'ar';
  if (lang === 'en-GB') return 'en-GB';
  return 'en-US';
}

/** UI chrome strings. Merchant-authored content comes from settings instead. */
export const STRINGS: Dict = {
  /* ------------------------------------------------------------ navigation */
  'nav.home': { ar: 'الرئيسية', en: 'Home' },
  'nav.shop': { ar: 'كل الحلويات', en: 'All Desserts', gb: 'All Puddings' },
  'nav.mousse': { ar: 'الموس كيك', en: 'Mousse Cakes' },
  'nav.gifts': { ar: 'الهدايا', en: 'Gifting' },
  'nav.occasions': { ar: 'المناسبات', en: 'Occasions' },
  'nav.story': { ar: 'حكايتنا', en: 'Our Story' },
  'nav.track': { ar: 'تتبّع طلبك', en: 'Track Order' },
  'nav.menu': { ar: 'فتح القائمة', en: 'Open menu' },
  'nav.close': { ar: 'إغلاق', en: 'Close' },
  'nav.shopCta': { ar: 'تسوّق المجموعة', en: 'Shop the collection' },

  /* --------------------------------------------------------------- search */
  'search.aria': { ar: 'البحث عن حلوى', en: 'Search desserts' },
  'search.placeholder': {
    ar: 'ابحث… موس الشوكولاتة، الفستق، المانجو',
    en: 'Search… chocolate mousse, pistachio, mango',
  },
  'search.short': { ar: 'ابحث عن حلوى…', en: 'Search for a dessert…' },
  'search.close': { ar: 'إغلاق البحث', en: 'Close search' },
  'search.clear': { ar: 'مسح البحث', en: 'Clear search' },
  'search.suggestions': { ar: 'اقتراحات:', en: 'Suggestions:' },
  'search.s1': { ar: 'شوكولاتة', en: 'Chocolate' },
  'search.s2': { ar: 'فستق', en: 'Pistachio' },
  'search.s3': { ar: 'مانجو', en: 'Mango' },
  'search.s4': { ar: 'توت', en: 'Berries' },
  'search.s5': { ar: 'كراميل', en: 'Caramel' },
  'search.s6': { ar: 'هدايا', en: 'Gifts' },

  /* ------------------------------------------------------------- switcher */
  'switch.language': { ar: 'اللغة', en: 'Language' },
  'switch.currency': { ar: 'العملة', en: 'Currency' },
  'switch.aria': { ar: 'اللغة والعملة', en: 'Language and currency' },
  'switch.note': {
    ar: 'الأسعار بعملات أخرى تقريبية، ويتم التحصيل بالريال السعودي.',
    en: 'Other currencies are indicative; payment is charged in SAR.',
  },

  /* -------------------------------------------------------------- product */
  'product.favorite': { ar: 'إضافة إلى المفضلة', en: 'Add to favourites' },
  'product.unfavorite': { ar: 'إزالة من المفضلة', en: 'Remove from favourites' },
  'product.added': { ar: 'أُضيفت إلى صندوقك', en: 'Added to your box' },
  'product.addedFav': { ar: 'أُضيفت إلى مفضلتك', en: 'Added to your favourites' },
  'product.removedFav': { ar: 'أُزيلت من مفضلتك', en: 'Removed from your favourites' },
  'product.limit': { ar: 'وصلت للحد المتاح', en: 'Maximum quantity reached' },
  'product.limitHint': { ar: 'لا توجد كمية إضافية من هذه الحلوى', en: 'No more of this dessert available' },
  'product.soldOut': { ar: 'نفدت الكمية مؤقتًا', en: 'Sold out for now' },
  'product.soldOutShort': { ar: 'نفدت الكمية', en: 'Sold out' },
  'product.new': { ar: 'وصل حديثًا', en: 'New' },
  'product.best': { ar: 'الأكثر طلبًا', en: 'Best seller' },
  'product.off': { ar: 'خصم', en: 'Save' },
  'product.left': { ar: 'بقيت {n} قطع فقط لهذا اليوم', en: 'Only {n} left today' },
  'product.leftShort': { ar: 'بقيت {n} قطع فقط', en: 'Only {n} left' },
  'product.inStock': { ar: 'متوفر اليوم', en: 'Available today' },
  'product.addToBox': { ar: 'أضف إلى الصندوق', en: 'Add to box' },
  'product.unavailable': { ar: 'غير متوفر حاليًا', en: 'Currently unavailable' },
  'product.quantity': { ar: 'الكمية', en: 'Quantity' },
  'product.weight': { ar: 'الوزن', en: 'Weight' },
  'product.serves': { ar: 'تكفي', en: 'Serves' },
  'product.storage': { ar: 'الحفظ', en: 'Storage' },
  'product.chilled': { ar: 'مبرّد', en: 'Chilled' },
  'product.ingredients': { ar: 'المكوّنات', en: 'Ingredients' },
  'product.allergens': { ar: 'مسببات الحساسية', en: 'Allergens' },
  'product.care': { ar: 'التقديم والحفظ', en: 'Serving & storage' },
  'product.serving': { ar: 'التقديم', en: 'Serving' },
  'product.reviews': { ar: 'تقييم', en: 'reviews' },
  'product.related': { ar: 'حلويات تليق بذوقك', en: 'You may also love' },
  'product.share': { ar: 'مشاركة', en: 'Share' },
  'product.linkCopied': { ar: 'تم نسخ الرابط', en: 'Link copied' },
  'product.notFound': { ar: 'لم نعثر على هذه الحلوى', en: 'We could not find this dessert' },
  'product.back': { ar: 'العودة', en: 'Go back' },
  'product.browse': { ar: 'تصفّح المجموعة', en: 'Browse the collection' },
  'product.question': { ar: 'لديك سؤال عن هذه الحلوى؟ تحدّث معنا', en: 'Questions about this dessert? Talk to us' },
  'product.allergenNote': {
    ar: 'تُحضَّر جميع حلوياتنا في مطبخ واحد قد يحتوي على المكسرات والحليب والغلوتين. إن كان لديك حساسية شديدة، تواصل معنا قبل الطلب.',
    en: 'All our desserts are made in one kitchen that also handles nuts, dairy and gluten. If you have a severe allergy, please contact us before ordering.',
  },
  'product.reserve': { ar: 'احجز نسختك', en: 'Reserve yours' },
  'product.reserveNote': {
    ar: 'نفدت كمية اليوم من هذه الحلوى. تواصل معنا عبر واتساب لحجزها في دفعة الغد.',
    en: 'Today batch is sold out. Message us on WhatsApp to reserve one from tomorrow batch.',
  },
  'product.servingNote': {
    ar: 'يُفضّل إخراجها من الثلاجة قبل ١٠ دقائق من التقديم ليعود القوام إلى نعومته الكاملة.',
    en: 'Take it out of the fridge 10 minutes before serving so the texture returns to its full silkiness.',
  },
  'product.deliveryNote': {
    ar: 'توصيل مبرّد في نفس اليوم داخل الرياض · مجاني للطلبات فوق',
    en: 'Same-day chilled delivery in Riyadh · free on orders above',
  },
  'product.breadcrumbHome': { ar: 'الرئيسية', en: 'Home' },
  'product.breadcrumbShop': { ar: 'الحلويات', en: 'Desserts' },

  /* --------------------------------------------------------------- catalog */
  'catalog.title': { ar: 'كل الحلويات', en: 'All Desserts', gb: 'All Puddings' },
  'catalog.favorites': { ar: 'مفضلتي', en: 'My Favourites' },
  'catalog.intro': {
    ar: 'تصفّح مجموعتنا الكاملة من الموس والكيكات وصناديق الإهداء، المحضّرة يوميًا في مطبخنا.',
    en: 'Browse our full collection of mousses, cakes and gift boxes, freshly made in our kitchen every day.',
  },
  'catalog.favIntro': {
    ar: 'الحلويات التي اخترتها لتعود إليها لاحقًا.',
    en: 'The desserts you saved to come back to.',
  },
  'catalog.all': { ar: 'الكل', en: 'All' },
  'catalog.categories': { ar: 'الأصناف', en: 'Categories' },
  'catalog.allDesserts': { ar: 'كل الحلويات', en: 'All desserts' },
  'catalog.maxPrice': { ar: 'السعر الأعلى', en: 'Max price' },
  'catalog.upTo': { ar: 'حتى', en: 'Up to' },
  'catalog.quickFilter': { ar: 'تصفية سريعة', en: 'Quick filters' },
  'catalog.inStockOnly': { ar: 'المتوفر الآن فقط', en: 'In stock only' },
  'catalog.onSale': { ar: 'عليها خصم', en: 'On sale', gb: 'On offer' },
  'catalog.favOnly': { ar: 'مفضلتي فقط', en: 'Favourites only' },
  'catalog.reset': { ar: 'إعادة ضبط كل الخيارات', en: 'Reset all filters' },
  'catalog.resetShort': { ar: 'إعادة الضبط', en: 'Reset' },
  'catalog.filter': { ar: 'تصفية', en: 'Filter' },
  'catalog.filterTitle': { ar: 'تصفية الحلويات', en: 'Filter desserts' },
  'catalog.sort': { ar: 'ترتيب النتائج', en: 'Sort results' },
  'catalog.sortDefault': { ar: 'الافتراضي', en: 'Featured' },
  'catalog.sortPriceAsc': { ar: 'السعر: من الأقل', en: 'Price: low to high' },
  'catalog.sortPriceDesc': { ar: 'السعر: من الأعلى', en: 'Price: high to low' },
  'catalog.sortRating': { ar: 'الأعلى تقييمًا', en: 'Top rated' },
  'catalog.sortNewest': { ar: 'الأحدث', en: 'Newest' },
  'catalog.loading': { ar: 'نجهّز العرض…', en: 'Preparing the display…' },
  'catalog.count': { ar: 'حلوى متاحة', en: 'desserts available', gb: 'puddings available' },
  'catalog.for': { ar: 'لـ', en: 'for' },
  'catalog.show': { ar: 'عرض', en: 'Show' },
  'catalog.loadError': { ar: 'تعذّر تحميل الحلويات', en: 'Could not load desserts' },
  'catalog.retry': { ar: 'إعادة المحاولة', en: 'Try again' },
  'catalog.emptyFav': { ar: 'مفضلتك فارغة بعد', en: 'No favourites yet' },
  'catalog.emptyFavHint': {
    ar: 'اضغط على القلب في أي حلوى لتحفظها هنا وتعود إليها متى شئت.',
    en: 'Tap the heart on any dessert to save it here for later.',
  },
  'catalog.empty': { ar: 'لم نعثر على حلوى مطابقة', en: 'No matching desserts' },
  'catalog.emptyHint': {
    ar: 'جرّب تعديل البحث أو التصفية، أو تصفّح مجموعتنا الكاملة.',
    en: 'Try adjusting your search or filters, or browse the full collection.',
  },
  'catalog.customTitle': { ar: 'لم تجد ما تبحث عنه؟', en: 'Looking for something else?' },
  'catalog.customText': {
    ar: 'نصنع طلبات خاصة للمناسبات والشركات. أخبرنا بفكرتك وسنحوّلها إلى حلوى.',
    en: 'We craft bespoke orders for events and companies. Tell us your idea and we will make it.',
  },
  'catalog.talkChef': { ar: 'تحدّث مع الشيف', en: 'Talk to the chef' },

  /* ------------------------------------------------------------------ cart */
  'cart.title': { ar: 'صندوق الحلويات', en: 'Your Dessert Box' },
  'cart.items': { ar: 'قطعة مختارة بعناية', en: 'pieces chosen with care' },
  'cart.emptyYet': { ar: 'لم تُضف أي حلوى بعد', en: 'Nothing added yet' },
  'cart.close': { ar: 'إغلاق الصندوق', en: 'Close box' },
  'cart.empty': { ar: 'صندوقك لا يزال فارغًا', en: 'Your box is still empty' },
  'cart.emptyHint': {
    ar: 'اختر قطعة واحدة… ودع بقية اليوم تتحول إلى لحظة حلوة.',
    en: 'Pick just one piece… and let the rest of your day turn sweet.',
  },
  'cart.browse': { ar: 'تصفّح الحلويات', en: 'Browse desserts' },
  'cart.remove': { ar: 'حذف من الصندوق', en: 'Remove from box' },
  'cart.removed': { ar: 'أُزيلت من الصندوق', en: 'Removed from your box' },
  'cart.subtotal': { ar: 'المجموع', en: 'Subtotal' },
  'cart.subtotalFull': { ar: 'المجموع الفرعي', en: 'Subtotal' },
  'cart.discount': { ar: 'الخصم', en: 'Discount' },
  'cart.delivery': { ar: 'التوصيل المبرّد', en: 'Chilled delivery' },
  'cart.free': { ar: 'مجاني', en: 'Free' },
  'cart.total': { ar: 'الإجمالي', en: 'Total' },
  'cart.review': { ar: 'مراجعة الصندوق', en: 'Review box' },
  'cart.checkout': { ar: 'إتمام الطلب', en: 'Checkout', gb: 'Checkout' },
  'cart.basket': { ar: 'السلة', en: 'Cart', gb: 'Basket' },
  'cart.addMore': { ar: 'أضف حلوى أخرى إلى الصندوق', en: 'Add another dessert to your box' },
  'cart.clear': { ar: 'إفراغ الصندوق', en: 'Empty box' },
  'cart.cleared': { ar: 'تم إفراغ الصندوق', en: 'Box emptied' },
  'cart.boxName': { ar: 'صندوق موسيريا الفاخر', en: 'The MOUSSERIE luxury box' },
  'cart.boxNote': { ar: 'مبطّن بورق حريري ومحفوظ مبرّدًا', en: 'Silk-lined and kept perfectly chilled' },
  'cart.emptyTitle': { ar: 'صندوقك ينتظر أول قطعة', en: 'Your box awaits its first piece' },
  'cart.emptyLong': {
    ar: 'لا شيء هنا بعد… وهذه فرصة ممتازة لتبدأ بموس الشوكولاتة البلجيكية، أو صندوق إهداء يليق بمن تحب.',
    en: 'Nothing here yet — a perfect excuse to start with the Belgian chocolate mousse, or a gift box for someone you love.',
  },
  'cart.giftBoxes': { ar: 'صناديق الهدايا', en: 'Gift boxes' },
  'cart.perPiece': { ar: 'قطعة', en: 'each' },
  'cart.reviewTitle': { ar: 'راجعها قبل أن نغلق الشريط.', en: 'Review it before we tie the ribbon.' },
  'cart.freeDeliveryIn': {
    ar: 'أضف {amount} لتحصل على توصيل مبرّد مجاني.',
    en: 'Add {amount} more for free chilled delivery.',
  },
  'cart.freeDeliveryShort': {
    ar: 'أضف {amount} لتحصل على توصيل مجاني',
    en: 'Add {amount} for free delivery',
  },
  'cart.freeDeliveryWon': { ar: 'حصلت على توصيل مجاني مبرّد 🎉', en: 'You unlocked free chilled delivery 🎉' },
  'cart.summary': { ar: 'ملخّص الطلب', en: 'Order summary' },
  'cart.continue': { ar: 'متابعة إتمام الطلب', en: 'Continue to checkout' },
  'cart.perk1': { ar: 'يصل مبرّدًا مع عبوة تبريد', en: 'Arrives chilled with a cooling pack' },
  'cart.perk2': { ar: 'توصيل في نفس اليوم داخل الرياض', en: 'Same-day delivery within Riyadh' },
  'cart.perk3': { ar: 'ضمان الجودة أو نُعيد التحضير', en: 'Quality guaranteed or we remake it' },

  /* -------------------------------------------------------------- discount */
  'discount.q': { ar: 'هل لديك رمز خصم؟', en: 'Have a discount code?' },
  'discount.aria': { ar: 'رمز الخصم', en: 'Discount code' },
  'discount.apply': { ar: 'تطبيق', en: 'Apply' },
  'discount.remove': { ar: 'إلغاء رمز الخصم', en: 'Remove discount code' },
  'discount.enter': { ar: 'اكتب رمز الخصم أولًا', en: 'Enter a discount code first' },
  'discount.invalid': { ar: 'رمز الخصم غير صالح', en: 'This discount code is not valid' },
  'discount.invalidTitle': { ar: 'رمز غير صالح', en: 'Invalid code' },
  'discount.applied': { ar: 'تم تفعيل رمز الخصم', en: 'Discount code applied' },
  'discount.saved': { ar: 'وفّرت {amount} على صندوقك', en: 'You saved {amount} on your box' },
  'discount.failed': { ar: 'تعذّر التحقق من الرمز', en: 'Could not verify the code' },
  'discount.percentOff': { ar: 'خصم {v}٪', en: '{v}% off' },
  'discount.amountOff': { ar: 'خصم {v}', en: '{v} off' },

  /* ---------------------------------------------------------------- footer */
  'footer.collection': { ar: 'المجموعة', en: 'The Collection' },
  'footer.occasions': { ar: 'مناسباتك', en: 'Your Occasions' },
  'footer.house': { ar: 'الدار', en: 'The House' },
  'footer.chocolate': { ar: 'الشوكولاتة', en: 'Chocolate' },
  'footer.fruits': { ar: 'الفواكه', en: 'Fruits' },
  'footer.pistachio': { ar: 'الفستق', en: 'Pistachio' },
  'footer.occasionCakes': { ar: 'كيكات المناسبات', en: 'Celebration Cakes' },
  'footer.giftBoxes': { ar: 'صناديق الهدايا', en: 'Gift Boxes' },
  'footer.bestsellers': { ar: 'الأكثر طلبًا', en: 'Best Sellers' },
  'footer.new': { ar: 'وصل حديثًا', en: 'New Arrivals' },
  'footer.faq': { ar: 'الأسئلة الشائعة', en: 'FAQ' },
  'footer.delivery': { ar: 'التوصيل والتغليف', en: 'Delivery & Packaging' },
  'footer.admin': { ar: 'لوحة الإدارة', en: 'Admin Panel' },
  'footer.whatsapp': { ar: 'تحدّث معنا عبر واتساب', en: 'Chat with us on WhatsApp' },
  'footer.orderVia': { ar: 'اطلب عبر', en: 'Order via' },
  'footer.rights': { ar: 'جميع الحقوق محفوظة', en: 'All rights reserved' },
  'footer.whatsappMsg': {
    ar: 'مرحبًا، أود الاستفسار عن طلب حلويات',
    en: 'Hello, I would like to ask about ordering desserts',
  },

  'order.asap': { ar: 'أقرب وقت ممكن', en: 'As soon as possible', gb: 'At the earliest opportunity' },

  /* ---------------------------------------------------------------- common */
  'common.loading': { ar: 'جارٍ التحميل…', en: 'Loading…' },
  'common.error': { ar: 'حدث خطأ غير متوقع', en: 'Something went wrong' },
  'common.retry': { ar: 'إعادة المحاولة', en: 'Try again' },
  'common.home': { ar: 'الصفحة الرئيسية', en: 'Home page' },
  'common.optional': { ar: 'اختياري', en: 'optional' },
};

export function translate(key: string, lang: Lang, vars?: Record<string, string | number>): string {
  const entry = STRINGS[key];
  let out = key;
  if (entry) {
    if (lang === 'ar') out = entry.ar;
    else if (lang === 'en-GB') out = entry.gb ?? entry.en;
    else out = entry.en;
  }
  if (vars) {
    for (const [k, v] of Object.entries(vars)) {
      out = out.replace(new RegExp(`\\{${k}\\}`, 'g'), String(v));
    }
  }
  return out;
}
