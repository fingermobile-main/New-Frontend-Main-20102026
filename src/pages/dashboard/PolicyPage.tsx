import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../contexts/AppContext';
import PolicyEditorModal from '../../components/PolicyEditorModal';
import legalComplianceService, { LegalDocument } from '../../services/legalComplianceService';
import PlatformOwnershipCard from '../../components/dashboard/PlatformOwnershipCard';
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
      <PlatformOwnershipCard />

      {isModalOpen && editingDoc && (
        <PolicyEditorModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          policyType={editingDoc.title}
          currentPolicy={editingDoc.content || ''}
          onSave={handleSaveDoc}
        />
      )}

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-300 pb-5">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <DocumentTextIcon className="w-8 h-8 text-blue-600" />
            <span>Policy & Statutory Document Management</span>
          </h1>
          <p className="text-slate-700 font-semibold text-sm mt-1">
            Authoritative regulatory policies versioned and stored in PostgreSQL cluster.
          </p>
        </div>
        <button
          onClick={fetchDocs}
          className="px-4 py-2 text-xs font-bold bg-white border border-slate-300 text-slate-800 rounded-xl hover:bg-slate-50 flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
        >
          <ArrowPathIcon className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-blue-600' : ''}`} />
          Refresh Documents
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-300 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-300">
              <tr>
                <th className="p-4 font-bold text-xs uppercase tracking-wider text-slate-800">Document Title</th>
                <th className="p-4 font-bold text-xs uppercase tracking-wider text-slate-800">Slug</th>
                <th className="p-4 font-bold text-xs uppercase tracking-wider text-slate-800">Version</th>
                <th className="p-4 font-bold text-xs uppercase tracking-wider text-slate-800">Status</th>
                <th className="p-4 font-bold text-xs uppercase tracking-wider text-slate-800">Effective Date</th>
                <th className="p-4 font-bold text-xs uppercase tracking-wider text-slate-800 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-sm bg-white">
              {documents.length > 0 ? (
                documents.map((doc) => (
                  <tr key={doc.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4">
                      <div className="font-bold text-slate-900">{doc.title}</div>
                      {doc.summary && (
                        <div className="text-xs text-slate-700 font-semibold truncate max-w-md mt-0.5">{doc.summary}</div>
                      )}
                    </td>
                    <td className="p-4 font-mono text-xs text-slate-700 font-semibold">{doc.slug}</td>
                    <td className="p-4 font-bold text-slate-800">v{doc.version}</td>
                    <td className="p-4">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-950 border border-emerald-400">
                        <CheckCircleIcon className="w-3.5 h-3.5 text-emerald-700" />
                        {doc.is_active ? 'Active' : 'Draft'}
                      </span>
                    </td>
                    <td className="p-4 text-xs font-semibold text-slate-700">
                      {new Date(doc.effective_date).toLocaleDateString()}
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => openEditModal(doc)}
                        className="px-3 py-1.5 bg-blue-50 text-blue-800 rounded-lg text-xs font-bold hover:bg-blue-100 transition-colors border border-blue-300 cursor-pointer"
                      >
                        Edit Policy
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-700 font-semibold text-sm">
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
