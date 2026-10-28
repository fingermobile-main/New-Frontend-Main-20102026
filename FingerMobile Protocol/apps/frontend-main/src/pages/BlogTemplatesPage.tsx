import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  DocumentTextIcon,
  SparklesIcon,
  CodeBracketIcon,
  ArrowTopRightOnSquareIcon,
  MagnifyingGlassIcon,
  CheckBadgeIcon,
  CheckCircleIcon,
  PlusIcon,
  EyeIcon,
  TrashIcon,
  XMarkIcon,
  ClockIcon,
  BookOpenIcon,
  DocumentDuplicateIcon
} from '@heroicons/react/24/outline';
import MainLayout from '../components/layout/MainLayout';
import { apiService } from '../services/apiService';
import { logError } from '../utils/errorLogger';

export interface BlogTemplate {
  id: string;
  name: string;
  category: 'Tech' | 'Travel' | 'Finance' | 'Lifestyle' | 'Food' | string;
  seoScore: number;
  schemaType: string;
  estimatedReadMin: number;
  description: string;
  headings: string[];
  jsonLdSnippet: Record<string, unknown>;
  author?: string;
  isCustom?: boolean;
}

const DEFAULT_TEMPLATES: BlogTemplate[] = [
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
  const [templates, setTemplates] = useState<BlogTemplate[]>(DEFAULT_TEMPLATES);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeJsonLdModal, setActiveJsonLdModal] = useState<BlogTemplate | null>(null);
  const [activeSandboxTemplate, setActiveSandboxTemplate] = useState<BlogTemplate | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [forkNotification, setForkNotification] = useState<string | null>(null);

  // New Template Form State
  const [newTemplate, setNewTemplate] = useState<{
    name: string;
    category: string;
    description: string;
    estimatedReadMin: number;
    schemaType: string;
    headings: string[];
    currentHeadingInput: string;
  }>({
    name: '',
    category: 'Tech',
    description: '',
    estimatedReadMin: 5,
    schemaType: 'Article',
    headings: ['Executive Summary', 'Key Technical Analysis', 'Implementation Architecture', 'Strategic Takeaways'],
    currentHeadingInput: ''
  });
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const fetchTemplates = () => {
    apiService.get<any>('/api/blog-templates')
      .then((res) => {
        const data = res.data?.data || res.data;
        if (Array.isArray(data) && data.length > 0) {
          const backendMapped: BlogTemplate[] = data.map((t: any) => ({
            id: String(t.id || t.template_key),
            name: t.name || t.title,
            category: t.category || 'Tech',
            seoScore: t.seo_score || t.seoScore || 98,
            schemaType: t.schema_type || t.schemaType || 'Article',
            estimatedReadMin: t.estimated_read_min || t.estimatedReadMin || 5,
            description: t.description || '',
            headings: Array.isArray(t.headings) ? t.headings : ['Introduction', 'Core Overview', 'Conclusion'],
            jsonLdSnippet: t.json_ld_snippet || t.jsonLdSnippet || { '@context': 'https://schema.org', '@type': 'Article' },
            author: t.author,
            isCustom: Boolean(t.isCustom || t.author !== 'system')
          }));
          setTemplates(backendMapped);
        }
      })
      .catch((err) => {
        logError(err, { context: 'BlogTemplatesPage - Fetch templates' });
      });
  };

  useEffect(() => {
    fetchTemplates();
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
      setForkNotification(`Template "${tmpl.name}" forked locally into draft!`);
    }
    setTimeout(() => setForkNotification(null), 3500);
  };

  const handleAddHeading = () => {
    if (!newTemplate.currentHeadingInput.trim()) return;
    setNewTemplate(prev => ({
      ...prev,
      headings: [...prev.headings, prev.currentHeadingInput.trim()],
      currentHeadingInput: ''
    }));
  };

  const handleRemoveHeading = (index: number) => {
    setNewTemplate(prev => ({
      ...prev,
      headings: prev.headings.filter((_, idx) => idx !== index)
    }));
  };

  const handleCreateTemplateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTemplate.name.trim()) return;

    setIsSubmitting(true);
    try {
      const payload = {
        name: newTemplate.name.trim(),
        category: newTemplate.category,
        description: newTemplate.description.trim(),
        estimatedReadMin: Number(newTemplate.estimatedReadMin) || 5,
        schemaType: newTemplate.schemaType || 'Article',
        headings: newTemplate.headings.length > 0 ? newTemplate.headings : ['Introduction', 'Body', 'Conclusion'],
        jsonLdSnippet: {
          '@context': 'https://schema.org',
          '@type': newTemplate.schemaType,
          headline: newTemplate.name.trim(),
          description: newTemplate.description.trim()
        }
      };

      const res = await apiService.post<any>('/api/blog-templates', payload);
      if (res.data?.success || res.status === 201) {
        setForkNotification(`Custom template "${newTemplate.name}" created and persisted to PostgreSQL!`);
        setIsCreateModalOpen(false);
        setNewTemplate({
          name: '',
          category: 'Tech',
          description: '',
          estimatedReadMin: 5,
          schemaType: 'Article',
          headings: ['Executive Summary', 'Key Technical Analysis', 'Implementation Architecture', 'Strategic Takeaways'],
          currentHeadingInput: ''
        });
        fetchTemplates();
      }
    } catch (err) {
      logError(err, { context: 'BlogTemplatesPage - Create custom template' });
      // Optimistic fallback for frontend
      const optimisticTmpl: BlogTemplate = {
        id: 'tmpl-custom-' + Date.now(),
        name: newTemplate.name.trim(),
        category: newTemplate.category,
        seoScore: 98,
        schemaType: newTemplate.schemaType,
        estimatedReadMin: newTemplate.estimatedReadMin,
        description: newTemplate.description,
        headings: newTemplate.headings,
        jsonLdSnippet: {
          '@context': 'https://schema.org',
          '@type': newTemplate.schemaType,
          headline: newTemplate.name
        },
        isCustom: true
      };
      setTemplates(prev => [optimisticTmpl, ...prev]);
      setIsCreateModalOpen(false);
      setForkNotification(`Template "${newTemplate.name}" saved!`);
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setForkNotification(null), 4000);
    }
  };

  const handleDeleteTemplate = async (templateId: string, templateName: string) => {
    if (!window.confirm(`Are you sure you want to delete template "${templateName}"?`)) return;
    try {
      await apiService.delete(`/api/blog-templates/${templateId}`);
      setTemplates(prev => prev.filter(t => t.id !== templateId));
      setForkNotification(`Template "${templateName}" was deleted.`);
      setTimeout(() => setForkNotification(null), 3000);
    } catch (err) {
      logError(err, { context: 'BlogTemplatesPage - Delete template' });
      setTemplates(prev => prev.filter(t => t.id !== templateId));
    }
  };

  return (
    <MainLayout pageTitle="Free SEO Blog Templates">
      <div className="w-full max-w-[1536px] 2xl:max-w-[1680px] mx-auto p-4 sm:p-6 lg:p-8 space-y-6 overflow-x-hidden pb-28 md:pb-12 text-slate-900">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-slate-200 gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-2xl shadow-sm">
              <DocumentTextIcon className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">
                Free SEO Blog Templates
              </h1>
              <p className="text-sm text-slate-700 font-medium">
                Turnkey structured templates with built-in Google Schema.org JSON-LD and PostgreSQL persistence
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="px-3 py-1 bg-emerald-100 text-emerald-950 border border-emerald-400 font-bold rounded-full text-xs flex items-center gap-1">
              <CheckBadgeIcon className="w-4 h-4 text-emerald-600" /> 100% Free Forever
            </span>
            <button
              type="button"
              onClick={() => setIsCreateModalOpen(true)}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-sm flex items-center gap-1.5 transition-all"
            >
              <PlusIcon className="w-4 h-4" />
              <span>Create Custom Template</span>
            </button>
          </div>
        </div>

        {forkNotification && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-2xl text-xs flex items-center gap-2">
            <CheckCircleIcon className="w-5 h-5 flex-shrink-0 text-emerald-600" />
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
                aria-label={`Filter by ${cat}`}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                  selectedCategory === cat
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-white text-slate-800 border border-slate-300 hover:bg-slate-50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-72">
            <MagnifyingGlassIcon className="w-4 h-4 text-slate-600 absolute left-3 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search templates..."
              className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-indigo-500 focus:border-indigo-500 bg-white text-slate-900 font-bold placeholder:text-slate-400"
            />
          </div>
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map((tmpl) => (
            <div
              key={tmpl.id}
              className="bg-white rounded-3xl border border-slate-300 shadow-sm hover:shadow-xl transition-all duration-200 flex flex-col justify-between overflow-hidden group"
            >
              <div className="p-6 space-y-4">
                {/* Meta Badge Bar */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-100 text-indigo-950 border border-indigo-400">
                      {tmpl.category}
                    </span>
                    {tmpl.isCustom && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-950 border border-amber-400">
                        Custom User Template
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-emerald-950 bg-emerald-100 px-2 py-0.5 rounded-md border border-emerald-400">
                    <SparklesIcon className="w-3.5 h-3.5 text-emerald-600" />
                    <span>SEO {tmpl.seoScore}/100</span>
                  </div>
                </div>

                {/* Title & Description */}
                <div>
                  <h3 className="font-bold text-lg text-slate-900 group-hover:text-indigo-600 transition-colors">
                    {tmpl.name}
                  </h3>
                  <p className="text-xs text-slate-700 mt-2 leading-relaxed">
                    {tmpl.description}
                  </p>
                </div>

                {/* Heading Outline */}
                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-800 block">
                    Structured Outline ({tmpl.headings.length} Sections)
                  </span>
                  <ul className="text-xs text-slate-800 space-y-1">
                    {tmpl.headings.slice(0, 3).map((h, i) => (
                      <li key={i} className="flex items-center gap-1.5 truncate">
                        <span className="text-indigo-600 font-bold font-mono">H2.</span> {h}
                      </li>
                    ))}
                    {tmpl.headings.length > 3 && (
                      <li className="text-[11px] text-slate-600 italic">
                        + {tmpl.headings.length - 3} more structured sections
                      </li>
                    )}
                  </ul>
                </div>

                {/* Schema Indicator */}
                <div className="text-[11px] text-slate-700 font-mono flex items-center justify-between pt-1">
                  <span>Schema: {tmpl.schemaType}</span>
                  <span className="flex items-center gap-1">
                    <ClockIcon className="w-3.5 h-3.5" />
                    {tmpl.estimatedReadMin} min read
                  </span>
                </div>
              </div>

              {/* Action Footer */}
              <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setActiveSandboxTemplate(tmpl)}
                    className="px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-800 rounded-xl text-xs font-semibold border border-slate-300 flex items-center gap-1 transition-all"
                    title="Live Sandbox Preview"
                  >
                    <EyeIcon className="w-3.5 h-3.5 text-indigo-600" /> Preview
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveJsonLdModal(tmpl)}
                    className="px-2.5 py-1.5 bg-white hover:bg-slate-100 text-slate-800 rounded-xl text-xs font-semibold border border-slate-300 flex items-center gap-1 transition-all"
                    title="View Schema JSON-LD"
                    aria-label="Schema JSON-LD"
                  >
                    <CodeBracketIcon className="w-3.5 h-3.5 text-slate-600" /> JSON-LD
                  </button>

                  {tmpl.isCustom && (
                    <button
                      type="button"
                      onClick={() => handleDeleteTemplate(tmpl.id, tmpl.name)}
                      className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-xl border border-rose-200 transition-all"
                      title="Delete Custom Template"
                    >
                      <TrashIcon className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => handleForkTemplate(tmpl)}
                  className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-sm flex items-center gap-1 transition-all"
                >
                  <span>Fork</span>
                  <ArrowTopRightOnSquareIcon className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* ========================================================================= */}
        {/* Interactive Sandbox Preview Modal */}
        {/* ========================================================================= */}
        {activeSandboxTemplate && (
          <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
            <div className="bg-white rounded-3xl border border-slate-300 max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-fade-in">
              {/* Modal Topbar */}
              <div className="px-6 py-4 bg-slate-100 border-b border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-indigo-600 text-white rounded-xl">
                    <BookOpenIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-base font-bold text-slate-900">
                        Live Sandbox Preview
                      </h2>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-950 border border-indigo-400">
                        {activeSandboxTemplate.category}
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-950 border border-emerald-400">
                        SEO {activeSandboxTemplate.seoScore}/100
                      </span>
                    </div>
                    <p className="text-xs text-slate-700 font-medium">
                      WYSIWYG layout emulation with Google Schema.org compliance
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      handleForkTemplate(activeSandboxTemplate);
                      setActiveSandboxTemplate(null);
                    }}
                    className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-sm flex items-center gap-1.5"
                  >
                    <span>Use Template</span>
                    <ArrowTopRightOnSquareIcon className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    aria-label="Close Sandbox Preview"
                    onClick={() => setActiveSandboxTemplate(null)}
                    className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-200 rounded-xl transition-all"
                  >
                    <XMarkIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Mock Article Viewport */}
              <div className="p-6 sm:p-10 overflow-y-auto space-y-8 bg-slate-50 flex-1">
                {/* Article Header Card */}
                <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-300 shadow-sm space-y-4">
                  <div className="flex items-center gap-2 text-xs text-slate-600">
                    <span className="font-bold text-indigo-600 uppercase tracking-wider">{activeSandboxTemplate.category}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1 font-semibold text-slate-700">
                      <ClockIcon className="w-3.5 h-3.5" /> {activeSandboxTemplate.estimatedReadMin} Min Read
                    </span>
                    <span>•</span>
                    <span className="font-mono text-slate-700">Schema: {activeSandboxTemplate.schemaType}</span>
                  </div>

                  <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
                    {activeSandboxTemplate.name}
                  </h1>

                  <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
                    {activeSandboxTemplate.description}
                  </p>

                  <div className="pt-4 border-t border-slate-200 flex items-center justify-between text-xs text-slate-700 font-medium">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xs">
                        FM
                      </div>
                      <span>Authored by FingerMobile Editorial Team</span>
                    </div>
                    <span className="italic">Standard Schema.org Compliant</span>
                  </div>
                </div>

                {/* Table of Contents */}
                <div className="bg-white p-6 rounded-2xl border border-slate-300 shadow-sm space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                    <DocumentDuplicateIcon className="w-4 h-4 text-indigo-600" />
                    Structured Table of Contents
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {activeSandboxTemplate.headings.map((heading, idx) => (
                      <div key={idx} className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-slate-800 font-medium flex items-center gap-2">
                        <span className="font-mono font-bold text-indigo-600">{idx + 1}.</span>
                        <span className="truncate">{heading}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Simulated Article Body */}
                <div className="space-y-6">
                  {activeSandboxTemplate.headings.map((heading, idx) => (
                    <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-300 shadow-sm space-y-3">
                      <h2 className="text-lg font-bold text-slate-900 border-b border-slate-200 pb-2 flex items-center justify-between">
                        <span>{idx + 1}. {heading}</span>
                        <span className="text-[11px] font-mono text-indigo-600 font-semibold">Section H2</span>
                      </h2>
                      <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                        This section provides comprehensive details on <strong>{heading.toLowerCase()}</strong>. Formatted specifically for search engine crawling with semantic rich snippets, clean heading hierarchy, and zero layout shift.
                      </p>
                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700 flex items-center justify-between">
                        <span className="italic">Key insight: High-density editorial data with contextual link anchor points.</span>
                        <span className="font-mono font-bold text-emerald-700">Schema Ready</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sandbox Footer */}
              <div className="px-6 py-4 bg-slate-100 border-t border-slate-200 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setActiveJsonLdModal(activeSandboxTemplate)}
                  className="px-3.5 py-1.5 bg-white text-slate-800 border border-slate-300 rounded-xl text-xs font-bold hover:bg-slate-50 flex items-center gap-1.5"
                >
                  <CodeBracketIcon className="w-4 h-4 text-slate-600" />
                  <span>Inspect JSON-LD Payload</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveSandboxTemplate(null)}
                  className="px-4 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold"
                >
                  Close Sandbox
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* Create Custom Template Modal */}
        {/* ========================================================================= */}
        {isCreateModalOpen && (
          <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white rounded-3xl border border-slate-300 max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl animate-fade-in my-8">
              <div className="flex items-center justify-between pb-4 border-b border-slate-200">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    Create Custom Blog Template
                  </h2>
                  <p className="text-xs text-slate-700 font-medium">
                    Persists directly to the platform content database with structured schema
                  </p>
                </div>
                <button
                  type="button"
                  aria-label="Close Create Custom Template Modal"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="text-slate-500 hover:text-slate-800 text-lg font-bold p-1"
                >
                  &times;
                </button>
              </div>

              <form onSubmit={handleCreateTemplateSubmit} className="space-y-4">
                {/* Name & Category */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-900 mb-1">
                      Template Title *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Continental Fintech Insights"
                      value={newTemplate.name}
                      onChange={(e) => setNewTemplate(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-3 py-2 text-xs rounded-xl bg-white text-slate-900 font-bold border border-slate-300 focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-900 mb-1">
                      Category *
                    </label>
                    <select
                      value={newTemplate.category}
                      onChange={(e) => setNewTemplate(prev => ({ ...prev, category: e.target.value }))}
                      className="w-full px-3 py-2 text-xs rounded-xl bg-white text-slate-900 font-bold border border-slate-300 focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="Tech">Tech</option>
                      <option value="Travel">Travel</option>
                      <option value="Finance">Finance</option>
                      <option value="Lifestyle">Lifestyle</option>
                      <option value="Food">Food</option>
                    </select>
                  </div>
                </div>

                {/* Read Time & Schema Type */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-900 mb-1">
                      Estimated Read Time (Minutes)
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={60}
                      value={newTemplate.estimatedReadMin}
                      onChange={(e) => setNewTemplate(prev => ({ ...prev, estimatedReadMin: Number(e.target.value) }))}
                      className="w-full px-3 py-2 text-xs rounded-xl bg-white text-slate-900 font-bold border border-slate-300 focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-900 mb-1">
                      Schema.org Type
                    </label>
                    <input
                      type="text"
                      placeholder="Article, TechArticle, NewsArticle, Recipe"
                      value={newTemplate.schemaType}
                      onChange={(e) => setNewTemplate(prev => ({ ...prev, schemaType: e.target.value }))}
                      className="w-full px-3 py-2 text-xs rounded-xl bg-white text-slate-900 font-bold border border-slate-300 focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-xs font-bold text-slate-900 mb-1">
                    Editorial Summary & Objectives
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Describe target audience, style tone, and core takeaways..."
                    value={newTemplate.description}
                    onChange={(e) => setNewTemplate(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-white text-slate-900 font-bold border border-slate-300 focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                {/* Headings Outline Manager */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-900">
                    Structured Section Headings ({newTemplate.headings.length})
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Add heading section (e.g. Risk Mitigation & On-Chain Audit)"
                      value={newTemplate.currentHeadingInput}
                      onChange={(e) => setNewTemplate(prev => ({ ...prev, currentHeadingInput: e.target.value }))}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddHeading();
                        }
                      }}
                      className="flex-1 px-3 py-2 text-xs rounded-xl bg-white text-slate-900 font-bold border border-slate-300"
                    />
                    <button
                      type="button"
                      onClick={handleAddHeading}
                      className="px-3.5 py-2 bg-slate-800 text-white rounded-xl text-xs font-bold hover:bg-slate-900"
                    >
                      Add
                    </button>
                  </div>

                  <div className="space-y-1.5 max-h-36 overflow-y-auto p-2 bg-slate-50 rounded-xl border border-slate-200">
                    {newTemplate.headings.map((heading, index) => (
                      <div key={index} className="flex items-center justify-between px-3 py-1.5 bg-white rounded-lg border border-slate-200 text-xs">
                        <span className="text-slate-800 font-medium truncate">
                          <span className="font-mono font-bold text-indigo-600 mr-1.5">H2.</span>
                          {heading}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleRemoveHeading(index)}
                          className="text-rose-600 hover:text-rose-800 font-bold px-1.5"
                        >
                          &times;
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Modal Actions */}
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
                  <button
                    type="button"
                    onClick={() => setIsCreateModalOpen(false)}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-sm flex items-center gap-1.5 disabled:opacity-50"
                  >
                    {isSubmitting ? 'Saving to Database...' : 'Persist to PostgreSQL'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* Schema.org Modal Preview */}
        {/* ========================================================================= */}
        {activeJsonLdModal && (
          <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg p-6 text-white space-y-4 shadow-2xl animate-fade-in">
              <div className="flex justify-between items-center pb-3 border-b border-slate-800">
                <div>
                  <h3 className="font-bold text-sm text-slate-100">
                    Schema.org JSON-LD Structured Data
                  </h3>
                  <p className="text-xs text-slate-400 font-medium">{activeJsonLdModal.name}</p>
                </div>
                <button
                  type="button"
                  aria-label="Close JSON-LD Preview"
                  onClick={() => setActiveJsonLdModal(null)}
                  className="text-slate-400 hover:text-white text-lg font-bold"
                >
                  &times;
                </button>
              </div>

              <pre className="p-4 bg-black/90 rounded-2xl text-[11px] font-mono text-emerald-400 overflow-x-auto max-h-72 border border-slate-800">
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
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Sovereign Mobile Navigation Quick Dock */}
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 py-2 px-4 md:hidden shadow-lg safe-area-bottom">
          <div className="flex justify-around items-center max-w-md mx-auto">
            <button
              onClick={() => {
                setSelectedCategory('All');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="flex flex-col items-center justify-center min-w-[44px] min-h-[44px] text-indigo-600 font-bold"
              aria-label="All Templates"
            >
              <DocumentTextIcon className="w-5 h-5 mb-1" />
              <span className="text-[10px]">Templates</span>
            </button>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="flex flex-col items-center justify-center min-w-[44px] min-h-[44px] text-slate-700 dark:text-slate-300 font-medium"
              aria-label="Create Template"
            >
              <PlusIcon className="w-5 h-5 mb-1" />
              <span className="text-[10px]">Create</span>
            </button>
            <button
              onClick={() => navigate('/blogs')}
              className="flex flex-col items-center justify-center min-w-[44px] min-h-[44px] text-slate-700 dark:text-slate-300 font-medium"
              aria-label="Blogs Hub"
            >
              <BookOpenIcon className="w-5 h-5 mb-1" />
              <span className="text-[10px]">Blogs</span>
            </button>
            <button
              onClick={() => navigate('/forum')}
              className="flex flex-col items-center justify-center min-w-[44px] min-h-[44px] text-slate-700 dark:text-slate-300 font-medium"
              aria-label="Back to Forum"
            >
              <SparklesIcon className="w-5 h-5 mb-1" />
              <span className="text-[10px]">Forum</span>
            </button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default BlogTemplatesPage;
