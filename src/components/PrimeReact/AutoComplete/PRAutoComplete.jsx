/* eslint-disable react/prop-types */
import { useState } from "react";
import { AutoComplete } from "primereact/autocomplete";

const PRAutoComplete = ({
  items = [],
  selectedItem,
  setSelectedItem,
  property,
  label,
  disabled = false,
  multiple = false,
  className = "",
}) => {
  const [filteredItems, setFilteredItems] = useState(null);

  const search = (event) => {
    let _filteredItems;

    if (!event.query.trim().length) {
      _filteredItems = [...items];
    } else {
      _filteredItems = items.filter((item) => {
        return item[property].toLowerCase().includes(event.query.toLowerCase());
      });
    }

    setFilteredItems(_filteredItems);
  };

  return (
    <div className="w-full">
      <label
        className={`block text-gray-700 text-lg font-bold mb-2 ${className}`}
        htmlFor="autocomplete"
      >
        {label}
      </label>
      {multiple ? (
        <AutoComplete
          field={property}
          placeholder={"Select " + label}
          multiple
          value={selectedItem}
          suggestions={filteredItems}
          completeMethod={search}
          onChange={(e) => setSelectedItem(e.value)}
          disabled={disabled}
        />
      ) : (
        <AutoComplete
          field={property}
          placeholder={"Select " + label}
          value={selectedItem}
          suggestions={filteredItems}
          completeMethod={search}
          onChange={(e) => setSelectedItem(e.value)}
          disabled={disabled}
        />
      )}
    </div>
  );
};

export default PRAutoComplete;
