import React from 'react';
import {
  ShieldCheck,
  FileCheck2,
  Award,
  HeartPulse,
  Lock,
  CheckCircle,
  Building2,
  Home,
  UserCheck,
  PhoneCall,
  Scale
} from 'lucide-react';

export const VettingSafetyPage: React.FC = () => {
  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-8 animate-fadeIn">
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-850 to-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-2xl">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-3">
          <ShieldCheck className="w-4 h-4" />
          <span>The BookATrainer Gold Safety Standard</span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
          How We Vet Every Fitness Trainer for Safety &amp; Accreditation
        </h1>

        <p className="text-sm sm:text-base text-slate-300 mt-3 max-w-3xl leading-relaxed">
          Inviting a trainer into your private residence or meeting them at a local gym requires total trust. 
          That is why fewer than <strong className="text-emerald-400 font-semibold">12% of trainer applicants</strong> pass our rigorous 5-pillar vetting process.
        </p>

        <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-slate-950/70 border border-slate-800 p-3 rounded-xl text-center">
            <div className="text-xl sm:text-2xl font-black text-emerald-400">100%</div>
            <div className="text-[11px] text-slate-400 font-medium mt-0.5">Background Checked</div>
          </div>
          <div className="bg-slate-950/70 border border-slate-800 p-3 rounded-xl text-center">
            <div className="text-xl sm:text-2xl font-black text-teal-400">NCCA</div>
            <div className="text-[11px] text-slate-400 font-medium mt-0.5">Accredited Certifications</div>
          </div>
          <div className="bg-slate-950/70 border border-slate-800 p-3 rounded-xl text-center">
            <div className="text-xl sm:text-2xl font-black text-emerald-400">$1M+</div>
            <div className="text-[11px] text-slate-400 font-medium mt-0.5">Liability Insurance</div>
          </div>
          <div className="bg-slate-950/70 border border-slate-800 p-3 rounded-xl text-center">
            <div className="text-xl sm:text-2xl font-black text-teal-400">CPR/AED</div>
            <div className="text-[11px] text-slate-400 font-medium mt-0.5">Active First Aid Audited</div>
          </div>
        </div>
      </div>

      {/* Pillar 1: Criminal Background Checks */}
      <section className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 sm:p-7 space-y-4 shadow-md">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
            <FileCheck2 className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-emerald-400">Pillar 1 • Conducted Outside This App</div>
            <h2 className="text-xl sm:text-2xl font-bold text-white mt-0.5">
              Comprehensive Criminal Background Checks
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 leading-relaxed">
              All criminal background checks are conducted independently outside this application via industry-leading FCRA-compliant consumer reporting agencies (such as Checkr and Sterling).
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
          <div className="bg-slate-950/60 border border-slate-800/80 p-4 rounded-xl space-y-1.5">
            <div className="flex items-center gap-2 text-white font-semibold text-sm">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              <span>Multi-Jurisdictional History</span>
            </div>
            <p className="text-xs text-slate-400 leading-normal">
              7-year deep search covering county court records in every location the candidate has resided or worked, plus statewide repositories and federal district courts.
            </p>
          </div>

          <div className="bg-slate-950/60 border border-slate-800/80 p-4 rounded-xl space-y-1.5">
            <div className="flex items-center gap-2 text-white font-semibold text-sm">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              <span>Sex Offender &amp; Watchlists</span>
            </div>
            <p className="text-xs text-slate-400 leading-normal">
              Direct verification against the National Sex Offender Public Website (NSOPW) across all 50 states, plus domestic and international sanctions databases.
            </p>
          </div>

          <div className="bg-slate-950/60 border border-slate-800/80 p-4 rounded-xl space-y-1.5">
            <div className="flex items-center gap-2 text-white font-semibold text-sm">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              <span>Continuous Monitoring</span>
            </div>
            <p className="text-xs text-slate-400 leading-normal">
              Unlike static one-time checks, we maintain automated ongoing arrest alert feeds. Any disqualified infraction results in immediate account suspension.
            </p>
          </div>
        </div>

        <div className="bg-emerald-500/5 border border-emerald-500/20 p-3 rounded-xl flex items-center gap-3 text-xs text-emerald-300">
          <Scale className="w-5 h-5 shrink-0 text-emerald-400" />
          <span>
            <strong>Zero-Tolerance Disqualification:</strong> Candidates with violent felonies, harassment records, burglary, or reckless endangerment are permanently rejected.
          </span>
        </div>
      </section>

      {/* Pillar 2: Accredited Fitness Certifications */}
      <section className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 sm:p-7 space-y-4 shadow-md">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400 shrink-0">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-teal-400">Pillar 2 • Professional Credentials</div>
            <h2 className="text-xl sm:text-2xl font-bold text-white mt-0.5">
              Accreditation as Fitness Trainers
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 leading-relaxed">
              We exclusively recognize credentials issued by organizations accredited by the National Commission for Certifying Agencies (NCCA) or regionally accredited collegiate degrees in Exercise Science.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 pt-2">
          {[
            { org: 'NASM', name: 'National Academy of Sports Medicine', tag: 'CPT / PES / CES' },
            { org: 'NSCA', name: 'National Strength & Conditioning', tag: 'CSCS / CPT' },
            { org: 'ACSM', name: 'American College of Sports Medicine', tag: 'EP-C / CPT' },
            { org: 'ACE', name: 'American Council on Exercise', tag: 'CPT / MES' },
            { org: 'ISSA', name: 'International Sports Sciences', tag: 'Master Trainer' }
          ].map((item, idx) => (
            <div key={idx} className="bg-slate-950/70 border border-slate-800 p-3 rounded-xl text-center flex flex-col justify-between">
              <div>
                <div className="font-extrabold text-white text-base tracking-wide">{item.org}</div>
                <div className="text-[10px] text-slate-400 mt-1 leading-tight">{item.name}</div>
              </div>
              <div className="mt-2 text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 py-0.5 px-1.5 rounded">
                {item.tag}
              </div>
            </div>
          ))}
        </div>

        <div className="bg-slate-950/60 border border-slate-800 p-4 rounded-xl space-y-2 text-xs text-slate-300">
          <div className="font-semibold text-white flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-emerald-400" />
            <span>Primary-Source Credential Verification Process</span>
          </div>
          <p className="text-slate-400 leading-relaxed">
            Our onboarding team manually cross-checks credential ID numbers directly in the issuing registry database to confirm active status, continuing education units (CEU) compliance, and expiration dates.
          </p>
        </div>
      </section>

      {/* Pillar 3 & 4: In-Home / Gym Safety Protocols & Insurance */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Insurance */}
        <section className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">$1,000,000 Liability Coverage</h3>
              <p className="text-xs text-slate-400">Commercial protection for peace of mind</p>
            </div>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Every trainer must provide a Certificate of Insurance (COI) maintaining at least $1,000,000 in professional and general liability insurance. This protects clients against accidental injury or property damage during sessions at home or external gyms.
          </p>
        </section>

        {/* CPR / AED */}
        <section className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400">
              <HeartPulse className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Active CPR &amp; AED Certification</h3>
              <p className="text-xs text-slate-400">American Heart Association or Red Cross</p>
            </div>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            All fitness trainers maintain current Adult and Pediatric CPR, Automated External Defibrillator (AED), and First Aid certifications with in-person practical skills testing.
          </p>
        </section>
      </div>

      {/* In-Home vs Gym Location Safety Guide */}
      <section className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 sm:p-7 space-y-4">
        <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
          <span>Safety Protocols for Home &amp; Gym Sessions</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 font-bold text-emerald-400 text-sm">
              <Home className="w-4 h-4" />
              <span>In-Home Training Standards</span>
            </div>
            <ul className="space-y-1.5 text-slate-300">
              <li className="flex items-start gap-1.5">
                <span className="text-emerald-400 font-bold">•</span>
                <span>Trainers carry sanitized equipment (dumbbells, resistance bands, foam rollers).</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-emerald-400 font-bold">•</span>
                <span>Requires a cleared 6x6 ft workout area free of hazards.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-emerald-400 font-bold">•</span>
                <span>GPS time-stamped check-in and check-out logs logged in our system.</span>
              </li>
            </ul>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 font-bold text-teal-400 text-sm">
              <Building2 className="w-4 h-4" />
              <span>Gym of Your Choice Standards</span>
            </div>
            <ul className="space-y-1.5 text-slate-300">
              <li className="flex items-start gap-1.5">
                <span className="text-teal-400 font-bold">•</span>
                <span>Meets at your residential condo gym, commercial club, or private studio.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-teal-400 font-bold">•</span>
                <span>Coach verifies guest policy and equipment availability before arrival.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-teal-400 font-bold">•</span>
                <span>No solicitation or unauthorized third-party transfers.</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400 border-t border-slate-800">
          <div className="flex items-center gap-2">
            <PhoneCall className="w-4 h-4 text-emerald-400" />
            <span>24/7 Client Safety Helpline: (800) 555-0199</span>
          </div>
          <span className="text-[11px] text-slate-500">
            Reports audited weekly by the BookATrainer Trust &amp; Safety Committee
          </span>
        </div>
      </section>
    </div>
  );
};
