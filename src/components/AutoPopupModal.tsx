import React, { useState } from "react";
import { ChevronLeft, ChevronRight, X, Check, Globe, Briefcase, Users, Clock, Users2, Share2, GraduationCap, UserPlus } from "lucide-react";

interface AutoPopupModalProps {
  onClose: () => void;
  userId: string;
  onComplete?: () => void;
}

// Country list with flag image URLs
const countries = [
  { name: "Afghanistan", flagUrl: "https://flagcdn.com/w320/af.png", code: "AF" },
  { name: "Albania", flagUrl: "https://flagcdn.com/w320/al.png", code: "AL" },
  { name: "Algeria", flagUrl: "https://flagcdn.com/w320/dz.png", code: "DZ" },
  { name: "Andorra", flagUrl: "https://flagcdn.com/w320/ad.png", code: "AD" },
  { name: "Angola", flagUrl: "https://flagcdn.com/w320/ao.png", code: "AO" },
  { name: "Antigua and Barbuda", flagUrl: "https://flagcdn.com/w320/ag.png", code: "AG" },
  { name: "Argentina", flagUrl: "https://flagcdn.com/w320/ar.png", code: "AR" },
  { name: "Armenia", flagUrl: "https://flagcdn.com/w320/am.png", code: "AM" },
  { name: "Australia", flagUrl: "https://flagcdn.com/w320/au.png", code: "AU" },
  { name: "Austria", flagUrl: "https://flagcdn.com/w320/at.png", code: "AT" },
  { name: "Azerbaijan", flagUrl: "https://flagcdn.com/w320/az.png", code: "AZ" },
  { name: "Bahamas", flagUrl: "https://flagcdn.com/w320/bs.png", code: "BS" },
  { name: "Bahrain", flagUrl: "https://flagcdn.com/w320/bh.png", code: "BH" },
  { name: "Bangladesh", flagUrl: "https://flagcdn.com/w320/bd.png", code: "BD" },
  { name: "Barbados", flagUrl: "https://flagcdn.com/w320/bb.png", code: "BB" },
  { name: "Belarus", flagUrl: "https://flagcdn.com/w320/by.png", code: "BY" },
  { name: "Belgium", flagUrl: "https://flagcdn.com/w320/be.png", code: "BE" },
  { name: "Belize", flagUrl: "https://flagcdn.com/w320/bz.png", code: "BZ" },
  { name: "Benin", flagUrl: "https://flagcdn.com/w320/bj.png", code: "BJ" },
  { name: "Bhutan", flagUrl: "https://flagcdn.com/w320/bt.png", code: "BT" },
  { name: "Bolivia", flagUrl: "https://flagcdn.com/w320/bo.png", code: "BO" },
  { name: "Bosnia and Herzegovina", flagUrl: "https://flagcdn.com/w320/ba.png", code: "BA" },
  { name: "Botswana", flagUrl: "https://flagcdn.com/w320/bw.png", code: "BW" },
  { name: "Brazil", flagUrl: "https://flagcdn.com/w320/br.png", code: "BR" },
  { name: "Brunei", flagUrl: "https://flagcdn.com/w320/bn.png", code: "BN" },
  { name: "Bulgaria", flagUrl: "https://flagcdn.com/w320/bg.png", code: "BG" },
  { name: "Burkina Faso", flagUrl: "https://flagcdn.com/w320/bf.png", code: "BF" },
  { name: "Burundi", flagUrl: "https://flagcdn.com/w320/bi.png", code: "BI" },
  { name: "Cambodia", flagUrl: "https://flagcdn.com/w320/kh.png", code: "KH" },
  { name: "Cameroon", flagUrl: "https://flagcdn.com/w320/cm.png", code: "CM" },
  { name: "Canada", flagUrl: "https://flagcdn.com/w320/ca.png", code: "CA" },
  { name: "Cape Verde", flagUrl: "https://flagcdn.com/w320/cv.png", code: "CV" },
  { name: "Central African Republic", flagUrl: "https://flagcdn.com/w320/cf.png", code: "CF" },
  { name: "Chad", flagUrl: "https://flagcdn.com/w320/td.png", code: "TD" },
  { name: "Chile", flagUrl: "https://flagcdn.com/w320/cl.png", code: "CL" },
  { name: "China", flagUrl: "https://flagcdn.com/w320/cn.png", code: "CN" },
  { name: "Colombia", flagUrl: "https://flagcdn.com/w320/co.png", code: "CO" },
  { name: "Comoros", flagUrl: "https://flagcdn.com/w320/km.png", code: "KM" },
  { name: "Congo", flagUrl: "https://flagcdn.com/w320/cg.png", code: "CG" },
  { name: "Costa Rica", flagUrl: "https://flagcdn.com/w320/cr.png", code: "CR" },
  { name: "Croatia", flagUrl: "https://flagcdn.com/w320/hr.png", code: "HR" },
  { name: "Cuba", flagUrl: "https://flagcdn.com/w320/cu.png", code: "CU" },
  { name: "Cyprus", flagUrl: "https://flagcdn.com/w320/cy.png", code: "CY" },
  { name: "Czech Republic", flagUrl: "https://flagcdn.com/w320/cz.png", code: "CZ" },
  { name: "Denmark", flagUrl: "https://flagcdn.com/w320/dk.png", code: "DK" },
  { name: "Djibouti", flagUrl: "https://flagcdn.com/w320/dj.png", code: "DJ" },
  { name: "Dominica", flagUrl: "https://flagcdn.com/w320/dm.png", code: "DM" },
  { name: "Dominican Republic", flagUrl: "https://flagcdn.com/w320/do.png", code: "DO" },
  { name: "Ecuador", flagUrl: "https://flagcdn.com/w320/ec.png", code: "EC" },
  { name: "Egypt", flagUrl: "https://flagcdn.com/w320/eg.png", code: "EG" },
  { name: "El Salvador", flagUrl: "https://flagcdn.com/w320/sv.png", code: "SV" },
  { name: "Equatorial Guinea", flagUrl: "https://flagcdn.com/w320/gq.png", code: "GQ" },
  { name: "Eritrea", flagUrl: "https://flagcdn.com/w320/er.png", code: "ER" },
  { name: "Estonia", flagUrl: "https://flagcdn.com/w320/ee.png", code: "EE" },
  { name: "Eswatini", flagUrl: "https://flagcdn.com/w320/sz.png", code: "SZ" },
  { name: "Ethiopia", flagUrl: "https://flagcdn.com/w320/et.png", code: "ET" },
  { name: "Fiji", flagUrl: "https://flagcdn.com/w320/fj.png", code: "FJ" },
  { name: "Finland", flagUrl: "https://flagcdn.com/w320/fi.png", code: "FI" },
  { name: "France", flagUrl: "https://flagcdn.com/w320/fr.png", code: "FR" },
  { name: "Gabon", flagUrl: "https://flagcdn.com/w320/ga.png", code: "GA" },
  { name: "Gambia", flagUrl: "https://flagcdn.com/w320/gm.png", code: "GM" },
  { name: "Georgia", flagUrl: "https://flagcdn.com/w320/ge.png", code: "GE" },
  { name: "Germany", flagUrl: "https://flagcdn.com/w320/de.png", code: "DE" },
  { name: "Ghana", flagUrl: "https://flagcdn.com/w320/gh.png", code: "GH" },
  { name: "Greece", flagUrl: "https://flagcdn.com/w320/gr.png", code: "GR" },
  { name: "Grenada", flagUrl: "https://flagcdn.com/w320/gd.png", code: "GD" },
  { name: "Guatemala", flagUrl: "https://flagcdn.com/w320/gt.png", code: "GT" },
  { name: "Guinea", flagUrl: "https://flagcdn.com/w320/gn.png", code: "GN" },
  { name: "Guinea-Bissau", flagUrl: "https://flagcdn.com/w320/gw.png", code: "GW" },
  { name: "Guyana", flagUrl: "https://flagcdn.com/w320/gy.png", code: "GY" },
  { name: "Haiti", flagUrl: "https://flagcdn.com/w320/ht.png", code: "HT" },
  { name: "Honduras", flagUrl: "https://flagcdn.com/w320/hn.png", code: "HN" },
  { name: "Hungary", flagUrl: "https://flagcdn.com/w320/hu.png", code: "HU" },
  { name: "Iceland", flagUrl: "https://flagcdn.com/w320/is.png", code: "IS" },
  { name: "India", flagUrl: "https://flagcdn.com/w320/in.png", code: "IN" },
  { name: "Indonesia", flagUrl: "https://flagcdn.com/w320/id.png", code: "ID" },
  { name: "Iran", flagUrl: "https://flagcdn.com/w320/ir.png", code: "IR" },
  { name: "Iraq", flagUrl: "https://flagcdn.com/w320/iq.png", code: "IQ" },
  { name: "Ireland", flagUrl: "https://flagcdn.com/w320/ie.png", code: "IE" },
  { name: "Israel", flagUrl: "https://flagcdn.com/w320/il.png", code: "IL" },
  { name: "Italy", flagUrl: "https://flagcdn.com/w320/it.png", code: "IT" },
  { name: "Jamaica", flagUrl: "https://flagcdn.com/w320/jm.png", code: "JM" },
  { name: "Japan", flagUrl: "https://flagcdn.com/w320/jp.png", code: "JP" },
  { name: "Jordan", flagUrl: "https://flagcdn.com/w320/jo.png", code: "JO" },
  { name: "Kazakhstan", flagUrl: "https://flagcdn.com/w320/kz.png", code: "KZ" },
  { name: "Kenya", flagUrl: "https://flagcdn.com/w320/ke.png", code: "KE" },
  { name: "Kiribati", flagUrl: "https://flagcdn.com/w320/ki.png", code: "KI" },
  { name: "Korea, North", flagUrl: "https://flagcdn.com/w320/kp.png", code: "KP" },
  { name: "Korea, South", flagUrl: "https://flagcdn.com/w320/kr.png", code: "KR" },
  { name: "Kosovo", flagUrl: "https://flagcdn.com/w320/xk.png", code: "XK" },
  { name: "Kuwait", flagUrl: "https://flagcdn.com/w320/kw.png", code: "KW" },
  { name: "Kyrgyzstan", flagUrl: "https://flagcdn.com/w320/kg.png", code: "KG" },
  { name: "Laos", flagUrl: "https://flagcdn.com/w320/la.png", code: "LA" },
  { name: "Latvia", flagUrl: "https://flagcdn.com/w320/lv.png", code: "LV" },
  { name: "Lebanon", flagUrl: "https://flagcdn.com/w320/lb.png", code: "LB" },
  { name: "Lesotho", flagUrl: "https://flagcdn.com/w320/ls.png", code: "LS" },
  { name: "Liberia", flagUrl: "https://flagcdn.com/w320/lr.png", code: "LR" },
  { name: "Libya", flagUrl: "https://flagcdn.com/w320/ly.png", code: "LY" },
  { name: "Liechtenstein", flagUrl: "https://flagcdn.com/w320/li.png", code: "LI" },
  { name: "Lithuania", flagUrl: "https://flagcdn.com/w320/lt.png", code: "LT" },
  { name: "Luxembourg", flagUrl: "https://flagcdn.com/w320/lu.png", code: "LU" },
  { name: "Madagascar", flagUrl: "https://flagcdn.com/w320/mg.png", code: "MG" },
  { name: "Malawi", flagUrl: "https://flagcdn.com/w320/mw.png", code: "MW" },
  { name: "Malaysia", flagUrl: "https://flagcdn.com/w320/my.png", code: "MY" },
  { name: "Maldives", flagUrl: "https://flagcdn.com/w320/mv.png", code: "MV" },
  { name: "Mali", flagUrl: "https://flagcdn.com/w320/ml.png", code: "ML" },
  { name: "Malta", flagUrl: "https://flagcdn.com/w320/mt.png", code: "MT" },
  { name: "Marshall Islands", flagUrl: "https://flagcdn.com/w320/mh.png", code: "MH" },
  { name: "Mauritania", flagUrl: "https://flagcdn.com/w320/mr.png", code: "MR" },
  { name: "Mauritius", flagUrl: "https://flagcdn.com/w320/mu.png", code: "MU" },
  { name: "Mexico", flagUrl: "https://flagcdn.com/w320/mx.png", code: "MX" },
  { name: "Micronesia", flagUrl: "https://flagcdn.com/w320/fm.png", code: "FM" },
  { name: "Moldova", flagUrl: "https://flagcdn.com/w320/md.png", code: "MD" },
  { name: "Monaco", flagUrl: "https://flagcdn.com/w320/mc.png", code: "MC" },
  { name: "Mongolia", flagUrl: "https://flagcdn.com/w320/mn.png", code: "MN" },
  { name: "Montenegro", flagUrl: "https://flagcdn.com/w320/me.png", code: "ME" },
  { name: "Morocco", flagUrl: "https://flagcdn.com/w320/ma.png", code: "MA" },
  { name: "Mozambique", flagUrl: "https://flagcdn.com/w320/mz.png", code: "MZ" },
  { name: "Myanmar", flagUrl: "https://flagcdn.com/w320/mm.png", code: "MM" },
  { name: "Namibia", flagUrl: "https://flagcdn.com/w320/na.png", code: "NA" },
  { name: "Nauru", flagUrl: "https://flagcdn.com/w320/nr.png", code: "NR" },
  { name: "Nepal", flagUrl: "https://flagcdn.com/w320/np.png", code: "NP" },
  { name: "Netherlands", flagUrl: "https://flagcdn.com/w320/nl.png", code: "NL" },
  { name: "New Zealand", flagUrl: "https://flagcdn.com/w320/nz.png", code: "NZ" },
  { name: "Nicaragua", flagUrl: "https://flagcdn.com/w320/ni.png", code: "NI" },
  { name: "Niger", flagUrl: "https://flagcdn.com/w320/ne.png", code: "NE" },
  { name: "Nigeria", flagUrl: "https://flagcdn.com/w320/ng.png", code: "NG" },
  { name: "North Macedonia", flagUrl: "https://flagcdn.com/w320/mk.png", code: "MK" },
  { name: "Norway", flagUrl: "https://flagcdn.com/w320/no.png", code: "NO" },
  { name: "Oman", flagUrl: "https://flagcdn.com/w320/om.png", code: "OM" },
  { name: "Pakistan", flagUrl: "https://flagcdn.com/w320/pk.png", code: "PK" },
  { name: "Palau", flagUrl: "https://flagcdn.com/w320/pw.png", code: "PW" },
  { name: "Palestine", flagUrl: "https://flagcdn.com/w320/ps.png", code: "PS" },
  { name: "Panama", flagUrl: "https://flagcdn.com/w320/pa.png", code: "PA" },
  { name: "Papua New Guinea", flagUrl: "https://flagcdn.com/w320/pg.png", code: "PG" },
  { name: "Paraguay", flagUrl: "https://flagcdn.com/w320/py.png", code: "PY" },
  { name: "Peru", flagUrl: "https://flagcdn.com/w320/pe.png", code: "PE" },
  { name: "Philippines", flagUrl: "https://flagcdn.com/w320/ph.png", code: "PH" },
  { name: "Poland", flagUrl: "https://flagcdn.com/w320/pl.png", code: "PL" },
  { name: "Portugal", flagUrl: "https://flagcdn.com/w320/pt.png", code: "PT" },
  { name: "Qatar", flagUrl: "https://flagcdn.com/w320/qa.png", code: "QA" },
  { name: "Romania", flagUrl: "https://flagcdn.com/w320/ro.png", code: "RO" },
  { name: "Russia", flagUrl: "https://flagcdn.com/w320/ru.png", code: "RU" },
  { name: "Rwanda", flagUrl: "https://flagcdn.com/w320/rw.png", code: "RW" },
  { name: "Saint Kitts and Nevis", flagUrl: "https://flagcdn.com/w320/kn.png", code: "KN" },
  { name: "Saint Lucia", flagUrl: "https://flagcdn.com/w320/lc.png", code: "LC" },
  { name: "Saint Vincent and the Grenadines", flagUrl: "https://flagcdn.com/w320/vc.png", code: "VC" },
  { name: "Samoa", flagUrl: "https://flagcdn.com/w320/ws.png", code: "WS" },
  { name: "San Marino", flagUrl: "https://flagcdn.com/w320/sm.png", code: "SM" },
  { name: "Sao Tome and Principe", flagUrl: "https://flagcdn.com/w320/st.png", code: "ST" },
  { name: "Saudi Arabia", flagUrl: "https://flagcdn.com/w320/sa.png", code: "SA" },
  { name: "Senegal", flagUrl: "https://flagcdn.com/w320/sn.png", code: "SN" },
  { name: "Serbia", flagUrl: "https://flagcdn.com/w320/rs.png", code: "RS" },
  { name: "Seychelles", flagUrl: "https://flagcdn.com/w320/sc.png", code: "SC" },
  { name: "Sierra Leone", flagUrl: "https://flagcdn.com/w320/sl.png", code: "SL" },
  { name: "Singapore", flagUrl: "https://flagcdn.com/w320/sg.png", code: "SG" },
  { name: "Slovakia", flagUrl: "https://flagcdn.com/w320/sk.png", code: "SK" },
  { name: "Slovenia", flagUrl: "https://flagcdn.com/w320/si.png", code: "SI" },
  { name: "Solomon Islands", flagUrl: "https://flagcdn.com/w320/sb.png", code: "SB" },
  { name: "Somalia", flagUrl: "https://flagcdn.com/w320/so.png", code: "SO" },
  { name: "South Africa", flagUrl: "https://flagcdn.com/w320/za.png", code: "ZA" },
  { name: "South Sudan", flagUrl: "https://flagcdn.com/w320/ss.png", code: "SS" },
  { name: "Spain", flagUrl: "https://flagcdn.com/w320/es.png", code: "ES" },
  { name: "Sri Lanka", flagUrl: "https://flagcdn.com/w320/lk.png", code: "LK" },
  { name: "Sudan", flagUrl: "https://flagcdn.com/w320/sd.png", code: "SD" },
  { name: "Suriname", flagUrl: "https://flagcdn.com/w320/sr.png", code: "SR" },
  { name: "Sweden", flagUrl: "https://flagcdn.com/w320/se.png", code: "SE" },
  { name: "Switzerland", flagUrl: "https://flagcdn.com/w320/ch.png", code: "CH" },
  { name: "Syria", flagUrl: "https://flagcdn.com/w320/sy.png", code: "SY" },
  { name: "Taiwan", flagUrl: "https://flagcdn.com/w320/tw.png", code: "TW" },
  { name: "Tajikistan", flagUrl: "https://flagcdn.com/w320/tj.png", code: "TJ" },
  { name: "Tanzania", flagUrl: "https://flagcdn.com/w320/tz.png", code: "TZ" },
  { name: "Thailand", flagUrl: "https://flagcdn.com/w320/th.png", code: "TH" },
  { name: "Timor-Leste", flagUrl: "https://flagcdn.com/w320/tl.png", code: "TL" },
  { name: "Togo", flagUrl: "https://flagcdn.com/w320/tg.png", code: "TG" },
  { name: "Tonga", flagUrl: "https://flagcdn.com/w320/to.png", code: "TO" },
  { name: "Trinidad and Tobago", flagUrl: "https://flagcdn.com/w320/tt.png", code: "TT" },
  { name: "Tunisia", flagUrl: "https://flagcdn.com/w320/tn.png", code: "TN" },
  { name: "Turkey", flagUrl: "https://flagcdn.com/w320/tr.png", code: "TR" },
  { name: "Turkmenistan", flagUrl: "https://flagcdn.com/w320/tm.png", code: "TM" },
  { name: "Tuvalu", flagUrl: "https://flagcdn.com/w320/tv.png", code: "TV" },
  { name: "Uganda", flagUrl: "https://flagcdn.com/w320/ug.png", code: "UG" },
  { name: "Ukraine", flagUrl: "https://flagcdn.com/w320/ua.png", code: "UA" },
  { name: "United Arab Emirates", flagUrl: "https://flagcdn.com/w320/ae.png", code: "AE" },
  { name: "United Kingdom", flagUrl: "https://flagcdn.com/w320/gb.png", code: "GB" },
  { name: "United States", flagUrl: "https://flagcdn.com/w320/us.png", code: "US" },
  { name: "Uruguay", flagUrl: "https://flagcdn.com/w320/uy.png", code: "UY" },
  { name: "Uzbekistan", flagUrl: "https://flagcdn.com/w320/uz.png", code: "UZ" },
  { name: "Vanuatu", flagUrl: "https://flagcdn.com/w320/vu.png", code: "VU" },
  { name: "Vatican City", flagUrl: "https://flagcdn.com/w320/va.png", code: "VA" },
  { name: "Venezuela", flagUrl: "https://flagcdn.com/w320/ve.png", code: "VE" },
  { name: "Vietnam", flagUrl: "https://flagcdn.com/w320/vn.png", code: "VN" },
  { name: "Yemen", flagUrl: "https://flagcdn.com/w320/ye.png", code: "YE" },
  { name: "Zambia", flagUrl: "https://flagcdn.com/w320/zm.png", code: "ZM" },
  { name: "Zimbabwe", flagUrl: "https://flagcdn.com/w320/zw.png", code: "ZW" }
];

