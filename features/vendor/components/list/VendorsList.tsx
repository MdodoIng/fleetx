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
  TableSingleList,
  TableSingleListContent,
  TableSingleListContentDetailsTitle,
  TableSingleListContents,
  TableSingleListContentTitle,
} from '@/shared/components/ui/tableList';
import { useRouter } from 'next/navigation';
import LoadMore from '@/shared/components/fetch/LoadMore';
import NoData from '@/shared/components/fetch/NoData';

type Props = {
  data: TypeVendorList;
  nextSetItemTotal: any;
  setPage: Dispatch<SetStateAction<number>>;
};

const VendorsList = ({ data, nextSetItemTotal, setPage }: Props) => {
  const vendorStore = useVendorStore();
  const { push } = useRouter();
  const handleEditClick = (item: TypeVendorListItem) => {
    vendorStore.setValue('isEditVendorId', item.id);
    console.log(item.id);
  };

  const handleUserSearchClick = (item: TypeVendorListItem) => {
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
        onClick: () => handleUserSearchClick(item),
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
              <TableSingleList key={idx}>
                <TableSingleListContents>
                  {item.map((i, listIdx) => (
                    <TableSingleListContent key={listIdx}>
                      <TableSingleListContentTitle>
                        <i.icon size={14} />
                        {i.title}
                      </TableSingleListContentTitle>
                      <TableSingleListContentDetailsTitle
                        className="line-clamp-2"
                        onClick={i.onClick ? () => i.onClick() : undefined}
                      >
                        {i.value}
                      </TableSingleListContentDetailsTitle>
                    </TableSingleListContent>
                  ))}
                </TableSingleListContents>
              </TableSingleList>
            ))}
            <LoadMore
              setPage={setPage}
              nextSetItemTotal={nextSetItemTotal}
              type="table"
            />
          </TableLists>
        </Table>
      ) : (
        <NoData />
      )}
    </>
  );
};

export default VendorsList;
