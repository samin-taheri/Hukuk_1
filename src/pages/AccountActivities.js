import { Icon } from '@iconify/react';
import 'react-datepicker/dist/react-datepicker.css';
import plusFill from '@iconify/icons-eva/plus-fill';
// material
import {
    Stack,
    Button,
    Container,
    Typography,
    TextField,
    InputAdornment, Box, TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody, Card
} from '@mui/material';
// components
import Page from '../components/Page';
//
import Modal from "@mui/material/Modal";
import CloseIcon from "@material-ui/icons/Close";
import FormControl from "@mui/material/FormControl";
import AttachMoneyOutlinedIcon from '@mui/icons-material/AttachMoneyOutlined';
import CreditCardOutlinedIcon from '@mui/icons-material/CreditCardOutlined';
import TextSnippetOutlinedIcon from '@mui/icons-material/TextSnippetOutlined';
import MonetizationOnOutlinedIcon from '@mui/icons-material/MonetizationOnOutlined';
import EventOutlinedIcon from '@mui/icons-material/EventOutlined';
import SubtitlesOutlinedIcon from '@mui/icons-material/SubtitlesOutlined';
import PhoneInTalkOutlinedIcon from '@mui/icons-material/PhoneInTalkOutlined';
import PaidOutlinedIcon from '@mui/icons-material/PaidOutlined';
import MenuItem from "@mui/material/MenuItem";
import {useEffect, useState} from "react";
import PopupMessageService from "../services/popupMessage.service";
import AuthService from "../services/auth.service";
import {Global} from "../Global";
import TransactionActivityTypeService from "../services/transactionActivityType.service";
import AccountActivityService from "../services/AccountActivity.service";
import TransactionActivitiesService from "../services/TransactionActivities.service";
import Scrollbar from "../components/Scrollbar";
import CircularProgress from "@mui/material/CircularProgress";
import Label from "../components/Label";
import {sentenceCase} from "change-case";
import copyOutline from '@iconify/icons-eva/copy-outline';
import Moment from "react-moment";
import roundUpdate from "@iconify/icons-ic/round-update";
// ----------------------------------------------------------------------

