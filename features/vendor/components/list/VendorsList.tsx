import {
  Activity,
  Axis3dIcon,
  Edit,
  GitBranch,
  MagnetIcon,
  Minus,
  Phone,
  User,
  User2,
} from 'lucide-react';

import { TypeVendorList, TypeVendorListItem } from '@/shared/types/vendor';
import { useVendorStore } from '@/store';
import { Dispatch, SetStateAction } from 'react';

import {
  Table,
  TableLists,
  TableSigleList,
  TableSigleListContent,
  TableSigleListContentDetailsTitle,
  TableSigleListContents,
  TableSigleListContentTitle,
} from '@/shared/components/ui/tableList';
import { useRouter } from 'next/navigation';

type Props = {
  setSearchValue: Dispatch<SetStateAction<string | null>>;
  fetchVendorList: () => Promise<void>;
  data: TypeVendorList;
  page: number;
  nextSetItemTotal: any;
  setPage: Dispatch<SetStateAction<number>>;
};

const VendorsList = ({
  setSearchValue,
  fetchVendorList: fetchVendorList,
  data,
  page,
  nextSetItemTotal,
  setPage,
}: Props) => {
  const vedorStore = useVendorStore();
  const { push } = useRouter();
  const handleEditClick = (item: TypeVendorListItem) => {
    vedorStore.setValue('isEditVendorId', item.id);
    console.log(item.id);
  };

  const handleUserSearhClick = (item: TypeVendorListItem) => {
    const searchParams = new URLSearchParams();
    searchParams.set('id', item.name.toString());
    push(`/vendor/users?${searchParams.toString()}`);
  };

  const tableData = data?.map((item) => {
    return [
      {
        icon: User2,
        title: 'Vendor',
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
        title: 'Location',
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
        onClick: () => handleUserSearhClick(item),
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
      {tableData?.length ? (
        <Table>
          <TableLists>
            {tableData.map((item, idx) => (
              <TableSigleList key={idx}>
                <TableSigleListContents>
                  {item.map((i, listIdx) => (
                    <TableSigleListContent key={listIdx}>
                      <TableSigleListContentTitle>
                        <i.icon size={14} />
                        {i.title}
                      </TableSigleListContentTitle>
                      <TableSigleListContentDetailsTitle
                        className="line-clamp-2"
                        onClick={i.onClick ? () => i.onClick() : undefined}
                      >
                        {i.value}
                      </TableSigleListContentDetailsTitle>
                    </TableSigleListContent>
                  ))}
                </TableSigleListContents>
              </TableSigleList>
            ))}
          </TableLists>
        </Table>
      ) : (
        <>no data</>
      )}
    </>
  );
};

export default VendorsList;
