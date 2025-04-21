import React, { useState } from 'react';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';

const TagSelector = ({
  availableTags,
  selectedTags,
  onChange,
  placeholder = 'Select tags',
  maxTags = 5,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const handleTagToggle = (tag) => {
    const isSelected = selectedTags.includes(tag);
    if (isSelected) {
      // Remove tag if already selected
      onChange(selectedTags.filter((selectedTag) => selectedTag !== tag));
    } else {
      // Add tag if not at max limit
      if (selectedTags.length < maxTags) {
        onChange([...selectedTags, tag]);
      }
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    onChange(selectedTags.filter((tag) => tag !== tagToRemove));
  };

  const filteredTags = availableTags.filter((tag) =>
    tag.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="relative w-full">
      {/* Selected Tags Display */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="flex min-h-[42px] cursor-pointer flex-wrap gap-2 rounded border p-2"
      >
        {selectedTags.length === 0 ? (
          <span className="text-gray-500">{placeholder}</span>
        ) : (
          selectedTags.map((tag) => (
            <div
              key={tag}
              className="bg-blue-100 text-blue-800 flex items-center rounded px-2 py-1 text-sm"
            >
              {tag}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveTag(tag);
                }}
                className="hover:text-red-600 ml-2"
              >
                <CloseOutlined size={16} />
              </button>
            </div>
          ))
        )}
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-10 mt-1 w-full rounded border bg-white shadow-lg">
          {/* Search Input */}
          <input
            type="text"
            placeholder="Search tags..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full border-b p-2"
          />

          {/* Tag List */}
          <div className="max-h-60 overflow-y-auto">
            {filteredTags.map((tag) => (
              <div
                key={tag}
                onClick={() => handleTagToggle(tag)}
                className={`
                  flex cursor-pointer items-center justify-between p-2 
                  hover:bg-gray-100 
                  ${selectedTags.includes(tag) ? 'bg-blue-50' : ''}
                `}
              >
                <span>{tag}</span>
                {selectedTags.includes(tag) && (
                  <CheckOutlined size={20} className="text-green-600" />
                )}
              </div>
            ))}

            {filteredTags.length === 0 && (
              <div className="p-2 text-center text-gray-500">No tags found</div>
            )}
          </div>

          {/* Tag Limit Warning */}
          {selectedTags.length >= maxTags && (
            <div className="text-red-600 p-2 text-center text-sm">
              Maximum {maxTags} tags selected
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TagSelector;
