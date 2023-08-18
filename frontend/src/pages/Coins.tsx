import { Breadcrumbs, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableFooter, TableHead, TablePagination, TableRow, TextField, Tooltip, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

import * as Paths from "../Paths";
import { CoinList, deleteCoin, getCoins, updateCoin } from '../api/coinsServices';
import useAlert from '../hooks/useAlert';


const Coins = () => {
   const [coinList, setCoinList] = useState<Array<CoinList> | []>([]);
   const [rowsPerPage, setRowsPerPage] = useState(5);
   const [page, setPage] = useState(0);
   const { setAlert } = useAlert();
   let navigate = useNavigate();
   const [open, setOpen] = useState(false);
   const [selectedUpdateCoin, setSelectedUpdateCoin] = useState<CoinList>()
   const [coinForm, setCoinForm] = useState<any>()

   const handleClickOpen = () => {
      setOpen(true);
   };

   const handleClose = () => {
      setOpen(false);
   };
   const handleChangePage = (
      event: React.MouseEvent<HTMLButtonElement> | null,
      newPage: number,
    ) => {
      setPage(newPage);
    };
   const handleChangeRowsPerPage = (
      event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
      setRowsPerPage(parseInt(event.target.value, 10));
      setPage(0);
    };

   useEffect(() => {
      getCoins().then(coins => setCoinList(coins))
   }, [])

   const getTotalAmountCoin = () => {
      return coinList.map(c => c.amount).reduce((partialSum, a) => partialSum + a, 0)
   }
   const getTotalCost = () => {
      return coinList.map(c => c.amount * c.price).reduce((partialSum, a) => partialSum + a, 0)
   }
   const getAvarageCost = () => {
      return coinList.map(c => c.amount * c.price).reduce((partialSum, a) => partialSum + a, 0) / getTotalAmountCoin()
   }
   const calculateBenefit = (currentPrice: number) => {
      return currentPrice * getTotalAmountCoin() - getTotalCost()
   }
   console.log(`Toplam Adet: ${getTotalAmountCoin()}`)
   console.log(getTotalCost())
   console.log(getAvarageCost())
   console.log("Your benefit:"+calculateBenefit(8))

   return <>
      <Breadcrumbs aria-label="breadcrumb">
         <Link color="inherit" to={Paths.coins.path}>
            Admin
         </Link>
         <Typography color="text.primary">Coins</Typography>
      </Breadcrumbs>
      <Stack direction="row" justifyContent="flex-end" alignItems="center" mb={2}>
         <Button
            variant='outlined'
            size='small'
            onClick={() => navigate(Paths.addCoin.path)}>Add New Coin</Button>
      </Stack>
      <Dialog
         open={open}

         onClose={handleClose}
         aria-describedby="alert-dialog-slide-description"
      >
         <DialogTitle>{"Edit coin details"}</DialogTitle>
         <DialogContent>
            {selectedUpdateCoin && <Stack>
               <TextField
                  sx={{ mt: 2 }}
                  size="small"
                  id="name"
                  defaultValue={selectedUpdateCoin.name}
                  label="Add Coin Name"
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                     setCoinForm({ ...coinForm, name: event.target.value });
                  }}
               />
               <TextField
                  sx={{ mt: 2 }}
                  size="small"
                  id="price"
                  label="Add Price"
                  type="number"
                  defaultValue={selectedUpdateCoin.price}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                     setCoinForm({ ...coinForm, price: parseFloat(event.target.value) });
                  }}
               />
               <TextField
                  sx={{ mt: 2 }}
                  size="small"
                  type="number"
                  id="amount"
                  label="Add Amount"
                  defaultValue={selectedUpdateCoin.amount}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                     setCoinForm({ ...coinForm, amount: parseFloat(event.target.value) });
                  }}
               />
            </Stack>}
         </DialogContent>
         <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button onClick={() => {
               selectedUpdateCoin && selectedUpdateCoin.id && updateCoin(selectedUpdateCoin.id, coinForm)
                  .then(res => {
                     getCoins().then(coins => setCoinList(coins))
                     setAlert("Successfully Updated", "success")
                  })
                  .catch(err => setAlert(err.message, "error"))
               handleClose()
            }}>Update</Button>
         </DialogActions>
      </Dialog>

      <TableContainer component={Paper}>
         <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
               <TableRow>
                  <TableCell>Coin Name</TableCell>
                  <TableCell>Coin Amount</TableCell>
                  <TableCell>Coin Price </TableCell>
                  <TableCell>Delete</TableCell>

               </TableRow>
            </TableHead>
            <TableBody>
               {(rowsPerPage > 0
            ? coinList.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            : coinList && coinList).map((row, i) => (
                  <TableRow
                     key={i}
                     sx={{
                        '&:last-child td, &:last-child th': { border: 0 },
                        transition: 'ease all .5s',
                        "&:hover": { backgroundColor: '#f5f5f5' },
                        cursor: "pointer"
                     }}
                  >
                     <TableCell
                        component="th"
                        scope="row"
                        onClick={() => {
                           setSelectedUpdateCoin(row)
                           handleClickOpen()
                        }}>
                        {row.name}
                     </TableCell>
                     <TableCell
                        component="th"
                        scope="row"
                        onClick={() => {
                           setSelectedUpdateCoin(row)
                           handleClickOpen()
                        }}>
                        {row.amount}
                     </TableCell>
                     <TableCell
                        component="th"
                        scope="row"
                        onClick={() => {
                           setSelectedUpdateCoin(row)
                           handleClickOpen()
                        }}>
                        {row.price}
                     </TableCell>
                     <TableCell>
                        <Tooltip title="Delete Coin">
                           <IconButton onClick={() => row.id && deleteCoin(row.id)
                              .then(res => {
                                 setAlert(res.message, "success");
                                 getCoins().then(coins => setCoinList(coins));
                              })
                              .catch(err => setAlert(err.message, "error"))
                           }>
                              <DeleteForeverIcon color='error' />
                           </IconButton>
                        </Tooltip>
                     </TableCell>
                  </TableRow>
               ))}
            </TableBody>
            <TableFooter>
          <TableRow>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
              colSpan={3}
              count={coinList.length}
              rowsPerPage={rowsPerPage}
              page={page}
              SelectProps={{
                inputProps: {
                  'aria-label': 'rows per page',
                },
                native: true,
              }}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            //   ActionsComponent={TablePaginationActions}
            />
          </TableRow>
        </TableFooter>
         </Table>
      </TableContainer>
   </>
}

export default Coins;
