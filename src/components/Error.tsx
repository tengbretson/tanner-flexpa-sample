import { Alert } from 'flowbite-react';
import { HiInformationCircle } from 'react-icons/hi';

export function ErrorAlert({ errorMessage }: { errorMessage: string }) {
  return (
    <Alert color="failure" icon={HiInformationCircle}>
      <span className="font-medium">Oh No!</span> {errorMessage}
    </Alert>
  );
}
