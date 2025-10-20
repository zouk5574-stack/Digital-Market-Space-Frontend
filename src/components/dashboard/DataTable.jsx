// src/components/dashboard/DataTable.jsx
import React from 'react';

const DataTable = ({ data = [], columns = [], actions = [], loading = false }) => {
  if (loading) return <p className="p-4 text-gray-500">Chargement...</p>;
  if (!data.length) return <p className="p-4 text-gray-500">Aucune donnée disponible.</p>;

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 bg-white">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                {col.label}
              </th>
            ))}
            {actions.length > 0 && (
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            )}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {data.map((item, idx) => (
            <tr key={idx} className="hover:bg-gray-50">
              {columns.map((col) => (
                <td key={col.key} className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  {col.format ? col.format(getNestedValue(item, col.key)) : getNestedValue(item, col.key)}
                </td>
              ))}
              {actions.length > 0 && (
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 space-x-2">
                  {actions.map((action, i) => (
                    <button
                      key={i}
                      onClick={() => action.onClick(item)}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      {typeof action.label === 'function' ? action.label(item) : action.label}
                    </button>
                  ))}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// Permet d’accéder aux objets imbriqués: ex: 'user.username'
function getNestedValue(obj, key) {
  return key.split('.').reduce((o, k) => (o ? o[k] : null), obj);
}

export default DataTable;