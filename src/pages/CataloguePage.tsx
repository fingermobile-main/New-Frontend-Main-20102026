import React from 'react';
import { useAppContext } from "../contexts/AppContext";
import PhotoCreditCard from '../components/PhotoCreditCard';
import { CatalogueIcon } from '../icons';
import type { PhotoCreditItem } from '../types/models';
import WatermarkPreviewModal from '../components/WatermarkPreviewModal';

const CataloguePage: React.FC = () => {
  const {
    photoCreditItems,
    handleVoteOnPhotoCredit,
    handleDownloadPhotoCredit,
    showToast
  } = useAppContext();
  const [searchTerm, setSearchTerm] = React.useState("");
  const [filters, setFilters] = React.useState({
    category: "all",
    orientation: "all",
    color: "all"
  });
  const [itemToDownload, setItemToDownload] = React.useState<PhotoCreditItem | null>(
    null,
  );

  const handleFilterChange = (
    filterType: keyof typeof filters,
    value: string,
  ) => {
    setFilters((prev) => ({ ...prev, [filterType]: value }));
  };

  const onDownloadClick = (item: PhotoCreditItem) => {
    handleDownloadPhotoCredit(item.id as any);
    setItemToDownload(item);
  };

  const filteredItems = photoCreditItems.filter((item: PhotoCreditItem) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.tags?.some((tag: string) =>
        tag.toLowerCase().includes(searchTerm.toLowerCase()),
      );

    const matchesCategory =
      filters.category === "all" || item.tags?.includes(filters.category);
    const matchesOrientation =
      filters.orientation === "all" || (item as any).orientation === filters.orientation;
    const matchesColor =
      filters.color === "all" || item.tags?.includes(filters.color);

    return (
      matchesSearch && matchesCategory && matchesOrientation && matchesColor
    );
  });

  const FilterSidebar = () => {
    const FilterGroup: React.FC<{
      title: string;
      children: React.ReactNode;
    }> = ({ title, children }) => (
      <div>
        <h4 className="font-semibold text-gray-700 mb-2">{title}</h4>
        <div className="flex flex-wrap gap-2">{children}</div>
      </div>
    );
    const FilterButton: React.FC<{
      filterKey: keyof typeof filters;
      value: string;
      label: string;
    }> = ({ filterKey, value, label }) => (
      <button
        onClick={() => handleFilterChange(filterKey, value)}
        className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-colors ${
          filters[filterKey] === value
            ? "bg-brand-blue text-white border-brand-blue"
            : "bg-white text-gray-600 border-gray-300 hover:border-gray-500"
        }`}
      >
        {label}
      </button>
    );

    return (
      <div className="bg-white p-4 rounded-xl shadow-sm sticky top-24">
        <h3 className="font-bold text-lg mb-4">Filters</h3>
        <div className="space-y-6">
          <FilterGroup title="Category">
            <FilterButton filterKey="category" value="all" label="All" />
            <FilterButton filterKey="category" value="nature" label="Nature" />
            <FilterButton filterKey="category" value="urban" label="Urban" />
            <FilterButton filterKey="category" value="city" label="City" />
          </FilterGroup>
          <FilterGroup title="Orientation">
            <FilterButton filterKey="orientation" value="all" label="All" />
            <FilterButton
              filterKey="orientation"
              value="landscape"
              label="Landscape"
            />
            <FilterButton
              filterKey="orientation"
              value="portrait"
              label="Portrait"
            />
            <FilterButton
              filterKey="orientation"
              value="square"
              label="Square"
            />
          </FilterGroup>
          <FilterGroup title="Color">
            <FilterButton filterKey="color" value="all" label="All" />
            <FilterButton filterKey="color" value="blue" label="Blue" />
            <FilterButton filterKey="color" value="green" label="Green" />
            <FilterButton filterKey="color" value="night" label="Night" />
          </FilterGroup>
        </div>
      </div>
    );
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {itemToDownload && (
        <WatermarkPreviewModal
          isOpen={!!itemToDownload}
          imageUrl={itemToDownload.imageUrl}
          onClose={() => setItemToDownload(null)}
        />
      )}
      <div className="flex items-center gap-4 mb-6">
        <CatalogueIcon className="w-10 h-10 text-brand-blue" />
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Catalogue
          </h1>
          <p className="text-gray-600">
            Browse all monetizable assets from our creators.
          </p>
        </div>
      </div>

      <div className="mb-6">
        <input
          type="text"
          placeholder="Search by title, description, or tags..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-4 pr-4 py-3 border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-blue transition-shadow"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <aside className="md:col-span-1">
          <FilterSidebar />
        </aside>
        <main className="md:col-span-3">
          {filteredItems.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {photoCreditItems.map((item: PhotoCreditItem) => (
                <PhotoCreditCard
                  key={item.id}
                  item={{
                    id: item.id,
                    uploader: { 
                      id: item.uploader?.id || '', 
                      name: item.uploader?.name || 'Unknown', 
                      membername: item.uploader?.membername || 'unknown', 
                      avatarUrl: item.uploader?.avatarUrl || '', 
                      animatedAvatarUrl: item.uploader?.animatedAvatarUrl || '', 
                      isVerified: item.uploader?.isVerified || false 
                    },
                    imageUrl: item.image || '',
                    title: item.title,
                    description: item.description,
                    tags: [],
                    license: 'standard'
                  }}
                  onLike={() => handleVoteOnPhotoCredit(item.id)}
                  onAddComment={() => showToast('Comments coming soon')}
                  onOpenGiftModal={() => showToast('Gifts coming soon')}
                  onOpenPaylinkModal={() => showToast('Paylinks coming soon')}
                  onVote={() => handleVoteOnPhotoCredit(item.id)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-500 py-12 bg-white rounded-xl shadow-sm">
              <p className="font-semibold">No items match your filters.</p>
              <p className="text-sm">Try adjusting your search or filters.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default CataloguePage;
