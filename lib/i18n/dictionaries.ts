import type { Locale } from "@/store/localeStore";

/** Flat message keys for type-safe lookups */
export type MessageKey = keyof typeof messages.he;

const messages = {
  he: {
    "meta.title": "שערי רווחה",
    "meta.description": "לוח בקרה לפעילות שערי רווחה",

    "home.title": "שערי רווחה",
    "home.subtitle":
      "התחברו ללוח הבקרה התפעולי, או המשיכו לדף הבית.",
    "home.signIn": "התחברות",
    "home.dashboard": "לוח בקרה",

    "login.brandSubtitle": "לוח בקרה תפעולי",
    "login.heading": "התחברות",
    "login.hint": "השתמשו בפרטי הגישה של שערי רווחה.",
    "login.username": "שם משתמש",
    "login.password": "סיסמה",
    "login.continue": "המשך",
    "login.signingIn": "מתחבר…",
    "login.policy": "בהמשך השימוש אתם מסכימים למדיניות הגישה בארגון.",
    "login.backHome": "חזרה לדף הבית",
    "login.placeholderUser": "שם משתמש",

    "login.toast.noToken": "לא הוחזר אסימון.",
    "login.toast.signedIn": "התחברתם בהצלחה",
    "login.toast.loginFailed": "ההתחברות נכשלה",
    "login.toast.requestFailed": "הבקשה נכשלה",

    "common.loading": "טוען…",
    "common.requestFailed": "הבקשה נכשלה",

    "dashboard.nav.overview": "סקירה",
    "dashboard.nav.reports": "דוחות סטטוס",
    "dashboard.header": "לוח בקרה",
    "dashboard.logout": "התנתקות",
    "dashboard.openMenu": "פתיחת תפריט",
    "dashboard.closeMenu": "סגירת תפריט",

    "overview.title": "סקירה",
    "overview.subtitle":
      "בחרו סניף, קופה, טווח תאריכים וטענו עסקאות חיות מהשרת. סננו מקומית או בצעו חיפוש עמוק.",
    "overview.branchStations": "סניף וקופה",
    "overview.branch": "סניף",
    "overview.stationSelect": "בחירת קופה",
    "overview.stationPlaceholder": "— בחרו קופה —",
    "overview.noBranches": "אין סניפים",
    "overview.noStations": "אין קופות לסניף זה.",
    "overview.transactions": "עסקאות",
    "overview.dateStart": "תאריך התחלה",
    "overview.dateEnd": "תאריך סיום",
    "overview.fetchData": "טען נתונים",
    "overview.searchCard": "חיפוש לפי מספר כרטיס",
    "overview.searchAmount": "חיפוש לפי סכום",
    "overview.placeholderCard": "חלק ממספר הכרטיס או מלא",
    "overview.placeholderAmount": "סכום מדויק",
    "overview.deepTitle": "לא נמצא מקומית — חיפוש בשרת החיצוני",
    "overview.deepHint":
      "שולף 30 יום אחרונים מה-API החי ומסנן לפי כרטיס וסכום.",
    "overview.deepButton": "חיפוש עמוק בשרת החיצוני",
    "overview.deepSearching": "מחפש…",
    "overview.showingRows": "מציג {filtered} מתוך {total} שורות שנטענו",
    "overview.afterFilter": " (אחרי סינון מקומי)",
    "overview.branchFallback": "סניף",
    "overview.toast.branchesError": "לא ניתן לטעון סניפים",
    "overview.toast.stationsError": "לא ניתן לטעון תחנות",
    "overview.toast.txLoaded": "עסקאות נטענו",
    "overview.toast.txRows": "{count} שורות.",
    "overview.toast.txError": "לא ניתן לטעון עסקאות",
    "overview.toast.deepDone": "חיפוש עמוק הושלם",
    "overview.toast.deepMatches": "{count} התאמות ב־30 הימים האחרונים.",
    "overview.toast.deepError": "חיפוש עמוק נכשל",

    "reports.title": "דוחות סטטוס",
    "reports.subtitle": "סננו עסקאות לפי טווח תאריכים ומצב תהליך (נתונים חיים).",
    "reports.dateStart": "תאריך התחלה",
    "reports.dateEnd": "תאריך סיום",
    "reports.branch": "סניף",
    "reports.station": "קופה",
    "reports.stationPlaceholder": "— בחרו קופה —",
    "reports.noBranches": "אין סניפים",
    "reports.searchCardLocal": "חיפוש לפי כרטיס",
    "reports.searchAmountLocal": "חיפוש לפי סכום",
    "reports.filteredHint": "מציג {filtered} מתוך {total} שורות (אחרי סינון מקומי)",
    "reports.emptyFilter": "אין תוצאות התואמות לסינון המקומי.",
    "reports.status": "סטטוס",
    "reports.loadReport": "טען דוח",
    "reports.loading": "טוען…",
    "reports.empty": "אין נתונים עדיין. בחרו מסננים ולחצו «טען דוח».",
    "reports.toast.loaded": "הדוח נטען",
    "reports.toast.rows": "{count} שורות.",
    "reports.toast.error": "לא ניתן לטעון את הדוח",

    "table.empty": "אין עסקאות להצגה.",
    "table.colId": "מזהה",
    "table.colWhen": "מועד",
    "table.colCard": "כרטיס",
    "table.colAmount": "סכום",
    "table.colStatus": "סטטוס",

    "status.completed": "הושלם",
    "status.error": "שגיאה",
    "status.canceled": "בוטל",
    "status.payment": "תשלום",
    "status.started": "התחיל",
    "status.created": "נוצר",

    "language.switchToEnglish": "English",
    "language.switchToHebrew": "עברית",
    "language.aria": "החלפת שפה",

    "auth.loading": "טוען…",
  },
  en: {
    "meta.title": "Shaarei Revacha",
    "meta.description": "Shaarei Revacha operations dashboard",

    "home.title": "Shaarei Revacha",
    "home.subtitle": "Sign in to open the operations dashboard, or continue to the home page.",
    "home.signIn": "Sign in",
    "home.dashboard": "Dashboard",

    "login.brandSubtitle": "Operations dashboard",
    "login.heading": "Sign in",
    "login.hint": "Use your Shaarei Revacha credentials.",
    "login.username": "Username",
    "login.password": "Password",
    "login.continue": "Continue",
    "login.signingIn": "Signing in…",
    "login.policy": "By continuing you agree to your organization's access policies.",
    "login.backHome": "Back to home",
    "login.placeholderUser": "username",

    "login.toast.noToken": "No token returned.",
    "login.toast.signedIn": "Signed in",
    "login.toast.loginFailed": "Login failed",
    "login.toast.requestFailed": "Request failed",

    "common.loading": "Loading…",
    "common.requestFailed": "Request failed",

    "dashboard.nav.overview": "Overview",
    "dashboard.nav.reports": "Status Reports",
    "dashboard.header": "Dashboard",
    "dashboard.logout": "Logout",
    "dashboard.openMenu": "Open menu",
    "dashboard.closeMenu": "Close menu",

    "overview.title": "Overview",
    "overview.subtitle":
      "Pick a branch, register, and date range to load live transactions from the API. Filter locally or run a deep search.",
    "overview.branchStations": "Branch & register",
    "overview.branch": "Branch",
    "overview.stationSelect": "Register (station)",
    "overview.stationPlaceholder": "— Select register —",
    "overview.noBranches": "No branches",
    "overview.noStations": "No registers for this branch.",
    "overview.transactions": "Transactions",
    "overview.dateStart": "Start date",
    "overview.dateEnd": "End date",
    "overview.fetchData": "Fetch Data",
    "overview.searchCard": "Search by Card Number",
    "overview.searchAmount": "Search by Amount",
    "overview.placeholderCard": "Partial or full card number",
    "overview.placeholderAmount": "Exact amount",
    "overview.deepTitle": "Not found locally. Deep search on external server",
    "overview.deepHint":
      "Fetches the last 30 days from the live API and filters by card and amount.",
    "overview.deepButton": "Deep Search in External Server",
    "overview.deepSearching": "Searching…",
    "overview.showingRows": "Showing {filtered} of {total} loaded row(s)",
    "overview.afterFilter": " (after local filter)",
    "overview.branchFallback": "Branch",
    "overview.toast.branchesError": "Could not load branches",
    "overview.toast.stationsError": "Could not load stations",
    "overview.toast.txLoaded": "Transactions loaded",
    "overview.toast.txRows": "{count} row(s).",
    "overview.toast.txError": "Could not load transactions",
    "overview.toast.deepDone": "Deep search complete",
    "overview.toast.deepMatches": "{count} match(es) in the last 30 days.",
    "overview.toast.deepError": "Deep search failed",

    "reports.title": "Status Reports",
    "reports.subtitle": "Filter live transactions by date range and workflow state.",
    "reports.dateStart": "Start date",
    "reports.dateEnd": "End date",
    "reports.branch": "Branch",
    "reports.station": "Register",
    "reports.stationPlaceholder": "— Select register —",
    "reports.noBranches": "No branches",
    "reports.searchCardLocal": "Search by card",
    "reports.searchAmountLocal": "Search by amount",
    "reports.filteredHint": "Showing {filtered} of {total} rows (after local filter)",
    "reports.emptyFilter": "No rows match the local filter.",
    "reports.status": "Status",
    "reports.loadReport": "Load report",
    "reports.loading": "Loading…",
    "reports.empty": "No data yet. Choose filters and click \"Load report\".",
    "reports.toast.loaded": "Report loaded",
    "reports.toast.rows": "{count} row(s).",
    "reports.toast.error": "Could not load report",

    "table.empty": "No transactions to display.",
    "table.colId": "ID",
    "table.colWhen": "When",
    "table.colCard": "Card",
    "table.colAmount": "Amount",
    "table.colStatus": "Status",

    "status.completed": "completed",
    "status.error": "error",
    "status.canceled": "canceled",
    "status.payment": "payment",
    "status.started": "started",
    "status.created": "created",

    "language.switchToEnglish": "English",
    "language.switchToHebrew": "עברית",
    "language.aria": "Change language",

    "auth.loading": "Loading…",
  },
} as const;

export function translate(
  locale: Locale,
  key: MessageKey,
  vars?: Record<string, string | number>,
): string {
  const primary = messages[locale];
  let s: string | undefined = primary[key];
  if (typeof s !== "string") {
    s = messages.en[key];
  }
  if (typeof s !== "string") {
    return String(key);
  }
  if (vars) {
    for (const [k, v] of Object.entries(vars)) {
      s = s.replaceAll(`{${k}}`, String(v));
    }
  }
  return s;
}
