/* eslint-disable react/prop-types */
import { useState } from "react";
import { AutoComplete } from "primereact/autocomplete";

const PRAutoComplete = ({items = [], selectedItem, setSelectedItem, property, label}) => {
    
    const [filteredItems, setFilteredItems] = useState(null);

    const search = (event) => {
        setTimeout(() => {
            let _filteredItems;

            if (!event.query.trim().length) {
                _filteredItems = [...items];
            }
            else {
                _filteredItems = items.filter((item) => {
                    return item[property].toLowerCase().includes(event.query.toLowerCase());
                });
            }

            setFilteredItems(_filteredItems);
        }, 0);
    }

    return (
        <div className="w-full">
            <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='autocomplete'>{label}</label>
            <AutoComplete field={property} placeholder={'Select ' + label} value={selectedItem} suggestions={filteredItems} completeMethod={search} onChange={(e) => setSelectedItem(e.value)} />
        </div>
    );
};

export default PRAutoComplete;