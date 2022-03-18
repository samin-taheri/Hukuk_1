import { filter } from 'lodash';
import { Icon } from '@iconify/react';
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';
import 'react-datepicker/dist/react-datepicker.css';
import { sentenceCase } from 'change-case';
import { useState } from 'react';
import plusFill from '@iconify/icons-eva/plus-fill';
import searchFill from '@iconify/icons-eva/search-fill';
import roundUpdate from '@iconify/icons-ic/round-update';
import { Link as RouterLink } from 'react-router-dom';
// material
import {
  Card,
  Table,
  Stack,
  Button,
  TableRow,
  TableBody,
  TableCell,
  Container,
  Typography,
  TableContainer,
  TablePagination,
  TextField,
  InputAdornment
} from '@mui/material';
// components
import { useFormik } from 'formik';
import Page from '../components/Page';
import Label from '../components/Label';
import Scrollbar from '../components/Scrollbar';
import SearchNotFound from '../components/SearchNotFound';
import { UserListHead } from '../components/_dashboard/user';
//
import USERLIST from '../_mocks_/user';
import { BlogPosts } from '../components/_dashboard/blog';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'name', label: 'Case Type', alignRight: false },
  { id: 'company', label: 'Status(TR)', alignRight: false },
  { id: 'role', label: 'Status(EN)', alignRight: false },
  { id: 'isVerified', label: 'Status', alignRight: false },
  { id: '' }
];
const Trial = [
  { value: 'All', label: 'Trial' },
  { value: 'Active', label: 'Dept Enforcemnet' }
];
// ----------------------------------------------------------------------

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

function applySortFilter(array, comparator, query) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  if (query) {
    return filter(array, (_user) => _user.name.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis.map((el) => el[0]);
}

export default function Tasks() {
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('name');
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = USERLIST.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - USERLIST.length) : 0;

  const filteredUsers = applySortFilter(USERLIST, getComparator(order, orderBy));

  const isUserNotFound = filteredUsers.length === 0;

  const formik = useFormik({
    initialValues: {
      No: '',
      password: '',
      remember: true
    }
  });
  const { getFieldProps } = formik;

  return (
    <Page title="Tasks | MediLaw">
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={4}>
          <Typography variant="h4" gutterBottom>
            Folders
          </Typography>
          <Button
            variant="contained"
            component={RouterLink}
            to="#"
            startIcon={<Icon icon={plusFill} />}
          >
            Filter
          </Button>
        </Stack>
        <Stack mb={5} flexDirection="row" alignItems="center" justifyContent="space-around" />
        <Stack
          mb={5}
          mt={-7}
          mr={45}
          flexDirection="row"
          alignItems="center"
          justifyContent="space-around"
        >
          <Stack mb={5} justifyContent="space-around">
            <Typography variant="body1" gutterBottom>
              Status
            </Typography>
            <BlogPosts options={Trial} icon={FormatListNumberedIcon} />
          </Stack>
          <Stack mb={5} justifyContent="space-around">
            <Typography variant="body1" gutterBottom>
              Client
            </Typography>
            <BlogPosts options={Trial} icon={FormatListNumberedIcon} />
          </Stack>
        </Stack>
        <Stack
          mb={10}
          mt={-15}
          ml={115}
          flexDirection="row"
          alignItems="center"
          justifyContent="space-around"
        >
          <Stack direction="row" alignItems="center" justifyContent="flex-end">
            <Button
              variant="contained"
              component={RouterLink}
              to="#"
              sx={{ backgroundColor: '#b2b9bf' }}
              startIcon={<Icon icon={searchFill} />}
            >
              View
            </Button>
          </Stack>
        </Stack>
        <Stack
          mb={5}
          mt={-7}
          mr={0}
          flexDirection="row"
          alignItems="center"
          justifyContent="space-around"
        >
          <Stack mb={5} justifyContent="space-around">
            <Typography variant="body1" gutterBottom>
              Task No
            </Typography>
            <TextField
              size="small"
              sx={{ width: 300 }}
              inputStyle={{ width: '80%' }}
              label="Task No"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <FormatListNumberedIcon />
                  </InputAdornment>
                )
              }}
              {...getFieldProps('No')}
            />
          </Stack>
          <Stack mb={5} justifyContent="space-around">
            <Typography variant="body1" gutterBottom>
              Task Type
            </Typography>
            <BlogPosts options={Trial} icon={FormatListNumberedIcon} />
          </Stack>
          <Stack mb={5} justifyContent="space-around">
            <Typography variant="body1" gutterBottom>
              responsible personnel
            </Typography>
            <BlogPosts options={Trial} icon={FormatListNumberedIcon} />
          </Stack>
        </Stack>
        <Stack
          mb={10}
          mt={-5}
          ml={109}
          flexDirection="row"
          alignItems="center"
          justifyContent="space-around"
        >
          <Stack direction="row" alignItems="center" justifyContent="flex-end">
            <Button
              variant="contained"
              component={RouterLink}
              to="#"
              sx={{ backgroundColor: '#b2b9bf' }}
              startIcon={<Icon icon={searchFill} />}
            >
              Detailed View
            </Button>
          </Stack>
        </Stack>
        <Card sx={{ marginTop: -3 }}>
          <Scrollbar>
            <TableContainer sx={{ minWidth: 800, marginTop: 3 }}>
              <Table>
                <UserListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={USERLIST.length}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleSelectAllClick}
                />
                <TableBody>
                  {filteredUsers
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => {
                      const { id, name, role, status } = row;

                      return (
                        <TableRow hover key={id} tabIndex={-1}>
                          <TableCell align="left" />
                          <TableCell component="th" scope="row" padding="20">
                            <Stack direction="row" alignItems="center" spacing={2}>
                              <Typography variant="subtitle2" noWrap>
                                {name}
                              </Typography>
                            </Stack>
                          </TableCell>
                          <TableCell align="left">{role}</TableCell>
                          <TableCell align="left">{role}</TableCell>
                          <TableCell align="left">
                            <Label
                              variant="ghost"
                              color={(status === 'banned' && 'error') || 'success'}
                            >
                              {sentenceCase(status)}
                            </Label>
                          </TableCell>
                          <TableCell align="right">
                            <Button
                              variant="contained"
                              component={RouterLink}
                              to="#"
                              startIcon={<Icon icon={roundUpdate} />}
                            >
                              Update
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  {emptyRows > 0 && (
                    <TableRow style={{ height: 53 * emptyRows }}>
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                </TableBody>
                {isUserNotFound && (
                  <TableBody>
                    <TableRow>
                      <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                        <SearchNotFound />
                      </TableCell>
                    </TableRow>
                  </TableBody>
                )}
              </Table>
            </TableContainer>
          </Scrollbar>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={USERLIST.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
      </Container>
    </Page>
  );
}
