/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { PageSwitch, DataType } from "../../../shared/AppEnum";
import testService from "../../../appwrite/test.service";
import { useDispatch, useSelector } from "react-redux";
import { switchPage } from "../../../store/pageSwitchSlice";
import { Query } from "appwrite";
import { Input, PRDataTable, Button } from "../../index";
import { notify } from "../../../shared/Utility";
import { confirm } from "../../../shared/Utility";

const ManageTest = () => {
  const [loading, setLoading] = useState(false);
  const [tests, setTests] = useState([]);
  const [searchFilter, setSearchFilter] = useState({ name: "" });

  const dispatch = useDispatch();
  const switchData = useSelector((state) => state.pageSwitch.switchData);

  const cols = [
    {
      field: "$id",
      header: "Id",
      dataType: DataType.string,
      isSelected: false,
    },
    {
      field: "Name",
      header: "Name",
      dataType: DataType.string,
      isSelected: true,
    },
    {
      field: "Description",
      header: "Description",
      dataType: DataType.string,
      isSelected: true,
    },
    {
      field: "Cost",
      header: "Cost",
      dataType: DataType.number,
      isSelected: true,
    },
    {
      field: "$createdAt",
      header: "Created At",
      dataType: DataType.dateTime,
      isSelected: false,
    },
    {
      field: "$updatedAt",
      header: "Updated At",
      dataType: DataType.dateTime,
      isSelected: false,
    },
  ];

  const search = () => {
    const queries = [];
    if (searchFilter.name && searchFilter.name.toString().trim() !== "") {
      queries.push(Query.equal("Name", searchFilter.name));
    }

    getTests(queries);
  };

  const getTests = (queries = []) => {
    setLoading(true);
    testService.getTests(queries).then((res) => {
      if (res.documents) {
        setTests(res.documents);
        setLoading(false);
      }
    });
  };

  const editTest = (rowData) => {
    dispatch(
      switchPage({ pageIndex: PageSwitch.EditPage, switchData: rowData })
    );
  };

  const deleteTest = async (rowData) => {
    try {
      confirm(`Are You Sure To Delete Test ${rowData.Name}?`, (isConfirmed) => {
        if (isConfirmed) {
          setLoading(true);
          testService
            .deleteTest(rowData.$id)
            .finally(() => setLoading(false))
            .then((res) => {
              if (res) {
                notify.succes("Deleted Successfully!");
                getTests();
              }
            });
        }
      });
    } catch (error) {
      notify.error(error);
    }
  };

  useEffect(() => {
    if (switchData?.Id) {
      getTests([Query.equal("Id", switchData.Id)]);
    }
  }, [switchData?.Id]);

  const actionFields = [
    { functionRef: editTest, label: "Edit" },
    { functionRef: deleteTest, label: "Delete" },
  ];

  const navigatePage = () => {
    dispatch(switchPage(PageSwitch.CreatePage));
  };

  return (
    <div className="flex flex-col min-h-screen flex-1">
      <div className="flex justify-between items-center ml-5 mr-5 mb-5">
        <h1 className="text-3xl font-bold text-gray-700">Manage Tests</h1>
        <Button className="mt-2" onClickEvent={navigatePage}>
          Create Test
        </Button>
      </div>

      <div className="flex justify-center mb-3">
        <div className="w-11/12 flex gap-2">
          <div className="w-full md:w-3/12">
            <Input
              label="Name"
              placeholder="Enter Test Name"
              value={searchFilter.name}
              onChange={(e) =>
                setSearchFilter((prev) => ({ ...prev, name: e.target.value }))
              }
            />
          </div>
          <div className="w-full md:w-3/12">
            <Button onClickEvent={search} className="mt-7">
              Search
            </Button>
          </div>
        </div>
      </div>

      <div className="flex justify-center">
        <div className="w-11/12 p-5 border border-gray-300 rounded overflow-x-auto mx-auto">
          <PRDataTable
            value={tests}
            loading={loading}
            cols={cols}
            actions={actionFields}
          />
        </div>
      </div>
    </div>
  );
};

export default ManageTest;
