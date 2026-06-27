import { supabase } from './supabase';
import { translations, Locale } from './i18n';

export type ContentMap = Record<string, string>;

export async function getContent(locale: Locale): Promise<ContentMap> {
  try {
    const { data } = await supabase.from('site_content').select('key, ar, en');
    if (!data || data.length === 0) return getFallback(locale);
    return Object.fromEntries(data.map((row) => [row.key, locale === 'ar' ? row.ar : row.en]));
  } catch {
    return getFallback(locale);
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
  };
}
