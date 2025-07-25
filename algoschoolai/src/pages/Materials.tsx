import React, { useEffect, useState } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useTranslation } from 'react-i18next';

const Materials: React.FC = () => {
  const { t } = useTranslation();
  const [materials, setMaterials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/materials')
      .then(res => res.json())
      .then(data => {
        setMaterials(data);
        setLoading(false);
      });
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">{t('adminDashboard.allMaterials', 'Todos los Materiales')}</h1>
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                {/* <th className="text-left py-3 px-4 font-medium text-gray-700">ID</th> */}
                <th className="text-left py-3 px-4 font-medium text-gray-700">Título</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Tipo</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">URL</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={4} className="py-6 text-center text-gray-500">{t('loading', 'Cargando...')}</td></tr>
              ) : materials.length === 0 ? (
                <tr><td colSpan={4} className="py-6 text-center text-gray-500">{t('adminDashboard.noMaterials', 'No hay materiales')}</td></tr>
              ) : (
                materials.map(material => (
                  <tr key={material.id} className="border-b border-gray-100 hover:bg-gray-50">
                    {/* <td className="py-3 px-4">{material.id}</td> */}
                    <td className="py-3 px-4">{material.title}</td>
                    <td className="py-3 px-4">{material.type}</td>
                    <td className="py-3 px-4"><a href={material.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">{material.url}</a></td>
                    <td className="py-3 px-4">
                      <Button size="sm" variant="outline">{t('adminDashboard.manage', 'Gestionar')}</Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default Materials; 