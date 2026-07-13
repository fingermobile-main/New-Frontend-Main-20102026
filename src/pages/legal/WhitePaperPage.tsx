import React from 'react';

import { PolicyIcon } from '../../components/icons';

const WhitePaperPage = () => {

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
    
    const whitePaperHash = "f0c3d2b8ee7123caee5b4c247bda45c91e8a2e8c0a16f0e612709345f9f053b2"; // TODO: Replace with actual SHA-256 hash of deployed white paper document
    const smartContractCode = `
contract Fiat2IFCBridge is Ownable {
    IERC20 public IFC;
    AggregatorV3Interface public priceFeed;
    constructor(address _ifc, address _oracle) {
        IFC = IERC20(_ifc);
        priceFeed = AggregatorV3Interface(_oracle);

    function fiatToIFC(uint256 fiatAmount) public view returns (uint256) {
        (, int256 rate,,,) = priceFeed.latestRoundData();
        return (fiatAmount * 1e18) / uint256(rate);

    function convertAndMint(address member, uint256 fiatAmount) external onlyOwner {
        uint256 tokens = fiatToIFC(fiatAmount);
        IFC.transfer(member, tokens);

}`;

    return (
        <div className="p-6 lg:p-8 bg-white min-h-full">
            <div className="max-w-4xl mx-auto">
                <div className="flex items-center gap-4 mb-6">
                    <PolicyIcon className="w-10 h-10 text-brand-blue" />
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">INFINITE COIN™©® (IFO) — WHITE PAPER</h1>
                        <p className="text-gray-600">Version 1.0 — July 9, 2025</p>
                        <p className="text-xs text-gray-500">Registered Intellectual Property — FingerMobile Protocol Communication™©®</p>
                    </div>
                </div>

                <div className="bg-gray-50 p-6 rounded-xl border">
                    <Section title="1. Executive Summary">
                        <p>Infinite Coin™©® (IFO) is a decentralized, programmable digital currency and exchange unit built to power the FingerMobile™ ecosystem — a creator-first protocol that fuses fintech, generative AI, secure communications, and social commerce into a unified platform. IFO is designed as the financial core of a globally-scaled UGC economy.</p>
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
                                <li><strong>Symbol:</strong> IFO</li>
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
                            <li><strong>Burn Mechanism:</strong> 2% of every transaction is burned quarterly</li>
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
                        </ul>
                    </Section>
                    
                    <Section title="Digital Proof of Authorship & Smart Contract Example">
                        <p><strong>SHA256 Hash of this white paper:</strong></p>
                        <pre className="bg-gray-200 p-2 rounded text-xs break-all"><code>{whitePaperHash}</code></pre>
                        
                        <p className="mt-4"><strong>Owner Signature ID:</strong> MBH-7210-FMP-IFO-WP-V1</p>
                        <p><strong>Date Issued:</strong> July 9, 2025</p>

                        <h4 className="font-bold mt-6 mb-2">FIC Smart Contract Example: Fiat2IFCBridge.sol</h4>
                        <pre className="bg-gray-800 text-gray-200 p-4 rounded-lg overflow-x-auto text-xs">
                            <code>{smartContractCode.trim()}</code>
                        </pre>
                    </Section>
                </div>
            </div>
        </div>
    );
};

export default WhitePaperPage;


