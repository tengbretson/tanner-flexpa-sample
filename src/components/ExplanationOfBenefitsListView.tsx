'use client';
import { useExplanationOfBenefits } from '@/hooks/useExplanationOfBenefits';
import { Spinner } from 'flowbite-react';
import { ErrorAlert } from '@/components/Error';
import { ExplanationOfBenefitsView } from '@/components/ExplanationOfBenefitsView';
import { FlexpaAuth } from '@/hooks/useFlexpa';

export type ExplanationOfBenefitsListViewProps = {
  flexpaAuth: FlexpaAuth;
};
export function ExplanationOfBenefitsListView({
  flexpaAuth,
}: ExplanationOfBenefitsListViewProps) {
  const { eobs, status } = useExplanationOfBenefits(flexpaAuth);
  if (status === 'loading') {
    return <Spinner />;
  } else if (status === 'complete') {
    return eobs.map((eob) => (
      <div key={eob.id ?? Math.random()} className="pt-6">
        <ExplanationOfBenefitsView eob={eob} />
      </div>
    ));
  } else {
    return <ErrorAlert errorMessage={status.errorMessage} />;
  }
}
