import React from 'react';
import checkIcon from '@/assets/icons/check.svg';

const COLOR_SWATCH_STYLE = {
  width: '28px',
  height: '28px',
  borderRadius: '50%',
  display: 'inline-block',
  cursor: 'pointer',
  border: '2px solid transparent',
};

function SizeOption({ option, selected, disabled, onSelect }) {
  return (
    <button
      type="button"
      onClick={() => !disabled && onSelect(option.value)}
      disabled={disabled}
      aria-pressed={selected}
      className={`min-w-[40px] px-3 py-1.5 rounded-lg text-sm font-medium border transition-all
        ${
          selected
            ? 'bg-blue-600 text-white border-blue-600'
            : disabled
            ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed line-through'
            : 'bg-white text-gray-700 border-gray-300 hover:border-blue-400'
        }`}
    >
      {option.label}
    </button>
  );
}

function ColorOption({ option, selected, disabled, onSelect }) {
  return (
    <button
      type="button"
      onClick={() => !disabled && onSelect(option.value)}
      disabled={disabled}
      aria-pressed={selected}
      aria-label={option.label}
      title={option.label}
      className={`relative rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-500 ${
        disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'
      }`}
      style={{
        ...COLOR_SWATCH_STYLE,
        backgroundColor: option.colorCode || option.value,
        borderColor: selected ? '#1d4ed8' : 'transparent',
        boxShadow: selected ? '0 0 0 2px #1d4ed8' : 'none',
      }}
    >
      {selected && (
        <span className="absolute inset-0 flex items-center justify-center">
          <img src={checkIcon} alt="Selected" className="w-3 h-3 invert" />
        </span>
      )}
    </button>
  );
}

export default function VariantPicker({
  attributes = [],
  selectedAttributes = {},
  skus = [],
  onAttributeChange,
  onSkuResolved,
}) {
  const resolveSkuFromAttributes = (attrs) => {
    if (!skus || skus.length === 0) return null;
    return (
      skus.find((sku) =>
        Object.entries(attrs).every(
          ([key, val]) => String(sku.attributes?.[key]) === String(val)
        )
      ) || null
    );
  };

  const isOptionDisabled = (attrName, value) => {
    const testAttrs = { ...selectedAttributes, [attrName]: value };
    if (!skus || skus.length === 0) return false;
    const match = skus.find((sku) =>
      Object.entries(testAttrs).every(
        ([key, val]) =>
          sku.attributes?.[key] == null ||
          String(sku.attributes[key]) === String(val)
      )
    );
    if (!match) return true;
    return match.stock != null && match.stock <= 0;
  };

  const handleSelect = (attrName, value) => {
    const newAttrs = { ...selectedAttributes, [attrName]: value };
    if (onAttributeChange) onAttributeChange(attrName, value);
    if (onSkuResolved) {
      const resolved = resolveSkuFromAttributes(newAttrs);
      onSkuResolved(resolved);
    }
  };

  if (!attributes || attributes.length === 0) return null;

  return (
    <div className="flex flex-col gap-4">
      {attributes.map((attr) => {
        const isColor =
          attr.name.toLowerCase() === 'colour' ||
          attr.name.toLowerCase() === 'color';
        return (
          <div key={attr.name}>
            <p className="text-sm font-semibold text-gray-700 mb-2">
              {attr.label || attr.name}:
              {selectedAttributes[attr.name] && (
                <span className="ml-1 font-normal text-gray-500">
                  {selectedAttributes[attr.name]}
                </span>
              )}
            </p>
            <div className="flex flex-wrap gap-2">
              {attr.options.map((option) => {
                const selected =
                  String(selectedAttributes[attr.name]) ===
                  String(option.value);
                const disabled = isOptionDisabled(attr.name, option.value);
                return isColor ? (
                  <ColorOption
                    key={option.value}
                    option={option}
                    selected={selected}
                    disabled={disabled}
                    onSelect={(val) => handleSelect(attr.name, val)}
                  />
                ) : (
                  <SizeOption
                    key={option.value}
                    option={option}
                    selected={selected}
                    disabled={disabled}
                    onSelect={(val) => handleSelect(attr.name, val)}
                  />
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
