
import React from 'react';

interface SectionProps {
  title: string;
  children: React.ReactNode;
}

export const Section: React.FC<SectionProps> = ({ title, children }) => {
  return (
    <div className="bg-white p-6 md:p-8 rounded-xl shadow-md border border-gray-200 mb-8">
      <h2 className="text-2xl font-bold text-teal-700 border-b-2 border-teal-200 pb-3 mb-6">
        {title}
      </h2>
      <div className="space-y-6">
        {children}
      </div>
    </div>
  );
};

export const SubSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => {
    return (
        <div className="p-4 border-l-4 border-gray-200 rounded-r-lg bg-gray-50/50">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {children}
            </div>
        </div>
    );
};
