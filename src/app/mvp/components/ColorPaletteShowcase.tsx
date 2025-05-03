// ColorPaletteShowcase.tsx
import React from 'react';

const ColorPaletteShowcase = () => {
  const colorGroups = {
    'Primary Colors': {
      Blue: 'bg-primary-blue',
      Brown: 'bg-primary-brown',
      Green: 'bg-primary-green',
    },
    'Secondary Colors': {
      Teal: 'bg-secondary-teal',
      Cream: 'bg-secondary-cream',
      'Light Gray': 'bg-secondary-lightGray',
    },
    'Text Colors': {
      Primary: 'bg-text-primary',
      Secondary: 'bg-text-secondary',
      Muted: 'bg-text-muted',
    },
  };

  return (
    <div className="mx-auto max-w-4xl p-6">
      <h1 className="text-text-primary mb-8 text-3xl font-bold">
        Color Palette
      </h1>

      {Object.entries(colorGroups).map(([groupName, colors]) => (
        <div key={groupName} className="mb-8">
          <h2 className="text-text-primary mb-4 text-xl font-semibold">
            {groupName}
          </h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
            {Object.entries(colors).map(([colorName, colorClass]) => (
              <div key={colorName} className="text-center">
                <div
                  className={`mb-2 h-24 w-full rounded-lg ${colorClass} border-neutral-gray-200 border`}
                />
                <p className="text-text-primary text-sm font-medium">
                  {colorName}
                </p>
              </div>
            ))}
          </div>
        </div>
      ))}

      <div className="mt-12">
        <h2 className="text-text-primary mb-4 text-xl font-semibold">
          Gray Scale
        </h2>
        <div className="flex flex-wrap gap-4">
          {[100, 200, 300, 400, 500, 600, 700, 800, 900].map((shade) => (
            <div key={shade} className="text-center">
              <div
                className={`mb-2 size-16 rounded-lg bg-neutral-gray-${shade} border-neutral-gray-200 border`}
              />
              <p className="text-text-primary text-sm font-medium">{shade}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ColorPaletteShowcase;
