import { Button } from '@/shared/components/ui/button';
import { CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Delete, Edit, Plus } from 'lucide-react';
import DropoffForm from '../create/DropOffForm';
import { TypeDropOffSchema } from '../../../wallet/validations/order';
import { TypeDropOffs } from '@/shared/types/orders';
import { Dispatch, SetStateAction } from 'react';
import { UseFormReturn } from 'react-hook-form';

type Props = {
  index?: number;
  isDropIndex: number;
  dropOffFormValues: TypeDropOffSchema;
  item?: TypeDropOffs;

  dropOffForm: UseFormReturn<TypeDropOffSchema>;
  isCOD: 1 | 2;
  setIsCOD: Dispatch<SetStateAction<1 | 2>>;
  functionsDropoffs: (
    type:
      | 'addOneDropoff'
      | 'editOneDropoff'
      | 'saveCurrentDropOff'
      | 'editDropOffWithSave'
      | 'deleteDropOff',
    index?: any
  ) => Promise<void>;
};

const DropoffFormSection = ({
  index,
  isDropIndex,
  dropOffFormValues,
  item,
  dropOffForm,
  isCOD,
  setIsCOD,
  functionsDropoffs,
}: Props) => {
  const isSingle = !index && !item;
  return (
    <div key={index} className="shadow bg-red-300">
      <CardHeader className="bg-cyan-50 rounded-t-lg p-4 flex items-center justify-between">
        <CardTitle className="flex items-center gap-2 text-lg font-semibold text-cyan-800">
          Drop Off{' '}
          {isSingle
            ? dropOffFormValues.customer_name
            : isDropIndex == index
              ? dropOffFormValues.customer_name
              : item?.customer_name}
        </CardTitle>
        {isSingle || index === isDropIndex ? (
          <Button
            // disabled={!isFormValid}
            onClick={() => functionsDropoffs('addOneDropoff')}
          >
            <Plus /> dropOff {isSingle ? 123 : index! + 1}
          </Button>
        ) : (
          <div className="grid-cols-2 grid gap-4">
            <Button
              onClick={() => functionsDropoffs('deleteDropOff', index!)}
              variant="destructive"
            >
              <Delete />
            </Button>
            <Button
              onClick={() => functionsDropoffs('editDropOffWithSave', index!)}
              variant="secondary"
            >
              <Edit />
            </Button>
          </div>
        )}
      </CardHeader>
      {isSingle ? (
        <DropoffForm
          recipientForm={dropOffForm}
          isCOD={isCOD}
          setIsCOD={setIsCOD}
        />
      ) : (
        isDropIndex === index && (
          <DropoffForm
            recipientForm={dropOffForm}
            isCOD={isCOD}
            setIsCOD={setIsCOD}
          />
        )
      )}
    </div>
  );
};

export default DropoffFormSection;
