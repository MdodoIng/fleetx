import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import {
  Activity,
  Axis3dIcon,
  Download,
  Edit,
  GitBranch,
  MagnetIcon,
  Minus,
  Phone,
  Search,
  User,
  User2,
} from 'lucide-react';
import TableComponent from './TableComponent';
import { TypeVenderList, TypeVenderListItem } from '@/shared/types/vender';
import { Dispatch, SetStateAction } from 'react';
import { useVenderStore } from '@/store';

type Props = {
  setSearchValue: Dispatch<SetStateAction<string | null>>;
  fetchVenderList: () => Promise<void>;
  data: TypeVenderList;
  page: number;
  nextSetItemTotal: any;
  setPage: Dispatch<SetStateAction<number>>;
};

const VendersList = ({
  setSearchValue,
  fetchVenderList,
  data,
  page,
  nextSetItemTotal,
  setPage,
}: Props) => {
  const vederStore = useVenderStore();

  const handleEditClick = (item: TypeVenderListItem) => {
    vederStore.setValue('isEditVenderId', item.id);
    console.log(item.id);
  };

  const tableData = data?.map((item) => {
    return [
      {
        icon: User2,
        title: 'Vender',
        value: item.name,
      },
      {
        icon: GitBranch,
        title: 'Branch',
        value: item.main_branch.name,
      },
      {
        icon: Phone,
        title: 'Phone',
        value: item.main_branch.mobile_number,
      },
      {
        icon: Axis3dIcon,
        title: 'Phone',
        value: `${item.main_branch.address.area}, ${item.main_branch.address.block}, ${item.main_branch.address.street}`,
      },
      {
        icon: MagnetIcon,
        title: 'Account Manager',
        value: item.account_manager ? <Activity /> : <Minus />,
      },
      {
        icon: User2,
        title: 'Users',
        value: <User />,
      },
      {
        icon: Edit,
        title: ' Action',
        value: <Edit />,
        onClick: () => handleEditClick(item),
      },
    ];
  });
  return (
    <>
      <div className="flex items-center justify-between w-[calc(100%-16px)] bg-gray-200 px-3 py-3 mx-2 my-2 rounded">
        <div className="flex items-center justify-between gap-10 ">
          <h2 className="text-xl font-semibold text-gray-900">Vendor List</h2>
          <div className="flex items-center justify-center gap-1.5">
            <div className="flex items-center gap-1.5">
              <Input
                type="text"
                placeholder="Search..."
                onChange={(e) => setSearchValue(e.target.value)}
              />
              <Button
                onClick={async () => await fetchVenderList()}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <Search className="w-5 h-5" /> Search
              </Button>
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="flex items-center justify-center gap-1.5">
          <Button
            // onClick={() => exportOrdersToCSV(data!, 'balance-report', ``)}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <Download className="w-5 h-5" /> Export
          </Button>
        </div>
      </div>

      {data?.length ? (
        <TableComponent
          data={tableData as any}
          page={page}
          setPage={setPage}
          nextSetItemTotal={nextSetItemTotal}
        />
      ) : (
        <>no data</>
      )}
    </>
  );
};

export default VendersList;
