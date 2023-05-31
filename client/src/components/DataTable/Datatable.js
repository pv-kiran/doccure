import * as React from 'react';
import PropTypes from 'prop-types';
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
// import Checkbox from '@mui/material/Checkbox';

import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';

import { visuallyHidden } from '@mui/utils';


// for add specialities
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';

import BorderColorIcon from '@mui/icons-material/BorderColor';

// for speaciality model




import './DataTable.css'
import { useState } from 'react';
import ConfirmModal from '../Modal/Modal';
import SpecialityModal from '../SpecialityModal/SpecialityModal';



function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}


function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}



function EnhancedTableHead(props) {
  const { onSelectAllClick, headCells , order, orderBy, numSelected, rowCount, onRequestSort } =
    props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow >
        
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
                    onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

function EnhancedTableToolbar(props) {
  const { numSelected , heading , handleSpecialityModalOpen , tableContent } = props;

  return (
    <Toolbar
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        pl: { sm: 2 , lg: 0 , md: 0 },
        pr: { xs: 1, sm: 1 , lg: 0 , md: 0 },
        ...(numSelected > 0 && {
          bgcolor: (theme) =>
            alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
        }),
      }}
    >
        <Typography
          // sx={{
          //   flex: '1 1 100%' ,
          // }}
          variant="h5"
          id="tableTitle"
          component="div"
        >
          {heading}
      </Typography>

      {
        tableContent === 'speciality' && <Button
        variant="outlined"
        startIcon={<AddIcon />}
        size='small'
        onClick={handleSpecialityModalOpen}
      >

          Add New
       </Button>

      }
      
      
    </Toolbar>
  );
}

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
};

