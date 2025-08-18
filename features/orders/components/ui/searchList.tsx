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
}

const SearchResults: React.FC<Props> = ({
  searchData,
  loading,
  handleAddressClick,
}) => {
  return (
    <div className="mt-2 grid px-10 py-4 gap-2 absolute w-full bg-yellow-300 top-full left-0 max-h-[200px] overflow-y-auto ">
      {' '}
      {loading ? (
        '...'
      ) : (
        <>
          {searchData.map((item) => (
            <span
              key={item.id}
              className="px-2 py-1 bg-gray-200 rounded cursor-pointer"
              onClick={() => handleAddressClick(item)}
            >
              {item.name_en}
            </span>
          ))}
        </>
      )}
    </div>
  );
};

export default SearchResults;
