import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../contexts/AppContext';
import PolicyEditorModal from '../../components/PolicyEditorModal';
import legalComplianceService, { LegalDocument } from '../../services/legalComplianceService';
import { DocumentTextIcon, CheckCircleIcon, ArrowPathIcon } from '../../icons';

const PolicyPage: React.FC = () => {
  const { showToast } = useAppContext();
  const [documents, setDocuments] = useState<LegalDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDoc, setEditingDoc] = useState<LegalDocument | null>(null);

  const fetchDocs = async () => {
    setLoading(true);
    try {
      const data = await legalComplianceService.getLegalDocuments();
      setDocuments(data);
    } catch (err) {
      console.warn('Could not load legal documents:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocs();
  }, []);

  const openEditModal = (doc: LegalDocument) => {
    setEditingDoc(doc);
    setIsModalOpen(true);
  };

  const handleSaveDoc = async (newContent: string) => {
    if (!editingDoc) return;
    try {
      await legalComplianceService.updateLegalDocument(editingDoc.slug, {
        content: newContent
      });
      showToast(`${editingDoc.title} updated successfully in PostgreSQL database!`, 'success');
      setIsModalOpen(false);
      fetchDocs();
    } catch (err: any) {
      showToast(err.response?.data?.error || 'Failed to update policy.', 'error');
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {isModalOpen && editingDoc && (
        <PolicyEditorModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          policyType={editingDoc.title}
          currentPolicy={editingDoc.content || ''}
          onSave={handleSaveDoc}
        />
      )}

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <DocumentTextIcon className="w-7 h-7 text-blue-600" />
            <span>Policy & Statutory Document Management</span>
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Authoritative regulatory policies versioned and stored in PostgreSQL cluster.
          </p>
        </div>
        <button
          onClick={fetchDocs}
          className="px-4 py-2 text-xs font-bold bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-xl hover:bg-slate-50 flex items-center gap-1.5 shadow-sm transition-all"
        >
          <ArrowPathIcon className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          Refresh Documents
        </button>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="p-4 font-bold text-xs uppercase tracking-wider text-slate-600 dark:text-slate-400">Document Title</th>
                <th className="p-4 font-bold text-xs uppercase tracking-wider text-slate-600 dark:text-slate-400">Slug</th>
                <th className="p-4 font-bold text-xs uppercase tracking-wider text-slate-600 dark:text-slate-400">Version</th>
                <th className="p-4 font-bold text-xs uppercase tracking-wider text-slate-600 dark:text-slate-400">Status</th>
                <th className="p-4 font-bold text-xs uppercase tracking-wider text-slate-600 dark:text-slate-400">Effective Date</th>
                <th className="p-4 font-bold text-xs uppercase tracking-wider text-slate-600 dark:text-slate-400 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60 text-sm">
              {documents.length > 0 ? (
                documents.map((doc) => (
                  <tr key={doc.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-750 transition-colors">
                    <td className="p-4">
                      <div className="font-bold text-slate-900 dark:text-white">{doc.title}</div>
                      {doc.summary && (
                        <div className="text-xs text-slate-500 truncate max-w-md mt-0.5">{doc.summary}</div>
                      )}
                    </td>
                    <td className="p-4 font-mono text-xs text-slate-500">{doc.slug}</td>
                    <td className="p-4 font-semibold text-slate-700 dark:text-slate-300">v{doc.version}</td>
                    <td className="p-4">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-950 border border-emerald-400  dark:bg-emerald-900/40 dark:text-emerald-300 font-black">
                        <CheckCircleIcon className="w-3 h-3" />
                        {doc.is_active ? 'Active' : 'Draft'}
                      </span>
                    </td>
                    <td className="p-4 text-xs text-slate-600 dark:text-slate-400">
                      {new Date(doc.effective_date).toLocaleDateString()}
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => openEditModal(doc)}
                        className="px-3 py-1.5 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg text-xs font-bold hover:bg-blue-100 transition-colors border border-blue-200 dark:border-blue-800"
                      >
                        Edit Policy
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-500 text-sm">
                    {loading ? 'Retrieving policies from PostgreSQL...' : 'No legal policies registered.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PolicyPage;
