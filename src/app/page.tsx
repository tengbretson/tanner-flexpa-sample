'use client';
import { FlexpaErrorAlert } from '@/components/FlexpaError';
import { useFlexpa } from '@/hooks/useFlexpa';
import { Button } from 'flowbite-react';
import { ExplanationOfBenefitsListView } from '../components/ExplanationOfBenefitsListView';

function ListViewContainer() {
  const { openPortal, flexpaAuth, error } = useFlexpa();

  if (flexpaAuth) {
    // we are logged in
    return <ExplanationOfBenefitsListView flexpaAuth={flexpaAuth} />;
  } else if (error) {
    return <FlexpaErrorAlert error={error} />;
  } else {
    return (
      <>
        <p className="text-white pt-6">
          To get started, click connect and get authorized with your insurance
          provider.
        </p>
        <div className="pt-1">
          <Button onClick={() => openPortal()}>Connect</Button>
        </div>
      </>
    );
  }
}

export default function Home() {
  return (
    <div className="flex flex-col justify-center w-3/5">
      <h1 className="text-6xl pb-2">Tanner&apos;s Health Data Emporium</h1>
      <h4 className="text-2xl italic text-gray-400 pb-6">
        Powered by{' '}
        <span className="underline underline-offset-3 decoration-3 decoration-blue-400 dark:decoration-blue-600">
          Flexpa
        </span>
      </h4>
      <ListViewContainer />
    </div>
  );
}
