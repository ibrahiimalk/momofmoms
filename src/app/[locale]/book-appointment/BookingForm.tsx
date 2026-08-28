'use client';
import { useState } from 'react';

const COUNTRY_CODES = [
  { code: '+965', flag: '🇰🇼', label: 'KW', name: 'Kuwait' },
  { code: '+966', flag: '🇸🇦', label: 'SA', name: 'Saudi Arabia' },
  { code: '+971', flag: '🇦🇪', label: 'AE', name: 'United Arab Emirates' },
  { code: '+973', flag: '🇧🇭', label: 'BH', name: 'Bahrain' },
  { code: '+974', flag: '🇶🇦', label: 'QA', name: 'Qatar' },
  { code: '+968', flag: '🇴🇲', label: 'OM', name: 'Oman' },
  { code: '+20', flag: '🇪🇬', label: 'EG', name: 'Egypt' },
  { code: '+962', flag: '🇯🇴', label: 'JO', name: 'Jordan' },
  { code: '+961', flag: '🇱🇧', label: 'LB', name: 'Lebanon' },
  { code: '+93', flag: '🇦🇫', label: 'AF', name: 'Afghanistan' },
  { code: '+355', flag: '🇦🇱', label: 'AL', name: 'Albania' },
  { code: '+213', flag: '🇩🇿', label: 'DZ', name: 'Algeria' },
  { code: '+376', flag: '🇦🇩', label: 'AD', name: 'Andorra' },
  { code: '+244', flag: '🇦🇴', label: 'AO', name: 'Angola' },
  { code: '+1268', flag: '🇦🇬', label: 'AG', name: 'Antigua and Barbuda' },
  { code: '+54', flag: '🇦🇷', label: 'AR', name: 'Argentina' },
  { code: '+374', flag: '🇦🇲', label: 'AM', name: 'Armenia' },
  { code: '+61', flag: '🇦🇺', label: 'AU', name: 'Australia' },
  { code: '+43', flag: '🇦🇹', label: 'AT', name: 'Austria' },
  { code: '+994', flag: '🇦🇿', label: 'AZ', name: 'Azerbaijan' },
  { code: '+1242', flag: '🇧🇸', label: 'BS', name: 'Bahamas' },
  { code: '+880', flag: '🇧🇩', label: 'BD', name: 'Bangladesh' },
  { code: '+1246', flag: '🇧🇧', label: 'BB', name: 'Barbados' },
  { code: '+375', flag: '🇧🇾', label: 'BY', name: 'Belarus' },
  { code: '+32', flag: '🇧🇪', label: 'BE', name: 'Belgium' },
  { code: '+501', flag: '🇧🇿', label: 'BZ', name: 'Belize' },
  { code: '+229', flag: '🇧🇯', label: 'BJ', name: 'Benin' },
  { code: '+975', flag: '🇧🇹', label: 'BT', name: 'Bhutan' },
  { code: '+591', flag: '🇧🇴', label: 'BO', name: 'Bolivia' },
  { code: '+387', flag: '🇧🇦', label: 'BA', name: 'Bosnia and Herzegovina' },
  { code: '+267', flag: '🇧🇼', label: 'BW', name: 'Botswana' },
  { code: '+55', flag: '🇧🇷', label: 'BR', name: 'Brazil' },
  { code: '+673', flag: '🇧🇳', label: 'BN', name: 'Brunei' },
  { code: '+359', flag: '🇧🇬', label: 'BG', name: 'Bulgaria' },
  { code: '+226', flag: '🇧🇫', label: 'BF', name: 'Burkina Faso' },
  { code: '+257', flag: '🇧🇮', label: 'BI', name: 'Burundi' },
  { code: '+855', flag: '🇰🇭', label: 'KH', name: 'Cambodia' },
  { code: '+237', flag: '🇨🇲', label: 'CM', name: 'Cameroon' },
  { code: '+1', flag: '🇨🇦', label: 'CA', name: 'Canada' },
  { code: '+238', flag: '🇨🇻', label: 'CV', name: 'Cape Verde' },
  { code: '+236', flag: '🇨🇫', label: 'CF', name: 'Central African Republic' },
  { code: '+235', flag: '🇹🇩', label: 'TD', name: 'Chad' },
  { code: '+56', flag: '🇨🇱', label: 'CL', name: 'Chile' },
  { code: '+86', flag: '🇨🇳', label: 'CN', name: 'China' },
  { code: '+57', flag: '🇨🇴', label: 'CO', name: 'Colombia' },
  { code: '+269', flag: '🇰🇲', label: 'KM', name: 'Comoros' },
  { code: '+242', flag: '🇨🇬', label: 'CG', name: 'Congo' },
  { code: '+506', flag: '🇨🇷', label: 'CR', name: 'Costa Rica' },
  { code: '+385', flag: '🇭🇷', label: 'HR', name: 'Croatia' },
  { code: '+53', flag: '🇨🇺', label: 'CU', name: 'Cuba' },
  { code: '+357', flag: '🇨🇾', label: 'CY', name: 'Cyprus' },
  { code: '+420', flag: '🇨🇿', label: 'CZ', name: 'Czech Republic' },
  { code: '+45', flag: '🇩🇰', label: 'DK', name: 'Denmark' },
  { code: '+253', flag: '🇩🇯', label: 'DJ', name: 'Djibouti' },
  { code: '+1767', flag: '🇩🇲', label: 'DM', name: 'Dominica' },
  { code: '+1809', flag: '🇩🇴', label: 'DO', name: 'Dominican Republic' },
  { code: '+593', flag: '🇪🇨', label: 'EC', name: 'Ecuador' },
  { code: '+503', flag: '🇸🇻', label: 'SV', name: 'El Salvador' },
  { code: '+240', flag: '🇬🇶', label: 'GQ', name: 'Equatorial Guinea' },
  { code: '+291', flag: '🇪🇷', label: 'ER', name: 'Eritrea' },
  { code: '+372', flag: '🇪🇪', label: 'EE', name: 'Estonia' },
  { code: '+268', flag: '🇸🇿', label: 'SZ', name: 'Eswatini' },
  { code: '+251', flag: '🇪🇹', label: 'ET', name: 'Ethiopia' },
  { code: '+679', flag: '🇫🇯', label: 'FJ', name: 'Fiji' },
  { code: '+358', flag: '🇫🇮', label: 'FI', name: 'Finland' },
  { code: '+33', flag: '🇫🇷', label: 'FR', name: 'France' },
  { code: '+241', flag: '🇬🇦', label: 'GA', name: 'Gabon' },
  { code: '+220', flag: '🇬🇲', label: 'GM', name: 'Gambia' },
  { code: '+995', flag: '🇬🇪', label: 'GE', name: 'Georgia' },
  { code: '+49', flag: '🇩🇪', label: 'DE', name: 'Germany' },
  { code: '+233', flag: '🇬🇭', label: 'GH', name: 'Ghana' },
  { code: '+30', flag: '🇬🇷', label: 'GR', name: 'Greece' },
  { code: '+1473', flag: '🇬🇩', label: 'GD', name: 'Grenada' },
  { code: '+502', flag: '🇬🇹', label: 'GT', name: 'Guatemala' },
  { code: '+224', flag: '🇬🇳', label: 'GN', name: 'Guinea' },
  { code: '+245', flag: '🇬🇼', label: 'GW', name: 'Guinea-Bissau' },
  { code: '+592', flag: '🇬🇾', label: 'GY', name: 'Guyana' },
  { code: '+509', flag: '🇭🇹', label: 'HT', name: 'Haiti' },
  { code: '+504', flag: '🇭🇳', label: 'HN', name: 'Honduras' },
  { code: '+36', flag: '🇭🇺', label: 'HU', name: 'Hungary' },
  { code: '+354', flag: '🇮🇸', label: 'IS', name: 'Iceland' },
  { code: '+91', flag: '🇮🇳', label: 'IN', name: 'India' },
  { code: '+62', flag: '🇮🇩', label: 'ID', name: 'Indonesia' },
  { code: '+98', flag: '🇮🇷', label: 'IR', name: 'Iran' },
  { code: '+964', flag: '🇮🇶', label: 'IQ', name: 'Iraq' },
  { code: '+353', flag: '🇮🇪', label: 'IE', name: 'Ireland' },
  { code: '+39', flag: '🇮🇹', label: 'IT', name: 'Italy' },
  { code: '+1876', flag: '🇯🇲', label: 'JM', name: 'Jamaica' },
  { code: '+81', flag: '🇯🇵', label: 'JP', name: 'Japan' },
  { code: '+7', flag: '🇰🇿', label: 'KZ', name: 'Kazakhstan' },
  { code: '+254', flag: '🇰🇪', label: 'KE', name: 'Kenya' },
  { code: '+686', flag: '🇰🇮', label: 'KI', name: 'Kiribati' },
  { code: '+383', flag: '🇽🇰', label: 'XK', name: 'Kosovo' },
  { code: '+996', flag: '🇰🇬', label: 'KG', name: 'Kyrgyzstan' },
  { code: '+856', flag: '🇱🇦', label: 'LA', name: 'Laos' },
  { code: '+371', flag: '🇱🇻', label: 'LV', name: 'Latvia' },
  { code: '+266', flag: '🇱🇸', label: 'LS', name: 'Lesotho' },
  { code: '+231', flag: '🇱🇷', label: 'LR', name: 'Liberia' },
  { code: '+218', flag: '🇱🇾', label: 'LY', name: 'Libya' },
  { code: '+423', flag: '🇱🇮', label: 'LI', name: 'Liechtenstein' },
  { code: '+370', flag: '🇱🇹', label: 'LT', name: 'Lithuania' },
  { code: '+352', flag: '🇱🇺', label: 'LU', name: 'Luxembourg' },
  { code: '+261', flag: '🇲🇬', label: 'MG', name: 'Madagascar' },
  { code: '+265', flag: '🇲🇼', label: 'MW', name: 'Malawi' },
  { code: '+60', flag: '🇲🇾', label: 'MY', name: 'Malaysia' },
  { code: '+960', flag: '🇲🇻', label: 'MV', name: 'Maldives' },
  { code: '+223', flag: '🇲🇱', label: 'ML', name: 'Mali' },
  { code: '+356', flag: '🇲🇹', label: 'MT', name: 'Malta' },
  { code: '+692', flag: '🇲🇭', label: 'MH', name: 'Marshall Islands' },
  { code: '+222', flag: '🇲🇷', label: 'MR', name: 'Mauritania' },
  { code: '+230', flag: '🇲🇺', label: 'MU', name: 'Mauritius' },
  { code: '+52', flag: '🇲🇽', label: 'MX', name: 'Mexico' },
  { code: '+691', flag: '🇫🇲', label: 'FM', name: 'Micronesia' },
  { code: '+373', flag: '🇲🇩', label: 'MD', name: 'Moldova' },
  { code: '+377', flag: '🇲🇨', label: 'MC', name: 'Monaco' },
  { code: '+976', flag: '🇲🇳', label: 'MN', name: 'Mongolia' },
  { code: '+382', flag: '🇲🇪', label: 'ME', name: 'Montenegro' },
  { code: '+212', flag: '🇲🇦', label: 'MA', name: 'Morocco' },
  { code: '+258', flag: '🇲🇿', label: 'MZ', name: 'Mozambique' },
  { code: '+95', flag: '🇲🇲', label: 'MM', name: 'Myanmar' },
  { code: '+264', flag: '🇳🇦', label: 'NA', name: 'Namibia' },
  { code: '+674', flag: '🇳🇷', label: 'NR', name: 'Nauru' },
  { code: '+977', flag: '🇳🇵', label: 'NP', name: 'Nepal' },
  { code: '+31', flag: '🇳🇱', label: 'NL', name: 'Netherlands' },
  { code: '+64', flag: '🇳🇿', label: 'NZ', name: 'New Zealand' },
  { code: '+505', flag: '🇳🇮', label: 'NI', name: 'Nicaragua' },
  { code: '+227', flag: '🇳🇪', label: 'NE', name: 'Niger' },
  { code: '+234', flag: '🇳🇬', label: 'NG', name: 'Nigeria' },
  { code: '+850', flag: '🇰🇵', label: 'KP', name: 'North Korea' },
  { code: '+389', flag: '🇲🇰', label: 'MK', name: 'North Macedonia' },
  { code: '+47', flag: '🇳🇴', label: 'NO', name: 'Norway' },
  { code: '+92', flag: '🇵🇰', label: 'PK', name: 'Pakistan' },
  { code: '+680', flag: '🇵🇼', label: 'PW', name: 'Palau' },
  { code: '+970', flag: '🇵🇸', label: 'PS', name: 'Palestine' },
  { code: '+507', flag: '🇵🇦', label: 'PA', name: 'Panama' },
  { code: '+675', flag: '🇵🇬', label: 'PG', name: 'Papua New Guinea' },
  { code: '+595', flag: '🇵🇾', label: 'PY', name: 'Paraguay' },
  { code: '+51', flag: '🇵🇪', label: 'PE', name: 'Peru' },
  { code: '+63', flag: '🇵🇭', label: 'PH', name: 'Philippines' },
  { code: '+48', flag: '🇵🇱', label: 'PL', name: 'Poland' },
  { code: '+351', flag: '🇵🇹', label: 'PT', name: 'Portugal' },
  { code: '+40', flag: '🇷🇴', label: 'RO', name: 'Romania' },
  { code: '+7', flag: '🇷🇺', label: 'RU', name: 'Russia' },
  { code: '+250', flag: '🇷🇼', label: 'RW', name: 'Rwanda' },
  { code: '+1869', flag: '🇰🇳', label: 'KN', name: 'Saint Kitts and Nevis' },
  { code: '+1758', flag: '🇱🇨', label: 'LC', name: 'Saint Lucia' },
  { code: '+1784', flag: '🇻🇨', label: 'VC', name: 'Saint Vincent and the Grenadines' },
  { code: '+685', flag: '🇼🇸', label: 'WS', name: 'Samoa' },
  { code: '+378', flag: '🇸🇲', label: 'SM', name: 'San Marino' },
  { code: '+239', flag: '🇸🇹', label: 'ST', name: 'Sao Tome and Principe' },
  { code: '+221', flag: '🇸🇳', label: 'SN', name: 'Senegal' },
  { code: '+381', flag: '🇷🇸', label: 'RS', name: 'Serbia' },
  { code: '+248', flag: '🇸🇨', label: 'SC', name: 'Seychelles' },
  { code: '+232', flag: '🇸🇱', label: 'SL', name: 'Sierra Leone' },
  { code: '+65', flag: '🇸🇬', label: 'SG', name: 'Singapore' },
  { code: '+421', flag: '🇸🇰', label: 'SK', name: 'Slovakia' },
  { code: '+386', flag: '🇸🇮', label: 'SI', name: 'Slovenia' },
  { code: '+677', flag: '🇸🇧', label: 'SB', name: 'Solomon Islands' },
  { code: '+252', flag: '🇸🇴', label: 'SO', name: 'Somalia' },
  { code: '+27', flag: '🇿🇦', label: 'ZA', name: 'South Africa' },
  { code: '+82', flag: '🇰🇷', label: 'KR', name: 'South Korea' },
  { code: '+211', flag: '🇸🇸', label: 'SS', name: 'South Sudan' },
  { code: '+34', flag: '🇪🇸', label: 'ES', name: 'Spain' },
  { code: '+94', flag: '🇱🇰', label: 'LK', name: 'Sri Lanka' },
  { code: '+249', flag: '🇸🇩', label: 'SD', name: 'Sudan' },
  { code: '+597', flag: '🇸🇷', label: 'SR', name: 'Suriname' },
  { code: '+46', flag: '🇸🇪', label: 'SE', name: 'Sweden' },
  { code: '+41', flag: '🇨🇭', label: 'CH', name: 'Switzerland' },
  { code: '+963', flag: '🇸🇾', label: 'SY', name: 'Syria' },
  { code: '+886', flag: '🇹🇼', label: 'TW', name: 'Taiwan' },
  { code: '+992', flag: '🇹🇯', label: 'TJ', name: 'Tajikistan' },
  { code: '+255', flag: '🇹🇿', label: 'TZ', name: 'Tanzania' },
  { code: '+66', flag: '🇹🇭', label: 'TH', name: 'Thailand' },
  { code: '+670', flag: '🇹🇱', label: 'TL', name: 'Timor-Leste' },
  { code: '+228', flag: '🇹🇬', label: 'TG', name: 'Togo' },
  { code: '+676', flag: '🇹🇴', label: 'TO', name: 'Tonga' },
  { code: '+1868', flag: '🇹🇹', label: 'TT', name: 'Trinidad and Tobago' },
  { code: '+216', flag: '🇹🇳', label: 'TN', name: 'Tunisia' },
  { code: '+90', flag: '🇹🇷', label: 'TR', name: 'Turkey' },
  { code: '+993', flag: '🇹🇲', label: 'TM', name: 'Turkmenistan' },
  { code: '+688', flag: '🇹🇻', label: 'TV', name: 'Tuvalu' },
  { code: '+256', flag: '🇺🇬', label: 'UG', name: 'Uganda' },
  { code: '+380', flag: '🇺🇦', label: 'UA', name: 'Ukraine' },
  { code: '+44', flag: '🇬🇧', label: 'GB', name: 'United Kingdom' },
  { code: '+1', flag: '🇺🇸', label: 'US', name: 'United States' },
  { code: '+598', flag: '🇺🇾', label: 'UY', name: 'Uruguay' },
  { code: '+998', flag: '🇺🇿', label: 'UZ', name: 'Uzbekistan' },
  { code: '+678', flag: '🇻🇺', label: 'VU', name: 'Vanuatu' },
  { code: '+379', flag: '🇻🇦', label: 'VA', name: 'Vatican City' },
  { code: '+58', flag: '🇻🇪', label: 'VE', name: 'Venezuela' },
  { code: '+84', flag: '🇻🇳', label: 'VN', name: 'Vietnam' },
  { code: '+967', flag: '🇾🇪', label: 'YE', name: 'Yemen' },
  { code: '+260', flag: '🇿🇲', label: 'ZM', name: 'Zambia' },
  { code: '+263', flag: '🇿🇼', label: 'ZW', name: 'Zimbabwe' },
];

