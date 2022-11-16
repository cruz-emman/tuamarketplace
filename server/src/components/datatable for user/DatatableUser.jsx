import "./datatable.scss";
import { DataGrid } from "@mui/x-data-grid";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";

import { userColumns, userRows } from "../../datatablesource";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useEffect } from "react";
import BeatLoader from "react-spinners/BeatLoader";
import { toast } from "react-toastify";
import { deleteProduct, deleteUser } from "../../redux/apiCalls";

import { useDispatch, useSelector } from 'react-redux'

const DatatableUser = ({data, columns, id}) => {
  const [loading, setLoading] = useState(true)
  const dispatch = useDispatch()

  //const [data, setData] = useState(userRows);

  useEffect(() => {
    setLoading(false)
  },[data,  columns])

  const handleDelete = (id) => {
    deleteUser(id, dispatch)
     window.location.reload();
     toast.success("User Deleted")
  };

  const actionColumn = [
    {
      field: "action",
      headerName: "Action",
      width: 200,
      renderCell: (params) => {
        return (
          <div className="cellAction">
            <Link to={`/${id}/${params?.row?._id}`} style={{ textDecoration: "none" }}>
              <div className="viewButton">View</div>
            </Link>
            <div
              className="deleteButton"
              onClick={() => handleDelete(params.row._id)}
            >
              Delete
            </div>
          </div>
        );
      },
    },
  ];
  return (
    <div className="datatable">
      <div className="datatableTitle">
      <div className="search">
          <input type="text" placeholder="Search..." />
          <SearchOutlinedIcon />
        </div>
      </div>
      {loading ? (
         <BeatLoader 
         color="#36d7b7" 
         loading={loading}
         size={50}
         aria-label="Loading Spinner"
         data-testid="loader"
       />
        
      ): (
        <DataGrid
        className="datagrid"
        rows={loading ? [] : data}
        getRowId={(row) => row._id}
        columns={columns.concat(actionColumn)}
        pageSize={9}
        rowsPerPageOptions={[9]}
        checkboxSelection
      />
      )}
    </div>
  );
};

export default DatatableUser;