// Source of Knowledge options with icons
const sourceOptions = [
  { name: "Friends", icon: Users2 },
  { name: "Social Media", icon: Share2 },
  { name: "School/College", icon: GraduationCap },
  { name: "Other", icon: UserPlus }
];

const steps = [
  {
    title: "Country",
    question: "1. Which country do you live in?",
    options: countries.map(c => c.name),
    key: "country",
    icon: Globe,
    color: "from-blue-500 to-cyan-500",
    showFlags: true
  },
  {
    title: "Profession",
    question: "2. What is your profession?",
    options: [],
    key: "profession",
    icon: Briefcase,
    color: "from-orange-500 to-red-500",
    showInput: true
  },
  {
    title: "Source of Knowledge",
    question: "3. How did you hear about us?",
    options: sourceOptions,
    key: "source",
    icon: Users,
    color: "from-green-500 to-emerald-500",
    hasIcons: true
  },
  {
    title: "Work Time",
    question: "4. How much time do you work daily?",
    options: ["1 hour", "2 hours", "4 hours", "6 hours", "8 hours", "Never"],
    key: "studyTime",
    icon: Clock,
    color: "from-indigo-500 to-blue-500",
    showTimeInput: true,
  },
];

const AutoPopupModal: React.FC<AutoPopupModalProps> = ({ onClose, userId, onComplete }) => {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<{ [key: string]: string }>({});
  const [searchTerm, setSearchTerm] = useState("");
  const [professionSearch, setProfessionSearch] = useState("");
  const [workTimeInput, setWorkTimeInput] = useState("");

  const handleOptionSelect = (option: string) => {
    setAnswers(prev => ({ ...prev, [steps[step].key]: option }));
    // if (steps[step].showFlags) {
    //   setSearchTerm("");
    // }
    if (steps[step].showInput) {
      setProfessionSearch(option);
    }
  };

  const handleNext = async () => {
    if (step < steps.length - 1) {
      setStep(s => s + 1);
    } else {
      // Save to localStorage so StudentProfileDashboard can read it
      try {
        const profileData = {
          country: answers.country,
          profession: answers.profession,
          source: answers.source,
          studyTime: answers.studyTime,
        };
        
        // Save to localStorage using the userId prop
        window.localStorage.setItem(`student_profile_answers_${userId}`, JSON.stringify(profileData));
        
        // Also try to save to API if it exists
        await fetch("/api/student/profile", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(profileData),
        });
      } catch {
        // silently ignore — modal still closes
      }
      if (onComplete) onComplete();
      else onClose();
    }
  };

  const handlePrev = () => {
    if (step > 0) setStep(s => s - 1);
  };

  const progress = ((step + 1) / steps.length) * 100;
  const CurrentIcon = steps[step].icon;
  
  // Filter countries based on search
  const filteredCountries = countries.filter(country =>
    country.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get flag URL for a country
  const getCountryFlagUrl = (countryName: string) => {
    const country = countries.find(c => c.name === countryName);
    return country ? country.flagUrl : "";
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-xl animate-slide-up">
        {/* White Background */}
        <div className="absolute inset-0 bg-white rounded-xl shadow-xl" />
        
        {/* Content Container - White */}
        <div className="relative bg-white rounded-xl shadow-lg overflow-hidden max-h-[85vh] flex flex-col">
          {/* Close Button — hidden in blocking mode (onComplete present) */}
          {!onComplete && (
          <button
            onClick={onClose}
            className="absolute top-3 right-3 z-10 p-1.5 rounded-full bg-gray-100 hover:bg-gray-200 transition-all duration-200 group"
          >
            <X className="w-4 h-4 text-gray-600 group-hover:rotate-90 transition-transform duration-200" />
          </button>
          )}

          {/* Header with Gradient Bar */}
          <div className="relative pt-6 pb-3 px-6 flex-shrink-0">
            <div className="absolute top-0 left-0 right-0 h-1 bg-[#1ec28e]" />
            
            {/* Progress Bar */}
            <div className="mb-4">
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>Step {step + 1} of {steps.length}</span>
                <span>{Math.round(progress)}% Complete</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-[#1ec28e] rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {/* Icon and Title */}
            <div className="flex items-center gap-3 mb-3">
              <div className={`p-2.5 rounded-xl bg-gradient-to-r ${steps[step].color} shadow-lg`}>
                <CurrentIcon className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">
                  {steps[step].title}
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  Tell us about yourself
                </p>
              </div>
            </div>
          </div>

          {/* Question Section - Scrollable */}
          <div className="px-6 pb-4 flex-1 overflow-y-auto">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                {steps[step].question}
              </h3>
              
              {/* Search Bar for Country */}
              {steps[step].showFlags && (
                <div className="mb-3">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder=" Search country..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full px-3 py-1.5 pl-9 border border-gray-300 rounded-lg focus:outline-none focus:border-[#1ec28e] focus:ring-1 focus:ring-[#1ec28e]"
                    />
                    <span className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-400">
                      🔍
                    </span>
                  </div>
                </div>
              )}

              {/* Input Field for Profession */}
              {steps[step].showInput && (
                <div className="mb-3">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder=" Enter your profession..."
                      value={professionSearch}
                      onChange={(e) => {
                        setProfessionSearch(e.target.value);
                        const trimmedValue = e.target.value.trim();
                        if (trimmedValue.length >= 2) {
                          setAnswers(prev => ({ ...prev, [steps[step].key]: trimmedValue }));
                        } else {
                          setAnswers(prev => {
                            const newAnswers = { ...prev };
                            delete newAnswers[steps[step].key];
                            return newAnswers;
                          });
                        }
                      }}
                      className="w-full px-3 py-2 pl-9 border border-gray-300 rounded-lg focus:outline-none focus:border-[#1ec28e] focus:ring-2 focus:ring-[#1ec28e] text-base"
                    />
                    <span className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-400">
                      💼
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1.5">
                    Type your profession (e.g., Doctor, Engineer, Artist, Student, etc.) - Next button will activate when you enter at least 2 characters
                  </p>
                </div>
              )}
              
              {/* Work Time — custom input + preset chips */}
              {(steps[step] as { showTimeInput?: boolean }).showTimeInput && (
                <div className="mb-3 space-y-3">
                  {/* Custom input */}
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="e.g. 3 hours, 90 minutes, 1.5 hours..."
                      value={workTimeInput}
                      onChange={(e) => {
                        const val = e.target.value;
                        setWorkTimeInput(val);
                        const trimmed = val.trim();
                        if (trimmed.length >= 1) {
                          setAnswers(prev => ({ ...prev, [steps[step].key]: trimmed }));
                        } else {
                          setAnswers(prev => {
                            const n = { ...prev };
                            delete n[steps[step].key];
                            return n;
                          });
                        }
                      }}
                      className="w-full px-3 py-2 pl-9 border border-gray-300 rounded-lg focus:outline-none focus:border-[#1ec28e] focus:ring-2 focus:ring-[#1ec28e] text-sm"
                    />
                    <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400">⏱</span>
                  </div>
                  {/* Preset chips */}
                  <div className="flex flex-wrap gap-2">
                    {(steps[step].options as string[]).map((opt) => {
                      const isSelected = answers[steps[step].key] === opt;
                      return (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => {
                            setWorkTimeInput(opt);
                            setAnswers(prev => ({ ...prev, [steps[step].key]: opt }));
                          }}
                          className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-all duration-200 ${
                            isSelected
                              ? "bg-[#1ec28e] text-white border-[#1ec28e] shadow-sm"
                              : "bg-gray-50 text-gray-700 border-gray-200 hover:border-[#1ec28e] hover:text-[#1ec28e]"
                          }`}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                  <p className="text-xs text-gray-400">Select a preset or type your own time above</p>
                </div>
              )}

              {/* Options Grid - Don't show for profession input or time input */}
              {!steps[step].showInput && !(steps[step] as { showTimeInput?: boolean }).showTimeInput && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-80 overflow-y-auto pr-1">
                  {(steps[step].showFlags
                    ? filteredCountries.map((c) => ({ name: c.name, flagUrl: c.flagUrl, icon: null }))
                    : steps[step].hasIcons
                      ? (steps[step].options as Array<{ name: string; icon: React.ElementType | null }>).map((o) => ({ name: o.name, flagUrl: null, icon: o.icon }))
                      : (steps[step].options as string[]).map((opt) => ({ name: opt, flagUrl: null, icon: null }))
                  ).map((item) => {
                    const optionName = item.name;
                    const flagUrl = item.flagUrl;
                    const OptionIcon = item.icon;
                    const isSelected = answers[steps[step].key] === optionName;

                    return (
                      <button
                        key={optionName}
                        onClick={() => handleOptionSelect(optionName)}
                        className={`relative group overflow-hidden rounded-lg transition-all duration-300 ${isSelected ? "bg-[#1ec28e] text-white shadow-md transform scale-105" : "bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200 hover:border-[#1ec28e]"}`}
                      >
                        <div className="px-3 py-2 text-left font-medium flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {flagUrl && (
                              <img src={flagUrl} alt={`${optionName} flag`} className="w-5 h-5 object-cover rounded-sm shadow-sm" />
                            )}
                            {OptionIcon && (
                              <div className={`p-1 rounded ${isSelected ? "bg-white/20" : "bg-gray-100"}`}>
                                <OptionIcon className={`w-4 h-4 ${isSelected ? "text-white" : "text-[#1ec28e]"}`} />
                              </div>
                            )}
                            <span className="text-sm">{optionName}</span>
                          </div>
                          {isSelected && <Check className="w-4 h-4 text-white" />}
                        </div>
                        <div className={`absolute inset-0 bg-[#1ec28e] opacity-0 transition-opacity duration-300 pointer-events-none ${isSelected ? "opacity-0" : "group-hover:opacity-10"}`} />
                      </button>
                    );
                  })}
                </div>
              )}
              
              {steps[step].showFlags && filteredCountries.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No countries found
                </div>
              )}

              {/* Show selected country with flag for non-country steps */}
              {!steps[step].showFlags && answers.country && (
                <div className="mt-3 p-2 bg-gray-50 rounded-md flex items-center gap-2">
                  <span className="text-xs text-gray-600">Selected Country:</span>
                  <img 
                    src={getCountryFlagUrl(answers.country)} 
                    alt={`${answers.country} flag`}
                    className="w-5 h-5 object-cover rounded-sm shadow-sm"
                  />
                  <span className="font-medium text-gray-800 text-sm">{answers.country}</span>
                </div>
              )}
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between gap-3 mt-6">
              <button
                onClick={handlePrev}
                disabled={step === 0}
                className={`
                  flex items-center gap-1.5 px-4 py-1.5 rounded-lg font-medium transition-all duration-300 text-sm
                  ${step === 0 
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed" 
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:transform hover:-translate-x-1"
                  }
                `}
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                Previous
              </button>

              {step < steps.length - 1 ? (
                <button
                  onClick={handleNext}
                  disabled={!answers[steps[step].key]}
                  className={`
                    flex items-center gap-1.5 px-4 py-1.5 rounded-lg font-medium transition-all duration-300 text-sm
                    ${answers[steps[step].key]
                      ? "bg-[#1ec28e] text-white shadow-md hover:shadow-lg hover:transform hover:translate-x-1"
                      : "bg-gray-100 text-gray-400 cursor-not-allowed"
                    }
                  `}
                >
                  Next                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button
                  onClick={handleNext}
                  disabled={!answers[steps[step].key]}
                  className={`
                    flex items-center gap-1.5 px-4 py-1.5 rounded-lg font-medium transition-all duration-300 text-sm
                    ${answers[steps[step].key]
                      ? "bg-[#1ec28e] text-white shadow-md hover:shadow-xl hover:transform hover:scale-105"
                      : "bg-gray-100 text-gray-400 cursor-not-allowed"
                    }
                  `}
                >
                  Finish
                  <Check className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Progress Dots */}
            <div className="flex justify-center gap-1.5 mt-4">
              {steps.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => idx <= step && setStep(idx)}
                  className={`
                    transition-all duration-300 rounded-full
                    ${idx === step
                      ? "w-6 h-1.5 bg-[#1ec28e]"
                      : idx < step
                      ? "w-1.5 h-1.5 bg-[#1ec28e] opacity-60"
                      : "w-1.5 h-1.5 bg-gray-300"
                    }
                  `}
                  disabled={idx > step}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes bounceIn {
          0% {
            opacity: 0;
            transform: scale(0);
          }
          50% {
            opacity: 1;
            transform: scale(1.2);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-slide-up {
          animation: slideUp 0.4s ease-out;
        }

        .animate-bounce-in {
          animation: bounceIn 0.3s ease-out;
        }

        /* Custom Scrollbar */
        ::-webkit-scrollbar {
          width: 8px;
        }

        ::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }

        ::-webkit-scrollbar-thumb {
          background: #1ec28e;
          border-radius: 10px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: #19a376;
        }
      `}</style>
    </div>
  );
};

export default AutoPopupModal;