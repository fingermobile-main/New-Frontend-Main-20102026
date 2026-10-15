import React, { useState } from 'react';
import LegalLayout from '../../components/layout/LegalLayout';
import { PolicyIcon } from '../../components/icons';
import LegalDocumentBanner from '../../components/legal/LegalDocumentBanner';
import { DigitalNotarizationModal } from '../../components/legal/DigitalNotarizationModal';
import { FIC_DIGITAL_NOTARIZATION_CERTIFICATE } from '../../constants/digitalNotarization';
import {
  ShieldCheck,
  Award,
  Copy,
  Check,
  Fingerprint,
  Clock,
  Hash,
  ExternalLink
} from 'lucide-react';

const WhitePaperPage: React.FC = () => {
  const [showCertModal, setShowCertModal] = useState<boolean>(false);
  const [copiedHash, setCopiedHash] = useState<boolean>(false);

  const cert = FIC_DIGITAL_NOTARIZATION_CERTIFICATE;
  const whitePaperHash = cert.documentSha256Hash;

  const copyHashToClipboard = () => {
    navigator.clipboard.writeText(whitePaperHash);
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2500);
  };

  const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <section className="mb-8">
      <h2 className="text-2xl font-bold text-gray-800 border-b-2 border-brand-blue pb-2 mb-4">{title}</h2>
      <div className="prose prose-sm max-w-none text-gray-600">
        {children}
      </div>
    </section>
  );

  const SubSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="mt-6">
      <h3 className="text-lg font-bold text-gray-700">{title}</h3>
      <div className="mt-2">{children}</div>
    </div>
  );

  const smartContractCode = `
contract Fiat2IFCBridge is Ownable {
    IERC20 public IFC;
    AggregatorV3Interface public priceFeed;
    constructor(address _ifc, address _oracle) {
        IFC = IERC20(_ifc);
        priceFeed = AggregatorV3Interface(_oracle);
    }

    function fiatToIFC(uint256 fiatAmount) public view returns (uint256) {
        (, int256 rate,,,) = priceFeed.latestRoundData();
        return (fiatAmount * 1e18) / uint256(rate);
    }

    function convertAndMint(address member, uint256 fiatAmount) external onlyOwner {
        uint256 tokens = fiatToIFC(fiatAmount);
        IFC.transfer(member, tokens);
    }
}`;

  return (
    <LegalLayout>
      <div className="p-6 lg:p-8 bg-white rounded-2xl shadow-sm border border-slate-300 min-h-full">
        <div className="max-w-4xl mx-auto">
          <LegalDocumentBanner
            slug="whitepaper"
            defaultTitle="FingerMobile Protocol Technical Whitepaper"
            defaultVersion="1.0.0"
            defaultEffectiveDate="July 9, 2025"
          />

          <div className="flex items-center gap-4 mb-6">
            <PolicyIcon className="w-10 h-10 text-brand-blue" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">INFINITE COIN™©® (IFO / FIC) — WHITE PAPER</h1>
              <p className="text-gray-600">Version 1.0 (IP Version) — July 9, 2025</p>
              <p className="text-xs text-gray-500">Registered Intellectual Property — FingerMobile Protocol Communication™©®</p>
            </div>
          </div>

          {/* OFFICIAL DIGITAL NOTARIZATION CERTIFICATE HERO BANNER */}
          <div className="mb-8 rounded-2xl bg-gradient-to-r from-slate-950 via-zinc-900 to-amber-950 border-2 border-amber-500/40 p-6 text-white shadow-xl relative overflow-hidden">
            <div className="absolute right-0 top-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none -mr-16 -mt-16"></div>
            <div className="relative z-10">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
                    <Award className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-[10px] font-mono font-bold uppercase tracking-wider mb-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Digitally Notarized Document</span>
                    </div>
                    <h3 className="text-lg font-extrabold text-white">
                      Digital Notarization & IP Integrity Certificate
                    </h3>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowCertModal(true)}
                    className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-xl font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>View Official Certificate</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 py-4 text-xs">
                <div className="bg-black/50 p-3 rounded-xl border border-white/5">
                  <span className="text-zinc-400 text-[10px] block">Issued To (Author)</span>
                  <span className="font-bold text-amber-300 text-xs">{cert.issuedTo}</span>
                </div>
                <div className="bg-black/50 p-3 rounded-xl border border-white/5">
                  <span className="text-zinc-400 text-[10px] block">Reference ID</span>
                  <span className="font-mono font-bold text-emerald-400 text-xs">{cert.referenceId}</span>
                </div>
                <div className="bg-black/50 p-3 rounded-xl border border-white/5">
                  <span className="text-zinc-400 text-[10px] block">Fingerprint ID</span>
                  <span className="font-mono font-bold text-amber-300 text-xs">{cert.fingerprintId}</span>
                </div>
                <div className="bg-black/50 p-3 rounded-xl border border-white/5">
                  <span className="text-zinc-400 text-[10px] block">Timestamp (UTC)</span>
                  <span className="font-mono text-zinc-300 text-[11px] flex items-center gap-1 mt-0.5">
                    <Clock className="w-3 h-3 text-amber-400" />
                    {cert.timestampUtc}
                  </span>
                </div>
              </div>

              {/* Document Hash Box */}
              <div className="bg-black/70 rounded-xl p-3 border border-amber-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2 overflow-hidden text-xs">
                  <Hash className="w-4 h-4 text-amber-400 shrink-0" />
                  <span className="text-zinc-400 font-mono text-[11px] shrink-0">SHA256:</span>
                  <code className="text-amber-300 font-mono text-[11px] truncate select-all">{whitePaperHash}</code>
                </div>
                <button
                  onClick={copyHashToClipboard}
                  className="px-3 py-1 bg-white/10 hover:bg-white/20 text-zinc-200 text-xs rounded-lg font-mono flex items-center gap-1.5 transition-all shrink-0"
                >
                  {copiedHash ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Hash</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 p-6 rounded-xl border">
            <Section title="1. Executive Summary">
              <p>Infinite Coin™©® (IFO / FIC) is a decentralized, programmable digital currency and exchange unit built to power the FingerMobile™ ecosystem — a creator-first protocol that fuses fintech, generative AI, secure communications, and social commerce into a unified platform. IFO is designed as the financial core of a globally-scaled UGC economy.</p>
            </Section>

            <Section title="2. Core Objectives">
              <ul className="list-disc pl-5 space-y-2">
                <li>Enable micro-payments, subscriptions, licensing, and royalty flows across borders.</li>
                <li>Reward creators and contributors via automated smart distribution.</li>
                <li>Serve as the native token for all monetization modules across FingerMobile™ and its plugins.</li>
              </ul>
            </Section>

            <Section title="3. Architecture">
              <SubSection title="a. Token Type">
                <ul className="list-disc pl-5">
                  <li><strong>Symbol:</strong> IFO / FIC</li>
                  <li><strong>Blockchain:</strong> Hybrid (ERC-20 + Sidechain Layer for scalable throughput)</li>
                  <li><strong>Supply:</strong> 1,000,000,000 (Fixed, Deflationary Model with scheduled burns)</li>
                </ul>
              </SubSection>
              <SubSection title="b. Components">
                <ul className="list-disc pl-5">
                  <li><strong>IFO Core:</strong> Primary ledger on Ethereum-compatible chain</li>
                  <li><strong>IFO-LX:</strong> Licensing Extension to handle royalty triggers</li>
                  <li><strong>IFO-Wallet:</strong> Embedded FingerWallet for secure asset storage, tipping, earnings</li>
                  <li><strong>IFO-Gate™:</strong> API for fiat on-ramp/off-ramp and local currency mapping</li>
                </ul>
              </SubSection>
            </Section>

            <Section title="4. Use Cases">
              <ul className="list-disc pl-5 space-y-2">
                <li>UGC monetization on posts, photos, videos, music</li>
                <li>Licensing and resell rights of digital assets</li>
                <li>In-app purchases, store items, premium unlocks</li>
                <li>Event ticketing, campaign boosting, referral systems</li>
                <li>Peer-to-peer creator tipping and crypto staking rewards</li>
              </ul>
            </Section>

            <Section title="5. Technical Design">
              <SubSection title="Smart Contract Features">
                <ul className="list-disc pl-5">
                  <li>Royalty Split Engine</li>
                  <li>Proof-of-Ownership Binding with asset metadata</li>
                  <li>Time-Locked Vaults for long-term rewards</li>
                  <li>Dynamic Gas-Adjusted Transaction System</li>
                </ul>
              </SubSection>
              <SubSection title="Compliance & Security">
                <ul className="list-disc pl-5">
                  <li>KYC-integrated FingerWallet</li>
                  <li>Multi-sig admin vaults and 2FA</li>
                  <li>DCIL-2025 compliance and digital asset licensing protocols</li>
                </ul>
              </SubSection>
            </Section>

            <Section title="6. Governance">
              <ul className="list-disc pl-5 space-y-2">
                <li>Community-based DAO-style voting (IFO-House)</li>
                <li>Governance proposals for utility expansions, fee adjustments</li>
                <li>Creator-backed treasury for grants and cultural funding</li>
              </ul>
            </Section>

            <Section title="7. Economic Model">
              <ul className="list-disc pl-5 space-y-2">
                <li><strong>Burn Mechanism:</strong> 2% of every transaction is burned quarterly (10% platform transaction sink)</li>
                <li><strong>Creator Reward Pool:</strong> 20% initial allocation</li>
                <li><strong>Protocol Maintenance:</strong> 5% of circulating flow</li>
                <li><strong>Staking Incentives:</strong> Up to 15% annualized returns</li>
              </ul>
            </Section>

            <Section title="8. Interoperability">
              <ul className="list-disc pl-5 space-y-2">
                <li>API-ready integration with 3rd-party platforms</li>
                <li>Wrapped IFO available for bridging to Solana, Polygon, BNB</li>
                <li>Cross-chain NFT compatibility</li>
              </ul>
            </Section>

            <Section title="9. Legal & IP Notes">
              <p>Infinite Coin™ is protected under the Digital Communications and Innovation Law (DCIL) 2025 and is recognized as part of the registered IP stack of FingerMobile Protocol Communication™©®.</p>
              <p>All underlying code, trademarks, visual assets, and protocol behaviors are copyright-protected and bound under international digital rights treaties.</p>
            </Section>

            <Section title="10. Contact & Registry">
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Issuer:</strong> FingerMobile Protocol Communication™©®</li>
                <li><strong>Owner:</strong> Mbah Israel Obinna</li>
                <li><strong>Registry ID:</strong> FMP-GTCR-2025-IFC901X</li>
                <li><strong>Jurisdiction:</strong> Global Digital Communication & Technology Registry (GDCTR)</li>
                <li><strong>Reference ID:</strong> {cert.referenceId}</li>
                <li><strong>Fingerprint ID:</strong> {cert.fingerprintId}</li>
                <li><strong>Timestamp (UTC):</strong> {cert.timestampUtc}</li>
              </ul>
            </Section>

            <Section title="Digital Proof of Authorship & Cryptographic Notarization">
              <div className="p-4 rounded-xl bg-slate-900 text-white space-y-3 mb-4">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-amber-400 text-xs flex items-center gap-1.5">
                    <Fingerprint className="w-4 h-4" />
                    DIGITAL NOTARIZATION CERTIFICATE — SHA-256 HASH
                  </span>
                  <span className="text-[10px] text-emerald-400 font-mono">CRYPTOGRAPHICALLY VERIFIED</span>
                </div>
                <pre className="bg-black/60 p-3 rounded text-xs break-all text-amber-300 font-mono border border-white/10 select-all">
                  <code>{whitePaperHash}</code>
                </pre>
                <div className="text-xs text-zinc-300 space-y-1">
                  <p><strong>Owner Signature / Fingerprint ID:</strong> {cert.fingerprintId}</p>
                  <p><strong>Reference ID:</strong> {cert.referenceId}</p>
                  <p><strong>Date Issued:</strong> {cert.dateIssued} | <strong>Timestamp (UTC):</strong> {cert.timestampUtc}</p>
                  <p className="text-[11px] text-zinc-400 italic pt-1">{cert.verificationStatement}</p>
                </div>
              </div>

              <h4 className="font-bold mt-6 mb-2 text-gray-800">FIC Smart Contract Example: Fiat2IFCBridge.sol</h4>
              <pre className="bg-gray-800 text-gray-200 p-4 rounded-lg overflow-x-auto text-xs">
                <code>{smartContractCode.trim()}</code>
              </pre>
            </Section>
          </div>
        </div>
      </div>

      {/* MODAL */}
      <DigitalNotarizationModal
        isOpen={showCertModal}
        onClose={() => setShowCertModal(false)}
      />
    </LegalLayout>
  );
};

export default WhitePaperPage;