export default function BookingForm({ content }: { content: Record<string, string> }) {
  const c = content;
  const [form, setForm] = useState({ name: '', email: '', phone: '', time: '', notes: '' });
  const [countryCode, setCountryCode] = useState('+965');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.time) { setError(c['book.error']); return; }
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/appointment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, phone: `${countryCode} ${form.phone}`.trim() }),
      });
      if (!res.ok) throw new Error('Failed');
      setSuccess(true);
      setForm({ name: '', email: '', phone: '', time: '', notes: '' });
    } catch {
      setError(c['book.error']);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="text-center py-16 px-8 rounded-3xl" style={{ background: 'linear-gradient(135deg, #FDF0EC 0%, #FAE8EF 100%)' }}>
        <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl" style={{ background: '#FAE0EC' }}>
          💌
        </div>
        <h3 className="text-2xl font-bold mb-3" style={{ fontFamily: 'Georgia, serif', color: '#2D1B20' }}>
          {c['book.successTitle']}
        </h3>
        <p className="text-base leading-relaxed mb-8" style={{ color: '#7A6068' }}>
          {c['book.successMsg']}
        </p>
        <button
          onClick={() => setSuccess(false)}
          className="px-6 py-2.5 rounded-full text-sm font-semibold border-2 transition-colors hover:opacity-80"
          style={{ borderColor: '#BB5E86', color: '#BB5E86' }}
        >
          {c['book.bookAnother']}
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border p-6 space-y-5" style={{ borderColor: '#F0E8EC' }}>
      {/* Name */}
      <div>
        <label className="block text-sm font-medium mb-1" style={{ color: '#5C4048' }}>{c['book.name']} *</label>
        <input type="text" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
          className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-pink-400" />
      </div>

      {/* Phone */}
      <div>
        <label className="block text-sm font-medium mb-1" style={{ color: '#5C4048' }}>{c['book.phone']} *</label>
        <div className="flex gap-2">
          <select value={countryCode} onChange={e => setCountryCode(e.target.value)}
            className="border-2 border-gray-200 rounded-xl px-2 py-2.5 focus:outline-none focus:border-pink-400 bg-white shrink-0 w-28 truncate">
            {COUNTRY_CODES.map(cc => (
              <option key={cc.label} value={cc.code}>{cc.flag} {cc.name} ({cc.code})</option>
            ))}
          </select>
          <input type="tel" required value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })}
            className="flex-1 min-w-0 border-2 border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-pink-400" />
        </div>
      </div>

      {/* Email */}
      <div>
        <label className="block text-sm font-medium mb-1" style={{ color: '#5C4048' }}>{c['book.email']}</label>
        <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
          className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-pink-400" />
      </div>

      {/* Period toggle */}
      <div>
        <label className="block text-sm font-medium mb-3" style={{ color: '#5C4048' }}>{c['book.period']} *</label>
        <div className="grid grid-cols-2 gap-3">
          {[
            { value: 'morning', label: c['book.morning'], emoji: '🌅' },
            { value: 'evening', label: c['book.evening'], emoji: '🌙' },
          ].map(opt => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setForm({ ...form, time: opt.value })}
              className="flex flex-col items-center gap-2 py-4 rounded-2xl border-2 font-medium text-sm transition-all"
              style={{
                borderColor: form.time === opt.value ? '#BB5E86' : '#E5E7EB',
                background: form.time === opt.value ? '#FAE0EC' : 'white',
                color: form.time === opt.value ? '#BB5E86' : '#6B7280',
              }}
            >
              <span className="text-2xl">{opt.emoji}</span>
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Notes */}
      <div>
        <label className="block text-sm font-medium mb-1" style={{ color: '#5C4048' }}>{c['book.notes']}</label>
        <textarea rows={3} value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })}
          className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-pink-400 resize-none" />
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <button type="submit" disabled={loading}
        className="w-full text-white py-3 rounded-xl font-semibold transition-opacity hover:opacity-90 disabled:opacity-60"
        style={{ background: '#BB5E86' }}>
        {loading ? '...' : c['book.submit']}
      </button>
    </form>
  );
}
