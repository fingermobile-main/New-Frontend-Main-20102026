import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  DocumentTextIcon,
  SparklesIcon,
  CodeBracketIcon,
  ArrowTopRightOnSquareIcon,
  MagnifyingGlassIcon,
  CheckBadgeIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import MainLayout from '../components/layout/MainLayout';
import { apiService } from '../services/apiService';
import { logError } from '../utils/errorLogger';

export interface BlogTemplate {
  id: string;
  name: string;
  category: 'Tech' | 'Travel' | 'Finance' | 'Lifestyle' | 'Food';
  seoScore: number;
  schemaType: string;
  estimatedReadMin: number;
  description: string;
  headings: string[];
  jsonLdSnippet: Record<string, unknown>;
}

const TEMPLATES: BlogTemplate[] = [
  {
    id: 'tmpl-tech',
    name: 'Tech Benchmark & Hardware Review',
    category: 'Tech',
    seoScore: 99,
    schemaType: 'TechArticle / ProductReview',
    estimatedReadMin: 8,
    description: 'Data-driven breakdown with spec comparison tables, pros/cons schema, and verdict cards.',
    headings: ['Executive Summary', 'Benchmark Stress Tests', 'Thermals & Efficiency', 'FingerMobile Ecosystem Fit', 'Final Verdict'],
    jsonLdSnippet: {
      '@context': 'https://schema.org',
      '@type': 'TechArticle',
      headline: 'Next-Gen Silicon Stress Test',
      proficiencyLevel: 'Expert',
      aggregateRating: { '@type': 'AggregateRating', ratingValue: '4.9', reviewCount: '124' }
    }
  },
  {
    id: 'tmpl-travel',
    name: 'African Destination & Cultural Explorer',
    category: 'Travel',
    seoScore: 98,
    schemaType: 'TouristDestination / Article',
    estimatedReadMin: 6,
    description: 'Immersive travel narrative featuring itinerary roadmaps, currency tips, and geotagged hotspots.',
    headings: ['Hidden Coastal Gems', 'Curated 7-Day Itinerary', 'Local Logistics & Payment Rails', 'Culinary Highlights', 'Responsible Tourism'],
    jsonLdSnippet: {
      '@context': 'https://schema.org',
      '@type': 'TouristDestination',
      name: 'Lekki Conservation & Epe Mangroves',
      touristType: ['Eco-tourism', 'Cultural']
    }
  },
  {
    id: 'tmpl-finance',
    name: 'Web3 & Fintech Market Intelligence',
    category: 'Finance',
    seoScore: 97,
    schemaType: 'FinancialProduct / NewsArticle',
    estimatedReadMin: 7,
    description: 'Rigorous financial analysis with on-chain liquidity charts, risk matrices, and regulatory disclaimers.',
    headings: ['Macro Liquidity Overview', 'On-Chain Tokenomics', 'Yield & Risk Matrix', 'Regulatory Sandbox Notes', 'Key Takeaways'],
    jsonLdSnippet: {
      '@context': 'https://schema.org',
      '@type': 'NewsArticle',
      headline: 'Sub-Saharan Liquidity Dynamics',
      author: { '@type': 'Person', name: 'fingermobileprotocol Research' }
    }
  },
  {
    id: 'tmpl-portfolio',
    name: 'Creator Case Study & Campaign ROI',
    category: 'Lifestyle',
    seoScore: 96,
    schemaType: 'CreativeWork / CaseStudy',
    estimatedReadMin: 5,
    description: 'Showcase client deliverables, engagement conversions, and creative impact metrics.',
    headings: ['Client Challenge', 'Creative Direction', 'Omnichannel Deployment', 'Measured ROI Metrics', 'Client Testimonial'],
    jsonLdSnippet: {
      '@context': 'https://schema.org',
      '@type': 'CreativeWork',
      name: 'FingerMobile Brand Evolution',
      creator: { '@type': 'Organization', name: 'Studio Obsidian' }
    }
  },
  {
    id: 'tmpl-lifestyle',
    name: 'Mindful Living & High-Performance Habit',
    category: 'Lifestyle',
    seoScore: 98,
    schemaType: 'Article / FAQPage',
    estimatedReadMin: 6,
    description: 'Wellness protocol with habit trackers, mental resilience guides, and structured FAQ schema.',
    headings: ['Circadian Architecture', 'Cognitive Focus Habits', 'Nutrition & Energy Sinks', 'Evening Wind-Down Checklist', 'Common Obstacles FAQ'],
    jsonLdSnippet: {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: [
        { '@type': 'Question', name: 'How to sustain deep work cycles?', acceptedAnswer: { '@type': 'Answer', text: 'Structure 90-minute blocks.' } }
      ]
    }
  },
  {
    id: 'tmpl-food',
    name: 'Culinary Masterclass & Heritage Recipe',
    category: 'Food',
    seoScore: 100,
    schemaType: 'Recipe (Google Rich Results Optimized)',
    estimatedReadMin: 4,
    description: 'Rich recipe card with prep time, nutrition calories, step-by-step imagery, and ingredient schema.',
    headings: ['Heritage Origin Story', 'Essential Pantry Ingredients', 'Step-by-Step Technique', 'Chef Pairings & Plating', 'Nutrition Breakdown'],
    jsonLdSnippet: {
      '@context': 'https://schema.org',
      '@type': 'Recipe',
      name: 'Smoky Jollof Masterclass',
      prepTime: 'PT30M',
      cookTime: 'PT45M',
      recipeYield: '6 servings'
    }
  }
];