function DataTable(props) {


  const { headCells, rows, heading, statusToggler, tableContent } = props;
  
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('calories');
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
    
  const handleChange = (event) => {  
     console.log(event);
            // setState({ ...state, [event.target.name]: event.target.checked });
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = rows.map((n) => n.name);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }

    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };


  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChangeDense = (event) => {
    setDense(event.target.checked);
  };

  const isSelected = (name) => selected.indexOf(name) !== -1;

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  
  const visibleRows = React.useMemo(
    () =>
      stableSort(rows, getComparator(order, orderBy)).slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage,
      ),
    [order, orderBy, page, rowsPerPage , rows]
  );

  // const visibleRows = rows;


  // confirmation related modal logic related methods and states

  const [id, setId] = useState(null);

  const [open, setOpen] = useState(false); // state for modal open/close

  const handleOpen = () => {
    setOpen(true); // open the modal
  };

  const handleClose = () => {
    setOpen(false);
    setId(null) // close the modal
  };

  const [checked, setChecked] = useState(false);

  const handleConfirmChange = (event) => {
    setChecked(event.target.checked);
  };

  const handleConfirm = (checked) => {
    // do something with the checked value
    // console.log(checked);
    if (checked) {
      statusToggler(id);
      setOpen(false); // close the modal
      setId(null);
      setChecked(false)
    } else {
       setOpen(false); // close the modal
       setId(null);
    }
  };
  



  // add specialities modal related states and logic

  const [specialityModelOpen, setspecialityModelOpen] = useState(false);

  const handleSpecialityModalOpen = () => setspecialityModelOpen(true);

  const [editId, setEditId] = useState(null);


  
  return (
      <Box sx={{
          width: {lg: '100%' , md: '100%', sm : '90%' , xs: '17.5rem'} ,
          marginTop: '2rem',
          marginLeft: {lg: '-14rem' , md: '-8rem' , sm: '1rem' , xs: '.5rem'}
      }}>
          <Paper sx={{
              width: '100%',
              padding: '2rem',
              mb: 2
          }}>
        <EnhancedTableToolbar
          handleSpecialityModalOpen = {handleSpecialityModalOpen}
          heading={heading}
          tableContent = {tableContent}
          numSelected={selected.length} />
        <TableContainer>
          <Table
            // sx={{ minWidth: 750 }}
            aria-labelledby="tableTitle"
            size={dense ? 'small' : 'medium'}
          >
            <EnhancedTableHead
              headCells = {headCells}
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={rows.length}
            />
            {
              tableContent === 'user' && <TableBody>
                  {visibleRows.map((row, index) => {
                    const labelId = `enhanced-table-checkbox-${index}`;

                    return (
                      <TableRow
                        hover
                        role="checkbox"
                        tabIndex={-1}
                        key={row.name}
                        sx={{
                          cursor: 'pointer',
                          height: '2rem'
                        }}
                      >
                        
                        <TableCell
                          component="th"
                          id={labelId}
                          scope="row"
                          padding="none"
                        >
                          {row.name}
                        </TableCell>
                        <TableCell 
                          component="th"
                          id={labelId}
                          scope="row"
                          padding="none">{row.email}</TableCell>
                        <TableCell
                          component="th"
                          id={labelId}
                          scope="row"
                          padding="none">
                          {row.phone}
                        </TableCell>
                        <TableCell align="right" padding='none'>
                                <FormControlLabel
                                    control={
                                    <Switch
                                      checked={row.isAdminVerified}
                                        onChange={() => {
                                          setId(row._id)
                                          handleOpen();
                                        }}
                                    />
                                    }
                                />
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  {emptyRows > 0 && (
                    <TableRow
                      style={{
                        height: (dense ? 33 : 53) * emptyRows,
                      }}
                    >
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
               </TableBody>
            }
            {
              tableContent === 'speciality' &&  <TableBody>
                  {visibleRows.map((row, index) => {
                    const labelId = `enhanced-table-checkbox-${index}`;

                    return (
                      <TableRow
                        hover
                        role="checkbox"
                        tabIndex={-1}
                        key={row.name}
                        sx={{
                          cursor: 'pointer',
                          height: '2rem'
                        }}
                      >
                        
                        <TableCell
                          component="th"
                          id={labelId}
                          scope="row"
                          padding="none"
                        >
                          {row.name}
                        </TableCell>
                        <TableCell 
                          component="th"
                          id={labelId}
                          scope="row"
                          padding="none">
                          {row.fees}
                        </TableCell>
                        <TableCell
                          component="th"
                          id={labelId}
                          scope="row"
                          padding="none">
                          {
                            row.isAdminVerified ? <Typography sx={{
                              color: '#32a850',
                              
                            }}>Active</Typography> : <Typography sx={{
                              color: '#ad1f1a'
                            }}>Inactive</Typography>
                          }
                        </TableCell>
                        <TableCell
                          align="right"
                          padding='none'
                        >
                          <BorderColorIcon sx={{
                            color: '#5d86c9',
                            marginRight: '1rem' ,
                          }} 
                          onClick={() => {
                            handleSpecialityModalOpen()
                            setEditId(row._id)
                          }}
                       
                          />
                        </TableCell>
                        <TableCell
                          align="right"
                          padding='none'
                        >
                          
                            <FormControlLabel
                                    control={
                                    <Switch
                                      checked={row.isAdminVerified}
                                      onChange={() => {
                                        setId(row._id)
                                        handleOpen();
                                      }}
                                    />
                                    }
                          />
                        </TableCell>


                      </TableRow>
                    );
                  })}
                  {emptyRows > 0 && (
                    <TableRow
                      style={{
                        height: (dense ? 33 : 53) * emptyRows,
                      }}
                    >
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
               </TableBody>
            }
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
      {/* <FormControlLabel
        control={<Switch checked={dense}
        onChange={handleChangeDense} />}
        label="Dense padding"
      /> */}


     
      {/* Modal - Speciality add / edit / delete  */}
      <SpecialityModal
        specialityModelOpen={specialityModelOpen} 
        id={editId}
        setEditId = {setEditId}
        setspecialityModelOpen = {setspecialityModelOpen}
      />
        
      {/* Confirmation - Blocking and Unblocking */}
      <ConfirmModal
        open={open}
        checked={checked}
        handleConfirmChange={handleConfirmChange}
        onClose={handleClose} onConfirm={handleConfirm} 
      />
    </Box>
  );
}


export default DataTable