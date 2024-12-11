import React from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';

// Dynamically import the Card components with no SSR to avoid the import issue
const Card = dynamic(() => import('../components/ui/card').then(mod => ({ default: mod.Card })), { ssr: false });
const CardHeader = dynamic(() => import('../components/ui/card').then(mod => ({ default: mod.CardHeader })), { ssr: false });
const CardTitle = dynamic(() => import('../components/ui/card').then(mod => ({ default: mod.CardTitle })), { ssr: false });
const CardContent = dynamic(() => import('../components/ui/card').then(mod => ({ default: mod.CardContent })), { ssr: false });

// Import all employee configs
const employeeFiles = {
  1: { name: "MELADY M MONICO" },
  2: { name: "CARLOS UMBERTO CRUZ" },
  3: { name: "JENNIFER RALDA ROMERO" },
  4: { name: "DANIEL ALFREDO CASTILLO" },
  5: { name: "MARITZA ROXANA GARCIA SUNUN" },
  6: { name: "AREVALO ANDERSON" },
  7: { name: "MELKI FUENTES SEVEK" },
  8: { name: "PEDRO SALGADO" },
  9: { name: "ESTIVER ANALIS AGUILAR" },
  10: { name: "JAIRA MELISSA DELCID" },
  11: { name: "MARIA MIRANDA" },
  12: { name: "MAURICIO RUBIO" },
  13: { name: "ANA M ZUNIGA" },
  14: { name: "KAREN VANESA LAZO" },
  15: { name: "MARIA FLOR ARGUETA VASQUEZ" }
};

const IndexPage = () => {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Wage Analysis Dashboard</h1>
      <div className="grid gap-4">
        {Object.entries(employeeFiles).map(([id, config]) => (
          <Link 
            key={id} 
            href={`/people/${id}`}
            className="block p-4 border rounded hover:bg-gray-50 transition-colors"
          >
            <div className="font-medium">{config.name}</div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default IndexPage;
