import { cn } from '@/shared/lib/utils';

type SearchItem =
  | {
      id: string;
      name_en: string;
    }
  | any;

interface Props {
  searchData: SearchItem[];
  loading: boolean;
  handleAddressClick: (item: SearchItem) => void;
  isMapOpen?: boolean;
}

const SearchResults: React.FC<Props> = ({
  searchData,
  loading,
  handleAddressClick,
  isMapOpen,
}) => {
  return (
    <div
      id="landmark-input-container"
      className={cn(
        'mt-2 grid px-4 py-4 gap-2 absolute w-full bg-white border border-dark-grey/25 rounded-[8px]  top-16 z-50 left-0 max-h-[200px] overflow-y-auto',
        isMapOpen ? 'w-[97%] mx-[10px]' : ''
      )}
    >
      {searchData.map((item) => (
        <span
          key={item.id}
          className="px-2 h-10 flex items-center hover:bg-dark-grey/25 bg-off-white rounded cursor-pointer w-full"
          onClick={() => handleAddressClick(item)}
        >
          {item.name_en}
        </span>
      ))}
    </div>
  );
};

export default SearchResults;
