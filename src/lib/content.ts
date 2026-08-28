import { getDb } from './db';
import { translations, Locale } from './i18n';

export type ContentMap = Record<string, string>;

export async function getContent(locale: Locale): Promise<ContentMap> {
  const fallback = getFallback(locale);
  try {
    const db = getDb();
    const { results } = await db.prepare('SELECT key, ar, en FROM site_content').all<{ key: string; ar: string; en: string }>();
    if (!results || results.length === 0) return fallback;
    const dbContent = Object.fromEntries(results.map((row: { key: string; ar: string; en: string }) => [row.key, locale === 'ar' ? row.ar : row.en]));
    // Merge so newly added keys still render before they're seeded into the DB
    return { ...fallback, ...dbContent };
  } catch {
    return fallback;
  }
}

function getFallback(locale: Locale): ContentMap {
  const t = translations[locale];
  return {
    'nav.home': t.nav.home,
    'nav.shop': t.nav.shop,
    'nav.awakeWindows': t.nav.awakeWindows,
    'nav.bookAppointment': t.nav.bookAppointment,
    'nav.pregnancyCalc': t.nav.pregnancyCalc,
    'home.heroBadge': t.home.heroBadge,
    'home.heroHeading1': t.home.heroHeading1,
    'home.heroHeading2': t.home.heroHeading2,
    'home.heroDesc': t.home.heroDesc,
    'home.heroBook': t.home.heroBook,
    'home.heroCalc': t.home.heroCalc,
    'home.estimatedDue': t.home.estimatedDue,
    'home.card1Label': t.home.pregnancyCalc,
    'home.card1Desc': locale === 'ar' ? 'اكتشفي موعد ولادتك' : 'Find your due date',
    'home.card1Link': locale === 'ar' ? 'احسبي الآن ←' : 'Calculate now →',
    'home.card2Label': t.home.bookAppointment,
    'home.card2Desc': locale === 'ar' ? 'احجزي موعدك الآن' : 'Book your session now',
    'home.card2Link': locale === 'ar' ? 'تحققي من المواعيد ←' : 'See availability →',
    'home.card3Label': t.home.shopDiapers,
    'home.card3Desc': locale === 'ar' ? 'تسوقي قماط وملابس الأطفال' : 'Shop essentials',
    'home.card3Link': locale === 'ar' ? 'تصفحي المتجر ←' : 'Browse the shop →',
    'home.babyClothes': t.home.babyClothes,
    'calc.sectionLabel': locale === 'ar' ? 'حاسبة الحمل' : 'Pregnancy Calculator',
    'calc.heading': locale === 'ar' ? 'حملكِ، أسبوعاً بأسبوع.' : 'Your pregnancy, week by gentle week.',
    'calc.desc': locale === 'ar' ? 'أدخلي أول يوم من آخر دورة' : 'Enter the first day of your last period',
    'calc.inputLabel': locale === 'ar' ? 'أول يوم من آخر دورة' : 'First day of last period',
    'calc.youAre': locale === 'ar' ? 'أنتِ في' : 'You are',
    'calc.dueDate': locale === 'ar' ? 'موعد الولادة' : 'Due Date',
    'calc.weeksLeft': locale === 'ar' ? 'أسبوع متبقية' : 'weeks to go',
    'calc.bookBtn': locale === 'ar' ? 'احجزي موعدك القادم' : 'Book your next scan',
    'calc.placeholder': locale === 'ar' ? 'أدخلي التاريخ لرؤية النتائج' : 'Enter a date to see your results',
    'footer.rights': locale === 'ar' ? '© 2025 MomOfMoms. جميع الحقوق محفوظة.' : '© 2025 MomOfMoms. All rights reserved.',
    // Home extras
    'home.duePlaceholder': locale === 'ar' ? 'لم يتم الحساب بعد' : 'Not calculated yet',
    // Book appointment page
    'book.title': locale === 'ar' ? 'احجزي موعدك' : 'Book an Appointment',
    'book.subtitle': locale === 'ar' ? 'سنتواصل معك لتأكيد الموعد' : 'We will contact you to confirm your appointment',
    'book.name': locale === 'ar' ? 'الاسم' : 'Name',
    'book.phone': locale === 'ar' ? 'رقم الهاتف' : 'Phone',
    'book.email': locale === 'ar' ? 'البريد الإلكتروني (اختياري)' : 'Email (optional)',
    'book.period': locale === 'ar' ? 'الفترة المفضلة' : 'Preferred Period',
    'book.morning': locale === 'ar' ? 'الفترة الصباحية' : 'Morning',
    'book.evening': locale === 'ar' ? 'الفترة المسائية' : 'Evening',
    'book.notes': locale === 'ar' ? 'ملاحظات (اختياري)' : 'Notes (optional)',
    'book.submit': locale === 'ar' ? 'إرسال الطلب' : 'Submit Request',
    'book.successTitle': locale === 'ar' ? 'تم استلام طلبك! 💌' : 'Request Received! 💌',
    'book.successMsg': locale === 'ar' ? 'سنتواصل معك في أقرب وقت لتأكيد موعدك.' : 'We will reach out shortly to confirm your appointment.',
    'book.bookAnother': locale === 'ar' ? 'حجز موعد آخر' : 'Book Another',
    'book.error': locale === 'ar' ? 'يرجى اختيار الفترة المفضلة' : 'Please select a preferred period',
    // Awake windows page
    'awake.title': locale === 'ar' ? 'نوافذ الاستيقاظ' : 'Awake Windows',
    'awake.subtitle': locale === 'ar' ? 'اكتشفي الأوقات المثالية لنشاط طفلك' : 'Discover the ideal wake times for your baby',
    'awake.selectAge': locale === 'ar' ? 'اختاري عمر الطفل' : 'Select baby age',
    'awake.empty': locale === 'ar' ? 'اختاري العمر لرؤية النوافذ' : 'Select an age to see windows',
    // Pregnancy calculator page
    'pregcalc.title': locale === 'ar' ? 'حاسبة الحمل' : 'Pregnancy Calculator',
    'pregcalc.subtitle': locale === 'ar' ? 'احسبي أسبوع حملك وموعد ولادتك' : 'Calculate your pregnancy week and due date',
    'pregcalc.lastPeriod': locale === 'ar' ? 'أول يوم من آخر دورة شهرية' : 'First day of last menstrual period',
    'pregcalc.calculate': locale === 'ar' ? 'احسبي' : 'Calculate',
    'pregcalc.dueDate': locale === 'ar' ? 'موعد الولادة المتوقع' : 'Estimated Due Date',
    'pregcalc.weeksPregnant': locale === 'ar' ? 'أسابيع الحمل' : 'Weeks Pregnant',
    'pregcalc.trimester': locale === 'ar' ? 'الثلث' : 'Trimester',
    'pregcalc.trimester1': locale === 'ar' ? 'الأول' : 'First',
    'pregcalc.trimester2': locale === 'ar' ? 'الثاني' : 'Second',
    'pregcalc.trimester3': locale === 'ar' ? 'الثالث' : 'Third',
    'pregcalc.weeks': locale === 'ar' ? 'أسابيع' : 'weeks',
    'pregcalc.days': locale === 'ar' ? 'أيام' : 'days',
    'pregcalc.complete': locale === 'ar' ? 'مكتملة' : 'complete',
    'pregcalc.month': locale === 'ar' ? 'شهر الحمل' : 'Pregnancy Month',
    'pregcalc.month1': locale === 'ar' ? 'الشهر الأول' : 'First Month',
    'pregcalc.month2': locale === 'ar' ? 'الشهر الثاني' : 'Second Month',
    'pregcalc.month3': locale === 'ar' ? 'الشهر الثالث' : 'Third Month',
    'pregcalc.month4': locale === 'ar' ? 'الشهر الرابع' : 'Fourth Month',
    'pregcalc.month5': locale === 'ar' ? 'الشهر الخامس' : 'Fifth Month',
    'pregcalc.month6': locale === 'ar' ? 'الشهر السادس' : 'Sixth Month',
    'pregcalc.month7': locale === 'ar' ? 'الشهر السابع' : 'Seventh Month',
    'pregcalc.month8': locale === 'ar' ? 'الشهر الثامن' : 'Eighth Month',
    'pregcalc.month9': locale === 'ar' ? 'الشهر التاسع' : 'Ninth Month',
    // Shop page
    'shop.empty': locale === 'ar' ? 'لا توجد منتجات متاحة حالياً' : 'No products available yet',
  };
}
