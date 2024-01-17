/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { DatatableSettings } from "../../shared/Constants";
import { dateFormat } from '../../shared/Utility.js';
import { Button } from '../index.js';
import { MultiSelect } from 'primereact/multiselect';

const PRDataTable = ({ value = [], loading = false, cols = [], actions = [] }) => {
    const [selectedOptions, setSelectedOptions] = useState([]);

    useEffect(() => {
        const preselectedOptions = cols.filter(option => option.isSelected);
        setSelectedOptions(preselectedOptions);
    }, []);

    const renderHeader = () => {
        return (
            <div className="flex">
                <MultiSelect value={selectedOptions} onChange={(e) => setSelectedOptions(e.value)} options={cols} optionLabel="header"
                    filter placeholder="Select Items" maxSelectedLabels={3} className="w-1/5" />
            </div>
        );
    };

    const actionField = (rowData) => {
        return (
            <div className="flex justify-center gap-2">
                {
                    actions && actions.map((item, index) => (
                        <Button key={index} onClickEvent={() => item.functionRef(rowData)}>{item.label}</Button>
                    ))
                }
            </div>
        )
    }

    return (
        <DataTable value={value} paginator rows={10} dataKey="$id" header={renderHeader} filterDisplay="row" loading={loading} emptyMessage={DatatableSettings.emptyMessage} paginatorTemplate={DatatableSettings.paginatorTemplate} rowsPerPageOptions={DatatableSettings.rowsPerPageOptions} sortMode="multiple" removableSort resizableColumns columnResizeMode="fit" style={{ border: '1px solid #E0E0E0' }}>
            {
                selectedOptions.map((col, index) =>
                    col.dataType === 'date' ? (
                        <Column key={index} field={col.field} header={col.header} filter={true} showFilterMenu={false} sortable filterPlaceholder="Search" headerClassName={DatatableSettings.headerClassName} filterHeaderClassName={DatatableSettings.filterHeaderClassName} body={(rowData) => dateFormat(rowData[col.field])} />
                    ) : (
                        <Column key={index} field={col.field} header={col.header} filter={true} showFilterMenu={false} sortable filterPlaceholder="Search" headerClassName={DatatableSettings.headerClassName} filterHeaderClassName={DatatableSettings.filterHeaderClassName} />
                    )
                )
            }

            <Column key='action' field={actionField} header='Action' filter={false} showFilterMenu={false} headerClassName={DatatableSettings.headerClassName} filterHeaderClassName={DatatableSettings.filterHeaderClassName} />
        </DataTable>
    );
};

export default PRDataTable;