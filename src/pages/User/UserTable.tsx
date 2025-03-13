import React, { useState } from 'react';
import { useTable, useSortBy, Column, HeaderGroup, Row, usePagination } from 'react-table';
import { Box, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PauseIcon from '@mui/icons-material/Pause';
import AddIcon from '@mui/icons-material/Add';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import LastPageIcon from '@mui/icons-material/LastPage';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';


// User data interface
interface UserData {
  name: string;
  email: string;
  group: string;
  roles: string;
  branch: string;
  status: string;
  userId: string;
}

const UserPage: React.FC = () => {
  const [selectedRowIds, setSelectedRowIds] = useState<{ [key: string]: boolean }>({});

  // Sample data for the table
  const data: UserData[] = React.useMemo(
    () => [
      { name: 'John Doe', email: 'john@example.com', group: 'Admin', roles: 'Manager', branch: 'NY', status: 'Active', userId: '1' },
      { name: 'Jane Smith', email: 'jane@example.com', group: 'User', roles: 'Developer', branch: 'LA', status: 'Inactive', userId: '2' },
      { name: 'Sam Green', email: 'sam@example.com', group: 'User', roles: 'Developer', branch: 'NY', status: 'Active', userId: '3' },
      { name: 'Alice Brown', email: 'alice@example.com', group: 'Admin', roles: 'Manager', branch: 'LA', status: 'Inactive', userId: '4' },
      { name: 'Bob White', email: 'bob@example.com', group: 'User', roles: 'Designer', branch: 'SF', status: 'Active', userId: '5' },
      { name: 'Carol Blue', email: 'carol@example.com', group: 'User', roles: 'Manager', branch: 'NY', status: 'Inactive', userId: '6' },
      { name: 'Dave Yellow', email: 'dave@example.com', group: 'Admin', roles: 'Admin', branch: 'LA', status: 'Active', userId: '7' },
      
    ],
    []
  );

  // Columns for the table
  const columns: Column<UserData>[] = React.useMemo(
    () => [
      {
        Header: () => (
          <input
          style={{width:'20px', height:'20px'}}
            type="checkbox"
            onChange={(e) => {
              const isChecked = e.target.checked;
              const newSelectedRowIds: { [key: string]: boolean } = {};
              if (isChecked) {
                data.forEach((_, index) => {
                  newSelectedRowIds[index] = true;
                });
              }
              setSelectedRowIds(newSelectedRowIds);
            }}
            checked={Object.keys(selectedRowIds).length === data.length && data.length > 0}
          />
        ),
        id: 'selectAll',
        Cell: () => null,
      },
      { Header: 'Name', accessor: 'name' },
      { Header: 'Email', accessor: 'email' },
      { Header: 'Group', accessor: 'group' },
      { Header: 'Roles', accessor: 'roles' },
      { Header: 'Branch', accessor: 'branch' },
      { Header: 'Status', accessor: 'status' },
      { Header: 'User ID', accessor: 'userId' },
    ],
    [data, selectedRowIds]
  );



  // Set up table hooks with useSortBy
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    // rows,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    gotoPage,
    nextPage,
    previousPage,
    state,
  } = useTable(
    {
      columns,
      data,
      initialState: {
        pageSize: 7,
      } as any,
    },
    useSortBy,
    usePagination
  ) as any;

  // Destructure sorting state correctly
  const { pageIndex }: any = state;

  return (
    <div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px',
        }}
      >
        <h1>User Page</h1>
        <div>
          <IconButton color="primary" aria-label="edit">
            <EditIcon />
          </IconButton>
          <IconButton color="secondary" aria-label="pause">
            <PauseIcon />
          </IconButton>
          <IconButton color="error" aria-label="delete">
            <DeleteIcon />
          </IconButton>
          <IconButton color="primary" aria-label="add user">
            <AddIcon />
          </IconButton>
        </div>
      </div>

      {/* Table wrapped in Box component */}
      <Box sx={{ padding: '8px', border: '1px solid #ddd', borderRadius: '8px', bgcolor:'#aaac'}}>
        <table {...getTableProps()} style={{ width: '100%', borderCollapse: 'collapse', backgroundColor:'#fff'}}>
          <thead>
            {headerGroups.map((headerGroup: HeaderGroup<UserData>) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column: any) => (
                  <th
                    {...column.getHeaderProps(column.getSortByToggleProps())}
                    style={{
                      padding: '10px',
                      borderBottom: '1px solid Lightgray',
                      cursor: 'pointer',
                      textAlign: 'center',
                      borderTop: '1px solid Lightgray',
                      borderRight: '1px solid Lightgray',
                      borderLeft: '1px solid Lightgray',
                    }}
                  >
                    {column.render('Header')}
                    {/* Add sorting indicators */}
                    <span>
                      {column.isSorted
                        ? column.isSortedDesc
                          ? ' 🔽'
                          : ' 🔼'
                        : ''}
                    </span>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {page.map((row: Row<UserData>) => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()}>
                  {/* Checkbox column with center alignment */}
                  <td
                    style={{
                      padding: '10px',
                      borderBottom: '1px solid Lightgray',
                      borderRight: '1px solid Lightgray',
                      borderLeft: '1px solid Lightgray',
                      textAlign: 'center',
                    }}
                  >
                    <input
                    style={{width:'20px', height:'20px'}}
                      type="checkbox"
                      checked={!!selectedRowIds[row.id]}
                      onChange={() => {
                        const newSelectedRowIds = { ...selectedRowIds };
                        if (newSelectedRowIds[row.id]) {
                          delete newSelectedRowIds[row.id];
                        } else {
                          newSelectedRowIds[row.id] = true;
                        }
                        setSelectedRowIds(newSelectedRowIds);
                      }}
                    />
                  </td>

                  {/* Render table data cells */}
                  {row.cells.map((cell) => {
                    if (cell.column.id !== 'selectAll') {
                      return (
                        <td
                          {...cell.getCellProps()}
                          style={{
                            padding: '10px',
                            borderBottom: '1px solid Lightgray',
                            borderRight: '1px solid Lightgray',
                            textAlign: 'center',
                          }}
                        >
                          {cell.render('Cell')}
                        </td>
                      );
                    }
                    return null;
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* Pagination Controls */}
        <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <IconButton onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
            <FirstPageIcon />
          </IconButton>
          <IconButton onClick={previousPage} disabled={!canPreviousPage}>
            <NavigateBeforeIcon />
          </IconButton>
          <span style={{ margin: '0 16px' }}>
            <strong>
              {pageIndex + 1} of {pageOptions.length}
            </strong>
          </span>
          <IconButton onClick={nextPage} disabled={!canNextPage}>
            <NavigateNextIcon />
          </IconButton>
          <IconButton onClick={() => gotoPage(pageOptions.length - 1)} disabled={!canNextPage}>
            <LastPageIcon />
          </IconButton>
        </div>
      </Box>
    </div>
  );
};

export default UserPage;
