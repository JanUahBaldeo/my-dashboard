import React from 'react';
import { ResponsiveFunnel } from '@nivo/funnel';

const rawData = [
  { id: 'Clicks', value: 100 },
  { id: 'Landing Page Views', value: 85 },
  { id: 'Form Submissions', value: 47 },
  { id: 'Qualified Leads', value: 25 },
  { id: 'Booked Appointments', value: 15 },
  { id: 'Closed/Won Deals', value: 8 },
];

// Preprocess with % and drop-off
const data = rawData.map((step, index) => ({
  ...step,
  percentage: ((step.value / rawData[0].value) * 100).toFixed(1),
  dropOff:
    index === 0
      ? null
      : ((1 - step.value / rawData[index - 1].value) * 100).toFixed(1),
}));

const LeadConversionFunnel = () => {
  return (
    <section className="w-full max-w-5xl mx-auto p-8 bg-white dark:bg-gray-900 rounded-xl shadow-md border border-gray-200 dark:border-gray-800 transition-colors duration-300">
      <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6 tracking-tight">
        Lead Conversion Funnel
      </h2>

      <div className="h-[480px]">
        <ResponsiveFunnel
          data={data}
          margin={{ top: 20, right: 100, bottom: 20, left: 100 }}
          shapeBlending={0.6}
          valueFormat={(v) => `${v}%`}
          colors={{ scheme: 'blues' }}
          borderWidth={0}
          labelColor={{ theme: 'background' }}
          motionConfig="gentle"
          currentPartSizeExtension={8}
          currentBorderWidth={10}
          separatorOffset={10}
          tooltip={({ part }) => (
            <div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm rounded-md px-4 py-3 shadow-lg border border-gray-200 dark:border-gray-700 max-w-[220px]">
              <div className="font-medium text-base">{part.data.id}</div>
              <div className="mt-1 text-sm">
                Leads: <strong>{part.data.value}</strong>
              </div>
              <div className="text-sm">
                Retention: <strong>{part.data.percentage}%</strong>
              </div>
              {part.data.dropOff && (
                <div className="text-sm text-red-500">
                  Drop-Off: {part.data.dropOff}%
                </div>
              )}
            </div>
          )}
        />
      </div>
    </section>
  );
};

export default LeadConversionFunnel;