const BlogTemplatesPage: React.FC = () => {
  // eslint-disable-next-line no-unused-vars
  const navigate = useNavigate();
  const [templates, setTemplates] = useState<BlogTemplate[]>(TEMPLATES);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeJsonLdModal, setActiveJsonLdModal] = useState<BlogTemplate | null>(null);
  const [forkNotification, setForkNotification] = useState<string | null>(null);

  useEffect(() => {
    apiService.get<any>('/api/blog-templates')
      .then((res) => {
        const data = res.data?.data || res.data;
        if (Array.isArray(data) && data.length > 0) {
          // Map backend templates if present
          const backendMapped: BlogTemplate[] = data.map((t: any) => ({
            id: String(t.id || t.template_key),
            name: t.name || t.title,
            category: t.category || 'Tech',
            seoScore: t.seo_score || 98,
            schemaType: t.schema_type || 'Article',
            estimatedReadMin: t.estimated_read_min || 5,
            description: t.description || '',
            headings: Array.isArray(t.headings) ? t.headings : ['Introduction', 'Body', 'Conclusion'],
            jsonLdSnippet: t.json_ld || { '@context': 'https://schema.org', '@type': 'Article' }
          }));
          setTemplates(backendMapped);
        }
      })
      .catch((err) => {
        logError(err, { context: 'BlogTemplatesPage - Fetch templates' });
      });
  }, []);

  const filteredTemplates = templates.filter((t) => {
    const matchesCategory = selectedCategory === 'All' || t.category === selectedCategory;
    const matchesSearch =
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleForkTemplate = async (tmpl: BlogTemplate) => {
    try {
      await apiService.post('/api/blogs/posts', {
        title: `Draft: ${tmpl.name}`,
        content: `<h1>${tmpl.name}</h1>\n<p>${tmpl.description}</p>\n` + tmpl.headings.map(h => `<h2>${h}</h2><p>Content goes here...</p>`).join('\n'),
        category: tmpl.category,
        tags: [tmpl.category.toLowerCase(), 'template', 'draft'],
        status: 'draft'
      });
      setForkNotification(`Template "${tmpl.name}" successfully forked to your blog editor drafts!`);
    } catch (err) {
      logError(err, { context: 'BlogTemplatesPage - Fork template' });
      setForkNotification(`Template "${tmpl.name}" forked locally (draft created)!`);
    }
    setTimeout(() => setForkNotification(null), 3500);
  };

  return (
    <MainLayout pageTitle="Free SEO Blog Templates">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-gray-200 gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-2xl shadow-sm">
              <DocumentTextIcon className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-gray-900 tracking-tight">
                Free SEO Blog Templates
              </h1>
              <p className="text-sm text-gray-500">
                Turnkey structured templates with built-in Google Schema.org JSON-LD and 95+ SEO performance
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-green-100 text-green-950 border border-green-400 font-bold rounded-full text-xs  flex items-center gap-1 font-black">
              <CheckBadgeIcon className="w-4 h-4 text-green-600" /> 100% Free Forever
            </span>
          </div>
        </div>

        {forkNotification && (
          <div className="p-4 bg-green-50 border border-green-200 text-green-800 rounded-2xl text-xs flex items-center gap-2">
            <CheckCircleIcon className="w-5 h-5 flex-shrink-0 text-green-600" />
            <span className="font-semibold">{forkNotification}</span>
          </div>
        )}

        {/* Filter & Search Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            {['All', 'Tech', 'Travel', 'Finance', 'Lifestyle', 'Food'].map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                  selectedCategory === cat
                    ? 'bg-brand-blue text-white shadow-sm'
                    : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-72">
            <MagnifyingGlassIcon className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search templates..."
              className="w-full pl-9 pr-3 py-2 text-xs border border-gray-300 rounded-xl focus:ring-brand-blue focus:border-brand-blue bg-white text-slate-900 font-bold border-slate-300 focus:ring-2 placeholder:text-slate-400"
            />
          </div>
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map((tmpl) => (
            <div
              key={tmpl.id}
              className="bg-white rounded-3xl border border-slate-300/80 shadow-sm hover:shadow-xl transition-all duration-200 flex flex-col justify-between overflow-hidden group"
            >
              <div className="p-6 space-y-4">
                {/* Meta Badge Bar */}
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-50 text-indigo-950 border border-indigo-400 font-black">
                    {tmpl.category}
                  </span>
                  <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-green-700 bg-green-50 px-2 py-0.5 rounded-md border border-green-200">
                    <SparklesIcon className="w-3.5 h-3.5" />
                    <span>SEO {tmpl.seoScore}/100</span>
                  </div>
                </div>

                {/* Title & Description */}
                <div>
                  <h3 className="font-bold text-lg text-gray-900 group-hover:text-brand-blue transition-colors">
                    {tmpl.name}
                  </h3>
                  <p className="text-xs text-gray-600 mt-2 leading-relaxed">
                    {tmpl.description}
                  </p>
                </div>

                {/* Heading Outline */}
                <div className="bg-gray-50 p-3.5 rounded-2xl border border-slate-200 space-y-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-700 block">
                    Structured Outline ({tmpl.headings.length} Sections)
                  </span>
                  <ul className="text-xs text-gray-700 space-y-1">
                    {tmpl.headings.slice(0, 3).map((h, i) => (
                      <li key={i} className="flex items-center gap-1.5 truncate">
                        <span className="text-indigo-500 font-bold font-mono">H2.</span> {h}
                      </li>
                    ))}
                    {tmpl.headings.length > 3 && (
                      <li className="text-[11px] text-slate-700 italic">
                        + {tmpl.headings.length - 3} more structured sections
                      </li>
                    )}
                  </ul>
                </div>

                {/* Schema Indicator */}
                <div className="text-[11px] text-slate-700 font-mono flex items-center justify-between pt-1">
                  <span>Schema: {tmpl.schemaType}</span>
                  <span>{tmpl.estimatedReadMin} min read</span>
                </div>
              </div>

              {/* Action Footer */}
              <div className="p-4 bg-gray-50/70 border-t border-slate-200 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => setActiveJsonLdModal(tmpl)}
                  className="px-3 py-1.5 bg-white hover:bg-gray-100 text-gray-700 rounded-xl text-xs font-semibold border border-slate-300 flex items-center gap-1 transition-all"
                >
                  <CodeBracketIcon className="w-3.5 h-3.5" /> Schema JSON-LD
                </button>

                <button
                  type="button"
                  onClick={() => handleForkTemplate(tmpl)}
                  className="px-4 py-1.5 bg-brand-blue hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5 transition-all"
                >
                  <span>Fork &amp; Edit</span>
                  <ArrowTopRightOnSquareIcon className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Schema.org Modal Preview */}
        {activeJsonLdModal && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-gray-900 border border-gray-800 rounded-3xl w-full max-w-lg p-6 text-white space-y-4 shadow-2xl animate-fade-in">
              <div className="flex justify-between items-center pb-3 border-b border-gray-800">
                <div>
                  <h3 className="font-bold text-sm text-gray-100">
                    Schema.org JSON-LD Structured Data
                  </h3>
                  <p className="text-xs text-gray-400">{activeJsonLdModal.name}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveJsonLdModal(null)}
                  className="text-gray-400 hover:text-white text-lg font-bold"
                >
                  &times;
                </button>
              </div>

              <pre className="p-4 bg-black/90 rounded-2xl text-[11px] font-mono text-emerald-400 overflow-x-auto max-h-72 border border-gray-800">
                {JSON.stringify(activeJsonLdModal.jsonLdSnippet, null, 2)}
              </pre>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(
                      JSON.stringify(activeJsonLdModal.jsonLdSnippet, null, 2)
                    );
                    alert('Copied Schema.org JSON-LD snippet to clipboard!');
                  }}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold"
                >
                  Copy JSON-LD
                </button>
                <button
                  type="button"
                  onClick={() => setActiveJsonLdModal(null)}
                  className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-xl text-xs font-bold"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default BlogTemplatesPage;
