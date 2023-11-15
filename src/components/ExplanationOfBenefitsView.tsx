import { IExplanationOfBenefit } from '@ahryman40k/ts-fhir-types/lib/R4';
import { Card, Table } from 'flowbite-react';
import { get, isNumber } from 'lodash';

export function ExplanationOfBenefitsView({
  eob,
}: {
  eob: IExplanationOfBenefit;
}) {
  const insurerName = eob.insurer.display;
  const period =
    eob.billablePeriod?.start &&
    eob.billablePeriod?.end &&
    ` ${eob.billablePeriod.start} to ${eob.billablePeriod.end}`;

  return (
    <Card className="font-normal text-gray-700 dark:text-gray-400">
      <h6 className="text-xl font-bold tracking-tight text-gray-600">
        {insurerName}
      </h6>
      <span className="italic">{period}</span>
      {eob.item && (
        <Table>
          <Table.Head>
            <Table.HeadCell>Location</Table.HeadCell>
            <Table.HeadCell>Service</Table.HeadCell>
            <Table.HeadCell>Cost</Table.HeadCell>
          </Table.Head>
          <Table.Body>
            {eob.item.map((item) => {
              const cost: number | undefined = get(item, ['net', 'value']);
              return (
                <Table.Row key={item.sequence}>
                  <Table.Cell>
                    {get(
                      item,
                      ['locationCodeableConcept', 'coding', 0, 'display'],
                      'unknown',
                    )}
                  </Table.Cell>
                  <Table.Cell>
                    {get(
                      item,
                      ['productOrService', 'coding', 0, 'display'],
                      'unknown',
                    )}
                  </Table.Cell>
                  <Table.Cell>
                    {isNumber(cost) ? `$${cost.toFixed(2)}` : 'unknown'}
                  </Table.Cell>
                </Table.Row>
              );
            })}
          </Table.Body>
        </Table>
      )}
      {eob.total && (
        <Table>
          <Table.Head>
            <Table.HeadCell>Category</Table.HeadCell>
            <Table.HeadCell>Amount</Table.HeadCell>
          </Table.Head>
          <Table.Body>
            {eob.total.map((line) => {
              const amount = get(line, ['amount', 'value']);
              return (
                <Table.Row key={Math.random()}>
                  {/* I know that Math.random for a key isnt great, but I cant find a reliable alternative prop at the moment.*/}
                  <Table.Cell>
                    {get(line, ['category', 'coding', 0, 'display'], 'unknown')}
                  </Table.Cell>
                  <Table.Cell>
                    {isNumber(amount) ? `$${amount.toFixed(2)}` : 'unknown'}
                  </Table.Cell>
                </Table.Row>
              );
            })}
          </Table.Body>
        </Table>
      )}
    </Card>
  );
}
