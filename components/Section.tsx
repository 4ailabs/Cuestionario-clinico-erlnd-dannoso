
import React from 'react';

interface SectionProps {
  title: string;
  children: React.ReactNode;
}

export const Section: React.FC<SectionProps> = ({ title, children }) => {
  return (
    <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg border border-gray-100 mb-8">
      <h2 className="text-2xl sm:text-3xl font-bold text-teal-700 border-b-3 border-teal-200 pb-4 mb-8">
        {title}
      </h2>
      <div className="space-y-8">
        {children}
      </div>
    </div>
  );
};

export const SubSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => {
    return (
        <div className="p-6 border-l-4 border-teal-300 rounded-r-xl bg-gradient-to-r from-teal-50 to-transparent">
            <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-6">{title}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {children}
            </div>
        </div>
    );
};
