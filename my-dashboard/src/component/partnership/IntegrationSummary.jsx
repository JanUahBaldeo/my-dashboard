import React from 'react';
import { FaLink } from 'react-icons/fa';

const IntegrationSummary = () => {
  const integrationGroups = [
    {
      title: 'CRM LEAD SYNCS',
      integrations: [
        ['GHL', 'WARNING', 'bg-yellow-400 text-black'],
        ['HubSpot', 'DISCONNECTED', 'bg-red-600 text-white'],
        ['Salesforce', 'SYNCED', 'bg-green-600 text-white']
      ]
    },
    {
      title: 'EMAIL PLATFORMS',
      integrations: [
        ['Mailchimp', 'WARNING', 'bg-yellow-400 text-black'],
        ['ActiveCampaign', 'DISCONNECTED', 'bg-red-600 text-white']
      ]
    },
    {
      title: 'AD PLATFORMS',
      integrations: [
        ['Meta', 'WARNING', 'bg-yellow-400 text-black'],
        ['Google', 'DISCONNECTED', 'bg-red-600 text-white'],
        ['LinkedIn', 'SYNCED', 'bg-green-600 text-white']
      ]
    }
  ];

  return (
    <section className="space-y-6 w-full bg-gray-900 rounded-xl p-6 shadow">
      <h2 className="text-2xl font-bold text-white flex items-center gap-2">
        🔗 Integration Summary
      </h2>

      {integrationGroups.map((group) => (
        <div key={group.title} className="rounded-xl overflow-hidden bg-gray-800 shadow-md">
          <div className="bg-orange-300 text-gray-900 font-semibold px-5 py-2 text-sm uppercase">
            {group.title}
          </div>
          <ul className="divide-y divide-gray-700 text-sm">
            {group.integrations.map(([name, status, color]) => (
              <li
                key={name}
                className="flex justify-between items-center px-5 py-3 hover:bg-gray-700 transition"
              >
                <a
                  href="#"
                  className="text-blue-400 underline flex items-center gap-1 hover:text-blue-300"
                >
                  <FaLink className="text-xs" />
                  {name}
                </a>
                <span className={`text-xs px-3 py-1 rounded-full font-medium ${color}`}>
                  {status}
                </span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </section>
  );
};

export default IntegrationSummary;
