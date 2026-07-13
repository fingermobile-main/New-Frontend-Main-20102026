import React from 'react';
import { useAppContext } from '../../../contexts/AppContext';
import type { NavigationSection } from '../../../types';

// Define NavLinkData if it's not already defined in types
interface NavLinkData {
  id?: string;
  title?: string;
  name?: string;
  path: string;
  icon?: any;
}

const SiteMenusPage: React.FC = () => {
    const { navStructure, handleUpdateNavStructure } = useAppContext();
    const { showToast } = useAppContext();
    // Note: Without DnD, editing order is currently disabled. 
    // Structure is just displayed.
    const [structure] = React.useState<NavigationSection[]>(JSON.parse(JSON.stringify(navStructure)));
    const [isSaving, setIsSaving] = React.useState(false);
    
    const handleSave = () => {
        setIsSaving(true);
        try {
            // In a real scenario with editing, we would save the modified structure.
            // Currently just saving the initial structure as no edits are possible without DnD or other inputs.
            if (handleUpdateNavStructure) {
                handleUpdateNavStructure(structure);
            }
            showToast('Navigation structure saved!', 'success');
        } catch (err) {
            console.error('Error saving nav structure:', err);
            showToast('Failed to save navigation structure', 'error');
        } finally {
            setIsSaving(false);
        }
    };

    const NavLinkItem: React.FC<{ link: NavLinkData }> = ({ link }) => {
        return (
            <div className="p-2 bg-gray-100 rounded flex items-center gap-2">
                {link.icon && React.createElement(link.icon as any, { className: "w-4 h-4 text-gray-500" })}
                <span className="text-sm font-medium">{link.name}</span>
            </div>
        );
    };

    const Section: React.FC<{ section: NavigationSection }> = ({ section }) => {
        return (
             <div className="bg-gray-50 p-4 rounded-lg border">
                <h3 className="font-bold text-gray-700 mb-3">{section.title}</h3>
                <div className="space-y-2 min-h-[50px]">
                    {(section.links || []).map((link, linkIdx) => (
                        <NavLinkItem key={link.path} link={link} />
                    ))}
                </div>
            </div>
        );
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Menu Management</h1>
                <button onClick={handleSave} disabled={isSaving} className="px-4 py-2 text-sm font-semibold bg-brand-blue text-white rounded-full disabled:bg-gray-400">
                    {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {structure.map((section, sectionIdx) => (
                    <Section key={section.title} section={section} />
                ))}
            </div>
        </div>
    );
};

export default SiteMenusPage;