export default function AccountActivities() {
  const [openModal, setOpen] = useState(false);
  const [getTransactionActivityType, setTransactionActivityType] = useState([]);
  const [getTransactionActivitySubType, setTransactionActivitySubType] = useState([]);
  const [expenseAdd, setExpenseAdd] = useState(1);
  const [otherAdd, setOtherAdd] = useState(0);
  const [explanationAdd, setExplanationAdd] = useState("");
  const [titleDetails, setTitleDetails] = useState("");
  const [cellPhoneDetails, setCellPhoneDetails] = useState(0);
  const [amountDetails, setAmountDetails] = useState(0);
  const [dateAdd, setDateAdd] = useState("");
  const [amountAdd, setAmountAdd] = useState(0);
  const [TransActivityId, setTransActivityId] = useState(0);
  const [TransActivitySubId, setTransActivitySubId] = useState(0);
  const [IsItExpenseAdd, setIsItExpenseAdd] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [openModalForDetails, setOpenModalForUpdate] = useState(false);
  const [transActivities, setTransActivities] = useState([]);
  const [transactionActivityTypeForFilter, setTransactionActivityTypeForFilter] = useState(1);

  const popupMessageService = new PopupMessageService();
  const authService = new AuthService();
  const catchMessagee = Global.catchMessage;
  const transactionActivityType = new TransactionActivityTypeService();
  const transactionActivitySubType = new AccountActivityService();
  const transactionActivitiesService = new TransactionActivitiesService();

    function filtering(getTransactionActivityType) {
        let filterdeTransactionActivities = getTransactionActivityType
        if (transactionActivityTypeForFilter > 0)
            filterdeTransactionActivities = filterdeTransactionActivities.filter(c => c.TransactionActivitySubTypeGetDto.TransactionActivityType.TransactionActivityTypeId === transactionActivityTypeForFilter)
        return filterdeTransactionActivities
    }

    function modalForDetails(id) {
        transactionActivitiesService.getById(id).then(result => {
            if (result.data.Success) {
                let details = result.data.Data
                setTransActivityId(details.TransactionActivityId)
                setTitleDetails(details.UserWhoAdd.Title)
                setCellPhoneDetails(details.UserWhoAdd.CellPhone)
                setAmountDetails(details.Amount)
                setExplanationAdd(details.Info)
                setAmountAdd(details.Amount)
                setDateAdd(details.Date)
                setIsItExpenseAdd(details.IsItExpense)
            }
        })
        setOpenModalForUpdate(true)
    }
    function modalForEdit(id) {
        transactionActivitiesService.getById(id).then(result => {
            if (result.data.Success) {
                let details = result.data.Data
                setTransActivityId(details.TransactionActivityId)
                setTransActivitySubId(details.TransactionActivitySubTypeId)
                setExplanationAdd(details.Info)
                setAmountAdd(details.Amount)
                setDateAdd(details.Date)
                setIsItExpenseAdd(details.IsItExpense)
            }
        })
        setOpen(true)
    }
    function deleteTransactionActivity(id) {
        transactionActivitiesService.delete(id).then(result => {
                popupMessageService.AlertErrorMessage(result.response.data.Message);
            },
            (error) => {
                popupMessageService.AlertErrorMessage(error.response.data.Message);
            }
        )
            .catch(() => {
                popupMessageService.AlertErrorMessage(catchMessagee)
            });
    }

    const handleClosModal = () => {
        setOpenModalForUpdate(false)
    }
    const handleOpenModal = () => {
        setOpenModalForUpdate(true)
    }
  const handleExpenseChange = (event) => {
        setExpenseAdd(event.target.value);

  };
  const getAllOthers =()=> {
        transactionActivitySubType
            .getAllByTransactionActivityId(expenseAdd)
            .then(
                (response) => {
                    const TransactionActivitySubTypeFromApi = response.data.Data;
                    const list = [];
                    TransactionActivitySubTypeFromApi.forEach((item) => {
                        list.push({
                            value: item.TransactionAcitivitySubTypeId,
                            label: item.TransactionAcitivitySubTypeName,
                            key: item.TransactionAcitivitySubTypeName
                        });
                    });
                    setTransactionActivitySubType(list);
                },
                (error) => {
                    popupMessageService.AlertErrorMessage(error.response.data.Message);
                }
            )
            .catch(() => {
                popupMessageService.AlertErrorMessage(catchMessagee)
            });
    }
  const getAllExpenses = () => {
    transactionActivityType
        .getAll()
        .then(
            (response) => {
              setTransactionActivityType(response.data.Data);
              const TransactionActivityTypeFromApi = response.data.Data;
              const list = [];
              TransactionActivityTypeFromApi.forEach((item) => {
                list.push({
                  value: item.TransactionActivityTypeId,
                  label: item.TransactionActivityTypeName,
                  key: item.TransactionActivityTypeName
                });
              });
              setTransactionActivityType(list);
            },
            (error) => {
              popupMessageService.AlertErrorMessage(error.response.data.Message);
            }
        )
        .catch(() => {
          popupMessageService.AlertErrorMessage(catchMessagee)
        });
  };

    const addNewRecord = () => {
        let obj = {
            transactionActivityId: expenseAdd,
            transactionActivitySubTypeId: otherAdd,
            info: explanationAdd,
            amount: amountAdd,
            date: dateAdd,
            isItExpense: IsItExpenseAdd
        }
        let re
        if (TransActivityId > 0) {
            obj.transactionActivityId = TransActivityId
            re = transactionActivitiesService.update(obj)
        }
        else {
            re = transactionActivitiesService.add(obj)
        }
        re.then(
            (result) => {
                if (result.data.Success) {
                    setOpen(false)
                    popupMessageService.AlertSuccessMessage(result.data.Message)
                }
            },
            (error) => {
                popupMessageService.AlertErrorMessage(error.response.data.Message);
            }
        ).catch(()=> {
            popupMessageService.AlertErrorMessage(catchMessagee)
        })
    };


    const getAllTransactionActivities = () => {
            transactionActivitiesService.getAll().then(
                (result) => {
                    if (result.data.Success) {
                        setTransActivities(result.data.Data);
                        setIsLoading(false)
                    }
                },
                (error) => {
                    popupMessageService.AlertErrorMessage(error.response.data.Message);
                }
            ).catch(()=> {
                popupMessageService.AlertErrorMessage(catchMessagee)
            })
    };

  const handleOpen = () => {
      setOtherAdd("")
      setExplanationAdd("")
      setAmountAdd(0)
      setDateAdd()
      setIsItExpenseAdd(true)
      setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  useEffect(() => {
    getAllExpenses();
    getAllTransactionActivities();
    getAllOthers();
  }, []);

  return (
    <Page title="Transaction Activities | MediLaw">
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={4}>
          <Typography variant="h4" gutterBottom>
            Transaction Activities
          </Typography>
          {authService.DoesHaveMandatoryClaim('CaseTypeAdd') ? (
              <>
                <Button onClick={handleOpen} variant="contained" startIcon={<Icon icon={plusFill} />}>
                  New Record
                </Button>
                <Modal sx={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
                       hideBackdrop={true}
                       disableEscapeKeyDown={true}
                       open={openModal}
                       aria-labelledby="modal-modal-title"
                       aria-describedby="modal-modal-description"
                >
                  <Box
                      sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 470,
                        backgroundColor: 'background.paper',
                        border: '2px solid #fff',
                        boxShadow: 24,
                        p: 4,
                        borderRadius: 2
                      }}
                  >
                    <Stack mb={5} flexDirection="row" justifyContent='space-between'>
                      <Typography id="modal-modal-title" variant="h6" component="h2">
                        Add new record!
                      </Typography>
                      <CloseIcon onClick={handleClose}/>
                    </Stack>
                    <Stack spacing={2} >
                      <Stack mb={0} alignItems="center" justifyContent="space-around">
                        <Stack mb={4} justifyContent="space-around">
                          {getTransactionActivityType.length > 0 ? (
                          <Box sx={{ minWidth: 400 }}>
                            <FormControl fullWidth size="small">
                              <TextField
                                  select
                                  size='small'
                                  id="demo-simple-select"
                                  label="Expense"
                                  value={expenseAdd}
                                  onChange={handleExpenseChange}
                                  key={Math.random().toString(36).substr(2, 9)}
                                  InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                          <AttachMoneyOutlinedIcon />
                                        </InputAdornment>
                                    )
                                  }}
                              >
                                {getTransactionActivityType.map((item) => (
                                <MenuItem
                                    key={Math.random().toString(36).substr(2, 9)}
                                    value={item.value}
                                >
                                  {item.label}
                                </MenuItem>
                                ))}
                              </TextField>
                            </FormControl>
                          </Box>
                          ) : null}
                        </Stack>
                          {getTransactionActivitySubType.length > 0 ? (
                                  <Stack mb={4} justifyContent="space-around">
                                  <Box sx={{ minWidth: 400 }}>
                                <FormControl fullWidth size="small">
                                  <TextField
                                      select
                                      size='small'
                                      id="demo-simple-select"
                                      label="Other"
                                      value={otherAdd}
                                      onChange={(event)=> setOtherAdd(event.target.value)}
                                      key={Math.random().toString(36).substr(2, 9)}
                                      InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                              <CreditCardOutlinedIcon />
                                            </InputAdornment>
                                        )
                                      }}
                                  >
                                    {getTransactionActivitySubType.map((item) => (
                                        <MenuItem
                                            key={Math.random().toString(36).substr(2, 9)}
                                            value={item.value}
                                        >
                                          {item.label}
                                        </MenuItem>
                                    ))}
                                  </TextField>
                                </FormControl>
                              </Box>
                          </Stack>
                          ) : null}
                        <Stack mb={4} justifyContent="space-around">
                          <Box sx={{ minWidth: 400 }}>
                            <FormControl fullWidth size="small">
                              <TextField
                                  type="text"
                                  multiline
                                  label="Explanation"
                                  size="small"
                                  value={explanationAdd}
                                  onChange={(event) => setExplanationAdd(event.target.value)}
                                  InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                          <TextSnippetOutlinedIcon />
                                        </InputAdornment>
                                    )
                                  }}
                              />
                            </FormControl>
                          </Box>
                        </Stack>
                        <Stack mb={4} justifyContent="space-around">
                          <Box sx={{ minWidth: 400 }}>
                            <FormControl fullWidth size="small">
                          <TextField
                              id="date"
                              label="Date"
                              type="date"
                              size="small"
                              defaultValue="2022-02-01"
                              value={dateAdd}
                              onChange={(event)=> setDateAdd(event.target.value)}
                              InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                      <EventOutlinedIcon />
                                    </InputAdornment>
                                )
                              }}
                          />
                            </FormControl>
                          </Box>
                        </Stack>
                        <Stack mb={4} justifyContent="space-around">
                          <Box sx={{ minWidth: 400 }}>
                            <FormControl fullWidth size="small">
                              <TextField
                                  type="number"
                                  label="Amount"
                                  size="small"
                                  value={amountAdd}
                                  onChange={(event) => setAmountAdd(event.target.value)}
                                  InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                          <MonetizationOnOutlinedIcon />
                                        </InputAdornment>
                                    )
                                  }}
                              />
                            </FormControl>
                          </Box>
                        </Stack>
                        <Stack justifyContent="space-around">
                        </Stack>
                      </Stack>
                      <Button
                          sx={{ bottom: 7 }}
                          size="large"
                          type="submit"
                          variant="contained"
                          onClick={() => addNewRecord()}
                      >
                        Add!
                      </Button>
                    </Stack>
                  </Box>
                </Modal>
              </>
          ) : null}
        </Stack>
          <Stack mb={5} ml={8} flexDirection="row" alignItems="center" justifyContent="space-between">
              <Stack mb={5} justifyContent="space-around">
                  <Typography variant="body1" gutterBottom mb={4}>
                      Expense
                  </Typography>
                  {getTransactionActivityType.length > 0 ? (
                      <Box sx={{ minWidth: 400 }}>
                          <FormControl fullWidth size="small">
                              <TextField
                                  select
                                  size='small'
                                  id="demo-simple-select"
                                  label="Expense"
                                  value={transactionActivityTypeForFilter}
                                  onChange={(e)=> setTransactionActivityTypeForFilter(e.target.value)}
                                  key={Math.random().toString(36).substr(2, 9)}
                                  InputProps={{
                                      startAdornment: (
                                          <InputAdornment position="start">
                                              <AttachMoneyOutlinedIcon />
                                          </InputAdornment>
                                      )
                                  }}
                              >
                                  {getTransactionActivityType.map((item) => (
                                      <MenuItem
                                          key={Math.random().toString(36).substr(2, 9)}
                                          value={item.value}
                                      >
                                          {item.label}
                                      </MenuItem>
                                  ))}
                              </TextField>
                          </FormControl>
                      </Box>
                  ) : null}
              </Stack>
          </Stack>
          <Card sx={{ marginTop: -3 }}>
              <Scrollbar>
                  {isLoading === true ?
                      <Stack sx={{ color: 'grey.500' }} spacing={2} direction="row" justifyContent='center'>
                          <CircularProgress color="inherit" />
                      </Stack>
                      :
                      <>
                          {transActivities.length > 0 ? (
                              <TableContainer component={Paper}>
                                  <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                      <TableHead>
                                          <TableRow>
                                              <TableCell sx={{ paddingLeft: 7 }}>Transaction Activity Type</TableCell>
                                              <TableCell align="left">Transaction Activity subtype</TableCell>
                                              <TableCell align="left">Date</TableCell>
                                              <TableCell align="left">Name / Surname</TableCell>
                                              <TableCell align="left">Expense</TableCell>
                                              <TableCell align="right" />
                                              <TableCell align="right" />
                                              <TableCell align="right" />
                                          </TableRow>
                                      </TableHead>
                                      <TableBody>
                                          <>
                                              {filtering(transActivities).map((row) => (
                                                          <TableRow
                                                              key={row.TransactionActivityId}
                                                              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                          >
                                                              <TableCell component="th" scope="row" sx={{ paddingLeft: 7 }}>
                                                                  {row.TransactionActivitySubTypeGetDto.TransactionActivityType.TransactionActivityTypeName}
                                                              </TableCell>
                                                              <TableCell component="th" scope="row">
                                                                  {row.TransactionActivitySubTypeGetDto.TransactionAcitivitySubTypeName}
                                                              </TableCell>
                                                              <TableCell component="th" scope="row">
                                                                  <Moment>
                                                                  {row.Date}
                                                                  </Moment>
                                                              </TableCell>
                                                              <TableCell component="th" scope="row">
                                                                  {row.UserWhoAdd.FirstName} / {row.UserWhoAdd.LastName}
                                                              </TableCell>
                                                              {row.IsItExpense ? (
                                                                  <TableCell component="th" scope="row">
                                                                      <Label variant="ghost" color="success">
                                                                          {sentenceCase('Active')}
                                                                      </Label>
                                                                  </TableCell>
                                                              ) : (
                                                                  <TableCell component="th" scope="row">
                                                                      <Label variant="ghost" color="error">
                                                                          {sentenceCase('Pasive')}
                                                                      </Label>
                                                                  </TableCell>
                                                              )}
                                                              <TableCell>
                                                                  <Button
                                                                      onClick={() => modalForEdit(row.TransactionActivityId)}
                                                                      variant="contained"
                                                                      sx={{backgroundColor: '#b1b9be'}}
                                                                      startIcon={<Icon icon={roundUpdate} />}
                                                                  >
                                                                      Edit
                                                                  </Button>
                                                              </TableCell>
                                                              <TableCell align="right">
                                                                  <Button
                                                                      onClick={() => modalForDetails(row.TransactionActivityId)}
                                                                      variant="contained"
                                                                      sx={{backgroundColor: '#b1b9be'}}
                                                                      startIcon={<Icon icon={copyOutline} />}
                                                                  >
                                                                      Details
                                                                  </Button>
                                                                  <Modal sx={{ backgroundColor: "rgba(0, 0, 0, 0.2)" }}
                                                                         hideBackdrop={true}
                                                                         disableEscapeKeyDown={true}
                                                                         open={openModalForDetails}
                                                                         aria-labelledby="modal-modal-title"
                                                                         aria-describedby="modal-modal-description"
                                                                  >
                                                                      <Box
                                                                          sx={{
                                                                              position: 'absolute',
                                                                              top: '50%',
                                                                              left: '50%',
                                                                              transform: 'translate(-50%, -50%)',
                                                                              width: 470,
                                                                              backgroundColor: 'background.paper',
                                                                              border: '2px solid #fff',
                                                                              boxShadow: 24,
                                                                              p: 4,
                                                                              borderRadius: 2
                                                                          }}
                                                                      >
                                                                          <Stack mb={5} flexDirection="row" justifyContent='space-between'>
                                                                              <Typography id="modal-modal-title" variant="h6" component="h2">
                                                                                  Details!
                                                                              </Typography>
                                                                              <CloseIcon onClick={handleClosModal}/>
                                                                          </Stack>
                                                                          <Stack mb={4} justifyContent="space-around">
                                                                              <Box sx={{ minWidth: 400 }}>
                                                                                  <FormControl fullWidth size="small">
                                                                                      <TextField
                                                                                          type="text"
                                                                                          multiline
                                                                                          label="Title"
                                                                                          size="small"
                                                                                          value={titleDetails}
                                                                                          onChange={(event) => setTitleDetails(event.target.value)}
                                                                                          InputProps={{
                                                                                              startAdornment: (
                                                                                                  <InputAdornment position="start">
                                                                                                      <SubtitlesOutlinedIcon />
                                                                                                  </InputAdornment>
                                                                                              )
                                                                                          }}
                                                                                      />
                                                                                  </FormControl>
                                                                              </Box>
                                                                          </Stack>
                                                                          <Stack mb={4} justifyContent="space-around">
                                                                              <Box sx={{ minWidth: 400 }}>
                                                                                  <FormControl fullWidth size="small">
                                                                                      <TextField
                                                                                          type="text"
                                                                                          multiline
                                                                                          label="Cell Phone"
                                                                                          size="small"
                                                                                          value={cellPhoneDetails}
                                                                                          onChange={(event) => setCellPhoneDetails(event.target.value)}
                                                                                          InputProps={{
                                                                                              startAdornment: (
                                                                                                  <InputAdornment position="start">
                                                                                                      <PhoneInTalkOutlinedIcon />
                                                                                                  </InputAdornment>
                                                                                              )
                                                                                          }}
                                                                                      />
                                                                                  </FormControl>
                                                                              </Box>
                                                                          </Stack>
                                                                          <Stack mb={4} justifyContent="space-around">
                                                                              <Box sx={{ minWidth: 400 }}>
                                                                                  <FormControl fullWidth size="small">
                                                                                      <TextField
                                                                                          type="text"
                                                                                          multiline
                                                                                          label="Amount"
                                                                                          size="small"
                                                                                          value={amountDetails}
                                                                                          onChange={(event) => setAmountDetails(event.target.value)}
                                                                                          InputProps={{
                                                                                              startAdornment: (
                                                                                                  <InputAdornment position="start">
                                                                                                      <PaidOutlinedIcon />
                                                                                                  </InputAdornment>
                                                                                              )
                                                                                          }}
                                                                                      />
                                                                                  </FormControl>
                                                                              </Box>
                                                                          </Stack>
                                                                          <Stack mb={4} justifyContent="space-around">
                                                                              <Box sx={{ minWidth: 400 }}>
                                                                                  <FormControl fullWidth size="small">
                                                                                      <TextField
                                                                                          type="text"
                                                                                          multiline
                                                                                          label="Explanation"
                                                                                          size="small"
                                                                                          value={explanationAdd}
                                                                                          onChange={(event) => setExplanationAdd(event.target.value)}
                                                                                          InputProps={{
                                                                                              startAdornment: (
                                                                                                  <InputAdornment position="start">
                                                                                                      <TextSnippetOutlinedIcon />
                                                                                                  </InputAdornment>
                                                                                              )
                                                                                          }}
                                                                                      />
                                                                                  </FormControl>
                                                                              </Box>
                                                                          </Stack>
                                                                      </Box>
                                                                  </Modal>
                                                              </TableCell>
                                                              <TableCell align="right" />
                                                          </TableRow>
                                                      ))}
                                          </>
                                      </TableBody>
                                  </Table>
                              </TableContainer>
                          ) : (
                              <TableCell sx={{ width: '40%' }}>
                                  <img src="/static/illustrations/no.png" alt="login" />
                                  <Typography variant="h3" gutterBottom textAlign='center' color='#a9a9a9'>No Data Found</Typography>
                              </TableCell>
                          )}
                      </>
                  }
              </Scrollbar>
          </Card>
      </Container>
    </Page>
  );
}
