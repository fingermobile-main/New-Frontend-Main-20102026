import React from 'react';
import LegalLayout from '../../components/layout/LegalLayout';
import { ShieldCheckIcon } from '../../icons';

const CommunityStandardsNudityPage: React.FC = () => {
  return (
    <LegalLayout>
      <div className="bg-white rounded-2xl shadow-sm border border-slate-300 p-6 lg:p-10">
        {/* Header */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-rose-50 text-rose-700 text-xs font-bold rounded-full mb-3 border border-rose-200">
            <ShieldCheckIcon className="w-4 h-4" />
            <span>FingerMobile Protocol™ Community Standards</span>
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight sm:text-4xl mb-2">
            Community Standards: Nudity &amp; Sexual Activity
          </h1>
          <p className="text-gray-700 text-sm leading-relaxed max-w-3xl">
            We don't allow the sharing or sending of nudity or sexual activity. While our policies have become more nuanced
            over time to accommodate educational, medical, artistic, and protest contexts, we restrict this content to keep
            our community respectful and safe. Because some users may be sensitive to nudity, and to prevent the spread of
            non-consensual or underage material, we default to removing sexual imagery unless a clear, permitted exception
            applies.
          </p>
          <p className="text-xs text-gray-500 mt-3">
            Effective Date: October 14, 2026 &nbsp;·&nbsp; Policy Version: v1.0.0 &nbsp;·&nbsp; Governing Authority: FingerMobile Protocol (GraceLink Ltd.)
          </p>
        </div>

        <hr className="border-slate-300 mb-8" />

        {/* Core Principles */}
        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span className="inline-block w-1.5 h-6 bg-blue-600 rounded-full"></span>
            Core Principles
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                title: 'Freedom of Expression',
                icon: '🗣️',
                desc: 'We want you to share freely with others, and we only restrict content or users to maintain a safe, respectful environment.'
              },
              {
                title: 'Global Consistency',
                icon: '🌍',
                desc: 'We apply the same rules worldwide, utilizing our technology and moderation teams across multiple languages to ensure consistent enforcement.'
              },
              {
                title: 'Nuance and Context',
                icon: '⚖️',
                desc: 'We recognize that nudity and sexual content often serve valid purposes. When intent is clear, allowances are made for health, education, art, protest, and crisis documentation.'
              }
            ].map((p) => (
              <div key={p.title} className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                <div className="text-2xl mb-2">{p.icon}</div>
                <h3 className="font-bold text-gray-900 text-sm mb-1">{p.title}</h3>
                <p className="text-gray-700 text-xs leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Prohibited Content */}
        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span className="inline-block w-1.5 h-6 bg-rose-600 rounded-full"></span>
            Prohibited Content
          </h2>

          {/* Adult Nudity */}
          <div className="mb-6 p-5 rounded-xl border border-rose-200 bg-rose-50">
            <h3 className="font-bold text-gray-900 mb-3 text-sm uppercase tracking-wide">Adult Nudity</h3>
            <p className="text-gray-700 text-xs mb-3 leading-relaxed">
              We do not allow imagery of adult nudity if it depicts:
            </p>
            <ul className="space-y-2 text-xs text-gray-700">
              <li className="flex gap-2"><span className="text-rose-600 font-bold mt-0.5">✕</span><span><strong>Sex:</strong> Sex in any variation.</span></li>
              <li className="flex gap-2"><span className="text-rose-600 font-bold mt-0.5">✕</span><span><strong>Genitalia:</strong> Visible genitalia, except in medical, health, or crisis contexts (e.g., birth and after-birth moments, gender confirmation surgery, disease examinations, famine, genocide, war crimes, or crimes against humanity).</span></li>
              <li className="flex gap-2"><span className="text-rose-600 font-bold mt-0.5">✕</span><span><strong>Anuses and Buttocks:</strong> Visible anuses and/or fully nude close-ups of buttocks, unless photoshopped onto a public figure or shared within permitted medical/crisis contexts.</span></li>
              <li className="flex gap-2"><span className="text-rose-600 font-bold mt-0.5">✕</span><span><strong>Female Nipples:</strong> Uncovered female nipples, except in the context of breastfeeding, post-mastectomy scarring, medical or health situations, acts of protest, or famine, genocide, war crimes, and crimes against humanity.</span></li>
            </ul>
          </div>

          {/* Adult Sexual Activity */}
          <div className="mb-6 p-5 rounded-xl border border-rose-200 bg-rose-50">
            <h3 className="font-bold text-gray-900 mb-3 text-sm uppercase tracking-wide">Adult Sexual Activity (Real-World)</h3>
            <p className="text-gray-700 text-xs mb-3 leading-relaxed">
              We do not allow imagery of adult sexual activity, including:
            </p>
            <ul className="space-y-2 text-xs text-gray-700">
              <li className="flex gap-2"><span className="text-rose-600 font-bold mt-0.5">✕</span><span><strong>Explicit Sexual Activity &amp; Stimulation:</strong> Explicit sexual intercourse or oral sex (indicated by a mouth or genitals in contact with another person's genitals or anus when at least one is visible), and direct stimulation or insertion of sex toys into a person's genitals or anus.</span></li>
              <li className="flex gap-2"><span className="text-rose-600 font-bold mt-0.5">✕</span><span><strong>Implicit Sexual Activity &amp; Stimulation:</strong> Implicit intercourse, oral sex, or toy insertion/placement where contact or anatomy is not directly visible — <em>unless</em> posted in medical, health, or sexual wellness contexts, promotional content, or recognized fictional works.</span></li>
              <li className="flex gap-2"><span className="text-rose-600 font-bold mt-0.5">✕</span><span><strong>Other Sexual Activities:</strong> Erections, the presence of sexual activity by-products, sex toys placed upon or inserted into the mouth, stimulation of visible human nipples, and breast squeezing — <em>except</em> in breastfeeding contexts — <em>unless</em> shared in medical, health, or fictional contexts.</span></li>
            </ul>
          </div>

          {/* Fetish Content */}
          <div className="mb-6 p-5 rounded-xl border border-rose-200 bg-rose-50">
            <h3 className="font-bold text-gray-900 mb-3 text-sm uppercase tracking-wide">Fetish Content</h3>
            <p className="text-gray-700 text-xs mb-3 leading-relaxed">
              We prohibit imagery depicting fetishes that involve:
            </p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-gray-700">
              {[
                'Acts likely to lead to the death of a person or animal',
                'Dismemberment',
                'Cannibalism',
                'Feces, urine, spit, snot, menstruation, or vomit',
                'Bestiality',
                'Incest'
              ].map((item) => (
                <li key={item} className="flex gap-2 items-center">
                  <span className="text-rose-600 font-bold">✕</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Digital & Audio */}
          <div className="p-5 rounded-xl border border-rose-200 bg-rose-50">
            <h3 className="font-bold text-gray-900 mb-3 text-sm uppercase tracking-wide">Digital Imagery and Audio</h3>
            <ul className="space-y-2 text-xs text-gray-700">
              <li className="flex gap-2"><span className="text-rose-600 font-bold mt-0.5">✕</span><span><strong>Digital Sexual Activity:</strong> Prohibited except when posted for medical awareness, scientific discourse, or sexual health discussion, <em>and</em> viewing is restricted to adults aged 18 or older.</span></li>
              <li className="flex gap-2"><span className="text-rose-600 font-bold mt-0.5">✕</span><span><strong>Audio:</strong> Extended audio of sexual activity is prohibited.</span></li>
            </ul>
          </div>
        </section>

        {/* Content Labeling & Age Restrictions */}
        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span className="inline-block w-1.5 h-6 bg-amber-500 rounded-full"></span>
            Content Labeling &amp; Age Restrictions
          </h2>
          <p className="text-gray-700 text-xs mb-4">
            To balance safety with user awareness, certain permitted content requires friction or age-gating:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Spoiler Warning Labels */}
            <div className="p-5 rounded-xl border border-amber-200 bg-amber-50">
              <h3 className="font-bold text-gray-900 text-sm mb-2 flex items-center gap-2">
                <span className="px-2 py-0.5 bg-amber-500 text-white text-xs font-bold rounded-full">⚠ Spoiler Warning</span>
                Labels Required
              </h3>
              <p className="text-xs text-gray-700 leading-relaxed">
                Content containing visible adult genitalia, close-ups of buttocks, anuses, or implicit/other sexual activity/stimulation shared in a <strong>medical or health context</strong> (such as birth-giving, gender confirmation surgery, or self-examinations) must include a <strong>Spoiler Warning</strong> label.
              </p>
            </div>

            {/* Age Gated */}
            <div className="p-5 rounded-xl border border-orange-200 bg-orange-50">
              <h3 className="font-bold text-gray-900 text-sm mb-2 flex items-center gap-2">
                <span className="px-2 py-0.5 bg-orange-600 text-white text-xs font-bold rounded-full">🔞 18+ Restricted</span>
                Age-Gated Content
              </h3>
              <p className="text-xs text-gray-700 mb-2">Viewing is limited to adults aged 18 or older for:</p>
              <ul className="space-y-1.5 text-xs text-gray-700">
                <li className="flex gap-1.5"><span className="text-orange-600">›</span>Real-world art depicting implicit, explicit, or other sexual activity/stimulation.</li>
                <li className="flex gap-1.5"><span className="text-orange-600">›</span>Real-world art depicting bestiality neutrally or in condemnation using unreal people/animals.</li>
                <li className="flex gap-1.5"><span className="text-orange-600">›</span>Implicit adult sexual activity in advertisements or recognized fictional works.</li>
                <li className="flex gap-1.5"><span className="text-orange-600">›</span>Digital imagery and real-world art of non-explicit, non-fetish adult sexual activity posted in a satirical or humorous context, or where only body shapes and contours are visible.</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Permitted Exceptions */}
        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span className="inline-block w-1.5 h-6 bg-emerald-600 rounded-full"></span>
            Permitted Exceptions
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              {
                icon: '🎨',
                title: 'Artistic & Cultural Works',
                desc: 'Photographs of paintings, sculptures, and other art depicting nude figures are allowed.'
              },
              {
                icon: '🌏',
                title: 'Crisis & Conflict',
                desc: 'All otherwise restricted nudity and sexual content is permitted in the context of famine, genocide, war crimes, or crimes against humanity.'
              },
              {
                icon: '😄',
                title: 'Satire and Humor',
                desc: 'Violating elements are permitted if the content genuinely satirizes, mocks, or criticizes the violating elements or the subject they are attributed to.'
              }
            ].map((e) => (
              <div key={e.title} className="p-4 rounded-xl border border-emerald-200 bg-emerald-50">
                <div className="text-2xl mb-2">{e.icon}</div>
                <h3 className="font-bold text-gray-900 text-sm mb-1">{e.title}</h3>
                <p className="text-gray-700 text-xs leading-relaxed">{e.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Reporting Violations */}
        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span className="inline-block w-1.5 h-6 bg-indigo-600 rounded-full"></span>
            Reporting Violations
          </h2>
          <p className="text-gray-700 text-xs mb-4 leading-relaxed">
            If you encounter content you believe violates these standards across posts, comments, stories, or messages, you can report it:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
            {[
              { step: '1', title: 'Tap Report', desc: 'Tap the report option on the specific piece of content.' },
              { step: '2', title: 'Select Category', desc: 'Select the category that best reflects the problem to ensure it routes correctly.' },
              { step: '3', title: 'Submit', desc: 'Review your details for accuracy and click Submit.' }
            ].map((s) => (
              <div key={s.step} className="flex gap-3 p-4 bg-indigo-50 rounded-xl border border-indigo-200">
                <div className="w-8 h-8 shrink-0 rounded-full bg-indigo-600 text-white flex items-center justify-center font-extrabold text-sm">
                  {s.step}
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 text-sm">{s.title}</h4>
                  <p className="text-gray-700 text-xs mt-0.5">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
            <p className="text-xs text-gray-700 leading-relaxed">
              Once a report is submitted, our moderation systems review the content. If it violates our Community Standards, it will be removed.
            </p>
            <p className="text-xs text-gray-500 mt-2 italic">
              <strong>Note:</strong> If you personally wish to avoid specific content without reporting it, you can also unfollow, block, or unfriend the account.
            </p>
          </div>
        </section>

        {/* Enforcement Notice */}
        <section className="p-6 bg-gradient-to-r from-slate-900 to-rose-950 rounded-2xl text-white">
          <h2 className="text-lg font-bold mb-2">Enforcement &amp; Penalties</h2>
          <p className="text-slate-700 text-sm leading-relaxed mb-3">
            Violation of this Community Standard may result in content removal, account warning, temporary suspension, or permanent
            termination of the offending account — depending on severity, pattern of behavior, and applicable legislation.
            Repeated or severe violations are escalated to our Guardian Protocol AI enforcement layer and, where applicable, reported
            to law enforcement authorities.
          </p>
          <div className="flex flex-wrap gap-3 mt-4">
            <span className="px-3 py-1 text-xs font-bold bg-white/10 rounded-full border border-white/20">Content Removal</span>
            <span className="px-3 py-1 text-xs font-bold bg-white/10 rounded-full border border-white/20">Account Warning</span>
            <span className="px-3 py-1 text-xs font-bold bg-white/10 rounded-full border border-white/20">Temporary Suspension</span>
            <span className="px-3 py-1 text-xs font-bold bg-rose-600 rounded-full">Permanent Termination</span>
            <span className="px-3 py-1 text-xs font-bold bg-white/10 rounded-full border border-white/20">Law Enforcement Referral</span>
          </div>
        </section>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-slate-300 text-center">
          <p className="text-xs text-gray-500">
            This policy is part of the FingerMobile Protocol™ Legal Trust Center. For policy inquiries, contact{' '}
            <a href="mailto:info@fingermobileprotocol.com" className="text-blue-600 underline hover:text-blue-800">
              info@fingermobileprotocol.com
            </a>
          </p>
        </div>
      </div>
    </LegalLayout>
  );
};

export default CommunityStandardsNudityPage;
